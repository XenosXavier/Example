import { Router } from 'express';
import { todoController } from '../../di/container';
import { validateRequest } from '../middleware/validateRequest';
import { CreateTodoSchema } from '../dto/CreateTodoDto';
import { UpdateTodoSchema } from '../dto/UpdateTodoDto';

const router = Router();

// GET /api/todos - 取得所有 todos
router.get('/todos', todoController.getAllTodos);

// POST /api/todos - 建立新 todo
router.post('/todos', validateRequest(CreateTodoSchema), todoController.createTodo);

// PUT /api/todos/:id - 更新 todo
router.put('/todos/:id', validateRequest(UpdateTodoSchema), todoController.updateTodo);

// DELETE /api/todos/:id - 刪除 todo
router.delete('/todos/:id', todoController.deleteTodo);

export default router;
