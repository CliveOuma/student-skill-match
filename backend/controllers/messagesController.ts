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
export const addMessage = async (req: AddMessageRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { from, to, message } = req.body;

    //Create message in the database
    const newMessage = await Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });

    if (newMessage) {
      res.status(201).json({ msg: "Message added successfully" });
    } else {
      res.status(400).json({ msg: "Failed to add message to the database" });
    }
  } catch (error) {
    next(error);
  }
};

// Retrieve all messages between two users
export const getAllMessages = async (req: GetMessagesRequest, res: Response): Promise<void> => {
  try {
    const { from, to } = req.body;

    //Use the correct model name
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({ updatedAt: 1 });

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
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
