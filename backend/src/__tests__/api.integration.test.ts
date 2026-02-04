import request from 'supertest';
import app from '../app';

describe('Todo API Integration Tests', () => {
  describe('POST /api/todos', () => {
    it('應該成功創建新的 todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'Integration Test Todo',
          description: 'This is an integration test',
        })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.title).toBe('Integration Test Todo');
      expect(response.body.data.description).toBe('This is an integration test');
      expect(response.body.data).toHaveProperty('createdTime');
    });

    it('應該拒絕空的標題', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: '',
          description: 'Test Description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('應該拒絕超過 200 字元的標題', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          title: 'a'.repeat(201),
          description: 'Test Description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('應該拒絕缺少 title 欄位的請求', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({
          description: 'Test Description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/todos', () => {
    beforeAll(async () => {
      // 創建測試數據
      await request(app).post('/api/todos').send({
        title: 'Todo 1',
        description: 'Description 1',
      });

      await request(app).post('/api/todos').send({
        title: 'Todo 2',
        description: 'Description 2',
      });
    });

    it('應該返回所有 todos', async () => {
      const response = await request(app).get('/api/todos').expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('應該返回正確的 todo 結構', async () => {
      const response = await request(app).get('/api/todos').expect(200);

      const todo = response.body.data[0];
      expect(todo).toHaveProperty('id');
      expect(todo).toHaveProperty('title');
      expect(todo).toHaveProperty('description');
      expect(todo).toHaveProperty('createdTime');
    });
  });

  describe('PUT /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'Original Title',
        description: 'Original Description',
      });
      todoId = response.body.data.id;
    });

    it('應該成功更新 todo', async () => {
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Title');
      expect(response.body.data.description).toBe('Updated Description');
    });

    it('應該在 todo 不存在時返回 404', async () => {
      const response = await request(app)
        .put('/api/todos/00000000-0000-0000-0000-000000000000')
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
        })
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('應該在 UUID 格式無效時返回 400', async () => {
      const response = await request(app)
        .put('/api/todos/invalid-uuid')
        .send({
          title: 'Updated Title',
          description: 'Updated Description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid UUID');
    });

    it('應該拒絕空的標題', async () => {
      const response = await request(app)
        .put(`/api/todos/${todoId}`)
        .send({
          title: '',
          description: 'Updated Description',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId: string;

    beforeEach(async () => {
      const response = await request(app).post('/api/todos').send({
        title: 'To Be Deleted',
        description: 'This will be deleted',
      });
      todoId = response.body.data.id;
    });

    it('應該成功刪除 todo', async () => {
      const response = await request(app)
        .delete(`/api/todos/${todoId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.message).toContain('deleted successfully');

      // 確認 todo 已被刪除
      await request(app).delete(`/api/todos/${todoId}`).expect(404);
    });

    it('應該在 todo 不存在時返回 404', async () => {
      const response = await request(app)
        .delete('/api/todos/00000000-0000-0000-0000-000000000000')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });

    it('應該在 UUID 格式無效時返回 400', async () => {
      const response = await request(app)
        .delete('/api/todos/invalid-uuid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid UUID');
    });
  });

  describe('404 處理', () => {
    it('應該在路由不存在時返回 404', async () => {
      const response = await request(app).get('/api/non-existent').expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('not found');
    });
  });

  describe('CORS', () => {
    it('應該包含 CORS headers', async () => {
      const response = await request(app).get('/api/todos');

      expect(response.headers['access-control-allow-origin']).toBeDefined();
    });
  });
});
