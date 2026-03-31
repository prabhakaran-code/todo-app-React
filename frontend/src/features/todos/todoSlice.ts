import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TodoType } from "../../types/todo";

type TodoState = {
  todos: TodoType[];
};

const initialState: TodoState = {
  todos: []
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    setTodos: (state, action: PayloadAction<TodoType[]>) => {
      state.todos = action.payload;
    },

    addTodo: (state, action: PayloadAction<TodoType>) => {
      state.todos.unshift(action.payload);
    },

    updateTodo: (state, action: PayloadAction<TodoType>) => {
      const index = state.todos.findIndex(
        (t) => t.id === action.payload.id
      );
      if (index !== -1) {
        state.todos[index] = action.payload;
      }
    },

    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
    },

    toggleComplete: (state, action: PayloadAction<number>) => {
      const todo = state.todos.find(
        (t) => t.id === action.payload
      );
      if (todo) {
        todo.isComplete = !todo.isComplete;
      }
    }
  }
});

export const {
  setTodos,
  addTodo,
  updateTodo,
  removeTodo,
  toggleComplete
} = todoSlice.actions;

export default todoSlice.reducer;