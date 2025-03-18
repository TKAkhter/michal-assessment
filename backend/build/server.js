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
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const winston_1 = require("./common/winston/winston");
const prisma_1 = require("./config/prisma/prisma");
const { PORT, NODE_ENV, BASE_URL, ALLOW_ORIGIN } = process.env;
/**
 * Function to check the connection status for Redis, and MongoDB.
 * Logs the success or failure of each connection check.
 */
function checkConnections() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            winston_1.logger.info("Checking database connections...");
            yield (0, prisma_1.connectPrisma)();
            winston_1.logger.info("Prisma connections verified successfully.");
        }
        catch (error) {
            if (error instanceof Error) {
                winston_1.logger.warn("MongoDB, or Redis connection failed", { error: error.message });
            }
            else {
                winston_1.logger.warn("Unknown error occurred during connection checks");
            }
            // eslint-disable-next-line no-process-exit
            process.exit(1); // Exit the process if any connection check fails
        }
    });
}
/**
 * Function to start the server and handle termination signals (SIGINT, SIGTERM).
 * Logs the server status on startup and graceful shutdown.
 */
checkConnections().then(() => {
    const server = app_1.default.listen(PORT || 5000, () => winston_1.logger.info(`Server running on PORT: ${PORT}, ==> ENV: ${NODE_ENV}, ==> API: ${BASE_URL}, ==> ALLOW_ORIGIN: ${ALLOW_ORIGIN}`));
    // Graceful shutdown logic
    const onCloseSignal = () => __awaiter(void 0, void 0, void 0, function* () {
        winston_1.logger.info("SIGTERM signal received. Closing server...");
        // Close Express server
        server.close(() => {
            winston_1.logger.info("HTTP server closed.");
            // eslint-disable-next-line no-process-exit
            process.exit(); // Ensure the process exits after server closure
        });
    });
    process.on("SIGINT", onCloseSignal); // Gracefully handle SIGINT (Ctrl+C or control+C)
    process.on("SIGTERM", onCloseSignal); // Gracefully handle SIGTERM (from Docker, etc.)
});
