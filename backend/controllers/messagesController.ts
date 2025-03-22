import { Request, Response, NextFunction } from "express";
import Message from "../models/message.model";

// Define a request type for adding a message
interface AddMessageRequest extends Request {
  body: {
    from: string;
    to: string;
    message: string;
  };
}

// Define a request type for retrieving messages
interface GetMessagesRequest extends Request {
  body: {
    from: string;
    to: string;
  };
}

// Add a new message
export const addMessage = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { from, to, message } = req.body;

    if (!from || !to || !message) {
      res.status(400).json({ msg: "Missing required fields" });
      return;
    }

    const newMessage = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    res.status(201).json({ msg: "Message added successfully" });
  } catch (error) {
    next(error);
  }
};

// Retrieve all messages between two users
export const getAllMessages = async (req: Request, res: Response): Promise<void> => {
  try {
    const { from, to } = req.body;

    if (!from || !to) {
      res.status(400).json({ message: "User IDs are required" });
      return;
    }

    const messages = await Message.find({ users: { $all: [from, to] } }).sort({ createdAt: 1 });

    if (!messages || messages.length === 0) {
      res.status(200).json([]); // Return empty array instead of 404
      return;
    }

    const formattedMessages = messages.map((msg) => ({
      fromSelf: msg.sender === from,
      message: msg.message.text,
      timestamp: msg.createdAt,
    }));

    res.status(200).json(formattedMessages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
