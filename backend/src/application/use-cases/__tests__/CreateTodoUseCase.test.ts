import { CreateTodoUseCase } from '../CreateTodoUseCase';
import type { ITodoRepository } from '../../../domain/repositories/ITodoRepository';
import type { Todo } from '../../../domain/entities/Todo';
import { BusinessRuleError } from '../../../domain/errors/AppErrors';

describe('CreateTodoUseCase', () => {
  let mockRepository: jest.Mocked<ITodoRepository>;
  let useCase: CreateTodoUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new CreateTodoUseCase(mockRepository);
  });

  describe('成功案例', () => {
    it('應該成功創建一個有效的 todo', async () => {
      const request = {
        title: 'Test Todo',
        description: 'Test Description',
      };

      const mockCreatedTodo: Todo = {
        id: 'mock-uuid',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      mockRepository.create.mockResolvedValue(mockCreatedTodo);

      const result = await useCase.execute(request);

      expect(result).toEqual(mockCreatedTodo);
      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Todo',
          description: 'Test Description',
        })
      );
    });

    it('應該自動 trim 標題和描述的空白', async () => {
      const request = {
        title: '  Test Todo  ',
        description: '  Test Description  ',
      };

      mockRepository.create.mockResolvedValue({
        id: 'mock-uuid',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      });

      await useCase.execute(request);

      expect(mockRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Test Todo',
          description: 'Test Description',
        })
      );
    });

    it('應該接受空的描述', async () => {
      const request = {
        title: 'Test Todo',
        description: '',
      };

      mockRepository.create.mockResolvedValue({
        id: 'mock-uuid',
        title: 'Test Todo',
        description: '',
        createdTime: Date.now(),
      });

      const result = await useCase.execute(request);

      expect(result.description).toBe('');
    });
  });

  describe('驗證失敗案例', () => {
    it('應該拒絕空的標題', async () => {
      const request = {
        title: '',
        description: 'Test Description',
      };

      await expect(useCase.execute(request)).rejects.toThrow(BusinessRuleError);
      await expect(useCase.execute(request)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('應該拒絕只有空白的標題', async () => {
      const request = {
        title: '   ',
        description: 'Test Description',
      };

      await expect(useCase.execute(request)).rejects.toThrow(BusinessRuleError);
      await expect(useCase.execute(request)).rejects.toThrow('Title cannot be empty');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('應該拒絕超過 200 字元的標題', async () => {
      const request = {
        title: 'a'.repeat(201),
        description: 'Test Description',
      };

      await expect(useCase.execute(request)).rejects.toThrow(BusinessRuleError);
      await expect(useCase.execute(request)).rejects.toThrow('Title must not exceed 200 characters');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it('應該拒絕超過 1000 字元的描述', async () => {
      const request = {
        title: 'Test Todo',
        description: 'a'.repeat(1001),
      };

      await expect(useCase.execute(request)).rejects.toThrow(BusinessRuleError);
      await expect(useCase.execute(request)).rejects.toThrow('Description must not exceed 1000 characters');
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('邊界案例', () => {
    it('應該接受 200 字元的標題（邊界值）', async () => {
      const request = {
        title: 'a'.repeat(200),
        description: 'Test Description',
      };

      mockRepository.create.mockResolvedValue({
        id: 'mock-uuid',
        title: request.title,
        description: request.description,
        createdTime: Date.now(),
      });

      await expect(useCase.execute(request)).resolves.toBeDefined();
    });

    it('應該接受 1000 字元的描述（邊界值）', async () => {
      const request = {
        title: 'Test Todo',
        description: 'a'.repeat(1000),
      };

      mockRepository.create.mockResolvedValue({
        id: 'mock-uuid',
        title: request.title,
        description: request.description,
        createdTime: Date.now(),
      });

      await expect(useCase.execute(request)).resolves.toBeDefined();
    });
  });
});
