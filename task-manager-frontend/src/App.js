import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'pending' });
  const [editingTask, setEditingTask] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTask({ ...newTask, [name]: value });
  };

  const handleAddTask = async () => {
    try {
      const response = await axios.post('http://localhost:5000/tasks', newTask);
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'pending' });
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleEditTask = async () => {
    try {
      const response = await axios.put(`http://localhost:5000/tasks/${editingTask.id}`, editingTask);
      const updatedTasks = tasks.map((task) =>
        task.id === editingTask.id ? response.data : task
      );
      setTasks(updatedTasks);
      setIsEditing(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>
      <div className="form">
        <input
          type="text"
          name="title"
          value={isEditing ? editingTask.title : newTask.title}
          onChange={isEditing ? (e) => setEditingTask({ ...editingTask, title: e.target.value }) : handleInputChange}
          placeholder="Title"
        />
        <input
          type="text"
          name="description"
          value={isEditing ? editingTask.description : newTask.description}
          onChange={isEditing ? (e) => setEditingTask({ ...editingTask, description: e.target.value }) : handleInputChange}
          placeholder="Description"
        />
        <select
          name="status"
          value={isEditing ? editingTask.status : newTask.status}
          onChange={isEditing ? (e) => setEditingTask({ ...editingTask, status: e.target.value }) : handleInputChange}
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={isEditing ? handleEditTask : handleAddTask}>
          {isEditing ? 'Save Changes' : 'Add Task'}
        </button>
      </div>

      <h2>Task List</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <button onClick={() => { setEditingTask(task); setIsEditing(true); }}>Edit</button>
            <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
