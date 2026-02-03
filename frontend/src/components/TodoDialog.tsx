import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';
import type { Todo } from '../store/todosSlice';

interface TodoDialogProps {
  open: boolean;
  todo: Todo | null;
  onClose: () => void;
  onSubmit: (todo: Todo) => void;
}

const TodoDialog: React.FC<TodoDialogProps> = ({ open, todo, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState(false);

  // 當 todo 改變時更新表單
  useEffect(() => {
    if (todo) {
      setTitle(todo.title);
      setDescription(todo.description);
      setTitleError(false);
    }
  }, [todo]);

  const handleSubmit = () => {
    // 驗證標題必填
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    // 提交更新
    if (todo) {
      onSubmit({
        ...todo,
        title: title.trim(),
        description: description.trim(),
      });
    }

    handleClose();
  };

  const handleClose = () => {
    setTitle('');
    setDescription('');
    setTitleError(false);
    onClose();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (titleError && e.target.value.trim()) {
      setTitleError(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>編輯 Todo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="標題"
          type="text"
          fullWidth
          required
          value={title}
          onChange={handleTitleChange}
          error={titleError}
          helperText={titleError ? '標題為必填欄位' : ''}
          sx={{ mb: 2 }}
        />
        <TextField
          margin="dense"
          label="描述"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} color="inherit">
          取消
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          儲存
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoDialog;
