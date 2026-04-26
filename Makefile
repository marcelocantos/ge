# ge — top-level delegator.
#
# ge itself has no standalone build: it's a library consumed via
# `-include $(ge)/Module.mk` from an app's Makefile. This file exists
# purely for developer ergonomics — running `make check` (or any other
# app-level target) from the ge root proxies to the canonical in-tree
# sample at sample/tiltbuggy/.
#
# The sample is responsible for exercising as much of ge's surface as
# practicable; see sample/tiltbuggy/Makefile.

SAMPLE ?= sample/tiltbuggy

# Specific targets the delegator should proxy. `check` is the big one:
# runs the 24-cell e2e matrix via the sample's Module.mk integration.
.PHONY: all check matrix-test check-list unit-test init clean ged run

all check matrix-test check-list unit-test clean run:
	$(MAKE) -C $(SAMPLE) $@

# ge/init and the sample's init both contribute to dev-machine setup.
init:
	$(MAKE) -C $(SAMPLE) ge/init
	$(MAKE) -C $(SAMPLE) init 2>/dev/null || true

# ged and other `ge/*` engine targets can be invoked directly from here
# via the sample's Module.mk. Forward anything starting with `ge/`.
ge/%:
	$(MAKE) -C $(SAMPLE) $@

# Forward per-cell invocations for parity with the sample:
#   make cell.ios-sim-tablet-dist
cell.%:
	$(MAKE) -C $(SAMPLE) $@

# ── Wire protocol codegen ──────────────────────────────────────────────────
#
# Regenerates all platform bindings from protocol/ge_wire.yaml using
# pigeon-protogen (github.com/marcelocantos/pigeon/cmd/protogen).
#
# Install protogen once:
#   GOBIN=$$HOME/go/bin go install github.com/marcelocantos/pigeon/cmd/protogen@v0.20.0
#
# Then regenerate:
#   make protogen
#
# CI drift check (exits non-zero if generated files are out of date):
#   make protogen-check
#
.PHONY: protogen protogen-check

protogen:
	scripts/run-protogen.sh

# Regenerate into a temp copy and diff against repo; fail if anything changed.
protogen-check:
	@TMPDIR=$$(mktemp -d) && \
	  cp -r . "$$TMPDIR/ge" && \
	  PROTOGEN=$$(which protogen 2>/dev/null || echo "$${GOPATH:-$$HOME/go}/bin/protogen") \
	    PROTOGEN=$$PROTOGEN "$$TMPDIR/ge/scripts/run-protogen.sh" && \
	  git -C "$$TMPDIR/ge" diff --exit-code -- \
	    protocol/gewire_gen.go \
	    include/ge/generated/gewire_gen.h \
	    src/generated/gewire_gen.c \
	    tools/ios/generated/GeWireMachine.swift \
	    tools/android/generated/GeWireMachine.kt \
	    web/src/GeWireMachine.ts \
	    formal/GeWire.tla \
	    docs/gewire_transport.puml \
	    docs/gewire_relay.puml && \
	  rm -rf "$$TMPDIR" || { rm -rf "$$TMPDIR"; echo "ERROR: generated files are out of date; run 'make protogen'"; exit 1; }
