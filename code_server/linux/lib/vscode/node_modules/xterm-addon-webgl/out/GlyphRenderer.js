"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlyphRenderer = void 0;
var WebglUtils_1 = require("./WebglUtils");
var RenderModel_1 = require("./RenderModel");
var TypedArrayUtils_1 = require("common/TypedArrayUtils");
var TypedArray_1 = require("./TypedArray");
var Constants_1 = require("common/buffer/Constants");
var AttributeData_1 = require("common/buffer/AttributeData");
var vertexShaderSource = "#version 300 es\nlayout (location = " + 0 + ") in vec2 a_unitquad;\nlayout (location = " + 1 + ") in vec2 a_cellpos;\nlayout (location = " + 2 + ") in vec2 a_offset;\nlayout (location = " + 3 + ") in vec2 a_size;\nlayout (location = " + 4 + ") in vec2 a_texcoord;\nlayout (location = " + 5 + ") in vec2 a_texsize;\n\nuniform mat4 u_projection;\nuniform vec2 u_resolution;\n\nout vec2 v_texcoord;\n\nvoid main() {\n  vec2 zeroToOne = (a_offset / u_resolution) + a_cellpos + (a_unitquad * a_size);\n  gl_Position = u_projection * vec4(zeroToOne, 0.0, 1.0);\n  v_texcoord = a_texcoord + a_unitquad * a_texsize;\n}";
var fragmentShaderSource = "#version 300 es\nprecision lowp float;\n\nin vec2 v_texcoord;\n\nuniform sampler2D u_texture;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = texture(u_texture, v_texcoord);\n}";
var INDICES_PER_CELL = 10;
var BYTES_PER_CELL = INDICES_PER_CELL * Float32Array.BYTES_PER_ELEMENT;
var CELL_POSITION_INDICES = 2;
var GlyphRenderer = (function () {
    function GlyphRenderer(_terminal, _colors, _gl, _dimensions) {
        this._terminal = _terminal;
        this._colors = _colors;
        this._gl = _gl;
        this._dimensions = _dimensions;
        this._activeBuffer = 0;
        this._vertices = {
            count: 0,
            attributes: new Float32Array(0),
            attributesBuffers: [
                new Float32Array(0),
                new Float32Array(0)
            ],
            selectionAttributes: new Float32Array(0)
        };
        var gl = this._gl;
        var program = WebglUtils_1.throwIfFalsy(WebglUtils_1.createProgram(gl, vertexShaderSource, fragmentShaderSource));
        this._program = program;
        this._projectionLocation = WebglUtils_1.throwIfFalsy(gl.getUniformLocation(this._program, 'u_projection'));
        this._resolutionLocation = WebglUtils_1.throwIfFalsy(gl.getUniformLocation(this._program, 'u_resolution'));
        this._textureLocation = WebglUtils_1.throwIfFalsy(gl.getUniformLocation(this._program, 'u_texture'));
        this._vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArrayObject);
        var unitQuadVertices = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
        var unitQuadVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, unitQuadVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, unitQuadVertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, this._gl.FLOAT, false, 0, 0);
        var unitQuadElementIndices = new Uint8Array([0, 1, 3, 0, 2, 3]);
        var elementIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, unitQuadElementIndices, gl.STATIC_DRAW);
        this._attributesBuffer = WebglUtils_1.throwIfFalsy(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, this._attributesBuffer);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 2, gl.FLOAT, false, BYTES_PER_CELL, 0);
        gl.vertexAttribDivisor(2, 1);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 2, gl.FLOAT, false, BYTES_PER_CELL, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(3, 1);
        gl.enableVertexAttribArray(4);
        gl.vertexAttribPointer(4, 2, gl.FLOAT, false, BYTES_PER_CELL, 4 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(4, 1);
        gl.enableVertexAttribArray(5);
        gl.vertexAttribPointer(5, 2, gl.FLOAT, false, BYTES_PER_CELL, 6 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(5, 1);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, BYTES_PER_CELL, 8 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(1, 1);
        this._atlasTexture = WebglUtils_1.throwIfFalsy(gl.createTexture());
        gl.bindTexture(gl.TEXTURE_2D, this._atlasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 255, 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        this.onResize();
    }
    GlyphRenderer.prototype.beginFrame = function () {
        return this._atlas ? this._atlas.beginFrame() : true;
    };
    GlyphRenderer.prototype.updateCell = function (x, y, code, bg, fg, chars) {
        this._updateCell(this._vertices.attributes, x, y, code, bg, fg, chars);
    };
    GlyphRenderer.prototype._updateCell = function (array, x, y, code, bg, fg, chars) {
        var terminal = this._terminal;
        var i = (y * terminal.cols + x) * INDICES_PER_CELL;
        if (code === Constants_1.NULL_CELL_CODE || code === Constants_1.WHITESPACE_CELL_CODE || code === undefined) {
            TypedArrayUtils_1.fill(array, 0, i, i + INDICES_PER_CELL - 1 - CELL_POSITION_INDICES);
            return;
        }
        var rasterizedGlyph;
        if (!this._atlas) {
            return;
        }
        if (chars && chars.length > 1) {
            rasterizedGlyph = this._atlas.getRasterizedGlyphCombinedChar(chars, bg, fg);
        }
        else {
            rasterizedGlyph = this._atlas.getRasterizedGlyph(code, bg, fg);
        }
        if (!rasterizedGlyph) {
            TypedArrayUtils_1.fill(array, 0, i, i + INDICES_PER_CELL - 1 - CELL_POSITION_INDICES);
            return;
        }
        array[i] = -rasterizedGlyph.offset.x + this._dimensions.scaledCharLeft;
        array[i + 1] = -rasterizedGlyph.offset.y + this._dimensions.scaledCharTop;
        array[i + 2] = rasterizedGlyph.size.x / this._dimensions.scaledCanvasWidth;
        array[i + 3] = rasterizedGlyph.size.y / this._dimensions.scaledCanvasHeight;
        array[i + 4] = rasterizedGlyph.texturePositionClipSpace.x;
        array[i + 5] = rasterizedGlyph.texturePositionClipSpace.y;
        array[i + 6] = rasterizedGlyph.sizeClipSpace.x;
        array[i + 7] = rasterizedGlyph.sizeClipSpace.y;
    };
    GlyphRenderer.prototype.updateSelection = function (model) {
        var terminal = this._terminal;
        this._vertices.selectionAttributes = TypedArray_1.slice(this._vertices.attributes, 0);
        var bg = (this._colors.selectionOpaque.rgba >>> 8) | 50331648;
        if (model.selection.columnSelectMode) {
            var startCol = model.selection.startCol;
            var width = model.selection.endCol - startCol;
            var height = model.selection.viewportCappedEndRow - model.selection.viewportCappedStartRow + 1;
            for (var y = model.selection.viewportCappedStartRow; y < model.selection.viewportCappedStartRow + height; y++) {
                this._updateSelectionRange(startCol, startCol + width, y, model, bg);
            }
        }
        else {
            var startCol = model.selection.viewportStartRow === model.selection.viewportCappedStartRow ? model.selection.startCol : 0;
            var startRowEndCol = model.selection.viewportCappedStartRow === model.selection.viewportCappedEndRow ? model.selection.endCol : terminal.cols;
            this._updateSelectionRange(startCol, startRowEndCol, model.selection.viewportCappedStartRow, model, bg);
            var middleRowsCount = Math.max(model.selection.viewportCappedEndRow - model.selection.viewportCappedStartRow - 1, 0);
            for (var y = model.selection.viewportCappedStartRow + 1; y <= model.selection.viewportCappedStartRow + middleRowsCount; y++) {
                this._updateSelectionRange(0, startRowEndCol, y, model, bg);
            }
            if (model.selection.viewportCappedStartRow !== model.selection.viewportCappedEndRow) {
                var endCol = model.selection.viewportEndRow === model.selection.viewportCappedEndRow ? model.selection.endCol : terminal.cols;
                this._updateSelectionRange(0, endCol, model.selection.viewportCappedEndRow, model, bg);
            }
        }
    };
    GlyphRenderer.prototype._updateSelectionRange = function (startCol, endCol, y, model, bg) {
        var terminal = this._terminal;
        var row = y + terminal.buffer.active.viewportY;
        var line;
        for (var x = startCol; x < endCol; x++) {
            var offset = (y * this._terminal.cols + x) * RenderModel_1.RENDER_MODEL_INDICIES_PER_CELL;
            var code = model.cells[offset];
            var fg = model.cells[offset + RenderModel_1.RENDER_MODEL_FG_OFFSET];
            if (fg & 67108864) {
                var workCell = new AttributeData_1.AttributeData();
                workCell.fg = fg;
                workCell.bg = model.cells[offset + RenderModel_1.RENDER_MODEL_BG_OFFSET];
                fg = (fg & ~(50331648 | 16777215 | 67108864));
                switch (workCell.getBgColorMode()) {
                    case 16777216:
                    case 33554432:
                        var c = this._getColorFromAnsiIndex(workCell.getBgColor()).rgba;
                        fg |= (c >> 8) & 16711680 | (c >> 8) & 65280 | (c >> 8) & 255;
                    case 50331648:
                        var arr = AttributeData_1.AttributeData.toColorRGB(workCell.getBgColor());
                        fg |= arr[0] << 16 | arr[1] << 8 | arr[2] << 0;
                    case 0:
                    default:
                        var c2 = this._colors.background.rgba;
                        fg |= (c2 >> 8) & 16711680 | (c2 >> 8) & 65280 | (c2 >> 8) & 255;
                }
                fg |= 50331648;
            }
            if (code & RenderModel_1.COMBINED_CHAR_BIT_MASK) {
                if (!line) {
                    line = terminal.buffer.active.getLine(row);
                }
                var chars = line.getCell(x).getChars();
                this._updateCell(this._vertices.selectionAttributes, x, y, model.cells[offset], bg, fg, chars);
            }
            else {
                this._updateCell(this._vertices.selectionAttributes, x, y, model.cells[offset], bg, fg);
            }
        }
    };
    GlyphRenderer.prototype._getColorFromAnsiIndex = function (idx) {
        if (idx >= this._colors.ansi.length) {
            throw new Error('No color found for idx ' + idx);
        }
        return this._colors.ansi[idx];
    };
    GlyphRenderer.prototype.onResize = function () {
        var terminal = this._terminal;
        var gl = this._gl;
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
        var newCount = terminal.cols * terminal.rows * INDICES_PER_CELL;
        if (this._vertices.count !== newCount) {
            this._vertices.count = newCount;
            this._vertices.attributes = new Float32Array(newCount);
            for (var i_1 = 0; i_1 < this._vertices.attributesBuffers.length; i_1++) {
                this._vertices.attributesBuffers[i_1] = new Float32Array(newCount);
            }
            var i = 0;
            for (var y = 0; y < terminal.rows; y++) {
                for (var x = 0; x < terminal.cols; x++) {
                    this._vertices.attributes[i + 8] = x / terminal.cols;
                    this._vertices.attributes[i + 9] = y / terminal.rows;
                    i += INDICES_PER_CELL;
                }
            }
        }
    };
    GlyphRenderer.prototype.setColors = function () {
    };
    GlyphRenderer.prototype.render = function (renderModel, isSelectionVisible) {
        if (!this._atlas) {
            return;
        }
        var gl = this._gl;
        gl.useProgram(this._program);
        gl.bindVertexArray(this._vertexArrayObject);
        this._activeBuffer = (this._activeBuffer + 1) % 2;
        var activeBuffer = this._vertices.attributesBuffers[this._activeBuffer];
        var bufferLength = 0;
        for (var y = 0; y < renderModel.lineLengths.length; y++) {
            var si = y * this._terminal.cols * INDICES_PER_CELL;
            var sub = (isSelectionVisible ? this._vertices.selectionAttributes : this._vertices.attributes).subarray(si, si + renderModel.lineLengths[y] * INDICES_PER_CELL);
            activeBuffer.set(sub, bufferLength);
            bufferLength += sub.length;
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this._attributesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, activeBuffer.subarray(0, bufferLength), gl.STREAM_DRAW);
        if (this._atlas.hasCanvasChanged) {
            this._atlas.hasCanvasChanged = false;
            gl.uniform1i(this._textureLocation, 0);
            gl.activeTexture(gl.TEXTURE0 + 0);
            gl.bindTexture(gl.TEXTURE_2D, this._atlasTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this._atlas.cacheCanvas);
            gl.generateMipmap(gl.TEXTURE_2D);
        }
        gl.uniformMatrix4fv(this._projectionLocation, false, WebglUtils_1.PROJECTION_MATRIX);
        gl.uniform2f(this._resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.drawElementsInstanced(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, bufferLength / INDICES_PER_CELL);
    };
    GlyphRenderer.prototype.setAtlas = function (atlas) {
        var gl = this._gl;
        this._atlas = atlas;
        gl.bindTexture(gl.TEXTURE_2D, this._atlasTexture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas.cacheCanvas);
        gl.generateMipmap(gl.TEXTURE_2D);
    };
    GlyphRenderer.prototype.setDimensions = function (dimensions) {
        this._dimensions = dimensions;
    };
    return GlyphRenderer;
}());
exports.GlyphRenderer = GlyphRenderer;
//# sourceMappingURL=GlyphRenderer.js.map