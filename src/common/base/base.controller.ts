import { NextFunction, Response } from "express";
import { BaseService } from "@/common/base/base.services";
import { CustomRequest } from "@/types/request";
import { logger } from "../winston/winston";
import { StatusCodes } from "http-status-codes";
import createHttpError from "http-errors";
import { csvBufferToJson, csvToJson } from "@/utils/csv-to-json";
import { createResponse } from "@/utils/create-response";

export class BaseController<T, TCreateDto, TUpdateDto> {
  public collectionName: string;
  protected baseService: BaseService<T, TCreateDto, TUpdateDto>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(model: any, collectionName: string, ignoreFields?: Record<string, boolean>) {
    this.collectionName = collectionName;
    this.baseService = new BaseService<T, TCreateDto, TUpdateDto>(
      model,
      collectionName,
      ignoreFields,
    );
  }

  /**
   * Get all entities objects
   * @param _req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON list of entities
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getAll = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      logger.info(`[${this.collectionName} Controller] Fetching all ${this.collectionName}`);
      const data = await this.baseService.getAll();

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `[${this.collectionName} Controller] Error fetching all ${this.collectionName}`,
          {
            error: error.message,
          },
        );
      }
      next(error);
    }
  };

  /**
   * Get entity by ID
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON entity object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { id } = req.params;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Fetching ${this.collectionName} by ID`, {
        loggedUser,
        id,
      });
      const data = await this.baseService.getById(id);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `[${this.collectionName} Controller] Error fetching ${this.collectionName} by ID`,
          {
            error: error.message,
            loggedUser,
            id,
          },
        );
      }
      next(error);
    }
  };

  /**
   * Get entity by ID
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON entity object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getByUuid = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { uuid } = req.params;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Fetching ${this.collectionName} by uuid`, {
        loggedUser,
        uuid,
      });
      const data = await this.baseService.getByUuid(uuid);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `[${this.collectionName} Controller] Error fetching ${this.collectionName} by uuid`,
          {
            error: error.message,
            loggedUser,
            uuid,
          },
        );
      }
      next(error);
    }
  };

  /**
   * Get entity by email
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON entity object
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getByEmail = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { email } = req.params;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Fetching ${this.collectionName} by email`, {
        loggedUser,
        email,
      });
      const data = await this.baseService.getByEmail(email);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `[${this.collectionName} Controller] Error fetching ${this.collectionName} by email`,
          {
            error: error.message,
            loggedUser,
            email,
          },
        );
      }
      next(error);
    }
  };

  /**
   * Find entities by query (pagination, sorting, filtering)
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON result of the query
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  findByQuery = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      const { paginate, orderBy, filter } = req.body;
      const queryOptions = { paginate, orderBy, filter };
      logger.info(`[${this.collectionName} Controller] Finding ${this.collectionName} by query`, {
        queryOptions,
      });

      const data = await this.baseService.findByQuery(queryOptions);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(
          `[${this.collectionName} Controller] Error finding ${this.collectionName} by query`,
          {
            error: error.message,
          },
        );
      }
      next(error);
    }
  };

  /**
   * Create a new entity
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON created entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const createDto = req.body;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Creating new ${this.collectionName}`, {
        loggedUser,
        createDto,
      });
      const created = await this.baseService.create(createDto);
      return res.json(createResponse({ data: created, status: StatusCodes.CREATED }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error creating ${this.collectionName}`, {
          error: error.message,
          loggedUser,
          createDto,
        });
      }
      next(error);
    }
  };

  /**
   * Update an existing entity
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON updated entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  update = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { uuid } = req.params;
    const updateDto = req.body;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Updating ${this.collectionName}`, {
        loggedUser,
        uuid,
        updateDto,
      });
      const updated = await this.baseService.update(uuid, updateDto);
      return res.json(createResponse({ data: updated }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error updating ${this.collectionName}`, {
          error: error.message,
          loggedUser,
          uuid,
          updateDto,
        });
      }
      next(error);
    }
  };

  /**
   * Delete a entity by ID
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON success message
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { uuid } = req.params;
    const { loggedUser } = req;
    try {
      logger.info(`[${this.collectionName} Controller] Deleting ${this.collectionName} by uuid`, {
        loggedUser,
        uuid,
      });
      const data = await this.baseService.delete(uuid);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error deleting ${this.collectionName}`, {
          error: error.message,
          loggedUser,
          uuid,
        });
      }
      next(error);
    }
  };

  /**
   * Delete multiple entities
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON success message
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  deleteMany = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { uuids } = req.body;
    const { loggedUser } = req;
    try {
      if (!Array.isArray(uuids) || uuids.length === 0) {
        throw createHttpError(StatusCodes.BAD_REQUEST, "Invalid or empty array of uuids", {
          resource: this.collectionName,
        });
      }

      logger.info(`[${this.collectionName} Controller] Deleting multiple ${this.collectionName}`, {
        loggedUser,
        uuids,
      });
      const data = await this.baseService.deleteMany(uuids);

      return res.json(createResponse({ data }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error deleting ${this.collectionName}`, {
          error: error.message,
          loggedUser,
          uuids,
        });
      }
      next(error);
    }
  };

  /**
   * Import entities
   * @param req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON created entity
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  import = async (req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    const { loggedUser, file } = req;
    if (!file) {
      return next(createHttpError(StatusCodes.BAD_REQUEST, "No file uploaded."));
    }
    try {
      logger.info(`[${this.collectionName} Controller] Importing new ${this.collectionName}`, {
        loggedUser,
      });
      let importEntries;

      if (file.buffer) {
        importEntries = await csvBufferToJson(file.buffer);
      } else {
        importEntries = await csvToJson(file.path);
      }

      const imported = await this.baseService.import(importEntries);

      return res.json(createResponse({ data: imported }));
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error creating ${this.collectionName}`, {
          error: error.message,
          loggedUser,
        });
      }
      next(error);
    }
  };

  /**
   * Export entities
   * @param _req - CustomRequest object
   * @param res - Response object
   * @param next - Next middleware function
   * @returns JSON list of entities
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export = async (_req: CustomRequest, res: Response, next: NextFunction): Promise<any> => {
    try {
      logger.info(`[${this.collectionName} Controller] Exporting ${this.collectionName}`);
      const csv = await this.baseService.export();
      res.setHeader("Content-Type", "text/csv");
      res.attachment(`${this.collectionName}.csv`);
      res.status(StatusCodes.OK).send(csv);
    } catch (error) {
      if (error instanceof Error) {
        logger.warn(`[${this.collectionName} Controller] Error exporting ${this.collectionName}`, {
          error: error.message,
        });
      }
      next(error);
    }
  };
}
