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
all: ge.passed

TESTS = codec rpc

CC = clang
CXX = clang++
CXXFLAGS = -std=c++2b -Wall -O2 -MMD -g
CPPFLAGS = -I.

ge.passed: $(patsubst %,%_test.passed,$(TESTS))
	touch ge.passed

%_test.passed: %_test
	./$< && touch $<.passed || rm $<.passed

%_test: %_test.o
	$(LINK.cpp) $^ $(LOADLIBES) $(LDLIBS) -o $@

%_test.o: %_test.cpp
	$(COMPILE.cpp) $(OUTPUT_OPTION) $<

-include *.d
