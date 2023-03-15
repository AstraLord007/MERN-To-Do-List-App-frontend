import axios from "axios";
import { useState, useEffect } from "react";

const API_BASE = "http://localhost:4000";

function App() {
    const [todos, setTodos] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewTodo] = useState("");

    useEffect(() => {
        GetTodos();
    },[])

    const GetTodos = async () => {
        try {
            const { data } = await axios.get(API_BASE + "/todos");
            console.log(data);
            setTodos(data);
        }catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const completeTodo = async id => {
        const data = await fetch(API_BASE + "/todo/complete/" + id)
        .then(res => res.json());

        setTodos(todos => todos.map(todo => {
            if (todo._id === data._id) {
                todo.complete = data.complete;
            }
            return todo;
        }));
    }

    const deleteTodo = async (id) => {
        try {
            const { data } = await axios.delete(API_BASE + `/todo/delete/${id} `)
            const newListTodo = todos.filter(todo => todo._id !== data._id);
            setTodos(newListTodo); 
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    const addTodo = async () => {
        try {
            const { data }= await axios.post(API_BASE + "/todo/new", {text: newTodo})
            setTodos([...todos, data]);
            setPopupActive(false);
            setNewTodo("");
        } catch (error) {
            console.log(`Error: ${error.message}`);
        }
    }

    return (
        <div className="App">
            <h1>Welcome, Mauri!</h1>
            <h4>Your Tasks</h4>

            <div className="todos">
                {todos.map(todo => (
                    <div
                        className={"todo " + (todo.complete ? "is-complete" : "")}
                        key={todo._id}
                        onClick={() => completeTodo(todo._id)}
                    >
                        <div className="checkbox"></div>

                        <div className="text">{ todo.text }</div>

                        <div
                            className="delete-todo"
                            onClick={(e) => {
                                e.stopPropagation();
                                deleteTodo(todo._id);
                              }}
                        >
                            x
                        </div>
                    </div>
                ))}
            </div>
            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {popupActive ? (
                <div className="popup">
                    <div
                        className="closePopup"
                        onClick={() => setPopupActive(false)}
                    >
                        x
                    </div>
                    <div className="content">
                        <h3>Add Task</h3>
                        { newTodo }
                        <input
                            type="text"
                            className="add-todo-input"
                            onChange={e => setNewTodo(e.target.value)}
                            value={newTodo}
                        />
                        <div
                            className="button"
                            onClick={addTodo}
                        >
                            Create Task
                        </div>
                    </div>
                </div>
            ) : ''}
        </div>
    );
}

export default App;
