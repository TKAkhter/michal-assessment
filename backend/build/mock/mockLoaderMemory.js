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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadMockLibrary = void 0;
let mockLibraryCache = null;
const REPO_URL = process.env.MOCK_LIBRARY_RAW_PATH || "https://raw.githubusercontent.com/TKAkhter/michal-assessment-mockLibrary";
const loadMockLibrary = (version) => __awaiter(void 0, void 0, void 0, function* () {
    if (mockLibraryCache && mockLibraryCache.version === version) {
        return mockLibraryCache.library;
    }
    const response = yield fetch(`${REPO_URL}/refs/heads/${version}/mockLibrary.js`);
    const jsCode = yield response.text();
    mockLibraryCache = {
        version,
        library: eval(jsCode),
    };
    return mockLibraryCache.library;
});
exports.loadMockLibrary = loadMockLibrary;
