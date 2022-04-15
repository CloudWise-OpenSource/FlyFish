#include <node_api.h>

#if _WIN32
#include <windows.h>
#endif

namespace foreground_love {

napi_value AllowSetForegroundWindow(napi_env env, napi_callback_info info) {
#if _WIN32
  napi_value argv[1];
  size_t argc = 1;

  napi_get_cb_info(env, info, &argc, argv, NULL, NULL);

  int pid = 0;

  if (argc != 0) {
    napi_valuetype valuetype0;
    napi_typeof(env, argv[0], &valuetype0);

    if (valuetype0 != napi_undefined) {
      napi_status status = napi_get_value_int32(env, argv[0], &pid);

      if (status != napi_ok) {
        napi_throw_type_error(env, NULL, "Invalid number was passed as argument.");
        return NULL;
      }
    }
  }

  BOOL result;
  if (pid != 0) {
    result = ::AllowSetForegroundWindow(pid);
  } else {
    // Send foreground love to all processes
    result = ::AllowSetForegroundWindow(ASFW_ANY);
  }

  napi_value napi_result;
  napi_get_boolean(env, result, &napi_result);
#else
  napi_value napi_result;
  napi_get_undefined(env, &napi_result);
#endif

  return napi_result;
}

napi_value Init(napi_env env, napi_value exports) {
  napi_value allowSetForegroundWindow;
  napi_create_function(env, "allowSetForegroundWindow", NAPI_AUTO_LENGTH, AllowSetForegroundWindow, NULL, &allowSetForegroundWindow);
  napi_set_named_property(env, exports, "allowSetForegroundWindow", allowSetForegroundWindow);

  return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);

} // namespace foreground_love
