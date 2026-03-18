import axios from 'axios';

const API_URL = 'http://localhost:5000/api/user';

// Get token from localStorage
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

export const getStudentDetails = async () => {
    return await axios.get(`${API_URL}/details`, getHeaders());
};

export const updateStudentProfile = async (userData) => {
    return await axios.put(`${API_URL}/update-profile`, userData, getHeaders());
};
