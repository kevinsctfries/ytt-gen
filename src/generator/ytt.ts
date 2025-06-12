import { create } from "xmlbuilder2";
import { YTTCue, YTTDocument } from "../types";
import { assToYtt } from "../converters/ass";
import { YTTAttributes as Attr, YTTValues as Val } from "../constants/ytt";

export function parseASS(content: string): YTTCue[] {
  return assToYtt(content).body;
}

export function generateYTT(document: YTTDocument): string {
  const root = create({ version: "1.0", encoding: "utf-8" }).ele("timedtext", {
    format: "3",
  });

  const head = root.ele("head");
  const styles = document.head.styles;
  const defaultStyle = styles["Default"] || Object.values(styles)[0];

  // Normal Text Style
  // id: "1" is the default style in YTT
  head.ele("pen", {
    id: "1",
    [Attr.FOREGROUND_COLOR]: defaultStyle.primaryColor,
    [Attr.FONT_STYLE]: mapFontToYTTStyle(defaultStyle.fontName),
    [Attr.FONT_SIZE]: defaultStyle.fontSize.toString(),
    [Attr.BOLD]: defaultStyle.bold ? Val.Toggle.ON : Val.Toggle.OFF,
    [Attr.ITALIC]: defaultStyle.italic ? Val.Toggle.ON : Val.Toggle.OFF,
    [Attr.UNDERLINE]: defaultStyle.underline ? Val.Toggle.ON : Val.Toggle.OFF,
    [Attr.EDGE_TYPE]: Val.EdgeType.GLOW_OUTLINE,
    [Attr.EDGE_COLOR]: defaultStyle.outlineColor,
    [Attr.BACKGROUND_OPACITY]: Val.Toggle.OFF,
  });

  // Bold Text Style
  // id: "2" is used for bold text in YTT
  head.ele("pen", {
    id: "2",
    [Attr.FOREGROUND_COLOR]: defaultStyle.primaryColor,
    [Attr.FONT_STYLE]: mapFontToYTTStyle(defaultStyle.fontName),
    [Attr.FONT_SIZE]: defaultStyle.fontSize.toString(),
    [Attr.BOLD]: Val.Toggle.ON,
    [Attr.ITALIC]: defaultStyle.italic ? Val.Toggle.ON : Val.Toggle.OFF,
    [Attr.UNDERLINE]: defaultStyle.underline ? Val.Toggle.ON : Val.Toggle.OFF,
    [Attr.EDGE_TYPE]: Val.EdgeType.GLOW_OUTLINE,
    [Attr.EDGE_COLOR]: defaultStyle.outlineColor,
    [Attr.BACKGROUND_OPACITY]: Val.Toggle.OFF,
  });

  // Window Style
  head.ele("ws", {
    id: "1",
    [Attr.JUSTIFY]: convertASSAlignment(defaultStyle.alignment),
  });

  // Window Position
  head.ele("wp", {
    id: "1",
    [Attr.ANCHOR_POINT]: getAnchorPointFromAlignment(defaultStyle.alignment),
    [Attr.HORIZONTAL_ALIGN]: calculateHorizontalPosition(
      defaultStyle.marginL,
      defaultStyle.marginR
    ),
    [Attr.VERTICAL_ALIGN]: calculateVerticalPosition(defaultStyle.alignment),
  });

  const body = root.ele("body");

  document.body.forEach(caption => {
    if (!caption.text.trim()) return;

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

function timeToMs(timeStr: string): number {
  const [h, m, s] = timeStr.split(":").map(Number);
  const [seconds, ms] = s.toString().split(".").map(Number);
  return ((h * 60 + m) * 60 + seconds) * 1000 + (ms || 0);
}

function convertASSAlignment(align: number): string {
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

function getAnchorPointFromAlignment(align: number): string {
  // ASS alignment values:
  // 7 8 9
  // 4 5 6
  // 1 2 3

  // YTT anchor points:
  // 0 1 2
  // 3 4 5
  // 6 7 8
  const map: Record<number, number> = {
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

function calculateHorizontalPosition(marginL: number, marginR: number): string {
  if (marginL > marginR) return "25";
  if (marginR > marginL) return "75";
  return "50";
}

function calculateVerticalPosition(alignment: number): string {
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

function mapFontToYTTStyle(fontName: string): string {
  const fontMap: Record<string, string> = {
    "Courier New": Val.FontStyle.COURIER_NEW,
    "Times New Roman": Val.FontStyle.TIMES_NEW_ROMAN,
    Times: Val.FontStyle.TIMES_NEW_ROMAN,
    "Lucida Console": Val.FontStyle.LUCIDA_CONSOLE,
    Roboto: Val.FontStyle.ROBOTO,
    "Comic Sans": Val.FontStyle.COMIC_SANS,
    "Monotype Corsiva": Val.FontStyle.MONOTYPE_CORSIVA,
    Arial: Val.FontStyle.SMALL_CAPS_ARIAL,
  };

  return fontMap[fontName] || Val.FontStyle.DEFAULT;
}
