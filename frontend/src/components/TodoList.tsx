import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { AppDispatch } from '../store/store';
import {
  Container,
  Fab,
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { RootState } from '../store/store';
import {
  fetchTodos,
  createTodoAsync,
  updateTodoAsync,
  deleteTodoAsync,
  clearError,
} from '../store/todosSlice';
import type { Todo } from '../store/todosSlice';
import TodoItem from './TodoItem';
import TodoForm from './TodoForm';
import TodoDialog from './TodoDialog';

const TodoList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { todos, loading, error } = useSelector((state: RootState) => state.todos);

  // 對話框狀態
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // 初始載入 todos
  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  // 處理新增 todo
  const handleAddTodo = async (title: string, description: string) => {
    await dispatch(createTodoAsync({ title, description }));
  };

  // 處理編輯 todo
  const handleEditTodo = (todo: Todo) => {
    setSelectedTodo(todo);
    setOpenEditDialog(true);
  };

  // 處理更新 todo
  const handleUpdateTodo = async (todo: Todo) => {
    await dispatch(
      updateTodoAsync({
        id: todo.id,
        title: todo.title,
        description: todo.description,
      })
    );
    setOpenEditDialog(false);
    setSelectedTodo(null);
  };

  // 處理刪除 todo
  const handleDeleteTodo = async (id: string) => {
    if (window.confirm('確定要刪除這個 Todo 嗎？')) {
      await dispatch(deleteTodoAsync(id));
    }
  };

  // 關閉錯誤提示
  const handleCloseError = () => {
    dispatch(clearError());
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* 標題 */}
      <Typography
        variant="h3"
        component="h1"
        gutterBottom
        sx={{
          textAlign: 'center',
          mb: 4,
          fontWeight: 'bold',
          color: 'primary.main',
        }}
      >
        Todo List
      </Typography>

      {/* Loading 狀態 */}
      {loading && todos.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Todo 列表 */}
          {todos.length === 0 ? (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
              }}
            >
              <Typography variant="h6" color="text.secondary">
                目前沒有任何 Todo
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                點擊右下角的按鈕新增一個吧！
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 3,
              }}
            >
              {todos.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onEdit={handleEditTodo}
                  onDelete={handleDeleteTodo}
                />
              ))}
            </Box>
          )}
        </>
      )}

      {/* 浮動新增按鈕 */}
      <Fab
        color="primary"
        aria-label="add"
        disabled={loading}
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
        }}
        onClick={() => setOpenAddDialog(true)}
      >
        <AddIcon />
      </Fab>

      {/* 新增 Todo 對話框 */}
      <TodoForm
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSubmit={handleAddTodo}
      />

      {/* 編輯 Todo 對話框 */}
      <TodoDialog
        open={openEditDialog}
        todo={selectedTodo}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedTodo(null);
        }}
        onSubmit={handleUpdateTodo}
      />

      {/* 錯誤提示 Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default TodoList;
