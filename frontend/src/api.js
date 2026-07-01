import { API_URL } from "./utils"

const request = async (path, { method = 'GET', body } = {}) => {
    const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
    };
    if (body !== undefined) {
        options.body = JSON.stringify(body);
    }
    const result = await fetch(`${API_URL}${path}`, options);
    return result.json();
}

export const CreateTask = (taskObj) =>
    request('/tasks', { method: 'POST', body: taskObj });

export const GetAllTasks = () =>
    request('/tasks');

export const DeleteTaskById = (id) =>
    request(`/tasks/${id}`, { method: 'DELETE' });

export const UpdateTaskById = (id, reqBody) =>
    request(`/tasks/${id}`, { method: 'PUT', body: reqBody });
