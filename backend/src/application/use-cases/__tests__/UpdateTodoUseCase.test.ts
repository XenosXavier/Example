import { UpdateTodoUseCase } from '../UpdateTodoUseCase';
import type { ITodoRepository } from '../../../domain/repositories/ITodoRepository';
import type { Todo } from '../../../domain/entities/Todo';
import { NotFoundError, BusinessRuleError } from '../../../domain/errors/AppErrors';

describe('UpdateTodoUseCase', () => {
  let mockRepository: jest.Mocked<ITodoRepository>;
  let useCase: UpdateTodoUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new UpdateTodoUseCase(mockRepository);
  });

  describe('成功案例', () => {
    it('應該成功更新存在的 todo', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      const updateRequest = {
        title: 'New Title',
        description: 'New Description',
      };

      const updatedTodo: Todo = {
        ...existingTodo,
        ...updateRequest,
      };

      mockRepository.findById.mockResolvedValue(existingTodo);
      mockRepository.update.mockResolvedValue(updatedTodo);

      const result = await useCase.execute('test-id', updateRequest);

      expect(result.title).toBe('New Title');
      expect(result.description).toBe('New Description');
      expect(result.createdTime).toBe(1000); // createdTime 應保持不變
      expect(mockRepository.findById).toHaveBeenCalledWith('test-id');
      expect(mockRepository.update).toHaveBeenCalledWith('test-id', updateRequest);
    });

    it('應該自動 trim 標題和描述', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      const updateRequest = {
        title: '  New Title  ',
        description: '  New Description  ',
      };

      mockRepository.findById.mockResolvedValue(existingTodo);
      mockRepository.update.mockResolvedValue({
        ...existingTodo,
        title: 'New Title',
        description: 'New Description',
      });

      await useCase.execute('test-id', updateRequest);

      expect(mockRepository.update).toHaveBeenCalledWith(
        'test-id',
        expect.objectContaining({
          title: '  New Title  ', // UseCase 傳遞原始值，trim 在 Entity 中處理
          description: '  New Description  ',
        })
      );
    });
  });

  describe('失敗案例', () => {
    it('應該在 todo 不存在時拋出 NotFoundError', async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(
        useCase.execute('non-existent-id', {
          title: 'New Title',
          description: 'New Description',
        })
      ).rejects.toThrow(NotFoundError);
      await expect(
        useCase.execute('non-existent-id', {
          title: 'New Title',
          description: 'New Description',
        })
      ).rejects.toThrow('Todo not found');

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('應該在更新失敗時拋出 NotFoundError', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      mockRepository.findById.mockResolvedValue(existingTodo);
      mockRepository.update.mockResolvedValue(null);

      await expect(
        useCase.execute('test-id', {
          title: 'New Title',
          description: 'New Description',
        })
      ).rejects.toThrow(NotFoundError);
    });

    it('應該拒絕空的標題', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      mockRepository.findById.mockResolvedValue(existingTodo);

      await expect(
        useCase.execute('test-id', {
          title: '',
          description: 'New Description',
        })
      ).rejects.toThrow(BusinessRuleError);
      await expect(
        useCase.execute('test-id', {
          title: '',
          description: 'New Description',
        })
      ).rejects.toThrow('Title cannot be empty');

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('應該拒絕超過 200 字元的標題', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      mockRepository.findById.mockResolvedValue(existingTodo);

      await expect(
        useCase.execute('test-id', {
          title: 'a'.repeat(201),
          description: 'New Description',
        })
      ).rejects.toThrow(BusinessRuleError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('應該拒絕超過 1000 字元的描述', async () => {
      const existingTodo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      mockRepository.findById.mockResolvedValue(existingTodo);

      await expect(
        useCase.execute('test-id', {
          title: 'New Title',
          description: 'a'.repeat(1001),
        })
      ).rejects.toThrow(BusinessRuleError);

      expect(mockRepository.update).not.toHaveBeenCalled();
    });
  });
});
