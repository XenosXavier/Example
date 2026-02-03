import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from '@mui/material';

interface TodoFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (title: string, description: string) => void;
}

const TodoForm: React.FC<TodoFormProps> = ({ open, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [titleError, setTitleError] = useState(false);

  const handleSubmit = () => {
    // 驗證標題必填
    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    // 提交表單
    onSubmit(title.trim(), description.trim());

    // 重置表單
    setTitle('');
    setDescription('');
    setTitleError(false);
    onClose();
  };

  const handleClose = () => {
    // 重置表單
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
      <DialogTitle>新增 Todo</DialogTitle>
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
          新增
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TodoForm;
