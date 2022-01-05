#ifndef NSFW_WIN32_WATCHER
#define NSFW_WIN32_WATCHER

#include <WinSock2.h>
#include <Windows.h>
#include <string>
#include <mutex>
#include <atomic>
#include <thread>

#include "../SingleshotSemaphore.h"
#include "../Queue.h"

class Watcher
{
  public:
    Watcher(std::shared_ptr<EventQueue> queue, HANDLE dirHandle, const std::wstring &path, bool pathWasNtPrefixed);
    ~Watcher();

    bool isRunning() const { return mRunning; }
    std::string getError() const;

  private:
    void run();
    bool pollDirectoryChanges();
    void start();
    void stop();

    void setError(const std::string &error);
    void eventCallback(DWORD errorCode);
    void handleEvents();

    void resizeBuffers(std::size_t size);

    std::string getUTF8Directory(std::wstring path) ;

    std::atomic<bool> mRunning;
    SingleshotSemaphore mHasStartedSemaphore;
    SingleshotSemaphore mIsRunningSemaphore;
    mutable std::mutex mErrorMutex;
    std::string mError;

    const std::wstring mPath;
    std::shared_ptr<EventQueue> mQueue;
    HANDLE mDirectoryHandle;
    bool mPathWasNtPrefixed;

    std::vector<BYTE> mReadBuffer, mWriteBuffer;
    OVERLAPPED mOverlapped;

    std::thread mRunner;
};


#endif
