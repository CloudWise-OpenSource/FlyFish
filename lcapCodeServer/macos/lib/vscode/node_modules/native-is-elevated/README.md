# native-is-elevated

[![NPM](https://nodei.co/npm/native-is-elevated.png?compact=true)](https://nodei.co/npm/native-is-elevated)

Checks if the process is running with elevated privileges (as root on Unix systems, and as Administrator on Windows).

Basically just a [native version](https://nodejs.org/api/addons.html) of [is-elevated](https://github.com/sindresorhus/is-elevated).


## Install

```
$ npm install --save native-is-elevated
```


## Usage

```js
const isElevated = require('native-is-elevated')();  // boolean value
```
