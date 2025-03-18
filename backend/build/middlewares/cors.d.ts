import corsLibrary from "cors";
import { StatusCodes } from "http-status-codes";
export declare const config: {
    origin: (origin: string | undefined, callback: any) => void;
    optionsSuccessStatus: StatusCodes;
    methods: string;
    credentials: boolean;
    exposedHeaders: string[];
    options: {
        "Access-Control-Allow-Origin": string;
        "Access-Control-Allow-Headers": string;
        "Access-Control-Allow-Methods": string;
    };
};
export declare const cors: (req: corsLibrary.CorsRequest, res: {
    statusCode?: number | undefined;
    setHeader(key: string, value: string): any;
    end(): any;
}, next: (err?: any) => any) => void;
declare const _default: {
    cors: (req: corsLibrary.CorsRequest, res: {
        statusCode?: number | undefined;
        setHeader(key: string, value: string): any;
        end(): any;
    }, next: (err?: any) => any) => void;
    config: {
        origin: (origin: string | undefined, callback: any) => void;
        optionsSuccessStatus: StatusCodes;
        methods: string;
        credentials: boolean;
        exposedHeaders: string[];
        options: {
            "Access-Control-Allow-Origin": string;
            "Access-Control-Allow-Headers": string;
            "Access-Control-Allow-Methods": string;
        };
    };
};
export default _default;
