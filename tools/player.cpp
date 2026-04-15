// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "player_core.h"
#include <SDL3/SDL_main.h>
#include <cstring>
#include <string>

int main(int argc, char* argv[]) {
    std::string name = "server";
    for (int i = 1; i < argc; i++) {
        if (std::strcmp(argv[i], "--name") == 0 && i + 1 < argc) {
            name = argv[++i];
        }
    }
    return playerCore("localhost", 42069, name);
}
