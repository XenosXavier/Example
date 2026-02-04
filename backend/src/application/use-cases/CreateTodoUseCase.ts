import { v4 as uuidv4 } from 'uuid';
import type { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import { TodoEntity } from '../../domain/entities/Todo';
import type { Todo } from '../../domain/entities/Todo';

/**
 * 建立 Todo 請求資料
 */
export interface CreateTodoRequest {
  title: string;
  description: string;
}

/**
 * 建立 Todo Use Case
 */
export class CreateTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(request: CreateTodoRequest): Promise<Todo> {
    // 使用 TodoEntity 驗證業務規則並建立實體
    const todoEntity = TodoEntity.create({
      id: uuidv4(), // 產生 UUID
      title: request.title,
      description: request.description,
      createdTime: Date.now(), // 產生時間戳記
    });

    // 儲存到 Repository
    return await this.todoRepository.create(todoEntity.toJSON());
  }
}
