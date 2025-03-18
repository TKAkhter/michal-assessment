import fs from "fs";
import path from "path";
import { logger } from "@/common/winston/winston";

export const deleteFileFromDisk = async (fileName: string) => {
  try {
    const uploadDir = "./uploads";
    const filePath = path.join(uploadDir, fileName);

    if (!fs.existsSync(filePath)) {
      throw new Error("File not found.");
    }

    fs.unlink(filePath, (err) => {
      if (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        logger.warn("Error deleting file:", err as any);
        throw new Error("Failed to delete the file.");
      }

      logger.info(`File deleted successfully: ${filePath}`);
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    logger.warn("Error deleting file:", error);
    throw new Error("Failed to delete the file.");
  }
};
