import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';

// 配置 Redux store
export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

// 定義 RootState 類型 - 從 store 本身推斷
export type RootState = ReturnType<typeof store.getState>;

// 定義 AppDispatch 類型
export type AppDispatch = typeof store.dispatch;
