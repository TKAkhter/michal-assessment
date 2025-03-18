import { inferAsyncReturnType } from "@trpc/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export const createContext = () => ({ prisma });

export type Context = inferAsyncReturnType<typeof createContext>;
