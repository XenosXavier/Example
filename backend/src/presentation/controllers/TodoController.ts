import type { Request, Response } from 'express';
import { GetAllTodosUseCase } from '../../application/use-cases/GetAllTodosUseCase';
import { CreateTodoUseCase } from '../../application/use-cases/CreateTodoUseCase';
import { UpdateTodoUseCase } from '../../application/use-cases/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '../../application/use-cases/DeleteTodoUseCase';
import { ResponseHelper } from '../utils/responseHelper';
import { asyncHandler } from '../middleware/asyncHandler';

/**
 * Todo Controller
 * 處理 HTTP 請求並協調 Use Cases
 */
export class TodoController {
  constructor(
    private readonly getAllTodosUseCase: GetAllTodosUseCase,
    private readonly createTodoUseCase: CreateTodoUseCase,
    private readonly updateTodoUseCase: UpdateTodoUseCase,
    private readonly deleteTodoUseCase: DeleteTodoUseCase
  ) {}

  /**
   * GET /api/todos - 取得所有 todos
   */
  getAllTodos = asyncHandler(async (req: Request, res: Response) => {
    const todos = await this.getAllTodosUseCase.execute();
    return ResponseHelper.success(res, todos);
  });

  /**
   * POST /api/todos - 建立新 todo
   */
  createTodo = asyncHandler(async (req: Request, res: Response) => {
    const todo = await this.createTodoUseCase.execute(req.body);
    return ResponseHelper.success(res, todo, 201);
  });

  /**
   * PUT /api/todos/:id - 更新 todo
   */
  updateTodo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const todo = await this.updateTodoUseCase.execute(id, req.body);
    return ResponseHelper.success(res, todo);
  });

  /**
   * DELETE /api/todos/:id - 刪除 todo
   */
  deleteTodo = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    await this.deleteTodoUseCase.execute(id);
    return ResponseHelper.success(res, { message: 'Todo deleted successfully' });
  });
}
