"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const http_status_codes_1 = require("http-status-codes");
const http_errors_1 = __importDefault(require("http-errors"));
const generateToken = (payload) => {
    // @ts-expect-error - The payload is an object
    return (0, jsonwebtoken_1.sign)(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_SECRET_EXPIRATION });
};
exports.generateToken = generateToken;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const verifyToken = (token) => {
    try {
        return (0, jsonwebtoken_1.verify)(token, process.env.JWT_SECRET || "");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
    }
    catch (error) {
        throw (0, http_errors_1.default)(http_status_codes_1.StatusCodes.FORBIDDEN, "Invalid or expired token", {
            resource: "Auth Middleware",
        });
    }
};
exports.verifyToken = verifyToken;
