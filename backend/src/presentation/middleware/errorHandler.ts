import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

/**
 * 全域錯誤處理中介層
 * 統一處理各種類型的錯誤並轉換為適當的 HTTP 回應
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Zod 驗證錯誤
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
  }

  // 業務邏輯錯誤（從 Use Cases 拋出）
  if (err.message === 'Todo not found') {
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }

  // Domain 層的業務規則錯誤
  if (
    err.message.includes('Title') ||
    err.message.includes('Description') ||
    err.message.includes('cannot be empty') ||
    err.message.includes('must not exceed')
  ) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  // 未預期的錯誤
  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
