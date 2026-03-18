import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

// Get token from localStorage
const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
};

/**
 * USER / PROFILE API
 */
export const getStudentDetails = async () => {
    return await axios.get(`${BASE_URL}/user/details`, getHeaders());
};

export const updateStudentProfile = async (userData) => {
    return await axios.put(`${BASE_URL}/user/update-profile`, userData, getHeaders());
};

/**
 * STUDENT ACADEMIC API
 */
export const getStudentGPA = async () => {
    return await axios.get(`${BASE_URL}/student/gpa`, getHeaders());
};

export const getMyIncourseSubjects = async () => {
    return await axios.get(`${BASE_URL}/incourse/student/courses`, getHeaders());
};

export const getMyIncourseMarks = async (courseCode) => {
    return await axios.get(`${BASE_URL}/incourse/student/my-result`, {
        ...getHeaders(),
        params: { courseCode }
    });
};

export const getSubjectIncourseMarks = async (courseCode) => {
    return await axios.get(`${BASE_URL}/incourse/student/subject-marks`, {
        ...getHeaders(),
        params: { courseCode }
    });
};

/**
 * FINAL RESULTS / SENATE API
 */
export const getStudentFinalResults = async () => {
    return await axios.get(`${BASE_URL}/final-results/student/all`, getHeaders());
};

export const getSubjectAnalytics = async (courseCode, batch) => {
    return await axios.get(`${BASE_URL}/final-results/student/analytics`, {
        ...getHeaders(),
        params: { courseCode, batch }
    });
};

export const downloadStudentReportPdf = async () => {
    return await axios.get(`${BASE_URL}/final-results/student/download-pdf`, {
        ...getHeaders(),
        responseType: 'blob'
    });
};

/**
 * COMPLAINTS API
 */
export const getMyComplaints = async () => {
    return await axios.get(`${BASE_URL}/complaints/my-complaints`, getHeaders());
};

export const submitComplaint = async (complaintData) => {
    return await axios.post(`${BASE_URL}/student/complaints`, complaintData, getHeaders());
};
