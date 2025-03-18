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
exports.trpcRouter = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const bcrypt_1 = __importDefault(require("bcrypt"));
const mockLoader_1 = require("../mock/mockLoader");
const jwt_1 = require("../common/jwt/jwt");
const t = server_1.initTRPC.context().create();
exports.trpcRouter = t.router({
    auth: t.router({
        register: t.procedure
            .input(zod_1.z.object({ name: zod_1.z.string(), email: zod_1.z.string().email(), password: zod_1.z.string().min(6) }))
            .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input, ctx }) {
            const hashedPassword = yield bcrypt_1.default.hash(input.password, 10);
            const user = yield ctx.prisma.users.create({
                data: { name: input.name, email: input.email, password: hashedPassword },
            });
            return user;
        })),
        login: t.procedure
            .input(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string() }))
            .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ input, ctx }) {
            const user = yield ctx.prisma.users.findUnique({ where: { email: input.email } });
            if (!user || !(yield bcrypt_1.default.compare(input.password, user.password))) {
                throw new Error("Invalid credentials");
            }
            const token = (0, jwt_1.generateToken)(user);
            return { token };
        })),
    }),
    mock: t.router({
        useVersion: t.procedure
            .input(zod_1.z.object({ version: zod_1.z.enum(["v1", "v2"]) }))
            .mutation(({ input }) => {
            (0, mockLoader_1.loadMockLibrary)(input.version);
            return { version: input.version };
        }),
        callMethod: t.procedure
            .input(zod_1.z.object({ version: zod_1.z.enum(["v1", "v2"]), method: zod_1.z.string() }))
            .mutation(({ input }) => {
            const lib = (0, mockLoader_1.loadMockLibrary)(input.version);
            const data = lib[input.method]();
            return { [input.method]: data };
        }),
    }),
});
