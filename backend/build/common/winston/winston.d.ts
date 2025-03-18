import "winston-daily-rotate-file";
import { Logger } from "winston";
import "winston-mongodb";
export declare const winstonLogger: Logger;
export declare const logger: {
    info: (message: string, metadata?: Record<string, unknown>) => Logger | null;
    debug: (message: string, metadata?: Record<string, unknown>) => Logger | null;
    warn: (message: string, metadata?: Record<string, unknown>) => Logger;
    http: (message: string, metadata?: Record<string, unknown>) => Logger | null;
    error: (message: string, metadata?: Record<string, unknown>) => Logger;
} | {
    info: (message: string, metadata?: Record<string, unknown>) => void | null;
    debug: (message: string, metadata?: Record<string, unknown>) => void | null;
    warn: (message: string, metadata?: Record<string, unknown>) => void;
    http: (message: string, metadata?: Record<string, unknown>) => void | null;
    error: (message: string, metadata?: Record<string, unknown>) => void;
};
export declare const morganStream: {
    write: (message: string) => void;
};
