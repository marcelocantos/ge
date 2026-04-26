#!/usr/bin/env bash
# Copyright 2026 Marcelo Cantos
# SPDX-License-Identifier: Apache-2.0
#
# run-protogen.sh — generate wire protocol bindings from protocol/ge_wire.yaml.
#
# Runs pigeon-protogen in a temporary scratch directory so its hardwired output
# paths (Sources/Pigeon/, android/pigeon/..., c/include/pigeon/, etc.) don't
# pollute the ge repo layout. After generation, moves each output to the
# ge-appropriate location:
#
#   protogen default path                         → ge destination
#   ─────────────────────────────────────────────────────────────────────
#   protocol/gewire_gen.go                        → protocol/gewire_gen.go
#   Sources/Pigeon/GeWireMachine.swift            → tools/ios/generated/GeWireMachine.swift
#   android/pigeon/.../GeWireMachine.kt           → tools/android/generated/GeWireMachine.kt
#   web/src/GeWireMachine.ts                      → web/src/GeWireMachine.ts
#   c/include/pigeon/gewire_gen.h                 → include/ge/generated/gewire_gen.h
#   c/src/gewire_gen.c                            → src/generated/gewire_gen.c
#   formal/GeWire.tla                             → formal/GeWire.tla
#   docs/transport.puml                           → docs/gewire_transport.puml
#   docs/relay.puml                               → docs/gewire_relay.puml
#
# Usage:
#   scripts/run-protogen.sh          # regenerate from protocol/ge_wire.yaml
#   PROTOGEN=/path/to/protogen scripts/run-protogen.sh   # override binary

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
YAML="$REPO_ROOT/protocol/ge_wire.yaml"

# Locate protogen binary. Preference order:
#   1. $PROTOGEN env var
#   2. $GOPATH/bin/protogen (from: go install github.com/marcelocantos/pigeon/cmd/protogen@v0.20.0)
#   3. $(go env GOPATH)/bin/protogen
GOBIN="${GOPATH:-$(go env GOPATH)}/bin"
PROTOGEN="${PROTOGEN:-${GOBIN}/protogen}"

if [[ ! -x "$PROTOGEN" ]]; then
  echo "protogen not found at $PROTOGEN" >&2
  echo "Install with: GOBIN=$GOBIN go install github.com/marcelocantos/pigeon/cmd/protogen@v0.20.0" >&2
  exit 1
fi

# Run in a temp scratch directory so protogen's default output paths don't land
# directly in the repo.
SCRATCH=$(mktemp -d)
trap 'rm -rf "$SCRATCH"' EXIT

# protogen reads the YAML and writes relative to its working directory.
cd "$SCRATCH"
"$PROTOGEN" "$YAML"

# Move generated files to ge-appropriate locations.
install -Dm644 "$SCRATCH/protocol/gewire_gen.go"           "$REPO_ROOT/protocol/gewire_gen.go"
install -Dm644 "$SCRATCH/Sources/Pigeon/GeWireMachine.swift" "$REPO_ROOT/tools/ios/generated/GeWireMachine.swift"
install -Dm644 "$SCRATCH/android/pigeon/src/main/kotlin/com/marcelocantos/pigeon/crypto/GeWireMachine.kt" \
               "$REPO_ROOT/tools/android/generated/GeWireMachine.kt"
install -Dm644 "$SCRATCH/web/src/GeWireMachine.ts"          "$REPO_ROOT/web/src/GeWireMachine.ts"
install -Dm644 "$SCRATCH/c/include/pigeon/gewire_gen.h"     "$REPO_ROOT/include/ge/generated/gewire_gen.h"
install -Dm644 "$SCRATCH/c/src/gewire_gen.c"                "$REPO_ROOT/src/generated/gewire_gen.c"
install -Dm644 "$SCRATCH/formal/GeWire.tla"                 "$REPO_ROOT/formal/GeWire.tla"
install -Dm644 "$SCRATCH/docs/transport.puml"               "$REPO_ROOT/docs/gewire_transport.puml"
install -Dm644 "$SCRATCH/docs/relay.puml"                   "$REPO_ROOT/docs/gewire_relay.puml"

echo "protogen: generated bindings written to ge layout"
