"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RectangleRenderer = void 0;
var WebglUtils_1 = require("./WebglUtils");
var TypedArrayUtils_1 = require("common/TypedArrayUtils");
var RenderModel_1 = require("./RenderModel");
var vertexShaderSource = "#version 300 es\nlayout (location = " + 0 + ") in vec2 a_position;\nlayout (location = " + 1 + ") in vec2 a_size;\nlayout (location = " + 2 + ") in vec4 a_color;\nlayout (location = " + 3 + ") in vec2 a_unitquad;\n\nuniform mat4 u_projection;\nuniform vec2 u_resolution;\n\nout vec4 v_color;\n\nvoid main() {\n  vec2 zeroToOne = (a_position + (a_unitquad * a_size)) / u_resolution;\n  gl_Position = u_projection * vec4(zeroToOne, 0.0, 1.0);\n  v_color = a_color;\n}";
var fragmentShaderSource = "#version 300 es\nprecision lowp float;\n\nin vec4 v_color;\n\nout vec4 outColor;\n\nvoid main() {\n  outColor = v_color;\n}";
var INDICES_PER_RECTANGLE = 8;
var BYTES_PER_RECTANGLE = INDICES_PER_RECTANGLE * Float32Array.BYTES_PER_ELEMENT;
var INITIAL_BUFFER_RECTANGLE_CAPACITY = 20 * INDICES_PER_RECTANGLE;
var RectangleRenderer = (function () {
    function RectangleRenderer(_terminal, _colors, _gl, _dimensions) {
        this._terminal = _terminal;
        this._colors = _colors;
        this._gl = _gl;
        this._dimensions = _dimensions;
        this._vertices = {
            count: 0,
            attributes: new Float32Array(INITIAL_BUFFER_RECTANGLE_CAPACITY),
            selection: new Float32Array(3 * INDICES_PER_RECTANGLE)
        };
        var gl = this._gl;
        this._program = WebglUtils_1.throwIfFalsy(WebglUtils_1.createProgram(gl, vertexShaderSource, fragmentShaderSource));
        this._resolutionLocation = WebglUtils_1.throwIfFalsy(gl.getUniformLocation(this._program, 'u_resolution'));
        this._projectionLocation = WebglUtils_1.throwIfFalsy(gl.getUniformLocation(this._program, 'u_projection'));
        this._vertexArrayObject = gl.createVertexArray();
        gl.bindVertexArray(this._vertexArrayObject);
        var unitQuadVertices = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
        var unitQuadVerticesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, unitQuadVerticesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, unitQuadVertices, gl.STATIC_DRAW);
        gl.enableVertexAttribArray(3);
        gl.vertexAttribPointer(3, 2, this._gl.FLOAT, false, 0, 0);
        var unitQuadElementIndices = new Uint8Array([0, 1, 3, 0, 2, 3]);
        var elementIndicesBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elementIndicesBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, unitQuadElementIndices, gl.STATIC_DRAW);
        this._attributesBuffer = WebglUtils_1.throwIfFalsy(gl.createBuffer());
        gl.bindBuffer(gl.ARRAY_BUFFER, this._attributesBuffer);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, BYTES_PER_RECTANGLE, 0);
        gl.vertexAttribDivisor(0, 1);
        gl.enableVertexAttribArray(1);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, BYTES_PER_RECTANGLE, 2 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(1, 1);
        gl.enableVertexAttribArray(2);
        gl.vertexAttribPointer(2, 4, gl.FLOAT, false, BYTES_PER_RECTANGLE, 4 * Float32Array.BYTES_PER_ELEMENT);
        gl.vertexAttribDivisor(2, 1);
        this._updateCachedColors();
    }
    RectangleRenderer.prototype.render = function () {
        var gl = this._gl;
        gl.useProgram(this._program);
        gl.bindVertexArray(this._vertexArrayObject);
        gl.uniformMatrix4fv(this._projectionLocation, false, WebglUtils_1.PROJECTION_MATRIX);
        gl.uniform2f(this._resolutionLocation, gl.canvas.width, gl.canvas.height);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._attributesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertices.attributes, gl.DYNAMIC_DRAW);
        gl.drawElementsInstanced(this._gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, this._vertices.count);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._attributesBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this._vertices.selection, gl.DYNAMIC_DRAW);
        gl.drawElementsInstanced(this._gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0, 3);
    };
    RectangleRenderer.prototype.onResize = function () {
        this._updateViewportRectangle();
    };
    RectangleRenderer.prototype.setColors = function () {
        this._updateCachedColors();
        this._updateViewportRectangle();
    };
    RectangleRenderer.prototype._updateCachedColors = function () {
        this._bgFloat = this._colorToFloat32Array(this._colors.background);
        this._selectionFloat = this._colorToFloat32Array(this._colors.selectionOpaque);
    };
    RectangleRenderer.prototype._updateViewportRectangle = function () {
        this._addRectangleFloat(this._vertices.attributes, 0, 0, 0, this._terminal.cols * this._dimensions.scaledCellWidth, this._terminal.rows * this._dimensions.scaledCellHeight, this._bgFloat);
    };
    RectangleRenderer.prototype.updateSelection = function (model) {
        var terminal = this._terminal;
        if (!model.hasSelection) {
            TypedArrayUtils_1.fill(this._vertices.selection, 0, 0);
            return;
        }
        if (model.columnSelectMode) {
            var startCol = model.startCol;
            var width = model.endCol - startCol;
            var height = model.viewportCappedEndRow - model.viewportCappedStartRow + 1;
            this._addRectangleFloat(this._vertices.selection, 0, startCol * this._dimensions.scaledCellWidth, model.viewportCappedStartRow * this._dimensions.scaledCellHeight, width * this._dimensions.scaledCellWidth, height * this._dimensions.scaledCellHeight, this._selectionFloat);
            TypedArrayUtils_1.fill(this._vertices.selection, 0, INDICES_PER_RECTANGLE);
        }
        else {
            var startCol = model.viewportStartRow === model.viewportCappedStartRow ? model.startCol : 0;
            var startRowEndCol = model.viewportCappedStartRow === model.viewportEndRow ? model.endCol : terminal.cols;
            this._addRectangleFloat(this._vertices.selection, 0, startCol * this._dimensions.scaledCellWidth, model.viewportCappedStartRow * this._dimensions.scaledCellHeight, (startRowEndCol - startCol) * this._dimensions.scaledCellWidth, this._dimensions.scaledCellHeight, this._selectionFloat);
            var middleRowsCount = Math.max(model.viewportCappedEndRow - model.viewportCappedStartRow - 1, 0);
            this._addRectangleFloat(this._vertices.selection, INDICES_PER_RECTANGLE, 0, (model.viewportCappedStartRow + 1) * this._dimensions.scaledCellHeight, terminal.cols * this._dimensions.scaledCellWidth, middleRowsCount * this._dimensions.scaledCellHeight, this._selectionFloat);
            if (model.viewportCappedStartRow !== model.viewportCappedEndRow) {
                var endCol = model.viewportEndRow === model.viewportCappedEndRow ? model.endCol : terminal.cols;
                this._addRectangleFloat(this._vertices.selection, INDICES_PER_RECTANGLE * 2, 0, model.viewportCappedEndRow * this._dimensions.scaledCellHeight, endCol * this._dimensions.scaledCellWidth, this._dimensions.scaledCellHeight, this._selectionFloat);
            }
            else {
                TypedArrayUtils_1.fill(this._vertices.selection, 0, INDICES_PER_RECTANGLE * 2);
            }
        }
    };
    RectangleRenderer.prototype.updateBackgrounds = function (model) {
        var terminal = this._terminal;
        var vertices = this._vertices;
        var rectangleCount = 1;
        for (var y = 0; y < terminal.rows; y++) {
            var currentStartX = -1;
            var currentBg = 0;
            var currentFg = 0;
            var currentInverse = false;
            for (var x = 0; x < terminal.cols; x++) {
                var modelIndex = ((y * terminal.cols) + x) * RenderModel_1.RENDER_MODEL_INDICIES_PER_CELL;
                var bg = model.cells[modelIndex + RenderModel_1.RENDER_MODEL_BG_OFFSET];
                var fg = model.cells[modelIndex + RenderModel_1.RENDER_MODEL_FG_OFFSET];
                var inverse = !!(fg & 67108864);
                if (bg !== currentBg || (fg !== currentFg && (currentInverse || inverse))) {
                    if (currentBg !== 0 || (currentInverse && currentFg !== 0)) {
                        var offset = rectangleCount++ * INDICES_PER_RECTANGLE;
                        this._updateRectangle(vertices, offset, currentFg, currentBg, currentStartX, x, y);
                    }
                    currentStartX = x;
                    currentBg = bg;
                    currentFg = fg;
                    currentInverse = inverse;
                }
            }
            if (currentBg !== 0 || (currentInverse && currentFg !== 0)) {
                var offset = rectangleCount++ * INDICES_PER_RECTANGLE;
                this._updateRectangle(vertices, offset, currentFg, currentBg, currentStartX, terminal.cols, y);
            }
        }
        vertices.count = rectangleCount;
    };
    RectangleRenderer.prototype._updateRectangle = function (vertices, offset, fg, bg, startX, endX, y) {
        var rgba;
        if (fg & 67108864) {
            switch (fg & 50331648) {
                case 16777216:
                case 33554432:
                    rgba = this._colors.ansi[fg & 255].rgba;
                    break;
                case 50331648:
                    rgba = (fg & 16777215) << 8;
                    break;
                case 0:
                default:
                    rgba = this._colors.foreground.rgba;
            }
        }
        else {
            switch (bg & 50331648) {
                case 16777216:
                case 33554432:
                    rgba = this._colors.ansi[bg & 255].rgba;
                    break;
                case 50331648:
                    rgba = (bg & 16777215) << 8;
                    break;
                case 0:
                default:
                    rgba = this._colors.background.rgba;
            }
        }
        if (vertices.attributes.length < offset + 4) {
            vertices.attributes = WebglUtils_1.expandFloat32Array(vertices.attributes, this._terminal.rows * this._terminal.cols * INDICES_PER_RECTANGLE);
        }
        var x1 = startX * this._dimensions.scaledCellWidth;
        var y1 = y * this._dimensions.scaledCellHeight;
        var r = ((rgba >> 24) & 0xFF) / 255;
        var g = ((rgba >> 16) & 0xFF) / 255;
        var b = ((rgba >> 8) & 0xFF) / 255;
        this._addRectangle(vertices.attributes, offset, x1, y1, (endX - startX) * this._dimensions.scaledCellWidth, this._dimensions.scaledCellHeight, r, g, b, 1);
    };
    RectangleRenderer.prototype._addRectangle = function (array, offset, x1, y1, width, height, r, g, b, a) {
        array[offset] = x1;
        array[offset + 1] = y1;
        array[offset + 2] = width;
        array[offset + 3] = height;
        array[offset + 4] = r;
        array[offset + 5] = g;
        array[offset + 6] = b;
        array[offset + 7] = a;
    };
    RectangleRenderer.prototype._addRectangleFloat = function (array, offset, x1, y1, width, height, color) {
        array[offset] = x1;
        array[offset + 1] = y1;
        array[offset + 2] = width;
        array[offset + 3] = height;
        array[offset + 4] = color[0];
        array[offset + 5] = color[1];
        array[offset + 6] = color[2];
        array[offset + 7] = color[3];
    };
    RectangleRenderer.prototype._colorToFloat32Array = function (color) {
        return new Float32Array([
            ((color.rgba >> 24) & 0xFF) / 255,
            ((color.rgba >> 16) & 0xFF) / 255,
            ((color.rgba >> 8) & 0xFF) / 255,
            ((color.rgba) & 0xFF) / 255
        ]);
    };
    return RectangleRenderer;
}());
exports.RectangleRenderer = RectangleRenderer;
//# sourceMappingURL=RectangleRenderer.js.map