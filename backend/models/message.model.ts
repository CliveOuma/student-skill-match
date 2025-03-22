import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  message: {
    text?: string;
    imageUrl?: string;  // Support for image messages
    fileUrl?: string;   // Support for file attachments
  };
  users: [mongoose.Types.ObjectId, mongoose.Types.ObjectId]; // Always store two users
  sender: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    message: {
      text: { type: String, trim: true },
      imageUrl: { type: String, default: null },
      fileUrl: { type: String, default: null },
    },
    users: {
      type: [Schema.Types.ObjectId],
      ref: "User",
      validate: {
        validator: function (users: mongoose.Types.ObjectId[]) {
          return users.length === 2; // Ensure only 2 users in the array
        },
        message: "A message must have exactly two users.",
      },
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, 
  }
);

// **Indexes for better performance**
MessageSchema.index({ users: 1, createdAt: -1 });

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
