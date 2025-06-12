"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSRT = void 0;
const srt_parser_2_1 = __importDefault(require("srt-parser-2"));
function parseSRT(input) {
    const parser = new srt_parser_2_1.default();
    const items = parser.fromSrt(input);
    return items.map((it, idx) => ({
        id: idx + 1,
        startTime: timestampToMs(it.startTime),
        endTime: timestampToMs(it.endTime),
        text: it.text.replace(/\r?\n/g, " "),
    }));
}
exports.parseSRT = parseSRT;
function timestampToMs(ts) {
    const [h, m, rest] = ts.split(":");
    const [s, ms] = rest.split(",");
    return (parseInt(h) * 3600000 +
        parseInt(m) * 60000 +
        parseInt(s) * 1000 +
        parseInt(ms));
}
