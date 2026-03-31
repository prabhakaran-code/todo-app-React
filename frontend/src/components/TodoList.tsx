import { useEffect, useState } from "react";
import TodoForm from "./TodoForm";
import Todo from "./Todo";
import { TodoType } from "../types/todo";
import { toast } from "react-toastify";
import axios from "axios";
import "../app.css";
import ReactPaginate from "react-paginate";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../app/store";
import {
  setTodos,
  addTodo,
  removeTodo,
  updateTodo
} from "../features/todos/todoSlice";



function TodoList() {
  const API = import.meta.env.VITE_API_URL;
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);

  const [filter, setFilter] = useState<"all" | "completed" | "pending">("all");
  const [pageNumber, setPageNumber] = useState(0);

  const todosPerPage = 10;
  const pagesVisited = pageNumber * todosPerPage;

  // ADD TODO
  const addTodoHandler = async (todo: TodoType) => {
    if (!todo.text || /^\s*$/.test(todo.text)) {
      toast.error("Todo cannot be empty");
      return;
    }

    const isDuplicate = todos.some(
      (t) => t.text.toLowerCase().trim() === todo.text.toLowerCase().trim()
    );
.
    if (isDuplicate) {
      toast.error("Duplicate values not allowed");
      return;
    }

    try {
      const res = await axios.post(`${API}/api/todos`,  {
        text: todo.text
      });

      dispatch(addTodo(res.data));

      toast.success("Todo added successfully");
    } catch (error) {
      toast.error("Failed to add todo");
    }
  };

  // UPDATE TODO
  const updateTodoHandler = async (todoId: number, newValue: TodoType) => {
    if (!newValue.text || /^\s*$/.test(newValue.text)) {
      toast.error("Todo cannot be empty");
      return;
    }

    try {
      const res = await axios.put(`${API}/api/todos/${todoId}`,
        { text: newValue.text }
      );

      dispatch(updateTodo(res.data));

      toast.success("Todo updated successfully");
    } catch (err: any) {
      console.log("Update error:", err.response?.data || err.message);
      toast.error("Update failed");
    }
  };

  // DELETE TODO
  const removeTodoHandler = async (id: number) => {
    try {
      await axios.delete(`${API}/api/todos/${id}`);

      dispatch(removeTodo(id));

      toast.success("Todo deleted");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // COMPLETE TODO
  const completeTodo = async (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    try {
      const res = await axios.put(`${API}/api/todos/${id}`,
        {
          text: todo.text,
          isComplete: !todo.isComplete
        }
      );

      dispatch(updateTodo(res.data));
    } catch (err) {
      console.log("Checkbox update error:", err);
      toast.error("Failed to update task status");
    }
  };

  // FETCH TODOS
  useEffect(() => {
   axios.get(`${API}/api/todos`)
      .then((res) => dispatch(setTodos(res.data)))
      .catch(() => toast.error("Failed to fetch todos"));
  }, [dispatch]);

  // FILTER TODOS
  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.isComplete;
    if (filter === "pending") return !todo.isComplete;
    return true;
  });

  // PAGINATION
  const pageCount = Math.ceil(filteredTodos.length / todosPerPage);

  const displayTodos = filteredTodos.slice(
    pagesVisited,
    pagesVisited + todosPerPage
  );

  const changePage = ({ selected }: { selected: number }) => {
    setPageNumber(selected);
  };

  return (
    <>
      <h1>What's the Plan for Today?</h1>

      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed
        </button>

        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending
        </button>
      </div>

      <TodoForm onSubmit={addTodoHandler} />

      <Todo
        todos={displayTodos}
        completeTodo={completeTodo}
        removeTodo={removeTodoHandler}
        updateTodo={updateTodoHandler}
      />

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        pageCount={pageCount}
        onPageChange={changePage}
        containerClassName={"pagination"}
        previousLinkClassName={"pagination-btn"}
        nextLinkClassName={"pagination-btn"}
        disabledClassName={"pagination-disabled"}
        activeClassName={"pagination-active"}
      />
    </>
  );
}

export default TodoList;