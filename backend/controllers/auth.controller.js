"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.getMe = exports.login = exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const hash_1 = require("../utils/hash");
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield user_model_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists!" });
            return;
        }
        const hashedPassword = yield (0, hash_1.hashPassword)(password);
        const user = yield user_model_1.default.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User registered successfully" });
    }
    catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid email or password" });
            return;
        }
        //Generate JWT Token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        console.log("Generated Token:", token);
        res.status(200).json({ user, token });
    }
    catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.login = login;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.user.id).select("-password");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.json({ user });
    }
    catch (_a) {
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.getMe = getMe;
const logout = (req, res) => {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.json({ message: "Logged out successfully" });
};
exports.logout = logout;
