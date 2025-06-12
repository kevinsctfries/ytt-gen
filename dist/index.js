"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseASS = exports.generateYTT = void 0;
var ytt_1 = require("./generator/ytt");
Object.defineProperty(exports, "generateYTT", { enumerable: true, get: function () { return ytt_1.generateYTT; } });
var ass_1 = require("./converters/ass");
Object.defineProperty(exports, "parseASS", { enumerable: true, get: function () { return ass_1.assToYtt; } });
