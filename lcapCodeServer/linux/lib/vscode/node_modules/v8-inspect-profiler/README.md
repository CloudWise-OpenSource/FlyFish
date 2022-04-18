### V8 Inspect Profiler

This node module offers v8 cpu profiling via the [Chrome DevTools protocol](https://chromedevtools.github.io/devtools-protocol/v8/Profiler/). 


### Usage


Start the node.js instance that you want to profile

```
node --inspect-brk=5222 myApp.js
```

Next, start profiling. Create an app that starts and stops profiling. Like so: 

```js
const profiler = require('v8-inspect-profiler');

// connect and start profiler
const session = await profiler.startProfiling({port: 5222 });

// time goes by ...

// stop profiler and disconnect 
const profile = await session.stop();

// save profile to disk
await profiler.writeProfile(profile, 'somepath.cpuprofile');
```
