import type { Request, Response, NextFunction } from 'express';
import { logger } from '../../infrastructure/logging/logger';

/**
 * HTTP 請求日誌 middleware
 * 記錄所有 HTTP 請求的詳細信息
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const startTime = Date.now();

  // 監聽響應完成事件
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logData = {
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('user-agent') || 'unknown',
      ip: req.ip || req.connection.remoteAddress,
    };

    const logMessage = `${req.method} ${req.url} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 500) {
      logger.error(logMessage, logData);
    } else if (res.statusCode >= 400) {
      logger.warn(logMessage, logData);
    } else {
      logger.http(logMessage, logData);
    }
  });

  next();
};
