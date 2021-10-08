/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#include "logger.h"

NAN_METHOD(setAsyncMode) {
  if (!info[0]->IsNumber()) {
    return Nan::ThrowError(Nan::Error("Provide queue size as first parameter"));
  }
  if (!info[1]->IsNumber()) {
    return Nan::ThrowError(Nan::Error(
        "Provide a flush interval in milliseconds as second parameter"));
  }

  spdlog::set_async_mode(
      Nan::To<int64_t>(info[0]).FromJust(),
      spdlog::async_overflow_policy::block_retry, nullptr,
      std::chrono::milliseconds(Nan::To<int64_t>(info[1]).FromJust()));
}

NAN_METHOD(setLevel) {
  if (!info[0]->IsNumber()) {
    return Nan::ThrowError(Nan::Error("Provide level"));
  }

  const int64_t numberValue = Nan::To<int64_t>(info[0]).FromJust();
  spdlog::level::level_enum level;
  switch (numberValue) {
    case spdlog::level::critical:
      level = spdlog::level::critical;
      break;
    case spdlog::level::err:
      level = spdlog::level::err;
      break;
    case spdlog::level::warn:
      level = spdlog::level::warn;
      break;
    case spdlog::level::info:
      level = spdlog::level::info;
      break;
    case spdlog::level::debug:
      level = spdlog::level::debug;
      break;
    case spdlog::level::trace:
      level = spdlog::level::trace;
      break;
    case spdlog::level::off:
      level = spdlog::level::off;
      break;
    default:
      return Nan::ThrowError(Nan::Error("Invalid level"));
  }
  spdlog::set_level(level);
}

Nan::Persistent<v8::Function> Logger::constructor;

NAN_MODULE_INIT(Logger::Init) {
  spdlog::set_async_mode(8192, spdlog::async_overflow_policy::block_retry,
                         nullptr, std::chrono::seconds(1));

  v8::Local<v8::FunctionTemplate> tpl = Nan::New<v8::FunctionTemplate>(New);
  tpl->SetClassName(Nan::New("Logger").ToLocalChecked());
  tpl->InstanceTemplate()->SetInternalFieldCount(1);

  Nan::SetPrototypeMethod(tpl, "critical", Logger::Critical);
  Nan::SetPrototypeMethod(tpl, "error", Logger::Error);
  Nan::SetPrototypeMethod(tpl, "warn", Logger::Warn);
  Nan::SetPrototypeMethod(tpl, "info", Logger::Info);
  Nan::SetPrototypeMethod(tpl, "debug", Logger::Debug);
  Nan::SetPrototypeMethod(tpl, "trace", Logger::Trace);

  Nan::SetPrototypeMethod(tpl, "getLevel", Logger::GetLevel);
  Nan::SetPrototypeMethod(tpl, "setLevel", Logger::SetLevel);
  Nan::SetPrototypeMethod(tpl, "flush", Logger::Flush);
  Nan::SetPrototypeMethod(tpl, "drop", Logger::Drop);
  Nan::SetPrototypeMethod(tpl, "setPattern", Logger::SetPattern);
  Nan::SetPrototypeMethod(tpl, "clearFormatters", Logger::ClearFormatters);

  constructor.Reset(Nan::GetFunction(tpl).ToLocalChecked());
  Nan::Set(target, Nan::New("Logger").ToLocalChecked(),
           Nan::GetFunction(tpl).ToLocalChecked());
}

Logger::Logger(std::shared_ptr<spdlog::logger> logger) : logger_(logger) {}

Logger::~Logger() {
  if (logger_ == NULL) {
    return;
  }

  try {
    spdlog::drop(logger_->name());
  } catch (...) {
    // noop
  }

  logger_ = NULL;
}

NAN_METHOD(Logger::New) {
  try {
    if (info.IsConstructCall()) {
      if (!info[0]->IsString()) {
        return Nan::ThrowError(Nan::Error("Provide a logger name"));
      }

      const std::string name = *Nan::Utf8String(info[0]);
      std::shared_ptr<spdlog::logger> logger;

      if (name == "rotating") {
        if (!info[1]->IsString() || !info[2]->IsString()) {
          return Nan::ThrowError(
              Nan::Error("Provide the log name and file name"));
        }
        if (!info[3]->IsNumber() || !info[4]->IsNumber()) {
          return Nan::ThrowError(
              Nan::Error("Provide the max size and max files"));
        }
        const std::string logName = *Nan::Utf8String(info[1]);

        logger = spdlog::get(logName);

        if (!logger) {
#if defined(_WIN32)
          std::wstring_convert<std::codecvt_utf8_utf16<wchar_t>> converter;
          const std::wstring fileName =
              converter.from_bytes(*Nan::Utf8String(info[2]));
#else
          const std::string fileName = *Nan::Utf8String(info[2]);
#endif

          logger = spdlog::rotating_logger_mt(
              logName, fileName, Nan::To<int64_t>(info[3]).FromJust(),
              Nan::To<int64_t>(info[4]).FromJust());
        }
      } else {
        logger = spdlog::stdout_logger_mt(name);
      }
      Logger *obj = new Logger(logger);
      obj->Wrap(info.This());
      info.GetReturnValue().Set(info.This());
    } else {
      const int argc = 1;
      v8::Local<v8::Value> argv[argc] = {info[0]};
      v8::Local<v8::Function> cons = Nan::New(constructor);
      info.GetReturnValue().Set(
          Nan::NewInstance(cons, argc, argv).ToLocalChecked());
    }
  } catch (const std::exception &ex) {
    return Nan::ThrowError(Nan::Error(ex.what()));
  } catch (...) {
    return Nan::ThrowError(Nan::Error("Unknown error creating log file"));
  }
}

NAN_METHOD(Logger::Critical) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->critical(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Error) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->error(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Warn) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->warn(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Info) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->info(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Debug) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->debug(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Trace) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide a message to log"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string message = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->trace(message);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::GetLevel) {
  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());

  if (obj->logger_) {
    info.GetReturnValue().Set(obj->logger_->level());
  }
}

NAN_METHOD(Logger::SetLevel) {
  if (!info[0]->IsNumber()) {
    return Nan::ThrowError(Nan::Error("Provide level"));
  }

  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());

  if (obj->logger_) {
    const int64_t numberValue = Nan::To<int64_t>(info[0]).FromJust();
    spdlog::level::level_enum level;
    switch (numberValue) {
      case spdlog::level::critical:
        level = spdlog::level::critical;
        break;
      case spdlog::level::err:
        level = spdlog::level::err;
        break;
      case spdlog::level::warn:
        level = spdlog::level::warn;
        break;
      case spdlog::level::info:
        level = spdlog::level::info;
        break;
      case spdlog::level::debug:
        level = spdlog::level::debug;
        break;
      case spdlog::level::trace:
        level = spdlog::level::trace;
        break;
      case spdlog::level::off:
        level = spdlog::level::off;
        break;
      default:
        return Nan::ThrowError(Nan::Error("Invalid level"));
    }
    obj->logger_->set_level(level);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Flush) {
  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());

  if (obj->logger_) {
    obj->logger_->flush();
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::Drop) {
  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());

  if (obj->logger_) {
    const std::string name = obj->logger_->name();
    obj->logger_ = NULL;
    spdlog::drop(name);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::SetPattern) {
  if (!info[0]->IsString()) {
    return Nan::ThrowError(Nan::Error("Provide pattern"));
  }
  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string pattern = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->set_pattern(pattern);
  }

  info.GetReturnValue().Set(info.This());
}

NAN_METHOD(Logger::ClearFormatters) {
  Logger *obj = Nan::ObjectWrap::Unwrap<Logger>(info.This());
  const std::string pattern = *Nan::Utf8String(info[0]);

  if (obj->logger_) {
    obj->logger_->set_formatter(
        std::unique_ptr<VoidFormatter>(new VoidFormatter()));
  }

  info.GetReturnValue().Set(info.This());
}
