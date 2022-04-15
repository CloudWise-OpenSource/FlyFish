# API wrapper for [AllowSetForegroundWindow](https://msdn.microsoft.com/en-us/library/windows/desktop/ms632668.aspx)

## Installing

```sh
npm install windows-foreground-love
```

## Using

```javascript
var allowSetForegroundWindow = require('windows-foreground-love').allowSetForegroundWindow
console.log(allowSetForegroundWindow(pid))
console.log(allowSetForegroundWindow()) // all processes will be enabled to set the foreground window
```

## Supported platforms
 * Windows
 * Other platforms: installs, but doesn't do anything and always returns false

## Developing
 * `npm install -g node-gyp`
 * `node-gyp configure`
 * `node-gyp build`
 * `npm test`

## Resources
[The Old New Thing: Foreground activation permission is like love: You can’t steal it, it has to be given to you](https://blogs.msdn.microsoft.com/oldnewthing/20090220-00/?p=19083)

## License
[MIT](LICENSE)
