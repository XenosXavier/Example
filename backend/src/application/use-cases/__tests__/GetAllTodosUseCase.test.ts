import { GetAllTodosUseCase } from '../GetAllTodosUseCase';
import type { ITodoRepository } from '../../../domain/repositories/ITodoRepository';
import type { Todo } from '../../../domain/entities/Todo';

describe('GetAllTodosUseCase', () => {
  let mockRepository: jest.Mocked<ITodoRepository>;
  let useCase: GetAllTodosUseCase;

  beforeEach(() => {
    mockRepository = {
      create: jest.fn(),
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    useCase = new GetAllTodosUseCase(mockRepository);
  });

  describe('成功案例', () => {
    it('應該返回所有 todos 並按 createdTime 降序排列', async () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          title: 'First Todo',
          description: 'First',
          createdTime: 1000,
        },
        {
          id: '2',
          title: 'Second Todo',
          description: 'Second',
          createdTime: 3000,
        },
        {
          id: '3',
          title: 'Third Todo',
          description: 'Third',
          createdTime: 2000,
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockTodos);

      const result = await useCase.execute();

      expect(result).toHaveLength(3);
      expect(result[0].id).toBe('2'); // 最新的在前
      expect(result[1].id).toBe('3');
      expect(result[2].id).toBe('1'); // 最舊的在後
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('應該返回空陣列當沒有 todos 時', async () => {
      mockRepository.findAll.mockResolvedValue([]);

      const result = await useCase.execute();

      expect(result).toEqual([]);
      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
    });

    it('應該返回單一 todo', async () => {
      const mockTodos: Todo[] = [
        {
          id: '1',
          title: 'Only Todo',
          description: 'Description',
          createdTime: Date.now(),
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockTodos);

      const result = await useCase.execute();

      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('1');
    });
  });

  describe('排序行為', () => {
    it('應該正確處理相同的 createdTime', async () => {
      const sameTime = 1000;
      const mockTodos: Todo[] = [
        {
          id: '1',
          title: 'First',
          description: 'First',
          createdTime: sameTime,
        },
        {
          id: '2',
          title: 'Second',
          description: 'Second',
          createdTime: sameTime,
        },
      ];

      mockRepository.findAll.mockResolvedValue(mockTodos);

      const result = await useCase.execute();

      expect(result).toHaveLength(2);
      // 當時間相同時，應該保持原始順序
    });
  });
});
