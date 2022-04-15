#include "../includes/win32/Controller.h"

static bool isNtPath(const std::wstring &path) {
  return path.rfind(L"\\\\?\\", 0) == 0 || path.rfind(L"\\??\\", 0) == 0;
}

static std::wstring prefixWithNtPath(const std::wstring &path) {
  const ULONG widePathLength = GetFullPathNameW(path.c_str(), 0, nullptr, nullptr);
  if (widePathLength == 0) {
    return path;
  }

  std::wstring ntPathString;
  ntPathString.resize(widePathLength - 1);
  if (GetFullPathNameW(path.c_str(), widePathLength, &(ntPathString[0]), nullptr) != widePathLength - 1) {
    return path;
  }

  return ntPathString.rfind(L"\\\\", 0) == 0
    ? ntPathString.replace(0, 2, L"\\\\?\\UNC\\")
    : ntPathString.replace(0, 0, L"\\\\?\\");
}

static std::wstring convertMultiByteToWideChar(const std::string &multiByte) {
  const int wlen = MultiByteToWideChar(CP_UTF8, 0, multiByte.data(), -1, 0, 0);

  if (wlen == 0) {
    return std::wstring();
  }

  std::wstring wideString;
  wideString.resize(wlen - 1);

  int failureToResolveUTF8 = MultiByteToWideChar(CP_UTF8, 0, multiByte.data(), -1, &(wideString[0]), wlen);
  if (failureToResolveUTF8 == 0) {
    return std::wstring();
  }

  return wideString;
}

HANDLE Controller::openDirectory(const std::wstring &path) {
  return CreateFileW(
          path.data(),
          FILE_LIST_DIRECTORY,
          FILE_SHARE_READ
          | FILE_SHARE_WRITE
          | FILE_SHARE_DELETE,
          NULL,
          OPEN_EXISTING,
          FILE_FLAG_BACKUP_SEMANTICS
          | FILE_FLAG_OVERLAPPED,
          NULL
         );
}

Controller::Controller(std::shared_ptr<EventQueue> queue, const std::string &path)
  : mDirectoryHandle(INVALID_HANDLE_VALUE)
{
  auto widePath = convertMultiByteToWideChar(path);
  const bool isNt = isNtPath(widePath);
  if (!isNt) {
    // We convert to an NT Path to support paths > MAX_PATH
    widePath = prefixWithNtPath(widePath);
  }
  mDirectoryHandle = openDirectory(widePath);

  if (mDirectoryHandle == INVALID_HANDLE_VALUE) {
    return;
  }

  mWatcher.reset(new Watcher(queue, mDirectoryHandle, widePath, isNt));
}

Controller::~Controller() {
  mWatcher.reset();
  CancelIo(mDirectoryHandle);
  CloseHandle(mDirectoryHandle);
  mDirectoryHandle = INVALID_HANDLE_VALUE;
}

std::string Controller::getError() {
  if (mDirectoryHandle == INVALID_HANDLE_VALUE) {
    return "Failed to open directory";
  }
  return mWatcher->getError();
}

bool Controller::hasErrored() {
  return mDirectoryHandle == INVALID_HANDLE_VALUE || !mWatcher->getError().empty();
}

bool Controller::isWatching() {
  return !hasErrored() && mWatcher->isRunning();
}
