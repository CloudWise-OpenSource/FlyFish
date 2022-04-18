"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.is256Color = exports.configEquals = exports.generateConfig = void 0;
var NULL_COLOR = {
    css: '',
    rgba: 0
};
function generateConfig(scaledCharWidth, scaledCharHeight, terminal, colors) {
    var clonedColors = {
        foreground: colors.foreground,
        background: colors.background,
        cursor: NULL_COLOR,
        cursorAccent: NULL_COLOR,
        selectionTransparent: NULL_COLOR,
        selectionOpaque: NULL_COLOR,
        ansi: colors.ansi.slice(),
        contrastCache: colors.contrastCache
    };
    return {
        devicePixelRatio: window.devicePixelRatio,
        scaledCharWidth: scaledCharWidth,
        scaledCharHeight: scaledCharHeight,
        fontFamily: terminal.getOption('fontFamily'),
        fontSize: terminal.getOption('fontSize'),
        fontWeight: terminal.getOption('fontWeight'),
        fontWeightBold: terminal.getOption('fontWeightBold'),
        allowTransparency: terminal.getOption('allowTransparency'),
        drawBoldTextInBrightColors: terminal.getOption('drawBoldTextInBrightColors'),
        minimumContrastRatio: terminal.getOption('minimumContrastRatio'),
        colors: clonedColors
    };
}
exports.generateConfig = generateConfig;
function configEquals(a, b) {
    for (var i = 0; i < a.colors.ansi.length; i++) {
        if (a.colors.ansi[i].rgba !== b.colors.ansi[i].rgba) {
            return false;
        }
    }
    return a.devicePixelRatio === b.devicePixelRatio &&
        a.fontFamily === b.fontFamily &&
        a.fontSize === b.fontSize &&
        a.fontWeight === b.fontWeight &&
        a.fontWeightBold === b.fontWeightBold &&
        a.allowTransparency === b.allowTransparency &&
        a.scaledCharWidth === b.scaledCharWidth &&
        a.scaledCharHeight === b.scaledCharHeight &&
        a.drawBoldTextInBrightColors === b.drawBoldTextInBrightColors &&
        a.minimumContrastRatio === b.minimumContrastRatio &&
        a.colors.foreground === b.colors.foreground &&
        a.colors.background === b.colors.background;
}
exports.configEquals = configEquals;
function is256Color(colorCode) {
    return (colorCode & 50331648) === 16777216 || (colorCode & 50331648) === 33554432;
}
exports.is256Color = is256Color;
//# sourceMappingURL=CharAtlasUtils.js.map