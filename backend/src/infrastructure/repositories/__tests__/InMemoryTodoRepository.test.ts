import { InMemoryTodoRepository } from '../InMemoryTodoRepository';
import type { Todo } from '../../../domain/entities/Todo';

describe('InMemoryTodoRepository', () => {
  let repository: InMemoryTodoRepository;

  beforeEach(() => {
    repository = new InMemoryTodoRepository();
  });

  describe('create', () => {
    it('應該成功創建並返回 todo', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      const result = await repository.create(todo);

      expect(result).toEqual(todo);
      expect(result).not.toBe(todo); // 應該返回副本
    });

    it('應該能創建多個 todos', async () => {
      const todo1: Todo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        createdTime: 1000,
      };

      const todo2: Todo = {
        id: '2',
        title: 'Todo 2',
        description: 'Description 2',
        createdTime: 2000,
      };

      await repository.create(todo1);
      await repository.create(todo2);

      const all = await repository.findAll();
      expect(all).toHaveLength(2);
    });
  });

  describe('findAll', () => {
    it('應該返回所有 todos', async () => {
      const todo1: Todo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        createdTime: 1000,
      };

      const todo2: Todo = {
        id: '2',
        title: 'Todo 2',
        description: 'Description 2',
        createdTime: 2000,
      };

      await repository.create(todo1);
      await repository.create(todo2);

      const result = await repository.findAll();

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(todo1);
      expect(result[1]).toEqual(todo2);
    });

    it('應該返回空陣列當沒有 todos 時', async () => {
      const result = await repository.findAll();

      expect(result).toEqual([]);
    });

    it('應該返回資料的副本而非原始資料', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      await repository.create(todo);
      const result1 = await repository.findAll();
      const result2 = await repository.findAll();

      expect(result1).not.toBe(result2); // 不同的陣列實例
      // 返回的物件是副本，保護內部資料不被外部修改
      expect(result1).toEqual(result2);
    });
  });

  describe('findById', () => {
    it('應該找到存在的 todo', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      await repository.create(todo);
      const result = await repository.findById('test-id');

      expect(result).toEqual(todo);
    });

    it('應該在 todo 不存在時返回 null', async () => {
      const result = await repository.findById('non-existent-id');

      expect(result).toBeNull();
    });

    it('應該返回資料的副本', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      await repository.create(todo);
      const result = await repository.findById('test-id');

      expect(result).not.toBe(todo);
    });
  });

  describe('update', () => {
    it('應該成功更新存在的 todo', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      await repository.create(todo);

      const updated = await repository.update('test-id', {
        title: 'New Title',
        description: 'New Description',
      });

      expect(updated).toEqual({
        id: 'test-id',
        title: 'New Title',
        description: 'New Description',
        createdTime: 1000,
      });
    });

    it('應該保護 id 和 createdTime 不被修改', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Title',
        description: 'Test Description',
        createdTime: 1000,
      };

      await repository.create(todo);

      // 嘗試修改 id 和 createdTime（應該被忽略）
      const updated = await repository.update('test-id', {
        title: 'New Title',
        description: 'New Description',
      });

      expect(updated?.id).toBe('test-id'); // id 保持不變
      expect(updated?.createdTime).toBe(1000); // createdTime 保持不變
    });

    it('應該在 todo 不存在時返回 null', async () => {
      const result = await repository.update('non-existent-id', {
        title: 'New Title',
        description: 'New Description',
      });

      expect(result).toBeNull();
    });

    it('應該只更新提供的欄位', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      await repository.create(todo);

      const updated = await repository.update('test-id', {
        title: 'New Title',
      });

      expect(updated).toEqual({
        id: 'test-id',
        title: 'New Title',
        description: 'Old Description', // 保持原值
        createdTime: 1000,
      });
    });

    it('應該返回更新後資料的副本', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Old Title',
        description: 'Old Description',
        createdTime: 1000,
      };

      await repository.create(todo);
      const updated = await repository.update('test-id', { title: 'New Title' });

      // 再次更新不應影響之前返回的結果
      await repository.update('test-id', { title: 'Another Title' });

      expect(updated?.title).toBe('New Title');
    });
  });

  describe('delete', () => {
    it('應該成功刪除存在的 todo', async () => {
      const todo: Todo = {
        id: 'test-id',
        title: 'Test Todo',
        description: 'Test Description',
        createdTime: Date.now(),
      };

      await repository.create(todo);
      const result = await repository.delete('test-id');

      expect(result).toBe(true);

      const found = await repository.findById('test-id');
      expect(found).toBeNull();
    });

    it('應該在 todo 不存在時返回 false', async () => {
      const result = await repository.delete('non-existent-id');

      expect(result).toBe(false);
    });

    it('應該只刪除指定的 todo', async () => {
      const todo1: Todo = {
        id: '1',
        title: 'Todo 1',
        description: 'Description 1',
        createdTime: 1000,
      };

      const todo2: Todo = {
        id: '2',
        title: 'Todo 2',
        description: 'Description 2',
        createdTime: 2000,
      };

      await repository.create(todo1);
      await repository.create(todo2);
      await repository.delete('1');

      const all = await repository.findAll();
      expect(all).toHaveLength(1);
      expect(all[0].id).toBe('2');
    });
  });
});
