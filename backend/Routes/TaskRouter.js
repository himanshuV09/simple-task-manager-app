const { createTask, fetchAllTasks, updateTaskById, deleteTaskById, getTaskById } = require('../Controllers/TaskController');

const router = require('express').Router();

// To get all the tasks
router.get('/', fetchAllTasks);

// To create a task
router.post('/', createTask);

// To update a task
router.put('/:id', updateTaskById);

// To delete a task
router.delete('/:id', deleteTaskById);

router.get('/:id', getTaskById);

module.exports = router;