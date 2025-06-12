"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateYTT = exports.parseASS = void 0;
const xmlbuilder2_1 = require("xmlbuilder2");
const ass_1 = require("../converters/ass");
const ytt_1 = require("../constants/ytt");
function parseASS(content) {
    return (0, ass_1.assToYtt)(content).body;
}
exports.parseASS = parseASS;
function generateYTT(document) {
    const root = (0, xmlbuilder2_1.create)({ version: "1.0", encoding: "utf-8" }).ele("timedtext", {
        format: "3",
    });
    const head = root.ele("head");
    const styles = document.head.styles;
    const defaultStyle = styles["Default"] || Object.values(styles)[0];
    // Normal Text Style
    // id: "1" is the default style in YTT
    head.ele("pen", {
        id: "1",
        [ytt_1.YTTAttributes.FOREGROUND_COLOR]: defaultStyle.primaryColor,
        [ytt_1.YTTAttributes.FONT_STYLE]: mapFontToYTTStyle(defaultStyle.fontName),
        [ytt_1.YTTAttributes.FONT_SIZE]: defaultStyle.fontSize.toString(),
        [ytt_1.YTTAttributes.BOLD]: defaultStyle.bold ? ytt_1.YTTValues.Toggle.ON : ytt_1.YTTValues.Toggle.OFF,
        [ytt_1.YTTAttributes.ITALIC]: defaultStyle.italic ? ytt_1.YTTValues.Toggle.ON : ytt_1.YTTValues.Toggle.OFF,
        [ytt_1.YTTAttributes.UNDERLINE]: defaultStyle.underline ? ytt_1.YTTValues.Toggle.ON : ytt_1.YTTValues.Toggle.OFF,
        [ytt_1.YTTAttributes.EDGE_TYPE]: ytt_1.YTTValues.EdgeType.GLOW_OUTLINE,
        [ytt_1.YTTAttributes.EDGE_COLOR]: defaultStyle.outlineColor,
        [ytt_1.YTTAttributes.BACKGROUND_OPACITY]: ytt_1.YTTValues.Toggle.OFF,
    });
    // Bold Text Style
    // id: "2" is used for bold text in YTT
    head.ele("pen", {
        id: "2",
        [ytt_1.YTTAttributes.FOREGROUND_COLOR]: defaultStyle.primaryColor,
        [ytt_1.YTTAttributes.FONT_STYLE]: mapFontToYTTStyle(defaultStyle.fontName),
        [ytt_1.YTTAttributes.FONT_SIZE]: defaultStyle.fontSize.toString(),
        [ytt_1.YTTAttributes.BOLD]: ytt_1.YTTValues.Toggle.ON,
        [ytt_1.YTTAttributes.ITALIC]: defaultStyle.italic ? ytt_1.YTTValues.Toggle.ON : ytt_1.YTTValues.Toggle.OFF,
        [ytt_1.YTTAttributes.UNDERLINE]: defaultStyle.underline ? ytt_1.YTTValues.Toggle.ON : ytt_1.YTTValues.Toggle.OFF,
        [ytt_1.YTTAttributes.EDGE_TYPE]: ytt_1.YTTValues.EdgeType.GLOW_OUTLINE,
        [ytt_1.YTTAttributes.EDGE_COLOR]: defaultStyle.outlineColor,
        [ytt_1.YTTAttributes.BACKGROUND_OPACITY]: ytt_1.YTTValues.Toggle.OFF,
    });
    // Window Style
    head.ele("ws", {
        id: "1",
        [ytt_1.YTTAttributes.JUSTIFY]: convertASSAlignment(defaultStyle.alignment),
    });
    // Window Position
    head.ele("wp", {
        id: "1",
        [ytt_1.YTTAttributes.ANCHOR_POINT]: getAnchorPointFromAlignment(defaultStyle.alignment),
        [ytt_1.YTTAttributes.HORIZONTAL_ALIGN]: calculateHorizontalPosition(defaultStyle.marginL, defaultStyle.marginR),
        [ytt_1.YTTAttributes.VERTICAL_ALIGN]: calculateVerticalPosition(defaultStyle.alignment),
    });
    const body = root.ele("body");
    document.body.forEach(caption => {
        if (!caption.text.trim())
            return;
        const startMs = timeToMs(caption.begin);
        const endMs = timeToMs(caption.end);
        const duration = endMs - startMs;
        const p = body.ele("p", {
            t: startMs,
            d: duration,
            wp: "1",
            ws: "1",
            p: caption.style?.fontWeight === "bold" ? "2" : "1",
        });
        p.txt(caption.text);
    });
    return root.end({ prettyPrint: true });
}
exports.generateYTT = generateYTT;
function timeToMs(timeStr) {
    const [h, m, s] = timeStr.split(":").map(Number);
    const [seconds, ms] = s.toString().split(".").map(Number);
    return ((h * 60 + m) * 60 + seconds) * 1000 + (ms || 0);
}
function convertASSAlignment(align) {
    switch (align % 3) {
        case 1:
            return "0";
        case 2:
            return "2";
        case 0:
            return "1";
        default:
            return "2";
    }
}
function getAnchorPointFromAlignment(align) {
    // ASS alignment values:
    // 7 8 9
    // 4 5 6
    // 1 2 3
    // YTT anchor points:
    // 0 1 2
    // 3 4 5
    // 6 7 8
    const map = {
        7: 0,
        8: 1,
        9: 2,
        4: 3,
        5: 4,
        6: 5,
        1: 6,
        2: 7,
        3: 8,
    };
    return String(map[align] ?? 7); // Defaults to bottom if unknown
}
function calculateHorizontalPosition(marginL, marginR) {
    if (marginL > marginR)
        return "25";
    if (marginR > marginL)
        return "75";
    return "50";
}
function calculateVerticalPosition(alignment) {
    const row = Math.floor((alignment - 1) / 3); // 0 = bottom, 1 = middle, 2 = top
    switch (row) {
        case 0:
            return "90"; // Bottom
        case 1:
            return "50"; // Middle
        case 2:
            return "10"; // Top
        default:
            return "90";
    }
}
function mapFontToYTTStyle(fontName) {
    const fontMap = {
        "Courier New": ytt_1.YTTValues.FontStyle.COURIER_NEW,
        "Times New Roman": ytt_1.YTTValues.FontStyle.TIMES_NEW_ROMAN,
        Times: ytt_1.YTTValues.FontStyle.TIMES_NEW_ROMAN,
        "Lucida Console": ytt_1.YTTValues.FontStyle.LUCIDA_CONSOLE,
        Roboto: ytt_1.YTTValues.FontStyle.ROBOTO,
        "Comic Sans": ytt_1.YTTValues.FontStyle.COMIC_SANS,
        "Monotype Corsiva": ytt_1.YTTValues.FontStyle.MONOTYPE_CORSIVA,
        Arial: ytt_1.YTTValues.FontStyle.SMALL_CAPS_ARIAL,
    };
    return fontMap[fontName] || ytt_1.YTTValues.FontStyle.DEFAULT;
}
