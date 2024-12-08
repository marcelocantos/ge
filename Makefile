# Copyright 2024 Marcelo Cantos <marcelo.cantos@gmail.com>
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
all: test bench

test: ge.passed

TESTS = $(patsubst %_test.cpp,%,$(wildcard *_test.cpp))

CC = clang
CXX = clang++
CXXFLAGS = -std=c++2b -Wall -Werror -O3 -MMD -g
CPPFLAGS = -I.

ge.passed: $(patsubst %,%_test.passed,$(TESTS))
	touch ge.passed

%_test.passed: %_test
	./$< && touch $<.passed || (rm -f $<.passed && false)

%_test: %_test.o
	$(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

%_test.o: %_test.cpp
	$(COMPILE.cpp) $(OUTPUT_OPTION) $<

.PHONY: bench
bench: $(patsubst %.cpp,%.md,$(wildcard *_bench.cpp))

%_bench.md: %_bench
	./$< --out-fmt=con --output=$@ && cat $@

bench/%: %_bench
	./$<

%_bench: %_bench.o
	$(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

%_bench.o: %_bench.cpp
	$(COMPILE.cpp) $(OUTPUT_OPTION) $<

.PHONY: loc
loc:
	tokei -e '*_test.*' -e 'loguru.*' -e 'httplib.*' -e 'doctest.*'
	tokei *_test.*

-include *.d
