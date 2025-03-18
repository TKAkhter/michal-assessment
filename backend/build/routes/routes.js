"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiRoutes = void 0;
const express_1 = require("express");
const express_2 = require("@trpc/server/adapters/express");
const trpc_route_1 = require("../trpc/trpc.route");
const trpc_context_1 = require("../trpc/trpc.context");
exports.apiRoutes = (0, express_1.Router)();
exports.apiRoutes.use("/trpc", (0, express_2.createExpressMiddleware)({ router: trpc_route_1.trpcRouter, createContext: trpc_context_1.createContext }));
