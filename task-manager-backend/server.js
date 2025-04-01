const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Read tasks from the JSON file
const readTasks = () => {
  const tasksData = fs.readFileSync('tasks.json', 'utf-8');
  return JSON.parse(tasksData);
};

// Write tasks to the JSON file
const writeTasks = (tasks) => {
  fs.writeFileSync('tasks.json', JSON.stringify(tasks, null, 2));
};

// API routes

// Get all tasks
app.get('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Add a new task
app.post('/tasks', (req, res) => {
  try {
    const tasks = readTasks();
    const newTask = { id: Date.now().toString(), ...req.body };
    tasks.push(newTask);
    writeTasks(tasks);
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// Update an existing task
app.put('/tasks/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const taskIndex = tasks.findIndex((task) => task.id === req.params.id);
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...req.body };
      writeTasks(tasks);
      res.json(tasks[taskIndex]);
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
  try {
    const tasks = readTasks();
    const updatedTasks = tasks.filter((task) => task.id !== req.params.id);
    writeTasks(updatedTasks);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
