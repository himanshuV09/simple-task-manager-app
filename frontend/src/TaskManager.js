import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    FaBolt, FaCalendarAlt, FaCheck, FaCheckCircle, FaListUl, FaMoon,
    FaPencilAlt, FaPercent, FaPlus, FaRegClipboard, FaSearch, FaSun,
    FaTimes, FaTrash
} from 'react-icons/fa';
import { ToastContainer } from 'react-toastify';
import { CreateTask, DeleteTaskById, GetAllTasks, UpdateTaskById } from './api';
import {
    formatDate, isOverdue, notify, PRIORITIES, PRIORITY_META, toDateInputValue
} from './utils';

const STATUS_FILTERS = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'completed', label: 'Completed' }
];

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

const getInitialTheme = () => {
    try {
        const saved = window.localStorage.getItem('tm-theme');
        if (saved === 'light' || saved === 'dark') return saved;
    } catch (e) { /* ignore */ }
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        return 'light';
    }
    return 'dark';
};

function TaskManager() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    // form
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [editingId, setEditingId] = useState(null);

    // controls
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created');

    const [confirmId, setConfirmId] = useState(null);
    const [theme, setTheme] = useState(getInitialTheme);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        try { window.localStorage.setItem('tm-theme', theme); } catch (e) { /* ignore */ }
    }, [theme]);

    const fetchAllTasks = useCallback(async () => {
        try {
            const { data } = await GetAllTasks();
            setTasks(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
            notify('Failed to fetch tasks', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAllTasks(); }, [fetchAllTasks]);

    const resetForm = () => {
        setTaskName('');
        setDescription('');
        setPriority('medium');
        setDueDate('');
        setEditingId(null);
    };

    const startEdit = (task) => {
        setEditingId(task._id);
        setTaskName(task.taskName || '');
        setDescription(task.description || '');
        setPriority(task.priority || 'medium');
        setDueDate(toDateInputValue(task.dueDate));
        setConfirmId(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = taskName.trim();
        if (!name) {
            notify('Please enter a task name', 'error');
            return;
        }
        const payload = {
            taskName: name,
            description: description.trim(),
            priority,
            dueDate: dueDate || null
        };
        try {
            const { success, message } = editingId
                ? await UpdateTaskById(editingId, payload)
                : await CreateTask({ ...payload, isDone: false });
            notify(message || (success ? 'Saved' : 'Something went wrong'), success ? 'success' : 'error');
            if (success) {
                resetForm();
                fetchAllTasks();
            }
        } catch (err) {
            console.error(err);
            notify(editingId ? 'Failed to update task' : 'Failed to create task', 'error');
        }
    };

    const handleToggle = useCallback(async (task) => {
        try {
            const { success, message } = await UpdateTaskById(task._id, { isDone: !task.isDone });
            if (!success) notify(message || 'Failed to update task', 'error');
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to update task', 'error');
        }
    }, [fetchAllTasks]);

    const handleDelete = useCallback(async (id) => {
        try {
            const { success, message } = await DeleteTaskById(id);
            notify(message || (success ? 'Task deleted' : 'Failed to delete task'), success ? 'success' : 'error');
            setConfirmId(null);
            if (editingId === id) resetForm();
            fetchAllTasks();
        } catch (err) {
            console.error(err);
            notify('Failed to delete task', 'error');
        }
    }, [fetchAllTasks, editingId]);

    const stats = useMemo(() => {
        const total = tasks.length;
        const completed = tasks.filter((t) => t.isDone).length;
        const active = total - completed;
        const rate = total ? Math.round((completed / total) * 100) : 0;
        return { total, completed, active, rate };
    }, [tasks]);

    const visibleTasks = useMemo(() => {
        const term = search.trim().toLowerCase();
        let list = tasks.filter((t) => {
            if (statusFilter === 'active' && t.isDone) return false;
            if (statusFilter === 'completed' && !t.isDone) return false;
            if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
            if (term) {
                const hay = `${t.taskName || ''} ${t.description || ''}`.toLowerCase();
                if (!hay.includes(term)) return false;
            }
            return true;
        });
        list = [...list].sort((a, b) => {
            switch (sortBy) {
                case 'priority':
                    return (PRIORITY_RANK[a.priority] ?? 3) - (PRIORITY_RANK[b.priority] ?? 3);
                case 'name':
                    return (a.taskName || '').localeCompare(b.taskName || '');
                case 'dueDate': {
                    const av = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
                    const bv = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
                    return av - bv;
                }
                case 'created':
                default: {
                    const av = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const bv = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return bv - av;
                }
            }
        });
        return list;
    }, [tasks, search, statusFilter, priorityFilter, sortBy]);

    const hasFilters = search.trim() || statusFilter !== 'all' || priorityFilter !== 'all';

    return (
        <div className="tm-page">
            <div className="tm-shell">
                {/* Header */}
                <header className="tm-header">
                    <div className="tm-brand">
                        <div className="tm-logo"><FaCheck /></div>
                        <div>
                            <h1 className="tm-title">Task Manager</h1>
                            <p className="tm-subtitle">Stay organized, stay ahead</p>
                        </div>
                    </div>
                    <button
                        className="tm-theme-toggle"
                        onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                        aria-label="Toggle theme"
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? <FaSun /> : <FaMoon />}
                    </button>
                </header>

                {/* Stats */}
                <section className="tm-stats">
                    <div className="tm-stat">
                        <div className="tm-stat-icon total"><FaListUl /></div>
                        <div>
                            <div className="tm-stat-value">{stats.total}</div>
                            <div className="tm-stat-label">Total</div>
                        </div>
                    </div>
                    <div className="tm-stat">
                        <div className="tm-stat-icon active"><FaBolt /></div>
                        <div>
                            <div className="tm-stat-value">{stats.active}</div>
                            <div className="tm-stat-label">Active</div>
                        </div>
                    </div>
                    <div className="tm-stat">
                        <div className="tm-stat-icon done"><FaCheckCircle /></div>
                        <div>
                            <div className="tm-stat-value">{stats.completed}</div>
                            <div className="tm-stat-label">Completed</div>
                        </div>
                    </div>
                    <div className="tm-stat">
                        <div className="tm-stat-icon rate"><FaPercent /></div>
                        <div>
                            <div className="tm-stat-value">{stats.rate}%</div>
                            <div className="tm-stat-label">Done</div>
                        </div>
                    </div>
                </section>

                {/* Progress */}
                <section className="tm-card tm-progress">
                    <div className="tm-progress-head">
                        <span className="tm-progress-label">Overall progress</span>
                        <span className="tm-progress-pct">{stats.completed}/{stats.total || 0}</span>
                    </div>
                    <div className="tm-progress-track">
                        <div className="tm-progress-fill" style={{ width: `${stats.rate}%` }} />
                    </div>
                </section>

                {/* Form */}
                <form className="tm-card tm-form" onSubmit={handleSubmit}>
                    <div className="tm-form-head">
                        {editingId
                            ? <><FaPencilAlt className="tm-editing" /> <span className="tm-editing">Edit task</span></>
                            : <><FaPlus /> <span>Add a new task</span></>}
                    </div>
                    <div className="tm-form-grid">
                        <div className="tm-field">
                            <label className="tm-label">Task</label>
                            <input
                                className="tm-input"
                                type="text"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                placeholder="What needs to be done?"
                            />
                        </div>
                        <div className="tm-field">
                            <label className="tm-label">Priority</label>
                            <select
                                className="tm-select"
                                value={priority}
                                onChange={(e) => setPriority(e.target.value)}
                            >
                                {PRIORITIES.map((p) => (
                                    <option key={p} value={p}>{PRIORITY_META[p].label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="tm-field">
                            <label className="tm-label">Due date</label>
                            <input
                                className="tm-input"
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="tm-field">
                        <label className="tm-label">Description <span style={{ textTransform: 'none' }}>(optional)</span></label>
                        <textarea
                            className="tm-textarea"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Add more details..."
                            rows={2}
                        />
                    </div>
                    <div className="tm-form-actions">
                        <button type="submit" className="tm-btn tm-btn-primary">
                            {editingId ? <><FaCheck /> Save changes</> : <><FaPlus /> Add task</>}
                        </button>
                        {editingId && (
                            <button type="button" className="tm-btn tm-btn-ghost" onClick={resetForm}>
                                <FaTimes /> Cancel
                            </button>
                        )}
                    </div>
                </form>

                {/* Toolbar */}
                <section className="tm-toolbar">
                    <div className="tm-search">
                        <FaSearch className="tm-search-icon" />
                        <input
                            className="tm-search-input"
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search tasks..."
                        />
                    </div>
                    <div className="tm-segment">
                        {STATUS_FILTERS.map((f) => (
                            <button
                                key={f.key}
                                className={`tm-segment-btn ${statusFilter === f.key ? 'active' : ''}`}
                                onClick={() => setStatusFilter(f.key)}
                                type="button"
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                    <select
                        className="tm-select tm-sort"
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        aria-label="Filter by priority"
                    >
                        <option value="all">All priorities</option>
                        {PRIORITIES.map((p) => (
                            <option key={p} value={p}>{PRIORITY_META[p].label} priority</option>
                        ))}
                    </select>
                    <select
                        className="tm-select tm-sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        aria-label="Sort tasks"
                    >
                        <option value="created">Newest first</option>
                        <option value="dueDate">Due date</option>
                        <option value="priority">Priority</option>
                        <option value="name">Name (A–Z)</option>
                    </select>
                </section>

                {/* List */}
                {loading ? (
                    <div className="tm-list">
                        <div className="tm-skeleton" />
                        <div className="tm-skeleton" />
                        <div className="tm-skeleton" />
                    </div>
                ) : visibleTasks.length === 0 ? (
                    <div className="tm-empty">
                        <div className="tm-empty-icon"><FaRegClipboard /></div>
                        <div className="tm-empty-title">
                            {hasFilters ? 'No matching tasks' : 'No tasks yet'}
                        </div>
                        <div className="tm-empty-text">
                            {hasFilters
                                ? 'Try adjusting your search or filters.'
                                : 'Add your first task using the form above.'}
                        </div>
                    </div>
                ) : (
                    <div className="tm-list">
                        {visibleTasks.map((task) => {
                            const meta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
                            const overdue = isOverdue(task.dueDate, task.isDone);
                            return (
                                <div
                                    key={task._id}
                                    className={`tm-item ${task.isDone ? 'done' : ''} ${overdue ? 'overdue' : ''}`}
                                >
                                    <button
                                        className={`tm-checkbox ${task.isDone ? 'checked' : ''}`}
                                        onClick={() => handleToggle(task)}
                                        title={task.isDone ? 'Mark as active' : 'Mark as done'}
                                        type="button"
                                    >
                                        {task.isDone && <FaCheck />}
                                    </button>

                                    <div className="tm-item-body">
                                        <div className="tm-item-name">{task.taskName}</div>
                                        {task.description && (
                                            <div className="tm-item-desc">{task.description}</div>
                                        )}
                                        <div className="tm-item-meta">
                                            <span className={`tm-pill ${meta.className}`}>{meta.label}</span>
                                            {task.dueDate && (
                                                <span className={`tm-chip ${overdue ? 'due-over' : ''}`}>
                                                    <FaCalendarAlt />
                                                    {overdue ? 'Overdue · ' : ''}{formatDate(task.dueDate)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="tm-item-actions">
                                        {confirmId === task._id ? (
                                            <div className="tm-confirm">
                                                <span className="tm-confirm-text">Delete?</span>
                                                <button
                                                    className="tm-icon-btn danger"
                                                    onClick={() => handleDelete(task._id)}
                                                    title="Confirm delete"
                                                    type="button"
                                                >
                                                    <FaCheck />
                                                </button>
                                                <button
                                                    className="tm-icon-btn"
                                                    onClick={() => setConfirmId(null)}
                                                    title="Cancel"
                                                    type="button"
                                                >
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <button
                                                    className="tm-icon-btn edit"
                                                    onClick={() => startEdit(task)}
                                                    title="Edit task"
                                                    type="button"
                                                >
                                                    <FaPencilAlt />
                                                </button>
                                                <button
                                                    className="tm-icon-btn delete"
                                                    onClick={() => setConfirmId(task._id)}
                                                    title="Delete task"
                                                    type="button"
                                                >
                                                    <FaTrash />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <ToastContainer
                position="top-right"
                autoClose={2500}
                hideProgressBar={false}
                theme={theme}
            />
        </div>
    );
}

export default TaskManager;
