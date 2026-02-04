import type { Request, Response, NextFunction } from 'express';
import { validate as uuidValidate } from 'uuid';

/**
 * UUID 驗證中介層
 * 驗證路由參數中的 UUID 格式是否正確
 */
export const validateUuid = (paramName: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const uuid = req.params[paramName];

    if (!uuid) {
      return res.status(400).json({
        success: false,
        message: `Missing ${paramName} parameter`,
      });
    }

    if (!uuidValidate(uuid)) {
      return res.status(400).json({
        success: false,
        message: `Invalid UUID format for ${paramName}`,
      });
    }

    return next();
  };
};
