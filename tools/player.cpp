// Copyright 2026 Marcelo Cantos
// SPDX-License-Identifier: Apache-2.0

#include "player_core.h"
#include <SDL3/SDL_main.h>

int main(int, char*[]) {
    return playerCore("localhost", 42069);
}
