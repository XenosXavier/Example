import type { Todo } from '../entities/Todo';

/**
 * Todo Repository 介面
 * 定義資料存取的抽象方法（不依賴具體實作）
 */
export interface ITodoRepository {
  /**
   * 取得所有 todos
   */
  findAll(): Promise<Todo[]>;

  /**
   * 根據 ID 查找 todo
   */
  findById(id: string): Promise<Todo | null>;

  /**
   * 建立新 todo
   */
  create(todo: Todo): Promise<Todo>;

  /**
   * 更新 todo
   */
  update(id: string, todo: Partial<Todo>): Promise<Todo | null>;

  /**
   * 刪除 todo
   */
  delete(id: string): Promise<boolean>;
}
