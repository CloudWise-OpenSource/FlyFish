<h1 align="center">
  <b>phc-format</b>
</h1>
<p align="center">
  <!-- Version - npm -->
  <a href="https://www.npmjs.com/package/@phc/format">
    <img src="https://img.shields.io/npm/v/@phc/format.svg" alt="Latest version on npm" />
  </a>
  <!-- Downloads - npm -->
  <a href="https://npm-stat.com/charts.html?package=@phc/format">
    <img src="https://img.shields.io/npm/dt/@phc/format.svg" alt="Downloads on npm" />
  </a>
  <!-- License - MIT -->
  <a href="https://github.com/simonepri/phc-format/tree/master/license">
    <img src="https://img.shields.io/github/license/simonepri/phc-format.svg" alt="Project license" />
  </a>

  <br/>

  <!-- Lint -->
  <a href="https://github.com/simonepri/phc-format/actions?query=workflow:lint+branch:master">
    <img src="https://github.com/simonepri/phc-format/workflows/lint/badge.svg?branch=master" alt="Lint status" />
  </a>
  <!-- Test - macOS -->
  <a href="https://github.com/simonepri/phc-format/actions?query=workflow:test-macos+branch:master">
    <img src="https://github.com/simonepri/phc-format/workflows/test-macos/badge.svg?branch=master" alt="Test macOS status" />
  </a>
  <!-- Test - Ubuntu -->
  <a href="https://github.com/simonepri/phc-format/actions?query=workflow:test-ubuntu+branch:master">
    <img src="https://github.com/simonepri/phc-format/workflows/test-ubuntu/badge.svg?branch=master" alt="Test Ubuntu status" />
  </a>
  <!-- Test - Windows -->
  <a href="https://github.com/simonepri/phc-format/actions?query=workflow:test-windows+branch:master">
    <img src="https://github.com/simonepri/phc-format/workflows/test-windows/badge.svg?branch=master" alt="Test Windows status" />
  </a>

  <br/>

  <!-- Coverage - Codecov -->
  <a href="https://codecov.io/gh/simonepri/phc-format">
    <img src="https://img.shields.io/codecov/c/github/simonepri/phc-format/master.svg" alt="Codecov Coverage report" />
  </a>
  <!-- DM - Snyk -->
  <a href="https://snyk.io/test/github/simonepri/phc-format?targetFile=package.json">
    <img src="https://snyk.io/test/github/simonepri/phc-format/badge.svg?targetFile=package.json" alt="Known Vulnerabilities" />
  </a>
  <!-- DM - David -->
  <a href="https://david-dm.org/simonepri/phc-format">
    <img src="https://david-dm.org/simonepri/phc-format/status.svg" alt="Dependency Status" />
  </a>

  <br/>

  <!-- Code Style - XO-Prettier -->
  <a href="https://github.com/xojs/xo">
    <img src="https://img.shields.io/badge/code_style-XO+Prettier-5ed9c7.svg" alt="XO Code Style used" />
  </a>
  <!-- Test Runner - AVA -->
  <a href="https://github.com/avajs/ava">
    <img src="https://img.shields.io/badge/test_runner-AVA-fb3170.svg" alt="AVA Test Runner used" />
  </a>
  <!-- Test Coverage - Istanbul -->
  <a href="https://github.com/istanbuljs/nyc">
    <img src="https://img.shields.io/badge/test_coverage-NYC-fec606.svg" alt="Istanbul Test Coverage used" />
  </a>
  <!-- Init - ni -->
  <a href="https://github.com/simonepri/ni">
    <img src="https://img.shields.io/badge/initialized_with-ni-e74c3c.svg" alt="NI Scaffolding System used" />
  </a>
  <!-- Release - np -->
  <a href="https://github.com/sindresorhus/np">
    <img src="https://img.shields.io/badge/released_with-np-6c8784.svg" alt="NP Release System used" />
  </a>
</p>
<p align="center">
  📝 PHC string format serializer/deserializer

  <br/>

  <sub>
    Coded with ❤️ by <a href="#authors">Simone Primarosa</a>.
  </sub>
</p>

## Motivation
The [PHC String Format][specs:phc] is an attempt to specify a common hash string format that’s a restricted & well defined subset of the Modular Crypt Format. New hashes are strongly encouraged to adhere to the PHC specification, rather than the much looser [Modular Crypt Format][specs:mcf].

## Install

```bash
npm install --save @phc/format
```

## Usage

```js
const phc = require('@phc/format');

const phcobj = {
  id: 'pbkdf2-sha256',
  params: {i: 6400},
  salt: Buffer.from('0ZrzXitFSGltTQnBWOsdAw', 'base64'),
  hash: Buffer.from('Y11AchqV4b0sUisdZd0Xr97KWoymNE0LNNrnEgY4H9M', 'base64'),
};

const phcstr = "$pbkdf2-sha256$i=6400$0ZrzXitFSGltTQnBWOsdAw$Y11AchqV4b0sUisdZd0Xr97KWoymNE0LNNrnEgY4H9M";

phc.serialize(phcobj);
// => phcstr

phc.deserialize(phcstr);
// => phcobj
```

You can also pass an optional version parameter.

```js
const phc = require('@phc/format');

const phcobj = {
  id: 'argon2i',
  version: 19,
  params: {
    m: 120,
    t: 5000,
    p: 2
  },
  salt: Buffer.from('iHSDPHzUhPzK7rCcJgOFfg', 'base64'),
  hash: Buffer.from('J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g', 'base64'),
};

const phcstr = "$argon2i$v=19$m=120,t=5000,p=2$iHSDPHzUhPzK7rCcJgOFfg$J4moa2MM0/6uf3HbY2Tf5Fux8JIBTwIhmhxGRbsY14qhTltQt+Vw3b7tcJNEbk8ium8AQfZeD4tabCnNqfkD1g";

phc.serialize(phcobj);
// => phcstr

phc.deserialize(phcstr);
// => phcobj
```

## API

#### TOC
<dl>
<dt><a href="#serialize">serialize(opts)</a> ⇒ <code>string</code></dt>
<dd><p>Generates a PHC string using the data provided.</p>
</dd>
<dt><a href="#deserialize">deserialize(phcstr)</a> ⇒ <code>Object</code></dt>
<dd><p>Parses data from a PHC string.</p>
</dd>
</dl>

<a name="serialize"></a>

### serialize(opts) ⇒ <code>string</code>
Generates a PHC string using the data provided.

**Kind**: global function  
**Returns**: <code>string</code> - The hash string adhering to the PHC format.  

| Param | Type | Description |
| --- | --- | --- |
| opts | <code>Object</code> | Object that holds the data needed to generate the PHC string. |
| opts.id | <code>string</code> | Symbolic name for the function. |
| [opts.version] | <code>Number</code> | The version of the function. |
| [opts.params] | <code>Object</code> | Parameters of the function. |
| [opts.salt] | <code>Buffer</code> | The salt as a binary buffer. |
| [opts.hash] | <code>Buffer</code> | The hash as a binary buffer. |

<a name="deserialize"></a>

### deserialize(phcstr) ⇒ <code>Object</code>
Parses data from a PHC string.

**Kind**: global function  
**Returns**: <code>Object</code> - The object containing the data parsed from the PHC string.  

| Param | Type | Description |
| --- | --- | --- |
| phcstr | <code>string</code> | A PHC string to parse. |

## Contributing
Contributions are REALLY welcome and if you find a security flaw in this code, PLEASE [report it][new issue].  
Please check the [contributing guidelines][contributing] for more details. Thanks!

## Authors
- **Simone Primarosa** - *Github* ([@simonepri][github:simonepri]) • *Twitter* ([@simoneprimarosa][twitter:simoneprimarosa])

See also the list of [contributors][contributors] who participated in this project.

## License
This project is licensed under the MIT License - see the [license][license] file for details.


<!-- Links -->
[start]: https://github.com/simonepri/phc-format#start-of-content
[new issue]: https://github.com/simonepri/phc-format/issues/new
[contributors]: https://github.com/simonepri/phc-format/contributors

[license]: https://github.com/simonepri/phc-format/tree/master/license
[contributing]: https://github.com/simonepri/phc-format/tree/master/.github/contributing.md

[github:simonepri]: https://github.com/simonepri
[twitter:simoneprimarosa]: http://twitter.com/intent/user?screen_name=simoneprimarosa

[specs:mcf]: https://github.com/ademarre/binary-mcf
[specs:phc]: https://github.com/P-H-C/phc-string-format/blob/master/phc-sf-spec.md
