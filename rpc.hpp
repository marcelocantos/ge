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
#pragma once

#include <functional>
#include <shared_mutex>

#include "httplib.h"

#include "codec.hpp"

namespace ge::rpc {

class Caller {
public:
  virtual std::string call(const std::string &path, std::string_view req) = 0;
};

class Router {
public:
  using handler = std::function<std::string(std::string_view)>;

  virtual void route(std::string path, handler handle) {
    std::unique_lock lk(mutex_);
    routes_[path] = handle;
  }

  std::string call(const std::string &path, std::string_view req) {
    return handler_for(path)(req);
  }

private:
  std::unordered_map<std::string, handler> routes_;
  mutable std::shared_mutex mutex_;

  const handler &handler_for(const std::string &path) const {
    std::shared_lock lk(mutex_);
    auto &handle = routes_.at(path);
    lk.unlock();
    if (!handle) {
      throw std::runtime_error("route " + path + " not found");
    }
    return handle;
  }
};

class InProcCaller : public Caller {
public:
  InProcCaller(Router &router) : router_{router} {}

  std::string call(const std::string &path, std::string_view req) override {
    return router_.call(path, req);
  }

private:
  Router &router_;
};

namespace detail {
inline const std::string octets{"application/octet-stream"};
}

auto http_handler(Router &server, std::string path_param) {
  return [&, path_param](const httplib::Request &req, httplib::Response &res) {
    auto resp = server.call(req.path_params.at(path_param), req.body);
    res.set_content(resp, detail::octets);
  };
}

class HttpCaller : public Caller {
public:
  HttpCaller(httplib::Client &client) : client_{client} {}

  std::string call(const std::string &path, std::string_view req) override {
    std::string reqData{req};
    auto result = client_.Post("/" + path, reqData, detail::octets);
    if (result.error() != httplib::Error::Success) {
      throw result.error();
    }
    return result->body;
  }

private:
  httplib::Client &client_;

  static const std::string contentType_;
};

template <class Req, class Resp> struct Endpoint {
  std::string path;

  std::function<Resp(Req)> bind(Caller &c) {
    return [&c, path = path](Req req) -> Resp {
      auto reqData = codec::encoded(req);
      auto respData = c.call(path, reqData);
      return codec::decoded<Resp>(respData);
    };
  }

  void route(Router &s, std::function<Resp(Req)> handle) {
    s.route(
        path,
        [handle = std::move(handle)](std::string_view reqData) -> std::string {
          auto req = codec::decoded<Req>(reqData);
          auto resp = handle(req);
          return codec::encoded(resp);
        });
  }
};

} // namespace ge::rpc
