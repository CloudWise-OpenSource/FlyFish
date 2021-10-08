# node-sentinel-file-watcher
<table>
  <thead>
    <tr>
      <th>Linux</th>
      <th>OS X</th>
      <th>Windows</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td colspan="2" align="center">
      <a href="https://travis-ci.org/Axosoft/nsfw"><img src="https://travis-ci.org/Axosoft/nsfw.svg?branch=master"></a>
      </td>
      <td align="center">
        <a href="https://ci.appveyor.com/project/implausible/node-simple-file-watcher"><img src="https://ci.appveyor.com/api/projects/status/79ejlq7e60kjmbl6?svg=true"></a>
      </td>
    </tr>
  </tbody>
</table>
A simple file watcher library for node.

## Why NSFW?
NSFW is a native abstraction for Linux, Windows, and OSX file watching services which tries to keep a consistent interface and feature set across operating systems. NSFW offers recursive file watching into deep file systems all at no additional cost to the Javascript layer. In Linux, NSFW recursively builds an inotify watch tree natively, which collects events concurrently to the javascript thread. In OSX, NSFW utilizes the FSEventsService, which recursively watches for file system changes in a specified directory. In Windows, NSFW implements a server around the ReadDirectoryChangesW method.

When NSFW has events and is not being throttled, it will group those events in the order that they occurred and report them to the Javascript layer in a single callback. This is an improvement over services that utilize Node FS.watch, which uses a callback for every file event that is triggered. Every callback FS.watch makes to the event queue is a big bonus to NSFW's performance when watching large file system operations, because NSFW will only make 1 callback with many events within a specified throttle period.

So why NSFW? Because it has a consistent and minimal footprint in the Javascript layer, manages recursive watching for you, and is super easy to use.

## Usage

```js
var nsfw = require('nsfw');

var watcher1;
return nsfw(
  'dir1',
  function(events) {
    // handle events
  })
  .then(function(watcher) {
    watcher1 = watcher;
    return watcher.start();
  })
  .then(function() {
    // we are now watching dir1 for events!

    // To stop watching
    watcher1.stop()
  });

// With options
var watcher2;
return nsfw(
  'dir2',
  function(events) {
  // handles other events
  },
  {
    debounceMS: 250,
    errorCallback(errors) {
      //handle errors
    }
  })
  .then(function(watcher) {
    watcher2 = watcher;
    return watcher.start();
  })
  .then(function() {
    // we are now watching dir2 for events!
  })
  .then(function() {
    // To stop watching
    watcher2.stop();
  })
```

## Callback Argument

An array of events as they have happened in a directory, it's children, or to a file.
```js
[
  {
    "action": 2, // nsfw.actions.MODIFIED
    "directory": "/home/nsfw/watchDir",
    "file": "file1.ext"
  },
  {
    "action": 0, // nsfw.actions.CREATED
    "directory": "/home/nsfw/watchDir",
    "file": "folder"
  },
  {
    "action": 1, // nsfw.actions.DELETED
    "directory": "home/nsfw/watchDir/testFolder",
    "file": "test.ext"
  },
  {
    "action": 3, // nsfw.actions.RENAMED
    "directory": "home/nsfw/watchDir",
    "oldFile": "oldname.ext",
    "newDirectory": "home/nsfw/watchDir/otherDirectory"
    "newFile": "newname.ext"
  }
]
```

Event are enumerated by the nsfw.actions enumeration
```js
nsfw.actions = {
  CREATED: 0,
  DELETED: 1,
  MODIFIED: 2,
  RENAMED: 3
};
```

## Installation
NSFW is a native node module and requires Node-Gyp to be functional before you can install it.
Make sure you have completed installing all of the dependencies listed for [Node-Gyp](https://github.com/nodejs/node-gyp) on your operating system.
