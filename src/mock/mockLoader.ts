import { execSync } from "child_process";
import path from "path";
import fs from "fs";
import { env } from "@/config/env";

const REPO_URL = env.MOCK_LIBRARY_PATH;
const LIB_PATH = path.join(__dirname, "mockLibrary");
const VERSION_FILE = path.join(LIB_PATH, "version.txt");

export const loadMockLibrary = (version: "v1" | "v2") => {
  if (fs.existsSync(LIB_PATH) && fs.existsSync(VERSION_FILE)) {
    const currentVersion = fs.readFileSync(VERSION_FILE, "utf-8").trim();
    if (currentVersion === version) {
      // eslint-disable-next-line global-require
      return require(path.join(LIB_PATH, "MockLibrary.js")); // eslint-disable-line @typescript-eslint/no-require-imports
    }
  }

  if (fs.existsSync(LIB_PATH)) {
    fs.rmSync(LIB_PATH, { recursive: true, force: true });
  }

  execSync(`git clone --depth=1 --branch=${version} ${REPO_URL} ${LIB_PATH}`);

  fs.writeFileSync(VERSION_FILE, version, "utf-8");

  const mockLibraryPath = path.join(LIB_PATH, "MockLibrary.js");
  // eslint-disable-next-line prefer-reflect
  delete require.cache[require.resolve(mockLibraryPath)];
  // eslint-disable-next-line global-require
  return require(mockLibraryPath); // eslint-disable-line @typescript-eslint/no-require-imports
};
