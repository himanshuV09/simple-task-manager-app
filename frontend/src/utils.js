import { toast } from 'react-toastify';

export const notify = (message, type = 'info') => {
    if (toast[type]) {
        toast[type](message);
    } else {
        toast(message);
    }
};

export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export const PRIORITIES = ['low', 'medium', 'high'];

export const PRIORITY_META = {
    low: { label: 'Low', className: 'low' },
    medium: { label: 'Medium', className: 'medium' },
    high: { label: 'High', className: 'high' }
};

// value: an ISO date string coming from the API. Returns a short, human label.
export const formatDate = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
};

// A due date is "overdue" only when it is in the past and the task is not done.
export const isOverdue = (value, isDone) => {
    if (!value || isDone) return false;
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
};

// Turn an ISO date into the yyyy-mm-dd value an <input type="date"> expects.
export const toDateInputValue = (value) => {
    if (!value) return '';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return '';
    const offset = d.getTimezoneOffset();
    const local = new Date(d.getTime() - offset * 60 * 1000);
    return local.toISOString().slice(0, 10);
};
