#ifndef INOTIFY_EVENT_HANDLER_H
#define INOTIFY_EVENT_HANDLER_H

#include "InotifyEventLoop.h"
#include "InotifyTree.h"
#include "../Queue.h"
#include <queue>
#include <map>

class InotifyEventLoop;
class InotifyTree;

class InotifyService {
public:
  InotifyService(std::shared_ptr<EventQueue> queue, std::string path);

  std::string getError();
  bool hasErrored();
  bool isWatching();

  ~InotifyService();
private:
  void create(int wd, std::string name);
  void createDirectory(int wd, std::string name);
  void createDirectoryTree(std::string directoryTreePath);
  void dispatch(EventType action, int wd, std::string name);
  void dispatchRename(int fromWd, std::string fromName, int toWd, std::string toName);
  void modify(int wd, std::string name);
  void remove(int wd, std::string name);
  void removeDirectory(int wd);
  void rename(int fromWd, std::string fromName, int toWd, std::string toName);
  void renameDirectory(int fromWd, std::string fromName, int toWd, std::string toName);

  InotifyEventLoop *mEventLoop;
  std::shared_ptr<EventQueue> mQueue;
  InotifyTree *mTree;
  int mInotifyInstance;

  friend class InotifyEventLoop;
};

#endif
