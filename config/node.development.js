const Application = require("thinkjs");
const babel = require("think-babel");
const watcher = require("think-watcher");
const notifier = require("node-notifier");

const instance = new Application({
  ROOT_PATH: __dirname + "/..",
  watcher: watcher,

  // 请项目编译
  // transpiler: [babel, {
  //     presets: ['think-node']
  // }],

  notifier: notifier.notify.bind(notifier),
  env: "dev",
});

instance.run();
