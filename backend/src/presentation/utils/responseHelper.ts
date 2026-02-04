import type { Response } from 'express';

/**
 * 回應輔助類別
 * 統一 API 回應格式
 */
export class ResponseHelper {
  /**
   * 成功回應
   */
  static success<T>(res: Response, data: T, statusCode = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  /**
   * 錯誤回應
   */
  static error(res: Response, message: string, statusCode = 500): Response {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
