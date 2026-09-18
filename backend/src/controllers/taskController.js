const prisma = require('../config/prisma');

const getTasks = async (req, res) => {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(tasks);
  } catch (error) {
    console.error('Get tasks failed:', error.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
};

const createTask = async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: description || null
      }
    });

    res.status(201).json(task);
  } catch (error) {
    console.error('Create task failed:', error.message);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

const updateTask = async (req, res) => {
  const taskId = Number(req.params.id);
  const { title, description, completed } = req.body;

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const updatedTask = await prisma.task.update({
      where: { id: taskId },
      data: {
        title: title.trim(),
        description: description || null,
        completed: Boolean(completed)
      }
    });

    res.json(updatedTask);
  } catch (error) {
    console.error('Update task failed:', error.message);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

const deleteTask = async (req, res) => {
  const taskId = Number(req.params.id);

  if (!Number.isInteger(taskId)) {
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    const existingTask = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    await prisma.task.delete({
      where: { id: taskId }
    });

    res.status(204).send();
  } catch (error) {
    console.error('Delete task failed:', error.message);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};