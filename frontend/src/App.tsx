import { ToastContainer } from "react-toastify";
import "./App.css";
import TodoList from "./components/TodoList";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="todo-app">
      <ToastContainer position="top-right" />
      <TodoList />
    </div>
  );
}

export default App;