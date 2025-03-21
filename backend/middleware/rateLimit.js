"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.loginLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 10 minutes
    max: 5, // limit each IP to 5 login requests per window
    message: JSON.stringify({ message: "Too many login attempts, try again later." }),
    standardHeaders: true,
    legacyHeaders: false,
});
