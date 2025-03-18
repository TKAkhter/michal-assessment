"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = require("./middlewares/cors");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const winston_1 = require("./common/winston/winston");
const express_slow_down_1 = require("express-slow-down");
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const morgan_1 = __importDefault(require("morgan"));
const nocache_1 = __importDefault(require("nocache"));
const node_path_1 = __importDefault(require("node:path"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const response_time_1 = __importDefault(require("response-time"));
const connect_timeout_1 = __importDefault(require("connect-timeout"));
const app = (0, express_1.default)();
// Set the trust proxy to handle X-Forwarded-For correctly
app.set("trust proxy", 1);
// Middlewares
app.use(helmet_1.default.crossOriginResourcePolicy({
    policy: "cross-origin",
}));
// Additional Security Headers
app.use((_, res, next) => {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    res.setHeader("X-Frame-Options", "DENY");
    res.setHeader("X-XSS-Protection", "1; mode=block");
    // Cross-Domain Policy
    res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
    res.setHeader("X-Download-Options", "noopen");
    // Feature Policy
    res.setHeader("Feature-Policy", "geolocation 'none'; microphone 'none'; camera 'none';");
    // Expect-CT Header
    res.setHeader("Expect-CT", "enforce, max-age=30");
    next();
});
winston_1.logger.info("Additional security headers set");
// Rate limiting middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 500, // Limit each IP to 500 requests per windowMs
    message: {
        success: false,
        message: "Too many requests, please try again later.",
    },
    headers: true,
});
// Slow down requests from a single IP to prevent abuse
const speedLimiter = (0, express_slow_down_1.slowDown)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    delayAfter: 1000, // Allow 1000 requests, then start delaying
    delayMs: (hits) => hits * 500, // Add a 500ms delay per request above 1000
});
// Apply middlewares
app.use(cors_1.cors); // Make sure this middleware is defined properly
winston_1.logger.info("CORS middleware applied");
app.use((0, cookie_parser_1.default)());
if (process.env.ENABLE_WINSTON === "1") {
    app.use((0, morgan_1.default)("dev", { stream: winston_1.morganStream }));
}
else {
    app.use((0, morgan_1.default)("dev"));
}
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, compression_1.default)());
app.use((0, nocache_1.default)()); // Prevent caching
app.use((0, hpp_1.default)());
app.use(limiter);
winston_1.logger.info("Rate limiting middleware applied");
app.use(speedLimiter);
winston_1.logger.info("Speed limiting middleware applied");
// Response Time Middleware
app.use((0, response_time_1.default)());
winston_1.logger.info("Response time middleware applied");
// Timeout Middleware
app.use((0, connect_timeout_1.default)(process.env.SERVER_TIMEOUT || "150s")); // Set a 150-second timeout for all routes
winston_1.logger.info("Timeout middleware applied"); // Log timeout middleware
// Permissions Policy
winston_1.logger.info("Permissions policy applied"); // Log permissions policy setup
app.use((_, res, next) => {
    res.append("Permissions-Policy", "browsing-topics=()");
    next();
});
// Routes
app.use("/logs", express_1.default.static(node_path_1.default.join(__dirname, "../logs")));
winston_1.logger.info("Logs routes set up");
app.use("/api", routes_1.apiRoutes);
winston_1.logger.info("API routes set up");
// Catch 404 and forward to error handler
app.use((_, res) => {
    winston_1.logger.warn("Route not found");
    res.status(404).send("Route not found");
});
exports.default = app;
