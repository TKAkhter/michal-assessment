import { createTRPCReact } from "@trpc/react-query";
import { TrpcRouter } from "../../../server/src/trpc/trpc.route";

export const trpc = createTRPCReact<TrpcRouter>(); 