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
exports.deleteTeam = exports.updateTeam = exports.getTeamById = exports.getTeams = exports.createTeam = void 0;
const team_model_1 = __importDefault(require("../models/team.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("🔍 Incoming Request Body:", req.body);
    const { name, category, role, teamType, skills, teamSize, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extracted from JWT Middleware
    if (!name || !category || !role || !teamType || !skills || !teamSize) {
        res.status(400).json({ message: "All required fields must be provided" });
        return;
    }
    try {
        const team = yield team_model_1.default.create({
            name,
            category,
            role,
            teamType,
            skills,
            teamSize,
            description,
            createdBy: new mongoose_1.default.Types.ObjectId(userId), // Ensure ObjectId conversion
        });
        res.status(201).json(team);
    }
    catch (error) {
        console.error("Team Creation Error:", error);
        res.status(500).json({ message: "Failed to create team" });
    }
});
exports.createTeam = createTeam;
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield team_model_1.default.find().populate("createdBy", "name email").sort({ createdAt: -1 });
        res.status(200).json(teams);
    }
    catch (error) {
        console.error("Fetching Teams Error:", error);
        res.status(500).json({ message: "Failed to fetch teams" });
    }
});
exports.getTeams = getTeams;
const getTeamById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid team ID format" });
            return;
        }
        const team = yield team_model_1.default.findById(id).populate("createdBy", "name email");
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        res.json(team);
    }
    catch (error) {
        console.error("Fetching Team Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getTeamById = getTeamById;
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, category, role, teamType, skills, teamSize, description } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extracted from JWT Middleware
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid team ID format" });
        return;
    }
    try {
        const team = yield team_model_1.default.findById(id);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        if (team.createdBy.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to edit this team" });
            return;
        }
        const updatedTeam = yield team_model_1.default.findByIdAndUpdate(id, { name, category, role, teamType, skills, teamSize, description }, { new: true, runValidators: true });
        res.status(200).json(updatedTeam);
    }
    catch (error) {
        console.error("Updating Team Error:", error);
        res.status(500).json({ message: "Failed to update team" });
    }
});
exports.updateTeam = updateTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extracted from JWT Middleware
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid team ID format" });
        return;
    }
    try {
        const team = yield team_model_1.default.findById(id);
        if (!team) {
            res.status(404).json({ message: "Team not found" });
            return;
        }
        if (team.createdBy.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this team" });
            return;
        }
        yield team_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Team deleted successfully" });
    }
    catch (error) {
        console.error("Deleting Team Error:", error);
        res.status(500).json({ message: "Failed to delete team" });
    }
});
exports.deleteTeam = deleteTeam;
