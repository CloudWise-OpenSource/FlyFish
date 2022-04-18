/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for
 *  license information.
 *--------------------------------------------------------------------------------------------*/

#include <nan.h>
#include "logger.h"

NAN_MODULE_INIT(Init) {
  Nan::Set(target, Nan::New("version").ToLocalChecked(), Nan::New(SPDLOG_VERSION));
  Nan::SetMethod(target, "setLevel", setLevel);
  Nan::SetMethod(target, "setFlushOn", setFlushOn);

  Logger::Init(target);
}

NODE_MODULE(spdlog, Init)
