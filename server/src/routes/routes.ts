import { Router } from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { trpcRouter } from "../trpc/trpc.route";
import { createContext } from "../trpc/trpc.context";

export const apiRoutes = Router();

apiRoutes.use("/trpc", createExpressMiddleware({ router: trpcRouter, createContext }));
