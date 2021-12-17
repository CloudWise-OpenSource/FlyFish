"use strict";
// In a bit of a hack, this file is stored in two places
// - src/node/uri_transformer.ts
// - lib/vscode/src/vs/server/uriTransformer.ts
class RawURITransformer {
    constructor(authority) {
        this.authority = authority;
    }
    transformIncoming(uri) {
        switch (uri.scheme) {
            case "vscode-remote":
                return { scheme: "file", path: uri.path };
            default:
                return uri;
        }
    }
    transformOutgoing(uri) {
        switch (uri.scheme) {
            case "file":
                return { scheme: "vscode-remote", authority: this.authority, path: uri.path };
            default:
                return uri;
        }
    }
    transformOutgoingScheme(scheme) {
        switch (scheme) {
            case "file":
                return "vscode-remote";
            default:
                return scheme;
        }
    }
}
module.exports = function rawURITransformerFactory(authority) {
    return new RawURITransformer(authority);
};
//# sourceMappingURL=uriTransformer.js.map