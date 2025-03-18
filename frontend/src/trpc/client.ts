import { createTRPCReact } from "@trpc/react-query";
import { TrpcRouter } from "../../../backend/src/trpc/trpc.route";

export const trpc = createTRPCReact<TrpcRouter>(); 