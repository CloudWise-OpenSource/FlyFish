#ifndef NSFW_H
#define NSFW_H

#include <atomic>
#include <chrono>
#include <memory>
#include <napi.h>
#include <thread>
#include <vector>

#include "./Queue.h"
#include "./NativeInterface.h"

class NSFW : public Napi::ObjectWrap<NSFW> {
  private:
    static Napi::FunctionReference constructor;
    static std::size_t instanceCount;
    static bool gcEnabled;

    uint32_t mDebounceMS;
    Napi::ThreadSafeFunction mErrorCallback;
    Napi::ThreadSafeFunction mEventCallback;
    std::unique_ptr<NativeInterface> mInterface;
    std::mutex mInterfaceLock;
    std::shared_ptr<EventQueue> mQueue;
    std::string mPath;
    std::thread mPollThread;
    std::atomic<bool> mRunning;

    class StartWorker: public Napi::AsyncWorker {
      public:
        StartWorker(Napi::Env env, NSFW *nsfw);
        void Execute();
        void OnOK();
        Napi::Promise RunJob();

      private:
        enum JobStatus { STARTED, ALREADY_RUNNING, COULD_NOT_START, JOB_NOT_EXECUTED_YET };
        Napi::Promise::Deferred mDeferred;
        NSFW *mNSFW;
        JobStatus mStatus;
    };

    Napi::Value Start(const Napi::CallbackInfo &info);

    class StopWorker: public Napi::AsyncWorker {
      public:
        StopWorker(Napi::Env env, NSFW *nsfw);
        void Execute();
        void OnOK();
        Napi::Promise RunJob();

      private:
        Napi::Promise::Deferred mDeferred;
        bool mDidStopWatching;
        NSFW *mNSFW;
    };

    Napi::Value Stop(const Napi::CallbackInfo &info);

    class PauseWorker: public Napi::AsyncWorker {
      public:
        PauseWorker(Napi::Env env, NSFW *nsfw);
        void Execute();
        void OnOK();
        Napi::Promise RunJob();

      private:
        Napi::Promise::Deferred mDeferred;
        std::atomic<bool> mDidPauseEvents;
        NSFW *mNSFW;
    };

    Napi::Value Pause(const Napi::CallbackInfo &info);

    class ResumeWorker: public Napi::AsyncWorker {
      public:
        ResumeWorker(Napi::Env env, NSFW *nsfw);
        void Execute();
        void OnOK();
        Napi::Promise RunJob();

      private:
        Napi::Promise::Deferred mDeferred;
        std::atomic<bool> mDidResumeEvents;
        NSFW *mNSFW;
    };

    Napi::Value Resume(const Napi::CallbackInfo &info);

  public:
    static Napi::Object Init(Napi::Env, Napi::Object exports);
    static Napi::Value InstanceCount(const Napi::CallbackInfo &info);
    void pauseQueue();
    void resumeQueue();
    void pollForEvents();

    NSFW(const Napi::CallbackInfo &info);
    ~NSFW();
};

#endif
