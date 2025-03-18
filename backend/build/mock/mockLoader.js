"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMockLibrary = void 0;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const REPO_URL = process.env.MOCK_LIBRARY_PATH || "https://github.com/TKAkhter/michal-assessment-mockLibrary";
const LIB_PATH = path_1.default.join(__dirname, "mockLibrary");
const VERSION_FILE = path_1.default.join(LIB_PATH, "version.txt");
const loadMockLibrary = (version) => {
    if (fs_1.default.existsSync(LIB_PATH) && fs_1.default.existsSync(VERSION_FILE)) {
        const currentVersion = fs_1.default.readFileSync(VERSION_FILE, "utf-8").trim();
        if (currentVersion === version) {
            // eslint-disable-next-line global-require
            return require(path_1.default.join(LIB_PATH, "MockLibrary.js")); // eslint-disable-line @typescript-eslint/no-require-imports
        }
    }
    if (fs_1.default.existsSync(LIB_PATH)) {
        fs_1.default.rmSync(LIB_PATH, { recursive: true, force: true });
    }
    (0, child_process_1.execSync)(`git clone --depth=1 --branch=${version} ${REPO_URL} ${LIB_PATH}`);
    fs_1.default.writeFileSync(VERSION_FILE, version, "utf-8");
    const mockLibraryPath = path_1.default.join(LIB_PATH, "MockLibrary.js");
    // eslint-disable-next-line prefer-reflect
    delete require.cache[require.resolve(mockLibraryPath)];
    // eslint-disable-next-line global-require
    return require(mockLibraryPath); // eslint-disable-line @typescript-eslint/no-require-imports
};
exports.loadMockLibrary = loadMockLibrary;
