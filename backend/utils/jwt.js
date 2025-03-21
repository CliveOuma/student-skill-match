"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
}
const generateToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
exports.generateToken = generateToken;
