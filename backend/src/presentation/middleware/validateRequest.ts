import type { Request, Response, NextFunction } from 'express';
import type { ZodSchema } from 'zod';

/**
 * 請求資料驗證中介層
 * 使用 Zod schema 驗證請求 body
 */
export const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // 驗證並解析請求 body
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      // 將驗證錯誤傳遞給錯誤處理中介層
      next(error);
    }
  };
};
