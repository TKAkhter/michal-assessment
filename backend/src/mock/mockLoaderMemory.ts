let mockLibraryCache: any = null;
const REPO_URL = process.env.MOCK_LIBRARY_RAW_PATH || "https://raw.githubusercontent.com/TKAkhter/michal-assessment-mockLibrary";

export const loadMockLibrary = async (version: "v1" | "v2") => {
    if (mockLibraryCache && mockLibraryCache.version === version) {
        return mockLibraryCache.library;
    }

    const response = await fetch(`${REPO_URL}/refs/heads/${version}/mockLibrary.js`);
    const jsCode = await response.text();

    mockLibraryCache = {
        version,
        library: eval(jsCode),
    };

    return mockLibraryCache.library;
};