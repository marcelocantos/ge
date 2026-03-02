#!/usr/bin/env python3
"""Apply sq-specific patches to Dawn source tree.

Fixes VkSurfaceKHR lifecycle when a Dawn wire device is destroyed before
the surface's swapchain is detached.  Without these patches, the
UniqueVkHandle destructor dereferences a null FencedDeleter → crash.

Patched files (all in src/dawn/native/vulkan/):
  - DeviceVk.h / DeviceVk.cpp  — add Device::HasFencedDeleter()
  - UniqueVkHandle.h            — guard FencedDeleter access
  - SwapChainVk.cpp             — graceful DetachFromSurfaceImpl when device is destroyed
"""

import pathlib
import sys

def patch(path, old, new, *, label=None):
    text = path.read_text()
    if old not in text:
        name = label or path.name
        print(f"  WARNING: patch target not found in {name}", file=sys.stderr)
        return False
    path.write_text(text.replace(old, new, 1))
    print(f"  Patched {label or path.name}")
    return True


def main():
    if len(sys.argv) < 2:
        print(f"Usage: {sys.argv[0]} <dawn-src-dir>", file=sys.stderr)
        sys.exit(1)

    vk = pathlib.Path(sys.argv[1]) / "src" / "dawn" / "native" / "vulkan"

    # ── DeviceVk.h: declare HasFencedDeleter() ───────────────
    patch(
        vk / "DeviceVk.h",
        "MutexProtected<FencedDeleter>& GetFencedDeleter() const;",
        "MutexProtected<FencedDeleter>& GetFencedDeleter() const;\n"
        "    bool HasFencedDeleter() const;",
    )

    # ── DeviceVk.cpp: implement HasFencedDeleter() ───────────
    patch(
        vk / "DeviceVk.cpp",
        "MutexProtected<FencedDeleter>& Device::GetFencedDeleter() const {\n"
        "    return *mDeleter;\n"
        "}",
        "MutexProtected<FencedDeleter>& Device::GetFencedDeleter() const {\n"
        "    return *mDeleter;\n"
        "}\n"
        "\n"
        "bool Device::HasFencedDeleter() const {\n"
        "    return mDeleter != nullptr;\n"
        "}",
    )

    # ── UniqueVkHandle.h: null-safe destructor & move-assign ─
    patch(
        vk / "UniqueVkHandle.h",
        # destructor
        "    ~UniqueVkHandle() {\n"
        "        if (mHandle != VK_NULL_HANDLE) {\n"
        "            mDevice->GetFencedDeleter()->DeleteWhenUnused(mHandle);\n"
        "        }\n"
        "    }",
        "    ~UniqueVkHandle() {\n"
        "        if (mHandle != VK_NULL_HANDLE && mDevice->HasFencedDeleter()) {\n"
        "            mDevice->GetFencedDeleter()->DeleteWhenUnused(mHandle);\n"
        "        }\n"
        "    }",
        label="UniqueVkHandle.h (destructor)",
    )
    patch(
        vk / "UniqueVkHandle.h",
        # move-assignment: existing handle cleanup
        "            if (mHandle != VK_NULL_HANDLE) {\n"
        "                mDevice->GetFencedDeleter()->DeleteWhenUnused(mHandle);\n"
        "            }",
        "            if (mHandle != VK_NULL_HANDLE && mDevice->HasFencedDeleter()) {\n"
        "                mDevice->GetFencedDeleter()->DeleteWhenUnused(mHandle);\n"
        "            }",
        label="UniqueVkHandle.h (move-assign)",
    )

    # ── SwapChainVk.cpp: graceful DetachFromSurfaceImpl ──────
    patch(
        vk / "SwapChainVk.cpp",
        "void SwapChain::DetachFromSurfaceImpl() {\n"
        "    if (mTexture != nullptr) {\n"
        "        mTexture->APIDestroy();\n"
        "        mTexture = nullptr;\n"
        "    }\n"
        "\n"
        "    if (mBlitTexture != nullptr) {\n"
        "        mBlitTexture->APIDestroy();\n"
        "        mBlitTexture = nullptr;\n"
        "    }\n"
        "\n"
        "    mImages.clear();\n"
        "\n"
        "    // The swapchain images are destroyed with the swapchain.\n"
        "    if (mSwapChain != VK_NULL_HANDLE) {\n"
        "        ToBackend(GetDevice())->GetFencedDeleter()->DeleteWhenUnused(mSwapChain);\n"
        "        mSwapChain = VK_NULL_HANDLE;\n"
        "    }\n"
        "\n"
        "    if (mVkSurface != VK_NULL_HANDLE) {\n"
        "        ToBackend(GetDevice())->GetFencedDeleter()->DeleteWhenUnused(mVkSurface);\n"
        "        mVkSurface = VK_NULL_HANDLE;\n"
        "    }\n"
        "}",
        #
        "void SwapChain::DetachFromSurfaceImpl() {\n"
        "    if (mTexture != nullptr) {\n"
        "        mTexture->APIDestroy();\n"
        "        mTexture = nullptr;\n"
        "    }\n"
        "\n"
        "    if (mBlitTexture != nullptr) {\n"
        "        mBlitTexture->APIDestroy();\n"
        "        mBlitTexture = nullptr;\n"
        "    }\n"
        "\n"
        "    Device* device = ToBackend(GetDevice());\n"
        "\n"
        "    // If the device has been destroyed (FencedDeleter torn down), VkDevice-child\n"
        "    // objects (semaphores, fences, swapchain images) were already freed by the\n"
        "    // Vulkan driver.  Release UniqueVkHandle ownership without enqueuing\n"
        "    // deletion to avoid dereferencing the null FencedDeleter.\n"
        "    if (!device->HasFencedDeleter()) {\n"
        "        for (auto& img : mImages) {\n"
        "            img.renderingDoneSemaphore.Acquire();\n"
        "            img.lastAcquireDoneFence.Acquire();\n"
        "        }\n"
        "    }\n"
        "\n"
        "    mImages.clear();\n"
        "\n"
        "    // The swapchain images are destroyed with the swapchain.\n"
        "    if (mSwapChain != VK_NULL_HANDLE) {\n"
        "        if (device->HasFencedDeleter()) {\n"
        "            device->GetFencedDeleter()->DeleteWhenUnused(mSwapChain);\n"
        "        }\n"
        "        // else: VkSwapchainKHR was already freed with VkDevice.\n"
        "        mSwapChain = VK_NULL_HANDLE;\n"
        "    }\n"
        "\n"
        "    if (mVkSurface != VK_NULL_HANDLE) {\n"
        "        if (device->HasFencedDeleter()) {\n"
        "            device->GetFencedDeleter()->DeleteWhenUnused(mVkSurface);\n"
        "        } else {\n"
        "            // VkSurfaceKHR is a VkInstance child, not freed with VkDevice.\n"
        "            // Destroy directly to avoid VK_ERROR_NATIVE_WINDOW_IN_USE_KHR.\n"
        "            auto* physDev = static_cast<PhysicalDevice*>(device->GetPhysicalDevice());\n"
        "            VulkanInstance* vulkanInstance = physDev->GetVulkanInstance();\n"
        "            vulkanInstance->GetFunctions().DestroySurfaceKHR(\n"
        "                vulkanInstance->GetVkInstance(), mVkSurface, nullptr);\n"
        "        }\n"
        "        mVkSurface = VK_NULL_HANDLE;\n"
        "    }\n"
        "}",
        label="SwapChainVk.cpp (DetachFromSurfaceImpl)",
    )

    print("Dawn patches applied.")


if __name__ == "__main__":
    main()
