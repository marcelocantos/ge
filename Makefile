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
