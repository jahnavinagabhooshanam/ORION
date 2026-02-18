import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to add the JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getRiskSummary = async () => {
    const response = await api.get('/risk-summary');
    return response.data;
};

export const getDepartments = async () => {
    const response = await api.get('/departments');
    return response.data;
};

export const getAlerts = async () => {
    const response = await api.get('/alerts');
    return response.data;
};

export const simulateRiskEvent = async () => {
    const response = await api.post('/simulate-risk-event');
    return response.data;
};

export const initDB = async () => {
    const response = await api.post('/init-db');
    return response.data;
};

export { api };
export default api;
