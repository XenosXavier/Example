import type { Request, Response, NextFunction } from 'express';

/**
 * 非同步錯誤處理包裝器
 * 自動捕捉 async/await 函數中的錯誤並傳遞給錯誤處理中介層
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
