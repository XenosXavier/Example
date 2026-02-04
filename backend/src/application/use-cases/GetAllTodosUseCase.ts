import type { ITodoRepository } from '../../domain/repositories/ITodoRepository';
import type { Todo } from '../../domain/entities/Todo';

/**
 * 取得所有 Todos Use Case
 */
export class GetAllTodosUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(): Promise<Todo[]> {
    const todos = await this.todoRepository.findAll();
    // 按 createdTime 降序排列（新的在前）
    return todos.sort((a, b) => b.createdTime - a.createdTime);
  }
}
