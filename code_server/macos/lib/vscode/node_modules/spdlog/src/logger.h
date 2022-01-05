/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#ifndef CONSOLE_H
#define CONSOLE_H

#include <nan.h>

// Prevent child processes from inheriting the file handles
#define SPDLOG_PREVENT_CHILD_FD

#if defined(_WIN32)
// Use wide character file names in windows
#define SPDLOG_WCHAR_FILENAMES
#endif

#include <spdlog/spdlog.h>

NAN_METHOD(setAsyncMode);
NAN_METHOD(setLevel);

class Logger : public Nan::ObjectWrap {
 public:
  static NAN_MODULE_INIT(Init);

 private:
  explicit Logger(std::shared_ptr<spdlog::logger> logger);
  ~Logger();

  static NAN_METHOD(New);

  static NAN_METHOD(Critical);
  static NAN_METHOD(Error);
  static NAN_METHOD(Warn);
  static NAN_METHOD(Info);
  static NAN_METHOD(Debug);
  static NAN_METHOD(Trace);

  static NAN_METHOD(GetLevel);
  static NAN_METHOD(SetLevel);
  static NAN_METHOD(Flush);
  static NAN_METHOD(Drop);
  static NAN_METHOD(SetPattern);
  static NAN_METHOD(ClearFormatters);

  static Nan::Persistent<v8::Function> constructor;

  std::shared_ptr<spdlog::logger> logger_;
};

class VoidFormatter : public spdlog::formatter {
  void format(spdlog::details::log_msg &msg) override {
    msg.formatted << fmt::StringRef(msg.raw.data(), msg.raw.size());
    msg.formatted.write("", -1);
  }
};

#endif  // !CONSOLE_H
