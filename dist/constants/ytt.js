"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YTTValues = exports.YTTAttributes = void 0;
exports.YTTAttributes = {
    // Text styles
    BOLD: "b",
    ITALIC: "i",
    UNDERLINE: "u",
    // Colors and opacity
    FOREGROUND_COLOR: "fc",
    FOREGROUND_OPACITY: "fo",
    BACKGROUND_COLOR: "bc",
    BACKGROUND_OPACITY: "bo",
    // Edge properties
    EDGE_TYPE: "et",
    EDGE_COLOR: "ec",
    // Font properties
    FONT_STYLE: "fs",
    FONT_SIZE: "sz",
    // Alignment
    JUSTIFY: "ju",
    // Position
    ANCHOR_POINT: "ap",
    HORIZONTAL_ALIGN: "ah",
    VERTICAL_ALIGN: "av",
};
exports.YTTValues = {
    // Edge types
    EdgeType: {
        HARD_SHADOW: "1",
        BEVEL: "2",
        GLOW_OUTLINE: "3",
        SOFT_SHADOW: "4",
    },
    // Font styles
    FontStyle: {
        DEFAULT: "0",
        COURIER_NEW: "1",
        TIMES_NEW_ROMAN: "2",
        LUCIDA_CONSOLE: "3",
        ROBOTO: "4",
        COMIC_SANS: "5",
        MONOTYPE_CORSIVA: "6",
        SMALL_CAPS_ARIAL: "7",
    },
    // Alignment
    Justify: {
        LEFT: "0",
        RIGHT: "1",
        CENTER: "2",
    },
    // Boolean values
    Toggle: {
        ON: "1",
        OFF: "0",
    },
    // Opacity limits
    Opacity: {
        MAX: "254",
        MIN: "0",
    },
};
