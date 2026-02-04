import 'dotenv/config';
import app from './app';
import { logger } from './infrastructure/logging/logger';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logger.info(`🚀 Server is running on port ${PORT}`);
  logger.info(`📝 API endpoint: http://localhost:${PORT}/api/todos`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
