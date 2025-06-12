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
    };
    body: YTTCue[];
}
export interface CaptionStyle {
    fontFamily?: string;
    fontSize?: string;
    color?: string;
    fontWeight?: "normal" | "bold";
    fontStyle?: "normal" | "italic";
    textDecoration?: "none" | "underline" | "line-through" | "underline line-through";
    textAlign?: "start" | "center" | "end";
    backgroundColor?: string;
}
export interface YTTPen {
    id: string;
    fc?: string;
    bc?: string;
    bo?: string;
    ec?: string;
    et?: string;
    fs?: string;
    b?: string;
    i?: string;
    u?: string;
    sz?: string;
}
export interface YTTWindowStyle {
    id: string;
    ju?: string;
    pd?: string;
    sd?: string;
}
export interface YTTPosition {
    id: string;
    ap: string;
    ah: string;
    av: string;
}
