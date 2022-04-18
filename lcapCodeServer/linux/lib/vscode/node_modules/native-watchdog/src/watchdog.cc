/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See LICENSE in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

#include "common.h"
#include <time.h>
#include <stdlib.h>
#include <uv.h>

#if defined(_WIN32) || defined(__WIN32)
#ifndef WIN32
#define WIN32
#endif
#endif

#if !defined(WIN32)
#include <unistd.h>
#include <signal.h>
#else
#include <windows.h>
#endif

namespace
{

int64_t w_parentpid = 0; // id of the parent process
uv_thread_t w_monitor_thread_id; // id of the monitor thread

bool w_processIsRunning(long pid)
{
#if defined(WIN32)
    HANDLE process = OpenProcess(SYNCHRONIZE, FALSE, pid);
    DWORD ret = WaitForSingleObject(process, 0);
    CloseHandle(process);
    return (ret == WAIT_TIMEOUT);
#else
    return (kill(pid, 0) == 0);
#endif
}

void w_sleep(int seconds)
{
#if defined(WIN32)
    Sleep(seconds * 1000);
#else
    sleep(seconds);
#endif
}

void w_monitor(void *arg)
{
    while (true)
    {
        if (!w_processIsRunning(w_parentpid))
        {
            w_sleep(5);
            exit(87);
        }
        w_sleep(1);
    }
}

} // namespace

napi_value Start(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    NAPI_CALL(env,
              napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments, expected 1.");

    napi_valuetype t;
    NAPI_CALL(env, napi_typeof(env, argv[0], &t));
    NAPI_ASSERT(env, t == napi_number,
                "Wrong argument, number expected.");

    NAPI_CALL(env, napi_get_value_int64(env, argv[0], &w_parentpid));

    uv_thread_create(&w_monitor_thread_id, w_monitor, NULL);

    return nullptr;
}

napi_value Exit(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value argv[1];
    NAPI_CALL(env,
              napi_get_cb_info(env, info, &argc, argv, nullptr, nullptr));

    NAPI_ASSERT(env, argc == 1, "Wrong number of arguments, expected 1.");

    napi_valuetype t;
    NAPI_CALL(env, napi_typeof(env, argv[0], &t));
    NAPI_ASSERT(env, t == napi_number,
                "Wrong argument, number expected.");

    int32_t code;
    NAPI_CALL(env, napi_get_value_int32(env, argv[0], &code));

    exit(code);

    return nullptr;
}

napi_value Init(napi_env env, napi_value exports)
{
    napi_property_descriptor properties[] = {
        DECLARE_NAPI_PROPERTY("start", Start),
        DECLARE_NAPI_PROPERTY("exit", Exit)};

    NAPI_CALL(env, napi_define_properties(
                       env, exports, sizeof(properties) / sizeof(*properties), properties));

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
