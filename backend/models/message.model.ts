import mongoose, { Schema, Document } from "mongoose";


export interface IMessage extends Document {
  message: {
    text: string;
  };
  users: mongoose.Types.ObjectId[]; 
  sender: mongoose.Types.ObjectId; 
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    message: {
      text: { type: String, required: true },
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, //Automatically adds `createdAt` & `updatedAt`
  }
);

const Message = mongoose.model<IMessage>("Message", MessageSchema);
export default Message;
