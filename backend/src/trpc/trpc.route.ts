import { initTRPC } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Context } from "./trpc.context";
import { loadMockLibrary } from "../mock/mockLoaderMemory";
import { generateToken } from "../common/jwt/jwt";
import { v4 as uuidv4 } from 'uuid';

const t = initTRPC.context<Context>().create();

export const trpcRouter = t.router({
  auth: t.router({
    register: t.procedure
      .input(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
      .mutation(async ({ input, ctx }) => {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await ctx.prisma.users.create({
          data: { name: input.name, email: input.email, password: hashedPassword, username: input.email },
        });
        return user;
      }),

    login: t.procedure
      .input(z.object({ email: z.string().email(), password: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const user = await ctx.prisma.users.findUnique({ where: { email: input.email } });
        if (!user || !(await bcrypt.compare(input.password, user.password))) {
          throw new Error("Invalid credentials");
        }
        const token = generateToken(user);
        return { token };
      }),
  }),

  mock: t.router({
    useVersion: t.procedure
      .input(z.object({ version: z.enum(["v1", "v2"]) }))
      .mutation(({ input }) => {
        loadMockLibrary(input.version);
        return { version: input.version };
      }),

    callMethod: t.procedure
      .input(z.object({ version: z.enum(["v1", "v2"]), method: z.string() }))
      .mutation(async ({ input }) => {
        const lib = await loadMockLibrary(input.version);
        const data = lib[input.method as keyof typeof lib]();
        return { [input.method]: data };
      }),
    all: t.procedure
      .input(z.object({ version: z.enum(["v1", "v2"]) }))
      .mutation(async ({ input }) => {
        const lib = await loadMockLibrary(input.version);
        if (input.version === "v1") {
          return {
            version: input.version,
            connection: lib.connection.toString(),
            disconnection: lib.disconnection.toString(),
            connected: lib.connected.toString(),
            readBatteryStatus: lib.readBatteryStatus.toString(),
          };
        }
        return {
          version: input.version,
          connect: lib.connect.toString(),
          disconnect: lib.disconnect.toString(),
          isConnected: lib.isConnected.toString(),
          batteryStatus: lib.batteryStatus.toString(),
        };
      }),
  }),
});

export type TrpcRouter = typeof trpcRouter;
