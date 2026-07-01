const TaskModel = require("../Models/TaskModel");


const createTask = async (req, res) => {
    try {
        const model = new TaskModel(req.body);
        const data = await model.save();
        res.status(201)
            .json({ message: 'Task is created', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task', success: false });
    }
}

const fetchAllTasks = async (req, res) => {
    try {
        const data = await TaskModel.find({}).lean();
        res.status(200)
            .json({ message: 'All Tasks', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to get all tasks', success: false });
    }
}


const updateTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TaskModel.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).lean();
        if (!data) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200)
            .json({ message: 'Task Updated', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task', success: false });
    }
}


const deleteTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TaskModel.findByIdAndDelete(id).lean();
        if (!data) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200)
            .json({ message: 'Task is deleted', success: true });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task', success: false });
    }
}

const getTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await TaskModel.findById(id).lean();
        if (!data) {
            return res.status(404).json({ message: 'Task not found', success: false });
        }
        res.status(200)
            .json({ message: 'Task found', success: true, data });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch task', success: false });
    }
}

module.exports = {
    createTask,
    fetchAllTasks,
    updateTaskById,
    deleteTaskById,
    getTaskById
}
