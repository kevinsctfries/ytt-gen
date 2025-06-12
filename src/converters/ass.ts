import { YTTDocument, YTTCue, ASSStyle } from "../types";

// Function to parse ASS color format
function assColorToCss(assColor: string): { color: string; alpha: number } {
  // ASS colors are &HAABBGGRR (alpha first, then BGR)
  // Example: &H002AE400 -> alpha=0x00, B=0x2A, G=0xE4, R=0x00
  // But often &H00BBGGRR (assuming alpha 0)
  let hex = assColor.trim();
  if (!hex.startsWith("&H")) return { color: "#FFFFFF", alpha: 1 };

  hex = hex.slice(2); // remove &H
  // Pad to 8 chars
  hex = hex.padStart(8, "0");

  // Parse components from right to left: RR GG BB AA
  // But ASS is BGR (inverted), so:
  const a = parseInt(hex.slice(0, 2), 16);
  const b = parseInt(hex.slice(2, 4), 16);
  const g = parseInt(hex.slice(4, 6), 16);
  const r = parseInt(hex.slice(6, 8), 16);

  const alpha = 1 - a / 255; // ASS alpha is inverted, 0=opaque, 255=transparent
  const color = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return { color, alpha };
}

// Parse styles section
function parseStyles(stylesText: string) {
  const styles: Record<string, ASSStyle> = {};

  const lines = stylesText.split(/\r?\n/);
  let format: string[] = [];
  for (const line of lines) {
    if (line.startsWith("Format:")) {
      format = line
        .slice("Format:".length)
        .split(",")
        .map(s => s.trim());
    }
  }

  for (const line of lines) {
    if (line.startsWith("Style:")) {
      const parts = line.slice("Style:".length).split(",");
      const styleData: Record<string, string> = {};
      format.forEach((key, i) => {
        styleData[key] = parts[i]?.trim() ?? "";
      });

      const primary = assColorToCss(styleData.PrimaryColour);
      const secondary = assColorToCss(styleData.SecondaryColour);
      const outline = assColorToCss(styleData.OutlineColour);
      const shadow = assColorToCss(styleData.BackColour); // renamed to better reflect purpose

      styles[styleData.Name] = {
        name: styleData.Name,
        fontName: styleData.Fontname,
        fontSize: parseFloat(styleData.Fontsize),
        primaryColor: primary.color,
        secondaryColor: secondary.color,
        outlineColor: outline.color,
        shadowColor: shadow.color, // renamed from backColor
        bold: parseInt(styleData.Bold) !== 0,
        italic: parseInt(styleData.Italic) !== 0,
        underline: parseInt(styleData.Underline) !== 0,
        strikeOut: parseInt(styleData.StrikeOut) !== 0,
        alignment: parseInt(styleData.Alignment),
        marginL: parseInt(styleData.MarginL),
        marginR: parseInt(styleData.MarginR),
        marginV: parseInt(styleData.MarginV),
      };
    }
  }
  return styles;
}

// Convert ASS alignment number to TTML textAlign and display region
function alignmentToTextAlign(align: number): "start" | "center" | "end" {
  switch (align) {
    case 1:
    case 4:
    case 7:
      return "start";
    case 2:
    case 5:
    case 8:
      return "center";
    case 3:
    case 6:
    case 9:
      return "end";
    default:
      return "center";
  }
}

// Main converter function
export function assToYtt(assContent: string): YTTDocument {
  const lines = assContent.split(/\r?\n/);

  let playResX: number | undefined;
  let playResY: number | undefined;

  for (const line of lines) {
    if (line.startsWith("PlayResX:")) {
      playResX = parseInt(line.split(":")[1].trim());
    } else if (line.startsWith("PlayResY:")) {
      playResY = parseInt(line.split(":")[1].trim());
    }
  }

  let stylesText = "";
  let eventsText = "";

  let inStyles = false;
  let inEvents = false;

  for (const line of lines) {
    if (line.trim() === "[V4+ Styles]") {
      inStyles = true;
      inEvents = false;
      continue;
    }
    if (line.trim() === "[Events]") {
      inEvents = true;
      inStyles = false;
      continue;
    }

    if (inStyles) {
      stylesText += line + "\n";
    }
    if (inEvents) {
      eventsText += line + "\n";
    }
  }

  const styles = parseStyles(stylesText);

  // Parse events lines (dialogues)
  const eventsLines = eventsText.split(/\r?\n/);
  let eventFormat: string[] = [];
  for (const line of eventsLines) {
    if (line.startsWith("Format:")) {
      eventFormat = line
        .slice("Format:".length)
        .split(",")
        .map(s => s.trim());
      break;
    }
  }

  // When creating cues, modify the style assignment:
  const cues: YTTCue[] = [];
  for (const line of eventsLines) {
    if (line.startsWith("Dialogue:")) {
      const parts = line.slice("Dialogue:".length).split(",");
      const textIndex = eventFormat.indexOf("Text");
      const fixedParts = parts.slice(0, textIndex);
      const textParts = parts.slice(textIndex);
      const text = textParts.join(",").trim();

      // Map fields to eventFormat keys
      const eventData: Record<string, string> = {};
      eventFormat.forEach((key, i) => {
        eventData[key] = (parts[i] || "").trim();
      });

      const styleName = eventData.Style;
      const style = styles[styleName] || styles.Default;

      // Convert style properties to TTML format
      const ttsStyles: Record<string, string> = {
        "tts:fontFamily": style.fontName,
        "tts:fontSize": `${style.fontSize}px`,
        "tts:color": style.primaryColor,
        "tts:backgroundColor": style.shadowColor,
        "tts:fontWeight": style.bold ? "bold" : "normal",
        "tts:fontStyle": style.italic ? "italic" : "normal",
        "tts:textDecoration":
          [style.underline && "underline", style.strikeOut && "line-through"]
            .filter(Boolean)
            .join(" ") || "none",
        "tts:textAlign": alignmentToTextAlign(style.alignment),
      };

      // Parse start and end times
      const begin = eventData.Start;
      const end = eventData.End;

      cues.push({
        begin,
        end,
        text: text.trim(),
        style: ttsStyles,
        styleName,
      });
    }
  }

  return {
    head: {
      styles: styles,
      playResX,
      playResY,
    },
    body: cues,
  };
}
