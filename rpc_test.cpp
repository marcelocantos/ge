// Copyright 2024 Marcelo Cantos <marcelo.cantos@gmail.com>
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
#include <future>
#include <ranges>

#define DOCTEST_CONFIG_IMPLEMENT_WITH_MAIN
#include "doctest.h"

#include "rpc.hpp"

using namespace ge;

void check_factorial(rpc::Caller &caller, rpc::Router &router) {
  rpc::Endpoint<int, int> factorial_ep = {"factorial"};

  factorial_ep.route(router, [](int n) {
    auto f = 1;
    for (; n > 1; n--) {
      f *= n;
    }
    return f;
  });

  auto factorial = factorial_ep.bind(caller);

  CHECK(factorial(6) == 720);
}

void check_upper(rpc::Caller &caller, rpc::Router &router) {
  rpc::Endpoint<std::string, std::string> upper_ep = {"upper"};

  upper_ep.route(router, [](std::string s) {
    std::ranges::transform(s, s.begin(),
                           [](unsigned char c) { return std::toupper(c); });
    return s;
  });

  auto upper = upper_ep.bind(caller);

  CHECK(upper("hello") == "HELLO");
}

TEST_CASE("rpc inproc") {
  rpc::Router router;
  rpc::InProcCaller caller{router};

  check_factorial(caller, router);
  check_upper(caller, router);
}

TEST_CASE("rpc http") {
  std::string host = "localhost";

  rpc::Router router;

  httplib::Server server;
  server.Post("/:endpoint", rpc::http_handler(router, "endpoint"));

  int port = server.bind_to_any_port(host);

  auto future =
      std::async(std::launch::async, [&] { server.listen_after_bind(); });

  httplib::Client client{host, port};
  rpc::HttpCaller caller{client};

  check_factorial(caller, router);
  check_upper(caller, router);

  server.stop();
  future.wait();
}
