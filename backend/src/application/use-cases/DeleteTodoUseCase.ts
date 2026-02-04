import type { ITodoRepository } from '../../domain/repositories/ITodoRepository';

/**
 * 刪除 Todo Use Case
 */
export class DeleteTodoUseCase {
  constructor(private readonly todoRepository: ITodoRepository) {}

  async execute(id: string): Promise<boolean> {
    // 檢查 todo 是否存在
    const todo = await this.todoRepository.findById(id);
    if (!todo) {
      throw new Error('Todo not found');
    }

    // 刪除 todo
    return await this.todoRepository.delete(id);
  }
}
