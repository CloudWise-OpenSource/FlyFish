#include "../../includes/linux/InotifyEventLoop.h"

InotifyEventLoop::InotifyEventLoop(
  int inotifyInstance,
  InotifyService *inotifyService
) :
  mInotifyInstance(inotifyInstance),
  mInotifyService(inotifyService)
{
  mStarted = !pthread_create(
    &mEventLoop,
    NULL,
    [](void *eventLoop)->void * {
      ((InotifyEventLoop *)eventLoop)->work();
      return NULL;
    },
    (void *)this
  );
    if (mStarted) { mLoopingSemaphore.wait(); }
}

bool InotifyEventLoop::isLooping() {
  return mStarted;
}

void InotifyEventLoop::work() {
  char buffer[BUFFER_SIZE];
  inotify_event *event = NULL;
  unsigned int bytesRead, position = 0;
  bool isDirectoryEvent = false, isDirectoryRemoval = false;
  InotifyService *inotifyService = mInotifyService;
  InotifyRenameEvent renameEvent;
  renameEvent.isStarted = false;

  auto create = [&event, &isDirectoryEvent, &inotifyService]() {
    if (event == NULL) {
      return;
    }

    if (isDirectoryEvent) {
      inotifyService->createDirectory(event->wd, event->name);
    } else {
      inotifyService->create(event->wd, event->name);
    }
  };

  auto modify = [&event, &isDirectoryEvent, &inotifyService]() {
    if (event == NULL) {
      return;
    }

    inotifyService->modify(event->wd, event->name);
  };

  auto remove = [&event, &isDirectoryRemoval, &inotifyService]() {
    if (event == NULL) {
      return;
    }

    if (isDirectoryRemoval) {
      inotifyService->removeDirectory(event->wd);
    } else {
      inotifyService->remove(event->wd, event->name);
    }
  };

  auto renameStart = [&event, &isDirectoryEvent, &renameEvent]() {
    renameEvent.cookie = event->cookie;
    renameEvent.isDirectory = isDirectoryEvent;
    renameEvent.name = event->name;
    renameEvent.wd = event->wd;
    renameEvent.isStarted = true;
  };

  auto renameEnd = [&create, &event, &inotifyService, &isDirectoryEvent, &renameEvent]() {
    if (!renameEvent.isStarted) {
      create();
      return;
    }

    if (renameEvent.cookie != event->cookie) {
      if (renameEvent.isDirectory) {
        inotifyService->removeDirectory(renameEvent.wd);
      } else {
        inotifyService->remove(renameEvent.wd, renameEvent.name);
      }
      create();
    } else {
      if (renameEvent.isDirectory) {
        inotifyService->renameDirectory(renameEvent.wd, renameEvent.name, event->wd, event->name);
      } else {
        inotifyService->rename(renameEvent.wd, renameEvent.name, event->wd, event->name);
      }
    }
    renameEvent.isStarted = false;
  };

  mLoopingSemaphore.signal();
  while((bytesRead = read(mInotifyInstance, &buffer, BUFFER_SIZE)) > 0) {
    std::lock_guard<std::mutex> syncWithDestructor(mMutex);
    do {
      event = (struct inotify_event *)(buffer + position);

      if (renameEvent.isStarted && event->cookie != renameEvent.cookie) {
        renameEnd();
      }

      isDirectoryRemoval = event->mask & (uint32_t)(IN_IGNORED | IN_DELETE_SELF);
      isDirectoryEvent = event->mask & (uint32_t)(IN_ISDIR);

      if (!isDirectoryRemoval && *event->name <= 31) {
        continue;
      }

      if (event->mask & (uint32_t)(IN_ATTRIB | IN_MODIFY)) {
        modify();
      } else if (event->mask & (uint32_t)IN_CREATE) {
        create();
      } else if (event->mask & (uint32_t)(IN_DELETE | IN_DELETE_SELF)) {
        remove();
      } else if (event->mask & (uint32_t)IN_MOVED_TO) {
        if (event->cookie == 0) {
          create();
          continue;
        }

        renameEnd();
      } else if (event->mask & (uint32_t)IN_MOVED_FROM) {
        if (event->cookie == 0) {
          remove();
          continue;
        }

        renameStart();
      } else if (event->mask & (uint32_t)IN_MOVE_SELF) {
        inotifyService->remove(event->wd, event->name);
        inotifyService->removeDirectory(event->wd);
      }
    } while((position += sizeof(struct inotify_event) + event->len) < bytesRead);
    if (renameEvent.isStarted) {
      remove();
      renameEvent.isStarted = false;
    }
    position = 0;
  }
  mStarted = false;
}

InotifyEventLoop::~InotifyEventLoop() {
  if (!mStarted) {
    return;
  }

  {
    std::lock_guard<std::mutex> syncWithWork(mMutex);
    pthread_cancel(mEventLoop);
  }

  pthread_join(mEventLoop, NULL);
}
