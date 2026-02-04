import { z } from 'zod';

/**
 * 更新 Todo 的 Zod Schema
 * 定義請求資料的驗證規則
 */
export const UpdateTodoSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must not exceed 200 characters'),
  description: z
    .string()
    .max(1000, 'Description must not exceed 1000 characters')
    .default(''),
});

/**
 * 更新 Todo DTO 類型（從 Schema 推斷）
 */
export type UpdateTodoDto = z.infer<typeof UpdateTodoSchema>;
