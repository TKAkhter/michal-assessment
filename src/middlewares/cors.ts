import corsLibrary from "cors";
import { StatusCodes } from "http-status-codes";
import { env } from "@/config/env";
import { logger } from "@/common/winston/winston";

const allowedOrigins = (env.ALLOW_ORIGIN || "").split(",");

/**
 * CORS configuration to check allowed origins and set the appropriate headers
 *
 * Params:
 * - origin (string | undefined): Origin of the request, or undefined if not present.
 * - callback (function): Callback to confirm if origin is allowed or not.
 *
 * Response:
 * - Calls the callback with null and true if origin is allowed, otherwise calls callback with an error.
 */
export const config = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  origin: (origin: string | undefined, callback: any) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn("Origin not allowed by CORS", { origin });

      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: StatusCodes.OK,
  methods: "GET,HEAD,OPTIONS,PUT,POST,DELETE",
  credentials: true,
  exposedHeaders: ["Content-Type", "set-cookie"],
  options: {
    "Access-Control-Allow-Origin": env.ALLOW_ORIGIN || "*",
    "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
    "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,PUT,POST,DELETE",
  },
};

// Initialize the CORS middleware with the configured settings
export const cors = corsLibrary(config);

export default { cors, config };
