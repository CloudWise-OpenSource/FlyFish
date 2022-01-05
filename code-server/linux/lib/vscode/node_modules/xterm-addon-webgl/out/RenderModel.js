"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RenderModel = exports.COMBINED_CHAR_BIT_MASK = exports.RENDER_MODEL_FG_OFFSET = exports.RENDER_MODEL_BG_OFFSET = exports.RENDER_MODEL_INDICIES_PER_CELL = void 0;
var TypedArrayUtils_1 = require("common/TypedArrayUtils");
exports.RENDER_MODEL_INDICIES_PER_CELL = 3;
exports.RENDER_MODEL_BG_OFFSET = 1;
exports.RENDER_MODEL_FG_OFFSET = 2;
exports.COMBINED_CHAR_BIT_MASK = 0x80000000;
var RenderModel = (function () {
    function RenderModel() {
        this.cells = new Uint32Array(0);
        this.lineLengths = new Uint32Array(0);
        this.selection = {
            hasSelection: false,
            columnSelectMode: false,
            viewportStartRow: 0,
            viewportEndRow: 0,
            viewportCappedStartRow: 0,
            viewportCappedEndRow: 0,
            startCol: 0,
            endCol: 0
        };
    }
    RenderModel.prototype.resize = function (cols, rows) {
        var indexCount = cols * rows * exports.RENDER_MODEL_INDICIES_PER_CELL;
        if (indexCount !== this.cells.length) {
            this.cells = new Uint32Array(indexCount);
            this.lineLengths = new Uint32Array(rows);
        }
    };
    RenderModel.prototype.clear = function () {
        TypedArrayUtils_1.fill(this.cells, 0, 0);
        TypedArrayUtils_1.fill(this.lineLengths, 0, 0);
    };
    RenderModel.prototype.clearSelection = function () {
        this.selection.hasSelection = false;
        this.selection.viewportStartRow = 0;
        this.selection.viewportEndRow = 0;
        this.selection.viewportCappedStartRow = 0;
        this.selection.viewportCappedEndRow = 0;
        this.selection.startCol = 0;
        this.selection.endCol = 0;
    };
    return RenderModel;
}());
exports.RenderModel = RenderModel;
//# sourceMappingURL=RenderModel.js.map