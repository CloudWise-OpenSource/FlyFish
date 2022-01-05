"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.throwIfFalsy = exports.expandFloat32Array = exports.createShader = exports.createProgram = exports.PROJECTION_MATRIX = void 0;
exports.PROJECTION_MATRIX = new Float32Array([
    2, 0, 0, 0,
    0, -2, 0, 0,
    0, 0, 1, 0,
    -1, 1, 0, 1
]);
function createProgram(gl, vertexSource, fragmentSource) {
    var program = throwIfFalsy(gl.createProgram());
    gl.attachShader(program, throwIfFalsy(createShader(gl, gl.VERTEX_SHADER, vertexSource)));
    gl.attachShader(program, throwIfFalsy(createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)));
    gl.linkProgram(program);
    var success = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (success) {
        return program;
    }
    console.error(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
}
exports.createProgram = createProgram;
function createShader(gl, type, source) {
    var shader = throwIfFalsy(gl.createShader(type));
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
}
exports.createShader = createShader;
function expandFloat32Array(source, max) {
    var newLength = Math.min(source.length * 2, max);
    var newArray = new Float32Array(newLength);
    for (var i = 0; i < source.length; i++) {
        newArray[i] = source[i];
    }
    return newArray;
}
exports.expandFloat32Array = expandFloat32Array;
function throwIfFalsy(value) {
    if (!value) {
        throw new Error('value must not be falsy');
    }
    return value;
}
exports.throwIfFalsy = throwIfFalsy;
//# sourceMappingURL=WebglUtils.js.map