# vscode-ripgrep

This is an npm module for using [ripgrep](https://github.com/BurntSushi/ripgrep) in a Node project. It's used by VS Code.

## How it works

- Ripgrep is built in [microsoft/ripgrep-prebuilt](https://github.com/microsoft/ripgrep-prebuilt) and published to releases for each tag in that repo.
- In this module's postinstall task, it determines which platform it is being installed on and downloads the correct binary from ripgrep-prebuilt for the platform.
- The path to the ripgrep binary is exported as `rgPath`.

### Usage example

```js
const { rgPath } = require('vscode-ripgrep');

// child_process.spawn(rgPath, ...)
```

### Dev note

Runtime dependencies are not allowed in this project. This code runs on postinstall, and any dependencies would only be needed for postinstall, but they would have to be declared as `dependencies`, not `devDependencies`. Then if they were not cleaned up manually, they would end up being included in any project that uses this. I allow `https-proxy-agent` as an exception because we already ship that in VS Code, and `proxy-from-env` because it's very small and much easier to use it than reimplement it.

### GitHub API Limit note

You can produce an API key, set the GITHUB_TOKEN environment var to it, and vscode-ripgrep will use it when downloading from GitHub. This increases your API limit.
