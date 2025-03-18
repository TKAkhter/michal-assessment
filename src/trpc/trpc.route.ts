import { initTRPC } from "@trpc/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import { Context } from "./trpc.context";
import { loadMockLibrary } from "../mock/mockLoader";
import { generateToken } from "@/common/jwt/jwt";

const t = initTRPC.context<Context>().create();

export const trpcRouter = t.router({
  auth: t.router({
    register: t.procedure
      .input(z.object({ name: z.string(), email: z.string().email(), password: z.string().min(6) }))
      .mutation(async ({ input, ctx }) => {
        const hashedPassword = await bcrypt.hash(input.password, 10);
        const user = await ctx.prisma.users.create({
          data: { name: input.name, email: input.email, password: hashedPassword },
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
      .mutation(({ input }) => {
        const lib = loadMockLibrary(input.version);
        const data = lib[input.method as keyof typeof lib]();
        return { [input.method]: data };
      }),
  }),
});

export type TrpcRouter = typeof trpcRouter;
