import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Todo } from '../store/todosSlice';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit, onDelete }) => {
  // 格式化建立時間
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" component="div" gutterBottom>
          {todo.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {todo.description}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography variant="caption" color="text.secondary">
            建立時間：
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {formatDate(todo.createdTime)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
        <IconButton
          size="small"
          color="primary"
          onClick={() => onEdit(todo)}
          aria-label="編輯"
        >
          <EditIcon />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => onDelete(todo.id)}
          aria-label="刪除"
        >
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default TodoItem;
