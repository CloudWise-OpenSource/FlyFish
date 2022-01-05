#include "../../includes/linux/InotifyTree.h"
#include <cstdio>
#include <sys/stat.h>
/**
 * InotifyTree ---------------------------------------------------------------------------------------------------------
 */
InotifyTree::InotifyTree(int inotifyInstance, std::string path):
  mError(""),
  mInotifyInstance(inotifyInstance) {
  mInotifyNodeByWatchDescriptor = new std::map<int, InotifyNode *>;
  std::string directory;
  std::string watchName;
  if (path.length() == 1 && path[0] == '/') {
    directory = "";
    watchName = "";
  } else {
    uint32_t location = path.find_last_of("/");
    directory = (location == 0) ? "" : path.substr(0, location);
    watchName = path.substr(location + 1);
  }

  struct stat file;
  if (stat((directory + "/" + watchName).c_str(), &file) < 0) {
    mRoot = NULL;
    return;
  }

  addInode(file.st_ino);
  mRoot = new InotifyNode(
    this,
    mInotifyInstance,
    NULL,
    directory,
    watchName,
    file.st_ino
  );

  if (!mRoot->isAlive()) {
    delete mRoot;
    mRoot = NULL;
    return;
  }
}

void InotifyTree::addDirectory(int wd, std::string name, EmitCreatedEvent emitCreatedEvent) {
  auto nodeIterator = mInotifyNodeByWatchDescriptor->find(wd);
  if (nodeIterator == mInotifyNodeByWatchDescriptor->end()) {
    return;
  }

  InotifyNode *node = nodeIterator->second;
  node->addChild(name, emitCreatedEvent);
}

void InotifyTree::addNodeReferenceByWD(int wd, InotifyNode *node) {
  (*mInotifyNodeByWatchDescriptor)[wd] = node;
}

std::string InotifyTree::getError() {
  return mError;
}

bool InotifyTree::getPath(std::string &out, int wd) {
  auto nodeIterator = mInotifyNodeByWatchDescriptor->find(wd);
  if (nodeIterator == mInotifyNodeByWatchDescriptor->end()) {
    return false;
  }

  out = nodeIterator->second->getFullPath();
  return true;
}

bool InotifyTree::hasErrored() {
  return mError != "";
}

bool InotifyTree::isRootAlive() {
  return mRoot != NULL;
}

bool InotifyTree::nodeExists(int wd) {
  auto nodeIterator = mInotifyNodeByWatchDescriptor->find(wd);
  return nodeIterator != mInotifyNodeByWatchDescriptor->end();
}

void InotifyTree::removeDirectory(int wd) {
  auto nodeIterator = mInotifyNodeByWatchDescriptor->find(wd);
  if (nodeIterator == mInotifyNodeByWatchDescriptor->end()) {
    return;
  }

  InotifyNode *node = nodeIterator->second;
  InotifyNode *parent = node->getParent();
  if (parent == NULL) {
    delete mRoot;
    mRoot = NULL;
    return;
  }

  parent->removeChild(node->getName());
}

void InotifyTree::removeNodeReferenceByWD(int wd) {
  auto nodeIterator = mInotifyNodeByWatchDescriptor->find(wd);
  if (nodeIterator != mInotifyNodeByWatchDescriptor->end()) {
    mInotifyNodeByWatchDescriptor->erase(nodeIterator);
  }
}

void InotifyTree::renameDirectory(int fromWd, std::string fromName, int toWd, std::string toName) {
  auto fromNodeIterator = mInotifyNodeByWatchDescriptor->find(fromWd);
  if (fromNodeIterator == mInotifyNodeByWatchDescriptor->end()) {
    return;
  }

  if (fromWd == toWd) {
    fromNodeIterator->second->renameChild(fromName, toName);
    return;
  }

  auto toNodeIterator = mInotifyNodeByWatchDescriptor->find(toWd);
  if (toNodeIterator == mInotifyNodeByWatchDescriptor->end()) {
    return;
  }

  InotifyNode *pulledChild = fromNodeIterator->second->pullChild(fromName);

  if (!pulledChild) {
    return;
  }

  toNodeIterator->second->takeChildAsName(pulledChild, toName);
}

void InotifyTree::setError(std::string error) {
  mError = error;
}

bool InotifyTree::addInode(ino_t inodeNumber) {
  return inodes.insert(inodeNumber).second;
}

void InotifyTree::removeInode(ino_t inodeNumber) {
  inodes.erase(inodeNumber);
}

InotifyTree::~InotifyTree() {
  if (isRootAlive()) {
    delete mRoot;
  }
  delete mInotifyNodeByWatchDescriptor;
}

/**
 * InotifyNode ---------------------------------------------------------------------------------------------------------
 */
InotifyTree::InotifyNode::InotifyNode(
  InotifyTree *tree,
  int inotifyInstance,
  InotifyNode *parent,
  std::string directory,
  std::string name,
  ino_t inodeNumber,
  EmitCreatedEvent emitCreatedEvent
):
  mDirectory(directory),
  mInodeNumber(inodeNumber),
  mInotifyInstance(inotifyInstance),
  mName(name),
  mParent(parent),
  mTree(tree) {
  mChildren = new std::map<std::string, InotifyNode *>;
  mFullPath = createFullPath(mDirectory, mName);
  mWatchDescriptorInitialized = false;

  #ifdef NSFW_TEST_SLOW_1
    std::this_thread::sleep_for(std::chrono::milliseconds(500));
  #endif

  if (!inotifyInit()) {
    return;
  }

  dirent ** directoryContents = NULL;

  int resultCountOrError = scandir(
    mFullPath.c_str(),
    &directoryContents,
    NULL,
    alphasort
  );

  mAlive = (resultCountOrError >= 0);

  if (!mAlive) {
    return;
  }

  for (int i = 0; i < resultCountOrError; ++i) {
    std::string fileName = directoryContents[i]->d_name;

    if (
      fileName == "." ||
      fileName == ".."
    ) {
      continue;
    }

    if (emitCreatedEvent) {
      emitCreatedEvent(mFullPath, fileName);
    }

    std::string filePath = createFullPath(mFullPath, fileName);

    struct stat file;

    if (
      stat(filePath.c_str(), &file) < 0 ||
      !S_ISDIR(file.st_mode) ||
      !mTree->addInode(file.st_ino) // Skip this inode if already watching
    ) {
      continue;
    }

    InotifyNode *child = new InotifyNode(
      mTree,
      mInotifyInstance,
      this,
      mFullPath,
      fileName,
      file.st_ino,
      emitCreatedEvent
    );

    if (child->isAlive()) {
      (*mChildren)[fileName] = child;
    } else {
      delete child;
    }
  }

  for (int i = 0; i < resultCountOrError; ++i) {
    free(directoryContents[i]);
  }

  free(directoryContents);
}

InotifyTree::InotifyNode::~InotifyNode() {
  mTree->removeInode(mInodeNumber);

  if (mWatchDescriptorInitialized) {
    inotify_rm_watch(mInotifyInstance, mWatchDescriptor);
    mTree->removeNodeReferenceByWD(mWatchDescriptor);
  }

  for (auto i = mChildren->begin(); i != mChildren->end(); ++i) {
    delete i->second;
    i->second = NULL;
  }
  delete mChildren;
}

void InotifyTree::InotifyNode::addChild(std::string name, EmitCreatedEvent emitCreatedEvent) {
  struct stat file;

  if (stat(createFullPath(mFullPath, name).c_str(), &file) >= 0 && mTree->addInode(file.st_ino)) {
    InotifyNode *child = new InotifyNode(
      mTree,
      mInotifyInstance,
      this,
      mFullPath,
      name,
      file.st_ino,
      emitCreatedEvent
    );

    if (child->isAlive()) {
      (*mChildren)[name] = child;
    } else {
      delete child;
    }
  }
}

void InotifyTree::InotifyNode::fixPaths() {
  std::string parentPath = mParent->getFullPath();
  std::string fullPath = createFullPath(parentPath, mName);

  if (fullPath == mFullPath) {
    return;
  }

  mDirectory = parentPath;
  mFullPath = fullPath;

  for(auto i = mChildren->begin(); i != mChildren->end(); ++i) {
    i->second->fixPaths();
  }
}

std::string InotifyTree::InotifyNode::getFullPath() {
  return mFullPath;
}

std::string InotifyTree::InotifyNode::getName() {
  return mName;
}

bool InotifyTree::InotifyNode::isAlive() {
  return mAlive;
}

InotifyTree::InotifyNode *InotifyTree::InotifyNode::getParent() {
  return mParent;
}

bool InotifyTree::InotifyNode::inotifyInit() {
  if (mTree->hasErrored()) {
    mAlive = false;
    return false;
  }

  int attr = mParent != NULL
           ? ATTRIBUTES
           : ATTRIBUTES | IN_MOVE_SELF;

  mWatchDescriptor = inotify_add_watch(
    mInotifyInstance,
    mFullPath.c_str(),
    attr
  );

  mAlive = (mWatchDescriptor != -1);

  if (!mAlive) {
    if (errno == ENOSPC) {
      mTree->setError("Inotify limit reached");
    } else if (errno == ENOMEM) {
      mTree->setError("Kernel out of memory");
    } else if (errno == EBADF || errno == EINVAL) {
      mTree->setError("Invalid file descriptor");
    }
    return false;
  }

  mWatchDescriptorInitialized = true;
  mTree->addNodeReferenceByWD(mWatchDescriptor, this);

  return mAlive;
}

void InotifyTree::InotifyNode::removeChild(std::string name) {
  auto child = mChildren->find(name);
  if (child != mChildren->end()) {
    delete child->second;
    child->second = NULL;
    mChildren->erase(child);
  }
}

void InotifyTree::InotifyNode::renameChild(std::string oldName, std::string newName) {
  auto child = mChildren->find(oldName);
  if (child == mChildren->end()) {
    child = mChildren->find(newName);
    if (child == mChildren->end()) {
      addChild(newName);
    }
    return;
  }

  InotifyNode *node = child->second;
  mChildren->erase(child);
  node->setName(newName);
  (*mChildren)[newName] = node;
}

void InotifyTree::InotifyNode::setName(std::string name) {
  mName = name;
  fixPaths();
}

void InotifyTree::InotifyNode::setParent(InotifyNode *newParent) {
  mParent = newParent;
}

std::string InotifyTree::InotifyNode::createFullPath(std::string parentPath, std::string name) {
  std::stringstream fullPathStream;

  fullPathStream
    << parentPath
    << '/'
    << name;

  return fullPathStream.str();
}

InotifyTree::InotifyNode *InotifyTree::InotifyNode::pullChild(std::string name) {
  auto child = mChildren->find(name);
  if (child == mChildren->end()) {
    return NULL;
  }

  auto node = child->second;
  node->setParent(NULL);
  mChildren->erase(child);
  return node;
}

void InotifyTree::InotifyNode::takeChildAsName(InotifyNode *child, std::string name) {
  (*mChildren)[name] = child;
  child->setParent(this);
  child->setName(name);
}
