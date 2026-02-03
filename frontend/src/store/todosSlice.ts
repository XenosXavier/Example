import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { todoApi } from '../services/todoApi';

// Todo 介面定義
export interface Todo {
  id: string;
  title: string;
  description: string;
  createdTime: number;
}

// State 介面定義（新增 loading 和 error 狀態）
interface TodosState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
}

// 初始狀態
const initialState: TodosState = {
  todos: [],
  loading: false,
  error: null,
};

// === Async Thunks ===

/**
 * 取得所有 todos
 */
export const fetchTodos = createAsyncThunk('todos/fetchAll', async () => {
  const todos = await todoApi.getAll();
  return todos;
});

/**
 * 建立新 todo
 */
export const createTodoAsync = createAsyncThunk(
  'todos/create',
  async (todoData: { title: string; description: string }) => {
    const todo = await todoApi.create(todoData);
    return todo;
  }
);

/**
 * 更新 todo
 */
export const updateTodoAsync = createAsyncThunk(
  'todos/update',
  async (params: { id: string; title: string; description: string }) => {
    const { id, title, description } = params;
    const todo = await todoApi.update(id, { title, description });
    return todo;
  }
);

/**
 * 刪除 todo
 */
export const deleteTodoAsync = createAsyncThunk(
  'todos/delete',
  async (id: string) => {
    await todoApi.delete(id);
    return id; // 返回 id 以便從 state 中移除
  }
);

// === Slice ===
const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // 清除錯誤訊息
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // === fetchTodos ===
    builder
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = action.payload;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch todos';
      });

    // === createTodoAsync ===
    builder
      .addCase(createTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.todos.unshift(action.payload); // 新 todo 放在最前面
      })
      .addCase(createTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create todo';
      });

    // === updateTodoAsync ===
    builder
      .addCase(updateTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.todos.findIndex((todo) => todo.id === action.payload.id);
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
      })
      .addCase(updateTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update todo';
      });

    // === deleteTodoAsync ===
    builder
      .addCase(deleteTodoAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTodoAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      })
      .addCase(deleteTodoAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete todo';
      });
  },
});

// 匯出 actions
export const { clearError } = todosSlice.actions;

// 匯出 reducer
export default todosSlice.reducer;
