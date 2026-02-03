import type { Todo } from '../store/todosSlice';

// API Base URL（從環境變數讀取，預設為 localhost:3000）
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * API 回應格式
 */
interface ApiResponse<T> {
  success: boolean;
  data: T;
}

interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Array<{
    field: string;
    message: string;
  }>;
}

/**
 * 處理 API 錯誤
 */
const handleApiError = async (response: Response): Promise<never> => {
  const error: ApiErrorResponse = await response.json();
  throw new Error(error.message || 'API request failed');
};

/**
 * Todo API 服務
 */
export const todoApi = {
  /**
   * 取得所有 todos
   */
  async getAll(): Promise<Todo[]> {
    const response = await fetch(`${API_BASE_URL}/api/todos`);

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse<Todo[]> = await response.json();
    return data.data;
  },

  /**
   * 建立新 todo
   */
  async create(todo: { title: string; description: string }): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse<Todo> = await response.json();
    return data.data;
  },

  /**
   * 更新 todo
   */
  async update(
    id: string,
    todo: { title: string; description: string }
  ): Promise<Todo> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const data: ApiResponse<Todo> = await response.json();
    return data.data;
  },

  /**
   * 刪除 todo
   */
  async delete(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      await handleApiError(response);
    }
  },
};
