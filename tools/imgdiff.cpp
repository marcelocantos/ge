// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0
//
// imgdiff — compare two PNGs and exit 0 if RMS difference is within a
// threshold. Used by matrix-test.sh to detect rendering regressions.
//
// Usage:
//   imgdiff <a.png> <b.png> [--threshold=<rms>] [--verbose]
//
// Exit codes:
//   0  within threshold
//   1  above threshold
//   2  invalid args, missing file, or dimensions mismatch

#include <ge/ImageDiff.h>

#define STB_IMAGE_IMPLEMENTATION
#include <stb_image.h>

#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>

namespace {

void printUsage(const char* argv0) {
    std::fprintf(stderr,
        "Usage: %s <a.png> <b.png> [--threshold=<rms>] [--verbose]\n"
        "  Compare two PNGs. Exit 0 if RMS <= threshold (default 0.05).\n",
        argv0);
}

} // namespace

int main(int argc, char** argv) {
    const char* a = nullptr;
    const char* b = nullptr;
    float threshold = 0.05f;
    bool verbose = false;

    for (int i = 1; i < argc; i++) {
        const char* arg = argv[i];
        if (std::strncmp(arg, "--threshold=", 12) == 0) {
            threshold = std::atof(arg + 12);
        } else if (std::strcmp(arg, "--verbose") == 0) {
            verbose = true;
        } else if (arg[0] == '-') {
            printUsage(argv[0]);
            return 2;
        } else if (!a)      a = arg;
        else if (!b)        b = arg;
        else { printUsage(argv[0]); return 2; }
    }
    if (!a || !b) { printUsage(argv[0]); return 2; }

    int wa, ha, na, wb, hb, nb;
    uint8_t* da = stbi_load(a, &wa, &ha, &na, 4);
    uint8_t* db = stbi_load(b, &wb, &hb, &nb, 4);
    if (!da || !db) {
        std::fprintf(stderr, "imgdiff: failed to load %s\n", !da ? a : b);
        if (da) stbi_image_free(da);
        if (db) stbi_image_free(db);
        return 2;
    }
    if (wa != wb || ha != hb) {
        std::fprintf(stderr, "imgdiff: dimensions differ (%dx%d vs %dx%d)\n",
                     wa, ha, wb, hb);
        stbi_image_free(da);
        stbi_image_free(db);
        return 2;
    }

    auto r = imgdiff::compareCPU(da, db, uint32_t(wa), uint32_t(ha), 4);
    stbi_image_free(da);
    stbi_image_free(db);
    if (!r.valid) {
        std::fprintf(stderr, "imgdiff: comparison failed\n");
        return 2;
    }

    if (verbose) {
        std::fprintf(stderr, "rms=%.4f max=%.4f threshold=%.4f\n",
                     r.rms, r.maxDiff, threshold);
    }
    std::printf("%.4f\n", r.rms);
    return r.rms <= threshold ? 0 : 1;
}
