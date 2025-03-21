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
exports.deleteProfile = exports.updateProfile = exports.getProfileById = exports.getProfiles = exports.createProfile = void 0;
const profile_model_1 = __importDefault(require("../models/profile.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const createProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("🔍 Received Profile Creation Request:", req.body);
    const { name, username, role, skills, portfolio, location, bio } = req.body;
    if (!name || !username || !role || !skills || !bio) {
        console.error("Missing required fields:", { name, username, role, skills, bio });
        res.status(400).json({ message: "All required fields must be provided" });
        return;
    }
    try {
        const existingProfile = yield profile_model_1.default.findOne({ username });
        if (existingProfile) {
            console.error("Username already exists:", username);
            res.status(400).json({ message: "Username already exists" });
            return;
        }
        const profile = yield profile_model_1.default.create({
            name,
            username,
            role,
            skills,
            portfolio,
            location,
            bio,
        });
        console.log("Profile Created Successfully:", profile);
        res.status(201).json(profile);
    }
    catch (error) {
        console.error("Profile Creation Error:", error);
        res.status(500).json({ message: "Failed to create profile" });
    }
});
exports.createProfile = createProfile;
const getProfiles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const profiles = yield profile_model_1.default.find().sort({ createdAt: -1 });
        res.status(200).json(profiles);
    }
    catch (error) {
        console.error("Fetching Profiles Error:", error);
        res.status(500).json({ message: "Failed to fetch profiles" });
    }
});
exports.getProfiles = getProfiles;
const getProfileById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ message: "Invalid profile ID format" });
            return;
        }
        const profile = yield profile_model_1.default.findById(id);
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        res.json(profile);
    }
    catch (error) {
        console.error("Fetching Profile Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getProfileById = getProfileById;
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { name, username, role, skills, portfolio, location, bio } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extracted from JWT Middleware
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid profile ID format" });
        return;
    }
    try {
        const profile = yield profile_model_1.default.findById(id);
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        // Ensure only the profile owner can edit
        if (profile._id.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to edit this profile" });
            return;
        }
        const updatedProfile = yield profile_model_1.default.findByIdAndUpdate(id, { name, username, role, skills, portfolio, location, bio }, { new: true, runValidators: true });
        res.status(200).json(updatedProfile);
    }
    catch (error) {
        console.error("Updating Profile Error:", error);
        res.status(500).json({ message: "Failed to update profile" });
    }
});
exports.updateProfile = updateProfile;
const deleteProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid profile ID format" });
        return;
    }
    try {
        const profile = yield profile_model_1.default.findById(id);
        if (!profile) {
            res.status(404).json({ message: "Profile not found" });
            return;
        }
        if (profile._id.toString() !== userId) {
            res.status(403).json({ message: "You are not authorized to delete this profile" });
            return;
        }
        yield profile_model_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: "Profile deleted successfully" });
    }
    catch (error) {
        console.error("Deleting Profile Error:", error);
        res.status(500).json({ message: "Failed to delete profile" });
    }
});
exports.deleteProfile = deleteProfile;
