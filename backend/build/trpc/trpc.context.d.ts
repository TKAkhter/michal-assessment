import { inferAsyncReturnType } from "@trpc/server";
import { PrismaClient } from "@prisma/client";
export declare const createContext: () => {
    prisma: PrismaClient<import(".prisma/client").Prisma.PrismaClientOptions, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
export type Context = inferAsyncReturnType<typeof createContext>;
