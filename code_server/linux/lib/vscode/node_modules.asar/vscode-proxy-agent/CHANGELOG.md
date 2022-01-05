# Change Log
Notable changes will be documented here.

## [0.11.0]
- Override original agent again (fixes [microsoft/vscode#117054](https://github.com/microsoft/vscode/issues/117054))

## [0.10.0]
- Do not override original agent (forward port [microsoft/vscode#120354](https://github.com/microsoft/vscode/issues/120354))
- Move vscode-windows-ca-certs dependency ([microsoft/vscode#120546](https://github.com/microsoft/vscode/issues/120546))

## [0.9.0]
- Copy and adapt pac-proxy-agent to catch up with latest dependencies and bug fixes.

## [0.8.2]
- Do not override original agent (fixes [microsoft/vscode#120354](https://github.com/microsoft/vscode/issues/120354))

## [0.8.0]
- Align log level constants with VS Code.

## [0.7.0]
- Override original agent (fixes [microsoft/vscode#117054](https://github.com/microsoft/vscode/issues/117054))

## [0.6.0]
- Use TypeScript.
- Move proxy resolution from VS Code here.

## [0.5.2]
- Handle false as the original proxy.
- Update typings.

## [0.5.1]
- Allow for newer patch versions of dependencies.

## [0.5.0]
- Update to https-proxy-agent 2.2.3 (https://nodesecurity.io/advisories/1184)

## [0.4.0]
- Fall back to original agent when provided in options.
- Add default port to options.

## [0.3.0]
- Forward request and options to `resolveProxy`.

## [0.2.0]
- Fix missing servername for SNI ([#27](https://github.com/Microsoft/vscode/issues/64133)).

## [0.1.0]
- Initial release