"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cors = exports.config = void 0;
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
const winston_1 = require("../common/winston/winston");
const allowedOrigins = (process.env.ALLOW_ORIGIN || "").split(",");
/**
 * CORS configuration to check allowed origins and set the appropriate headers
 *
 * Params:
 * - origin (string | undefined): Origin of the request, or undefined if not present.
 * - callback (function): Callback to confirm if origin is allowed or not.
 *
 * Response:
 * - Calls the callback with null and true if origin is allowed, otherwise calls callback with an error.
 */
exports.config = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            winston_1.logger.warn("Origin not allowed by CORS", { origin });
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionsSuccessStatus: http_status_codes_1.StatusCodes.OK,
    methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
    credentials: true,
    exposedHeaders: ["Content-Type", "set-cookie"],
    options: {
        "Access-Control-Allow-Origin": process.env.ALLOW_ORIGIN || "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,PUT,POST,DELETE",
    },
};
// Initialize the CORS middleware with the configured settings
exports.cors = (0, cors_1.default)(exports.config);
exports.default = { cors: exports.cors, config: exports.config };
