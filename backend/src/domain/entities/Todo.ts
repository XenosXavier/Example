// Todo 介面定義
export interface Todo {
  id: string;
  title: string;
  description: string;
  createdTime: number;
}

// Todo 實體類別（包含業務規則驗證）
export class TodoEntity {
  private constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly description: string,
    public readonly createdTime: number
  ) {}

  /**
   * 工廠方法：建立 Todo 實體
   * 包含業務規則驗證
   */
  static create(params: {
    id: string;
    title: string;
    description: string;
    createdTime: number;
  }): TodoEntity {
    // 業務規則驗證
    if (!params.title || params.title.trim().length === 0) {
      throw new Error('Title cannot be empty');
    }

    if (params.title.length > 200) {
      throw new Error('Title must not exceed 200 characters');
    }

    if (params.description.length > 1000) {
      throw new Error('Description must not exceed 1000 characters');
    }

    return new TodoEntity(
      params.id,
      params.title.trim(),
      params.description.trim(),
      params.createdTime
    );
  }

  /**
   * 轉換為普通物件
   */
  toJSON(): Todo {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdTime: this.createdTime,
    };
  }
}
