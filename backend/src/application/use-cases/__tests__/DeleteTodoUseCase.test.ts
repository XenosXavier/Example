import { DeleteTodoUseCase } from '../DeleteTodoUseCase';
import type { ITodoRepository } from '../../../domain/repositories/ITodoRepository';
import type { Todo } from '../../../domain/entities/Todo';
import { NotFoundError } from '../../../domain/errors/AppErrors';

describe('DeleteTodoUseCase', () => {
  let mockRepository: jest.Mocked<ITodoRepository>;
  let useCase: DeleteTodoUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new DeleteTodoUseCase(mockRepository);
  });

  describe('成功案例', () => {
    it('應該成功刪除存在的 todo', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      mockRepository.findById.mockResolvedValue(existingTodo);
      mockRepository.delete.mockResolvedValue(true);

      const result = await useCase.execute('test-id');

      expect(result).toBe(true);
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.delete).toHaveBeenCalledWith('test-id');
    });
  });

  describe('失敗案例', () => {
    it('應該在 todo 不存在時拋出 NotFoundError', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(useCase.execute('non-existent-id')).rejects.toThrow(NotFoundError);
      await expect(useCase.execute('non-existent-id')).rejects.toThrow('Todo not found');

      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('應該在 findById 失敗時傳播錯誤', async () => {
      const error = new Error('Database error');
      mockRepository.findById.mockRejectedValue(error);

      await expect(useCase.execute('test-id')).rejects.toThrow('Database error');
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });
  });

  describe('驗證行為', () => {
    it('應該在刪除前檢查 todo 是否存在', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      mockRepository.findById.mockResolvedValue(existingTodo);
      mockRepository.delete.mockResolvedValue(true);

      await useCase.execute('test-id');

      const findByIdCalls = mockRepository.findById.mock.calls;
      const deleteCalls = mockRepository.delete.mock.calls;

      // 確保先呼叫 findById 再呼叫 delete
      expect(findByIdCalls.length).toBe(1);
      expect(deleteCalls.length).toBe(1);
    });
  });
});
