"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["local", "development", "test", "production"]).default("local"),
    TZ: zod_1.z.string().default("UTC"),
    BASE_URL: zod_1.z.string().url(),
    BASE_URL_HTTPS: zod_1.z.string().url().optional(),
    PORT: zod_1.z.string().transform((val) => parseInt(val, 10)),
    SERVER_TIMEOUT: zod_1.z.string().default("150s"),
    LOG_FILE_DURATION: zod_1.z.string().default("3d"),
    ALLOW_ORIGIN: zod_1.z.string(),
    APP_URL: zod_1.z.string().url(),
    LOGS_DIRECTORY: zod_1.z.string(),
    BP_GENERATED_PASSWORD_LENGTH: zod_1.z.string().default("10"),
    // Basic Auth Secrets
    JWT_SECRET: zod_1.z.string(),
    JWT_SECRET_EXPIRATION: zod_1.z.string().default("1d"),
    HASH: zod_1.z.string().transform((val) => parseInt(val, 10)),
    MONGODB_URI: zod_1.z.string().url(),
    ENABLE_WINSTON: zod_1.z.enum(["0", "1"]).default("0"),
    ENABLE_LOGS: zod_1.z.enum(["0", "1"]).default("0"),
    ENABLE_ERROR_LOGS: zod_1.z.enum(["0", "1"]).default("0"),
    LOGS_TYPE: zod_1.z.enum(["mongodb", "directory"]).default("mongodb"),
    MONGODB_ERROR_COLLECTION_NAME: zod_1.z.string(),
    MONGODB_MEMORY_LIMIT: zod_1.z.string().default("512"),
    MOCK_LIBRARY_PATH: zod_1.z.string().optional(),
});
exports.env = envSchema.parse(process.env);
