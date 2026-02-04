/**
 * 依賴注入容器
 * 負責建立和連接所有層級的物件
 */

// Infrastructure Layer
import { InMemoryTodoRepository } from '../infrastructure/repositories/InMemoryTodoRepository';

// Application Layer
import { GetAllTodosUseCase } from '../application/use-cases/GetAllTodosUseCase';
import { CreateTodoUseCase } from '../application/use-cases/CreateTodoUseCase';
import { UpdateTodoUseCase } from '../application/use-cases/UpdateTodoUseCase';
import { DeleteTodoUseCase } from '../application/use-cases/DeleteTodoUseCase';

// Presentation Layer
import { TodoController } from '../presentation/controllers/TodoController';

// === 建立單例 Repository ===
const todoRepository = new InMemoryTodoRepository();

// === 建立 Use Cases（注入 Repository）===
const getAllTodosUseCase = new GetAllTodosUseCase(todoRepository);
const createTodoUseCase = new CreateTodoUseCase(todoRepository);
const updateTodoUseCase = new UpdateTodoUseCase(todoRepository);
const deleteTodoUseCase = new DeleteTodoUseCase(todoRepository);

// === 建立 Controller（注入所有 Use Cases）===
export const todoController = new TodoController(
  getAllTodosUseCase,
  createTodoUseCase,
  updateTodoUseCase,
  deleteTodoUseCase
);
