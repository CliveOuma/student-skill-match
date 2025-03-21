import dotenv from "dotenv";
import http from "http";
import connectDB from "./config/db";
import app from "./app";

dotenv.config();
connectDB();

//Create an HTTP server using Express
const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

//Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default server;
