"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTerminalFromCache = exports.acquireCharAtlas = void 0;
var CharAtlasUtils_1 = require("./CharAtlasUtils");
var WebglCharAtlas_1 = require("./WebglCharAtlas");
var charAtlasCache = [];
function acquireCharAtlas(terminal, colors, scaledCharWidth, scaledCharHeight) {
    var newConfig = CharAtlasUtils_1.generateConfig(scaledCharWidth, scaledCharHeight, terminal, colors);
    for (var i = 0; i < charAtlasCache.length; i++) {
        var entry = charAtlasCache[i];
        var ownedByIndex = entry.ownedBy.indexOf(terminal);
        if (ownedByIndex >= 0) {
            if (CharAtlasUtils_1.configEquals(entry.config, newConfig)) {
                return entry.atlas;
            }
            if (entry.ownedBy.length === 1) {
                entry.atlas.dispose();
                charAtlasCache.splice(i, 1);
            }
            else {
                entry.ownedBy.splice(ownedByIndex, 1);
            }
            break;
        }
    }
    for (var i = 0; i < charAtlasCache.length; i++) {
        var entry = charAtlasCache[i];
        if (CharAtlasUtils_1.configEquals(entry.config, newConfig)) {
            entry.ownedBy.push(terminal);
            return entry.atlas;
        }
    }
    var newEntry = {
        atlas: new WebglCharAtlas_1.WebglCharAtlas(document, newConfig),
        config: newConfig,
        ownedBy: [terminal]
    };
    charAtlasCache.push(newEntry);
    return newEntry.atlas;
}
exports.acquireCharAtlas = acquireCharAtlas;
function removeTerminalFromCache(terminal) {
    for (var i = 0; i < charAtlasCache.length; i++) {
        var index = charAtlasCache[i].ownedBy.indexOf(terminal);
        if (index !== -1) {
            if (charAtlasCache[i].ownedBy.length === 1) {
                charAtlasCache[i].atlas.dispose();
                charAtlasCache.splice(i, 1);
            }
            else {
                charAtlasCache[i].ownedBy.splice(index, 1);
            }
            break;
        }
    }
}
exports.removeTerminalFromCache = removeTerminalFromCache;
//# sourceMappingURL=CharAtlasCache.js.map