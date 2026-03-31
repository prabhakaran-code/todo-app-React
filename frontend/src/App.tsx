import { ToastContainer } from "react-toastify";
import "./App.css";
import TodoList from "./components/TodoList";

function App() {
  return (
    <div className="todo-app">
      <ToastContainer position="top-right" />
      <TodoList />
    </div>
  );
}

export default App;