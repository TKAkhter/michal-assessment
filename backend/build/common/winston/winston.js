"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.morganStream = exports.logger = exports.winstonLogger = void 0;
require("winston-daily-rotate-file");
const winston_1 = require("winston");
const http_status_codes_1 = require("http-status-codes");
const fs_1 = __importDefault(require("fs"));
const safe_1 = __importDefault(require("colors/safe"));
require("winston-mongodb");
const isWinstonEnabled = process.env.ENABLE_WINSTON === "1";
const logsDirectory = process.env.LOGS_DIRECTORY || "";
const logsType = process.env.LOGS_TYPE;
const timeZone = process.env.TZ;
const logsFileDuration = process.env.LOG_FILE_DURATION;
const mongodbURI = process.env.MONGODB_URI || "";
if (!fs_1.default.existsSync(logsDirectory) && isWinstonEnabled && logsType !== "mongodb") {
    fs_1.default.mkdirSync(logsDirectory);
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const formatConsoleMetaData = (metadata) => {
    if (!metadata) {
        return "";
    }
    // Extract common properties
    const { code, message, meta, name, response, details, status } = metadata;
    // Use details as a fallback for missing properties in metadata
    const resolvedDetails = details || {};
    return {
        details: {
            code: code || resolvedDetails.code || null,
            message: message || resolvedDetails.message || null,
            meta: Object.assign({}, (meta || resolvedDetails.meta || {})),
            data: Object.assign({}, ((response === null || response === void 0 ? void 0 : response.data) || (resolvedDetails === null || resolvedDetails === void 0 ? void 0 : resolvedDetails.data) || {})),
            status: (response === null || response === void 0 ? void 0 : response.status) || (resolvedDetails === null || resolvedDetails === void 0 ? void 0 : resolvedDetails.status) || status || null,
            statusText: (response === null || response === void 0 ? void 0 : response.statusText) || (resolvedDetails === null || resolvedDetails === void 0 ? void 0 : resolvedDetails.statusText) || null,
            name: name || resolvedDetails.name || null,
        },
    };
};
// NestJS-like console log format
const consoleFormat = winston_1.format.combine(winston_1.format.colorize({ all: true }), 
// eslint-disable-next-line @typescript-eslint/no-explicit-any
winston_1.format.printf((_a) => {
    var _b;
    var { level, message, timestamp } = _a, meta = __rest(_a, ["level", "message", "timestamp"]);
    const metadata = meta && Object.keys(meta).length ? JSON.stringify(meta, null, 2) : "";
    return `[${safe_1.default.cyan(timestamp)} ${timeZone}] ${level}: ${(_b = meta.loggedUser) !== null && _b !== void 0 ? _b : ""} ${message} ${metadata}`;
}));
const fileFormat = winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.json());
const createMongoTransport = () => new winston_1.transports.MongoDB({
    db: mongodbURI,
    dbName: process.env.NODE_ENV,
    collection: process.env.MONGODB_ERROR_COLLECTION_NAME,
    level: "error",
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.json()),
});
const createDailyRotateTransport = (level) => new winston_1.transports.DailyRotateFile({
    filename: `${level}-%DATE%.log`,
    dirname: logsDirectory,
    datePattern: "YYYY-MM-DD",
    level,
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: logsFileDuration,
    format: winston_1.format.combine(
    // eslint-disable-next-line no-extra-parens
    (0, winston_1.format)((info) => (info.level === level ? info : false))(), // eslint-disable multiline-ternary
    fileFormat),
});
const logLevels = {
    levels: {
        error: 0,
        warn: 1,
        http: 2,
        info: 3,
        debug: 4,
    },
    colors: {
        error: "red",
        warn: "yellow",
        info: "green",
        http: "blue",
        debug: "magenta",
    },
};
const transportsList = [];
if (isWinstonEnabled) {
    transportsList.push(new winston_1.transports.Console({ level: "info", format: consoleFormat }));
    if (logsType === "mongodb") {
        transportsList.push(createMongoTransport());
    }
    else {
        transportsList.push(createDailyRotateTransport("info"));
        transportsList.push(createDailyRotateTransport("error"));
    }
}
exports.winstonLogger = (0, winston_1.createLogger)({
    levels: logLevels.levels,
    format: winston_1.format.combine(winston_1.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston_1.format.errors({ stack: true }), winston_1.format.splat(), winston_1.format.align()),
    transports: transportsList,
});
// Export logger functions with fallback to console logs if disabled
exports.logger = isWinstonEnabled
    ? {
        // eslint-disable-next-line no-confusing-arrow
        info: (message, metadata) => exports.winstonLogger.info(message, metadata), // eslint-disable-line multiline-ternary
        // eslint-disable-next-line no-confusing-arrow
        debug: (message, metadata) => exports.winstonLogger.debug(message, metadata), // eslint-disable-line multiline-ternary
        warn: (message, metadata) => exports.winstonLogger.warn(message, metadata),
        // eslint-disable-next-line no-confusing-arrow
        http: (message, metadata) => exports.winstonLogger.http(message, metadata), // eslint-disable-line multiline-ternary
        error: (message, metadata) => exports.winstonLogger.error(message, metadata),
    }
    : {
        // eslint-disable-next-line no-confusing-arrow
        info: (message, metadata) => console.log(safe_1.default.green(message), metadata !== null && metadata !== void 0 ? metadata : ""), // eslint-disable-line multiline-ternary
        // eslint-disable-next-line no-confusing-arrow
        debug: (message, metadata) => console.log(safe_1.default.magenta(message), metadata !== null && metadata !== void 0 ? metadata : ""), // eslint-disable-line multiline-ternary
        warn: (message, metadata) => console.log(safe_1.default.yellow(message), metadata !== null && metadata !== void 0 ? metadata : ""),
        // eslint-disable-next-line no-confusing-arrow
        http: (message, metadata) => console.log(safe_1.default.blue(message), metadata !== null && metadata !== void 0 ? metadata : ""), // eslint-disable-line multiline-ternary
        error: (message, metadata) => { var _a; return console.log(safe_1.default.red(message), (_a = formatConsoleMetaData(metadata)) !== null && _a !== void 0 ? _a : ""); },
    };
exports.morganStream = {
    write: (message) => {
        const statusCode = parseInt(message.split(" ")[2], 10);
        if (statusCode >= http_status_codes_1.StatusCodes.BAD_REQUEST) {
            exports.logger.warn(message.trim());
        }
        else {
            exports.logger.http(message.trim());
        }
    },
};
