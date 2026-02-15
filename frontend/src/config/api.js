// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export const API_ENDPOINTS = {
    users: `${API_BASE_URL}/api/users`,
    discovery: `${API_BASE_URL}/api/discovery`,
    analytics: {
        exposure: `${API_BASE_URL}/api/analytics/exposure`,
        risk: `${API_BASE_URL}/api/analytics/risk`,
        trends: `${API_BASE_URL}/api/analytics/trends`,
    },
    loans: (userId) => `${API_BASE_URL}/api/loans/${userId}`,
    transactions: (userId) => `${API_BASE_URL}/api/transactions/${userId}`,
};

export default API_BASE_URL;
