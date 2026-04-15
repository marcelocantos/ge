// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// Core Text implementation of ge::resolveFont for macOS and iOS.

#include <ge/FontLoader.h>
#include <ge/Resource.h>

#import <CoreText/CoreText.h>
#import <Foundation/Foundation.h>

#include <spdlog/spdlog.h>

namespace ge {
namespace {

// Map logical font names to Core Text family names.
// The Apple system sans-serif is San Francisco on modern iOS/macOS,
// but that's only accessible via CTFontCreateUIFontForLanguage.
// Helvetica is a safe, long-standing alternative that's on all
// Apple platforms.
struct FamilySpec {
    const char* family;
    CTFontSymbolicTraits traits;
};

FamilySpec familyForName(const std::string& name) {
    if (name == "sans-serif")      return {"Helvetica", 0};
    if (name == "sans-serif-bold") return {"Helvetica", kCTFontBoldTrait};
    if (name == "serif")           return {"Times New Roman", 0};
    if (name == "serif-bold")      return {"Times New Roman", kCTFontBoldTrait};
    if (name == "monospace")       return {"Menlo", 0};
    if (name == "monospace-bold")  return {"Menlo", kCTFontBoldTrait};
    return {nullptr, 0};
}

// Find the face index within a .ttc font collection that matches the
// given PostScript name.
int faceIndexForPSName(const std::string& path, CFStringRef targetPSName) {
    CFStringRef pathStr = CFStringCreateWithCString(
        kCFAllocatorDefault, path.c_str(), kCFStringEncodingUTF8);
    if (!pathStr) return 0;
    CFURLRef url = CFURLCreateWithFileSystemPath(
        kCFAllocatorDefault, pathStr, kCFURLPOSIXPathStyle, false);
    CFRelease(pathStr);
    if (!url) return 0;

    CFArrayRef descs = CTFontManagerCreateFontDescriptorsFromURL(url);
    CFRelease(url);
    if (!descs) return 0;

    int found = 0;
    CFIndex count = CFArrayGetCount(descs);
    for (CFIndex i = 0; i < count; i++) {
        auto desc = (CTFontDescriptorRef)CFArrayGetValueAtIndex(descs, i);
        CFStringRef psName = (CFStringRef)CTFontDescriptorCopyAttribute(
            desc, kCTFontNameAttribute);
        if (psName) {
            if (CFStringCompare(psName, targetPSName, 0) == kCFCompareEqualTo) {
                found = int(i);
                CFRelease(psName);
                break;
            }
            CFRelease(psName);
        }
    }
    CFRelease(descs);
    return found;
}

FontRef resolveSystemFont(const std::string& name) {
    FamilySpec spec = familyForName(name);
    if (!spec.family) {
        SPDLOG_WARN("Unknown system font name: {}", name);
        return {};
    }

    CFStringRef familyStr = CFStringCreateWithCString(
        kCFAllocatorDefault, spec.family, kCFStringEncodingUTF8);
    if (!familyStr) return {};

    CTFontRef font = CTFontCreateWithName(familyStr, 12.0, nullptr);
    CFRelease(familyStr);
    if (!font) return {};

    if (spec.traits) {
        CTFontRef bold = CTFontCreateCopyWithSymbolicTraits(
            font, 0, nullptr, spec.traits, spec.traits);
        if (bold) {
            CFRelease(font);
            font = bold;
        }
    }

    CFURLRef url = (CFURLRef)CTFontCopyAttribute(font, kCTFontURLAttribute);
    CFStringRef psName = CTFontCopyPostScriptName(font);
    CFRelease(font);
    if (!url || !psName) {
        if (url) CFRelease(url);
        if (psName) CFRelease(psName);
        return {};
    }

    char pathBuf[1024];
    if (!CFURLGetFileSystemRepresentation(url, true,
                                          reinterpret_cast<UInt8*>(pathBuf),
                                          sizeof(pathBuf))) {
        CFRelease(url);
        CFRelease(psName);
        return {};
    }
    CFRelease(url);

    FontRef ref;
    ref.path = pathBuf;
    ref.faceIndex = faceIndexForPSName(ref.path, psName);
    CFRelease(psName);
    return ref;
}

} // namespace

FontRef resolveFont(const std::string& uri) {
    constexpr const char* kSystemPrefix = "system:";
    constexpr const char* kFilePrefix = "file:";

    if (uri.starts_with(kSystemPrefix)) {
        return resolveSystemFont(uri.substr(strlen(kSystemPrefix)));
    }
    if (uri.starts_with(kFilePrefix)) {
        return FontRef{uri.substr(strlen(kFilePrefix)), 0};
    }
    return FontRef{ge::resource(uri), 0};
}

} // namespace ge
