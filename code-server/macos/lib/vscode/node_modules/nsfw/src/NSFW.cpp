#include "../includes/NSFW.h"

Napi::FunctionReference NSFW::constructor;
std::size_t NSFW::instanceCount = 0;
bool NSFW::gcEnabled = false;

NSFW::NSFW(const Napi::CallbackInfo &info):
  Napi::ObjectWrap<NSFW>(info),
  mDebounceMS(0),
  mInterface(nullptr),
  mQueue(std::make_shared<EventQueue>()),
  mPath(""),
  mRunning(false)
{
  auto env = info.Env();
  if (info.Length() < 1 || !info[0].IsString()) {
    throw Napi::TypeError::New(env, "Must pass a string path as the first argument to NSFW.");
  }

  mPath = info[0].ToString();

  if (info.Length() < 2 || !info[1].IsFunction()) {
    throw Napi::TypeError::New(env, "Must pass an event callback as the second parameter to NSFW.");
  }

  mEventCallback = Napi::ThreadSafeFunction::New(
    env,
    info[1].As<Napi::Function>(),
    "nsfw",
    0,
    1
  );

  if (info.Length() >= 3) {
    if (!info[2].IsObject()) {
      throw Napi::TypeError::New(env, "If the third parameter to NSFW is provided, it must be an object.");
    }

    Napi::Object options = info[2].ToObject();
    Napi::Value maybeDebounceMS = options["debounceMS"];
    if (options.Has("debounceMS") && !maybeDebounceMS.IsNumber()) {
      throw Napi::TypeError::New(env, "options.debounceMS must be a number.");
    }

    if (maybeDebounceMS.IsNumber()) {
      Napi::Number temp = maybeDebounceMS.ToNumber();
      double bounds = temp.DoubleValue();
      if (bounds < 1 || bounds > 60000) {
        throw Napi::TypeError::New(env, "options.debounceMS must be >= 1 and <= 60000.");
      }

      mDebounceMS = temp;
    }

    Napi::Value maybeErrorCallback = options["errorCallback"];
    if (options.Has("errorCallback") && !maybeErrorCallback.IsFunction()) {
      throw Napi::TypeError::New(env, "options.errorCallback must be a function.");
    }

    mErrorCallback = Napi::ThreadSafeFunction::New(
      env,
      maybeErrorCallback.IsFunction()
        ? maybeErrorCallback.As<Napi::Function>()
        : Napi::Function::New(env, [](const Napi::CallbackInfo &info) {}),
      "nsfw",
      0,
      1
    );
  }

  if (gcEnabled) {
    instanceCount++;
  }
}

NSFW::~NSFW() {
  mErrorCallback.Release();
  mEventCallback.Release();

  if (gcEnabled) {
    instanceCount--;
  }
}

NSFW::StartWorker::StartWorker(Napi::Env env, NSFW *nsfw):
  Napi::AsyncWorker(env, "nsfw"),
  mDeferred(Napi::Promise::Deferred::New(env)),
  mNSFW(nsfw),
  mStatus(JOB_NOT_EXECUTED_YET)
{}

Napi::Promise NSFW::StartWorker::RunJob() {
  mNSFW->Ref();
  this->Queue();

  return mDeferred.Promise();
}

void NSFW::StartWorker::Execute() {
  std::lock_guard<std::mutex> lock(mNSFW->mInterfaceLock);

  if (mNSFW->mInterface) {
    mStatus = ALREADY_RUNNING;
    return;
  }

  mNSFW->mQueue->clear();
  mNSFW->mInterface.reset(new NativeInterface(mNSFW->mPath, mNSFW->mQueue));

  if (mNSFW->mInterface->isWatching()) {
    mStatus = STARTED;
    mNSFW->mRunning = true;
    mNSFW->mErrorCallback.Acquire();
    mNSFW->mEventCallback.Acquire();
    mNSFW->mPollThread = std::thread([] (NSFW *nsfw) { nsfw->pollForEvents(); }, mNSFW);
  } else {
    mStatus = COULD_NOT_START;
    mNSFW->mInterface.reset(nullptr);
  }
}

void NSFW::StartWorker::OnOK() {
  std::lock_guard<std::mutex> lock(mNSFW->mInterfaceLock);
  auto env = Env();
  switch (mStatus) {
    case ALREADY_RUNNING:
      mNSFW->Unref();
      mDeferred.Reject(Napi::Error::New(env, "This NSFW cannot be started, because it is already running.").Value());
      break;

    case COULD_NOT_START:
      mNSFW->Unref();
      mDeferred.Reject(Napi::Error::New(env, "NSFW was unable to start watching that directory.").Value());
      break;

    case STARTED:
      mDeferred.Resolve(env.Undefined());
      break;

    default:
      mNSFW->Unref();
      mDeferred.Reject(Napi::Error::New(
        env,
        "Execute did not run, but OnOK fired. This should never have happened."
      ).Value());
  }
}

Napi::Value NSFW::Start(const Napi::CallbackInfo &info) {
  return (new StartWorker(info.Env(), this))->RunJob();
}

NSFW::StopWorker::StopWorker(Napi::Env env, NSFW *nsfw):
  Napi::AsyncWorker(env, "nsfw"),
  mDeferred(Napi::Promise::Deferred::New(env)),
  mDidStopWatching(false),
  mNSFW(nsfw)
{}

Napi::Promise NSFW::StopWorker::RunJob() {
  this->Queue();
  return mDeferred.Promise();
}

void NSFW::StopWorker::Execute() {
  {
    std::lock_guard<std::mutex> lock(mNSFW->mInterfaceLock);
    if (!mNSFW->mInterface) {
      return;
    }
  }

  mDidStopWatching = true;
  mNSFW->mRunning = false;
  mNSFW->mPollThread.join();

  std::lock_guard<std::mutex> lock(mNSFW->mInterfaceLock);
  mNSFW->mInterface.reset(nullptr);
  mNSFW->mQueue->clear();
}

void NSFW::StopWorker::OnOK() {
  std::lock_guard<std::mutex> lock(mNSFW->mInterfaceLock);
  if (mDidStopWatching) {
    mNSFW->Unref();
    mDeferred.Resolve(Env().Undefined());
  } else {
    mDeferred.Reject(Napi::Error::New(Env(), "This NSFW cannot be stopped, because it is not running.").Value());
  }
}

Napi::Value NSFW::Stop(const Napi::CallbackInfo &info) {
  return (new StopWorker(info.Env(), this))->RunJob();
}

NSFW::PauseWorker::PauseWorker(Napi::Env env, NSFW *nsfw):
  Napi::AsyncWorker(env, "nsfw"),
  mDeferred(Napi::Promise::Deferred::New(env)),
  mDidPauseEvents(false),
  mNSFW(nsfw)
{}

Napi::Promise NSFW::PauseWorker::RunJob() {
  this->Queue();
  return mDeferred.Promise();
}

void NSFW::PauseWorker::Execute() {
  mDidPauseEvents = true;
  mNSFW->pauseQueue();
}

void NSFW::PauseWorker::OnOK() {
  if (mDidPauseEvents) {
    mDeferred.Resolve(Env().Undefined());
  } else {
    mDeferred.Reject(Napi::Error::New(Env(), "This NSFW could not be paused.").Value());
  }
}

Napi::Value NSFW::Pause(const Napi::CallbackInfo &info) {
  return (new PauseWorker(info.Env(), this))->RunJob();
}

NSFW::ResumeWorker::ResumeWorker(Napi::Env env, NSFW *nsfw):
  Napi::AsyncWorker(env, "nsfw"),
  mDeferred(Napi::Promise::Deferred::New(env)),
  mDidResumeEvents(false),
  mNSFW(nsfw)
{}

Napi::Promise NSFW::ResumeWorker::RunJob() {
  this->Queue();
  return mDeferred.Promise();
}

void NSFW::ResumeWorker::Execute() {
  mDidResumeEvents = true;
  mNSFW->resumeQueue();
}

void NSFW::ResumeWorker::OnOK() {
  if (mDidResumeEvents) {
    mDeferred.Resolve(Env().Undefined());
  } else {
    mDeferred.Reject(Napi::Error::New(Env(), "This NSFW could not be resumed.").Value());
  }
}

Napi::Value NSFW::Resume(const Napi::CallbackInfo &info) {
  return (new ResumeWorker(info.Env(), this))->RunJob();
}

void NSFW::pauseQueue() {
  mQueue->pause();
}

void NSFW::resumeQueue() {
  mQueue->resume();
}

void NSFW::pollForEvents() {
  while (mRunning) {
    uint32_t sleepDuration = 50;
    {
      std::lock_guard<std::mutex> lock(mInterfaceLock);

      if (mInterface->hasErrored()) {
        const std::string &error = mInterface->getError();
        mErrorCallback.NonBlockingCall([error](Napi::Env env, Napi::Function jsCallback) {
          Napi::Value jsError = Napi::Error::New(env, error).Value();
          jsCallback.Call({ jsError });
        });
        mRunning = false;
        break;
      }

      if (mQueue->count() != 0) {
        auto events = mQueue->dequeueAll();
        if (events != nullptr) {
          sleepDuration = mDebounceMS;
          auto callback = [](Napi::Env env, Napi::Function jsCallback, std::vector<std::unique_ptr<Event>> *eventsRaw) {
            std::unique_ptr<std::vector<std::unique_ptr<Event>>> events(eventsRaw);
            eventsRaw = nullptr;

            int numEvents = events->size();
            Napi::Array eventArray = Napi::Array::New(env, numEvents);

            for (int i = 0; i < numEvents; ++i) {
              auto event = Napi::Object::New(env);
              event["action"] = Napi::Number::New(env, (*events)[i]->type);
              event["directory"] = Napi::String::New(env, (*events)[i]->fromDirectory);

              if ((*events)[i]->type == RENAMED) {
                event["oldFile"] = Napi::String::New(env, (*events)[i]->fromFile);
                event["newDirectory"] = Napi::String::New(env, (*events)[i]->toDirectory);
                event["newFile"] = Napi::String::New(env, (*events)[i]->toFile);
              } else {
                event["file"] = Napi::String::New(env, (*events)[i]->fromFile);
              }

              eventArray[(uint32_t)i] = event;
            }

            jsCallback.Call({ eventArray });
          };

          mEventCallback.NonBlockingCall(events.release(), callback);
        }
      }
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(sleepDuration));
  }

  mErrorCallback.Release();
  mEventCallback.Release();
}

Napi::Value NSFW::InstanceCount(const Napi::CallbackInfo &info) {
  return Napi::Number::New(info.Env(), instanceCount);
}

Napi::Object NSFW::Init(Napi::Env env, Napi::Object exports) {
  gcEnabled = ((Napi::Value)env.Global()["gc"]).IsFunction();

  Napi::Function nsfwConstructor = DefineClass(env, "NSFW", {
    InstanceMethod("start", &NSFW::Start),
    InstanceMethod("stop", &NSFW::Stop),
    InstanceMethod("pause", &NSFW::Pause),
    InstanceMethod("resume", &NSFW::Resume)
  });

  if (gcEnabled) {
    nsfwConstructor.DefineProperty(Napi::PropertyDescriptor::Function(
      "getAllocatedInstanceCount",
      &NSFW::InstanceCount,
      napi_static
    ));
  }

  #ifdef NSFW_TEST_SLOW_1
    nsfwConstructor.DefineProperty(Napi::PropertyDescriptor::Value(
      "NSFW_TEST_SLOW",
      Napi::Boolean::New(env, true)
    ));
  #endif

  constructor = Napi::Persistent(nsfwConstructor);
  constructor.SuppressDestruct();

  return nsfwConstructor;
}

static Napi::Object Init(Napi::Env env, Napi::Object exports) {
  return NSFW::Init(env, exports);
}

NODE_API_MODULE(nsfw, Init)
