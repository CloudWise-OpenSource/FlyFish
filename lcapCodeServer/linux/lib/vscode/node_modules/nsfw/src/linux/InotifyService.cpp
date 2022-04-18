#include "../../includes/linux/InotifyService.h"

InotifyService::InotifyService(std::shared_ptr<EventQueue> queue, std::string path):
  mEventLoop(NULL),
  mQueue(queue),
  mTree(NULL) {
  mInotifyInstance = inotify_init();

  if (mInotifyInstance == -1) {
    return;
  }

  mTree = new InotifyTree(mInotifyInstance, path);
  if (!mTree->isRootAlive()) {
    delete mTree;
    mTree = NULL;
    mEventLoop = NULL;
  } else {
    mEventLoop = new InotifyEventLoop(
      mInotifyInstance,
      this
    );
  }
}

InotifyService::~InotifyService() {
  if (mEventLoop != NULL) {
    delete mEventLoop;
  }

  if (mTree != NULL) {
    delete mTree;
  }

  close(mInotifyInstance);
}

void InotifyService::create(int wd, std::string name) {
  dispatch(CREATED, wd, name);
}

void InotifyService::dispatch(EventType action, int wd, std::string name) {
  std::string path;
  if (!mTree->getPath(path, wd)) {
    return;
  }

  mQueue->enqueue(action, path, name);
}

void InotifyService::dispatchRename(int fromWd, std::string fromName, int toWd, std::string toName) {
  std::string fromPath, toPath;
  if (!mTree->getPath(fromPath, fromWd) || !mTree->getPath(toPath, toWd)) {
    return;
  }

  mQueue->enqueue(RENAMED, fromPath, fromName, toPath, toName);
}

std::string InotifyService::getError() {
  if (!isWatching()) {
    return "Service shutdown unexpectedly";
  }

  if (mTree->hasErrored()) {
    return mTree->getError();
  }

  return "";
}

bool InotifyService::hasErrored() {
  return !isWatching() || (mTree == NULL ? false : mTree->hasErrored());
}

bool InotifyService::isWatching() {
  if (mTree == NULL || mEventLoop == NULL) {
    return false;
  }

  return mTree->isRootAlive() && mEventLoop->isLooping();
}

void InotifyService::modify(int wd, std::string name) {
  dispatch(MODIFIED, wd, name);
}

void InotifyService::remove(int wd, std::string name) {
  dispatch(DELETED, wd, name);
}

void InotifyService::rename(int fromWd, std::string fromName, int toWd, std::string toName) {
  dispatchRename(fromWd, fromName, toWd, toName);
}

void InotifyService::createDirectory(int wd, std::string name) {
  if (!mTree->nodeExists(wd)) {
    return;
  }

  dispatch(CREATED, wd, name);
  mTree->addDirectory(wd, name, [this](std::string directory, std::string file) {
    mQueue->enqueue(CREATED, directory, file);
  });
}

void InotifyService::removeDirectory(int wd) {
  mTree->removeDirectory(wd);
}

void InotifyService::renameDirectory(int fromWd, std::string fromName, int toWd, std::string toName) {
  if (!mTree->nodeExists(fromWd) || !mTree->nodeExists(toWd)) {
    return;
  }

  mTree->renameDirectory(fromWd, fromName, toWd, toName);

  dispatchRename(fromWd, fromName, toWd, toName);
}
