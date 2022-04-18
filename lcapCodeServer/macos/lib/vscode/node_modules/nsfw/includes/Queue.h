#ifndef NSFW_QUEUE_H
#define NSFW_QUEUE_H

#include <string>
#include <memory>
#include <deque>
#include <vector>
#include <mutex>
#include <atomic>

enum EventType {
  CREATED = 0,
  DELETED = 1,
  MODIFIED = 2,
  RENAMED = 3
};

struct Event {
  Event(
    const EventType type,
    const std::string &fromDirectory,
    const std::string &fromFile,
    const std::string &toDirectory,
    const std::string &toFile
  ) :
    type(type),
    fromDirectory(fromDirectory),
    toDirectory(toDirectory),
    fromFile(fromFile),
    toFile(toFile)
  {}

  EventType type;
  std::string fromDirectory, toDirectory, fromFile, toFile;
};

class EventQueue {
public:
  void clear();
  std::size_t count();
  std::unique_ptr<Event> dequeue();
  std::unique_ptr<std::vector<std::unique_ptr<Event>>> dequeueAll();
  void enqueue(
    const EventType type,
    const std::string &fromDirectory,
    const std::string &fromFile,
    const std::string &toDirectory = "",
    const std::string &toFile = ""
  );

  void pause();
  void resume();

  EventQueue();

private:
  std::deque<std::unique_ptr<Event>> queue;
  std::mutex mutex;
  std::atomic<bool> mPaused;
};

#endif
