





# Watchdog node module
Kills the current process when another process is no longer running. This helps when the JavaScript event loop might be busy and never recovering e.g. an accidental while true loop.

This is implemented by launching a separate thread from C++ which periodically checks if the given process is still running. Typically, one would watch the parent process id. The watched process is checked every 1s and if it is no longer running, the current process will exit after 6 seconds with the exit code 87.

## Installing

```sh
npm install native-watchdog
```

## Using

```javascript
var watchdog = require('native-watchdog');

watchdog.start(pid);
```

## Developing
 * `npm install -g node-gyp`
 * `node-gyp configure`
 * `node-gyp build` (for debugging use `node-gyp build --debug`)
 * `npm test` (for debugging change `index.js` to load the node module from the `Debug` folder and press `F5`)

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

## License
[MIT](https://github.com/Microsoft/node-native-watchdog/blob/master/LICENSE)
