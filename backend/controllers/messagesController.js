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
exports.getAllMessages = exports.addMessage = void 0;
const message_model_1 = __importDefault(require("../models/message.model"));
// Add a new message
const addMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to, message } = req.body;
        //Create message in the database
        const newMessage = yield message_model_1.default.create({
            message: { text: message },
            users: [from, to],
            sender: from,
        });
        if (newMessage) {
            res.status(201).json({ msg: "Message added successfully" });
        }
        else {
            res.status(400).json({ msg: "Failed to add message to the database" });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.addMessage = addMessage;
// Retrieve all messages between two users
const getAllMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { from, to } = req.body;
        //Use the correct model name
        const messages = yield message_model_1.default.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 });
        if (!messages || messages.length === 0) {
            res.status(404).json({ message: "No messages found." });
            return;
        }
        const formattedMessages = messages.map((msg) => ({
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
            timestamp: msg.createdAt,
        }));
        res.status(200).json(formattedMessages);
    }
    catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.getAllMessages = getAllMessages;
