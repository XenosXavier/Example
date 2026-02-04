import type { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import type { Todo } from '../../domain/entities/Todo';

/**
 * 記憶體內 Todo Repository 實作
 * 使用陣列儲存資料在記憶體中
 */
export class InMemoryTodoRepository implements ITodoRepository {
  private todos: Todo[] = [];

  /**
   * 取得所有 todos
   * 返回副本以避免外部直接修改內部資料
   */
  async findAll(): Promise<Todo[]> {
    return [...this.todos];
  }

  /**
   * 根據 ID 查找 todo
   */
  async findById(id: string): Promise<Todo | null> {
    const todo = this.todos.find((t) => t.id === id);
    return todo ? { ...todo } : null;
  }

  /**
   * 建立新 todo
   */
  async create(todo: Todo): Promise<Todo> {
    const newTodo = { ...todo };
    this.todos.push(newTodo);
    return { ...newTodo };
  }

  /**
   * 更新 todo
   */
  async update(id: string, updates: Partial<Todo>): Promise<Todo | null> {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return null;
    }

    // 更新 todo（合併更新的欄位）
    this.todos[index] = {
      ...this.todos[index],
      ...updates,
    };

    return { ...this.todos[index] };
  }

  /**
   * 刪除 todo
   */
  async delete(id: string): Promise<boolean> {
    const index = this.todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return false;
    }

    this.todos.splice(index, 1);
    return true;
  }
}
