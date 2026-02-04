import type { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoEntity } from '../../domain/entities/Todo';
import type { Todo } from '../../domain/entities/Todo';

/**
 * 更新 Todo 請求資料
 */
export interface UpdateTodoRequest {
  title: string;
  description: string;
}

/**
 * 更新 Todo Use Case
 */
export class UpdateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string, request: UpdateTodoRequest): Promise<Todo> {
    // 檢查 todo 是否存在
    const existingTodo = await this.todoRepository.findById(id);
    if (!existingTodo) {
      throw new Error('Todo not found');
    }

    // 使用 TodoEntity 驗證業務規則
    TodoEntity.create({
      id: existingTodo.id,
      title: request.title,
      description: request.description,
      createdTime: existingTodo.createdTime, // 保持原有的 createdTime
    });

    // 更新 todo（保持 createdTime 不變）
    const updatedTodo = await this.todoRepository.update(id, {
      title: request.title,
      description: request.description,
    });

    if (!updatedTodo) {
      throw new Error('Failed to update todo');
    }

    return updatedTodo;
  }
}
