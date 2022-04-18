#ifndef NSFW_RUNLOOP_H
#define NSFW_RUNLOOP_H

#include "../SingleshotSemaphore.h"
#include "FSEventsService.h"

#include <CoreServices/CoreServices.h>
#include <thread>
#include <string>

void *scheduleRunLoopWork(void *runLoop);
void FSEventsServiceCallback(
  ConstFSEventStreamRef streamRef,
  void *clientCallBackInfo,
  size_t numEvents,
  void *eventPaths,
  const FSEventStreamEventFlags eventFlags[],
  const FSEventStreamEventId eventIds[]
);

class FSEventsService;

class RunLoop {
public:
  RunLoop(FSEventsService *eventsService, std::string path);

  friend void *scheduleRunLoopWork(void *runLoop);
  bool isLooping();

  ~RunLoop();
private:
  void work();

  FSEventsService *mEventsService;
  FSEventStreamRef mEventStream;
  bool mExited;
  std::string mPath;
  CFRunLoopRef mRunLoop;
  std::thread mRunLoopThread;
  SingleshotSemaphore mReadyForCleanup;
  bool mStarted;
};

#endif
