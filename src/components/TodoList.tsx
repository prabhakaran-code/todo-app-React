import { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { TodoType } from "../types/todo";
import { toast } from "react-toastify";
import axios from "axios";

function TodoList() {
  const [todos, setTodos] = useState<TodoType[]>([]);

  // ADD TODO
  const addTodo = async (todo: TodoType) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      toast.error("Todo cannot be empty");
      return;
    }

    const isDuplicate = todos.some(
      (t) => t.text.toLowerCase().trim() === todo.text.toLowerCase().trim()
    );

    if (isDuplicate) {
      toast.error("Duplicate values not allowed");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/todos", {
        text: todo.text,
      });

      setTodos((prev) => [res.data, ...prev]);

      toast.success("Todo added successfully");
    } catch (error) {
      toast.error("Failed to add todo");
      console.log(error);
    }
  };

  // UPDATE TODO
  const updateTodo = async (todoId: number, newValue: TodoType) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      toast.error("Todo cannot be empty");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:5000/api/todos/${todoId}`,
        { text: newValue.text }
      );

      setTodos((prev) =>
        prev.map((item) => (item.id === todoId ? res.data : item))
      );

      toast.success("Todo updated successfully");
    } catch (err) {
      toast.error("Update failed");
      console.log(err);
    }
  };

  // DELETE TODO
  const removeTodo = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      setTodos((prev) => prev.filter((t) => t.id !== id));

      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Delete failed");
      console.log(error);
    }
  };

  // COMPLETE TODO (checkbox / toggle)
  const completeTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, isComplete: !todo.isComplete } : todo
      )
    );
  };

  // FETCH TODOS
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/todos")
      .then((res) => setTodos(res.data))
      .catch(() => toast.error("Failed to fetch todos"));
  }, []);

  return (
    <>
      <h1>What's the Plan for Today?</h1>

      <TodoForm onSubmit={addTodo} />

      <Todo
        todos={todos}
        completeTodo={completeTodo}
        removeTodo={removeTodo}
        updateTodo={updateTodo}
      />
    </>
  );
}

export default TodoList;