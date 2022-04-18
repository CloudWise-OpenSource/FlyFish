#include "../includes/win32/Watcher.h"

#include <sstream>

static
void stripNTPrefix(std::wstring &path) {
  if (path.rfind(L"\\\\?\\UNC\\", 0) != std::wstring::npos) {
    path.replace(0, 7, L"\\");
  } else if (path.rfind(L"\\\\?\\", 0) != std::wstring::npos) {
    path.erase(0, 4);
  }
}

static
std::wstring getWStringFileName(LPWSTR cFileName, DWORD length) {
  LPWSTR nullTerminatedFileName = new WCHAR[length + 1]();
  memcpy(nullTerminatedFileName, cFileName, length);
  std::wstring fileName = nullTerminatedFileName;
  delete[] nullTerminatedFileName;
  return fileName;
}

std::string Watcher::getUTF8Directory(std::wstring path) {
  std::wstring::size_type found = path.rfind('\\');
  std::wstringstream utf16DirectoryStream;

  utf16DirectoryStream << mPath;

  if (found != std::wstring::npos) {
      utf16DirectoryStream
        << "\\"
        << path.substr(0, found);
  }

  std::wstring uft16DirectoryString = utf16DirectoryStream.str();
  if (!mPathWasNtPrefixed) {
    // If we were the ones that prefixed the path, we should strip it
    // before returning it to the user
    stripNTPrefix(uft16DirectoryString);
  }

  int utf8length = WideCharToMultiByte(
      CP_UTF8,
      0,
      uft16DirectoryString.data(),
      -1,
      0,
      0,
      NULL,
      NULL
  );
  char *utf8CString = new char[utf8length];
  int failureToResolveToUTF8 = WideCharToMultiByte(
      CP_UTF8,
      0,
      uft16DirectoryString.data(),
      -1,
      utf8CString,
      utf8length,
      NULL,
      NULL
  );

  std::string utf8Directory = utf8CString;
  delete[] utf8CString;

  return utf8Directory;
}

static
std::string getUTF8FileName(std::wstring path) {
  std::wstring::size_type found = path.rfind('\\');
  if (found != std::wstring::npos) {
      path = path.substr(found + 1);
  }

  int utf8length = WideCharToMultiByte(
      CP_UTF8,
      0,
      path.data(),
      -1,
      0,
      0,
      NULL,
      NULL
      );

  // TODO: failure cases for widechar conversion
  char *utf8CString = new char[utf8length];
  int failureToResolveToUTF8 = WideCharToMultiByte(
      CP_UTF8,
      0,
      path.data(),
      -1,
      utf8CString,
      utf8length,
      NULL,
      NULL
      );

  std::string utf8Directory = utf8CString;
  delete[] utf8CString;

  return utf8Directory;
}

Watcher::Watcher(std::shared_ptr<EventQueue> queue, HANDLE dirHandle, const std::wstring &path, bool pathWasNtPrefixed)
  : mRunning(false),
  mDirectoryHandle(dirHandle),
  mQueue(queue),
  mPath(path),
  mPathWasNtPrefixed(pathWasNtPrefixed)
{
  ZeroMemory(&mOverlapped, sizeof(OVERLAPPED));
  mOverlapped.hEvent = this;
  resizeBuffers(1024 * 1024);
  start();
}

Watcher::~Watcher() {
  stop();
}

void Watcher::resizeBuffers(std::size_t size) {
  mReadBuffer.resize(size);
  mWriteBuffer.resize(size);
}

void Watcher::run() {
  while(mRunning) {
    SleepEx(INFINITE, true);
  }
}

bool Watcher::pollDirectoryChanges() {
  DWORD bytes = 0;

  if (!isRunning()) {
    return false;
  }

  if (!ReadDirectoryChangesW(
    mDirectoryHandle,
    mWriteBuffer.data(),
    static_cast<DWORD>(mWriteBuffer.size()),
    TRUE,                           // recursive watching
    FILE_NOTIFY_CHANGE_FILE_NAME
    | FILE_NOTIFY_CHANGE_DIR_NAME
    | FILE_NOTIFY_CHANGE_ATTRIBUTES
    | FILE_NOTIFY_CHANGE_SIZE
    | FILE_NOTIFY_CHANGE_LAST_WRITE
    | FILE_NOTIFY_CHANGE_LAST_ACCESS
    | FILE_NOTIFY_CHANGE_CREATION
    | FILE_NOTIFY_CHANGE_SECURITY,
    &bytes,                         // num bytes written
    &mOverlapped,
    [](DWORD errorCode, DWORD numBytes, LPOVERLAPPED overlapped) {
      auto watcher = reinterpret_cast<Watcher*>(overlapped->hEvent);
      watcher->eventCallback(errorCode);
    }))
  {
    setError("Service shutdown unexpectedly");
    return false;
  }

  return true;
}

void Watcher::eventCallback(DWORD errorCode) {
  if (errorCode != ERROR_SUCCESS) {
    if (errorCode == ERROR_NOTIFY_ENUM_DIR) {
      setError("Buffer filled up and service needs a restart");
    } else if (errorCode == ERROR_INVALID_PARAMETER) {
      // resize the buffers because we're over the network, 64kb is the max buffer size for networked transmission
      resizeBuffers(64 * 1024);

      if (!pollDirectoryChanges()) {
        setError("failed resizing buffers for network traffic");
      }
    } else {
      setError("Service shutdown unexpectedly");
    }
    return;
  }

  std::swap(mWriteBuffer, mReadBuffer);
  pollDirectoryChanges();
  handleEvents();
}

void Watcher::handleEvents() {
  BYTE *base = mReadBuffer.data();
  while (true) {
    PFILE_NOTIFY_INFORMATION info = (PFILE_NOTIFY_INFORMATION)base;
    std::wstring fileName = getWStringFileName(info->FileName, info->FileNameLength);

    switch (info->Action) {
    case (FILE_ACTION_RENAMED_OLD_NAME):
      if (info->NextEntryOffset != 0) {
        base += info->NextEntryOffset;
        info = (PFILE_NOTIFY_INFORMATION)base;
        if (info->Action == FILE_ACTION_RENAMED_NEW_NAME) {
          std::wstring fileNameNew = getWStringFileName(info->FileName, info->FileNameLength);

          mQueue->enqueue(
            RENAMED,
            getUTF8Directory(fileName),
            getUTF8FileName(fileName),
            getUTF8Directory(fileName),
            getUTF8FileName(fileNameNew)
          );
        } else {
          mQueue->enqueue(DELETED, getUTF8Directory(fileName), getUTF8FileName(fileName));
        }
      } else {
        mQueue->enqueue(DELETED, getUTF8Directory(fileName), getUTF8FileName(fileName));
      }
      break;
    case FILE_ACTION_ADDED:
    case FILE_ACTION_RENAMED_NEW_NAME: // in the case we just receive a new name and no old name in the buffer
      mQueue->enqueue(CREATED, getUTF8Directory(fileName), getUTF8FileName(fileName));
      break;
    case FILE_ACTION_REMOVED:
      mQueue->enqueue(DELETED, getUTF8Directory(fileName), getUTF8FileName(fileName));
      break;
    case FILE_ACTION_MODIFIED:
    default:
      mQueue->enqueue(MODIFIED, getUTF8Directory(fileName), getUTF8FileName(fileName));
    };

    if (info->NextEntryOffset == 0) {
      break;
    }
    base += info->NextEntryOffset;
  }
}

void Watcher::start() {
  mRunner = std::thread([this] {
    // mRunning is set to false in the d'tor
    mRunning = true;
    mIsRunningSemaphore.signal();
    run();
  });

  if (!mRunner.joinable()) {
    mRunning = false;
    return;
  }

  if (!mIsRunningSemaphore.waitFor(std::chrono::seconds(10))) {
    setError("Watcher is not started");
    return;
  }

  QueueUserAPC([](__in ULONG_PTR self) {
    auto watcher = reinterpret_cast<Watcher*>(self);
    watcher->pollDirectoryChanges();
    watcher->mHasStartedSemaphore.signal();
  }, mRunner.native_handle(), (ULONG_PTR)this);

  if (!mHasStartedSemaphore.waitFor(std::chrono::seconds(10))) {
    setError("Watcher is not started");
  }
}

void Watcher::stop() {
  mRunning = false;
  // schedule a NOOP APC to force the running loop in `Watcher::run()` to wake
  // up, notice the changed `mRunning` and properly terminate the running loop
  QueueUserAPC([](__in ULONG_PTR) {}, mRunner.native_handle(), (ULONG_PTR)this);
  mRunner.join();
}

void Watcher::setError(const std::string &error) {
  std::lock_guard<std::mutex> lock(mErrorMutex);
  mError = error;
}

std::string Watcher::getError() const {
  if (!isRunning()) {
    return "Failed to start watcher";
  }

  std::lock_guard<std::mutex> lock(mErrorMutex);
  return mError;
}
