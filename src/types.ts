export interface Caption {
  id?: number;
  startTime: number;
  endTime: number;
  text: string;
  style?: Record<string, string>;
}

export interface YTTCue {
  begin: string;
  end: string;
  text: string;
  style?: CaptionStyle;
  styleName?: string;
}

export interface ASSStyle {
  name: string;
  fontName: string;
  fontSize: number;
  primaryColor: string;
  secondaryColor: string;
  outlineColor: string;
  shadowColor: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  strikeOut: boolean;
  alignment: number;
  marginL: number;
  marginR: number;
  marginV: number;
}

export interface YTTDocument {
  head: {
    styles: Record<string, ASSStyle>;
    playResX?: number;
    playResY?: number;
  };
  body: YTTCue[];
}

export interface CaptionStyle {
  fontFamily?: string;
  fontSize?: string;
  color?: string;
  fontWeight?: "normal" | "bold";
  fontStyle?: "normal" | "italic";
  textDecoration?:
    | "none"
    | "underline"
    | "line-through"
    | "underline line-through";
  textAlign?: "start" | "center" | "end";
  backgroundColor?: string;
}

export interface YTTPen {
  id: string;
  fc?: string; // Foreground color
  bc?: string; // Background color
  bo?: string; // Background opacity
  ec?: string; // Edge color
  et?: string; // Edge type
  fs?: string; // Font style
  b?: string; // Bold
  i?: string; // Italic
  u?: string; // Underline
  sz?: string; // Font size
}

export interface YTTWindowStyle {
  id: string;
  ju?: string; // Justification (alignment)
  pd?: string; // Paragraph direction
  sd?: string; // Scroll direction
}

export interface YTTPosition {
  id: string;
  ap: string; // Anchor point
  ah: string; // Horizontal alignment
  av: string; // Vertical alignment
}
