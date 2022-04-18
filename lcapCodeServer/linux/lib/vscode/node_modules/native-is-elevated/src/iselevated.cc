#include <node_api.h>

#if defined(_WIN32) || defined(WIN32)
#include <windows.h>  // Windows
#else
#include <unistd.h>   // Unix (macOS, Linux)
#endif

namespace
{
  napi_value IsElevated(napi_env env, napi_callback_info info)
  {
    bool bIsElevated = false;

    #if defined(_WIN32) || defined(WIN32)
    // Based on http://stackoverflow.com/a/8196291
    HANDLE hToken = NULL;
    if (OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &hToken))
    {
      TOKEN_ELEVATION Elevation;
      DWORD cbSize = sizeof(TOKEN_ELEVATION);
      if (GetTokenInformation(hToken,
                              TokenElevation,
                              &Elevation,
                              sizeof(Elevation),
                              &cbSize))
      {
        bIsElevated = Elevation.TokenIsElevated;
      }
    }
    if (hToken)
    {
      CloseHandle(hToken);
    }
    #else
    bIsElevated = geteuid() == 0;
    #endif

    napi_value napi_result;
    napi_get_boolean(env, bIsElevated, &napi_result);

    return napi_result;
  }

  napi_value Init(napi_env env, napi_value exports) {
    napi_value isElevated;
    napi_create_function(env, "isElevated", NAPI_AUTO_LENGTH, IsElevated, NULL, &isElevated);
    napi_set_named_property(env, exports, "isElevated", isElevated);

    return exports;
  }

  NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);
}
