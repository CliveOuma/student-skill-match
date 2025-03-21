"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const http_1 = __importDefault(require("http"));
const db_1 = __importDefault(require("./config/db"));
const app_1 = __importDefault(require("./app"));
dotenv_1.default.config();
(0, db_1.default)();
//Create an HTTP server using Express
const server = http_1.default.createServer(app_1.default);
const PORT = process.env.PORT || 5000;
//Start the server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
exports.default = server;
