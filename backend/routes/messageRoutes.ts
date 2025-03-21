import express from "express";
import { addMessage, getAllMessages } from "../controllers/messagesController";

const router = express.Router();


router.post("/addMsg", addMessage);
router.post("/getMsg", getAllMessages);

export default router;
