import axios from "axios";

const API = "http://localhost:5000/api";

/*
Fetch lecturer details from backend
Endpoint: GET /api/user/details (Private)
*/
export const getLecturerDetails = () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/user/details`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

/*
Fetch course codes for the logged-in lecturer
*/
export const getCourseCodes = () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/subjects/my-course-codes`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Fetch batches for a specific course
*/
export const getBatches = (courseCode) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/subjects/my-batches`, {
        params: { courseCode },
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Fetch the detailed incourse results for a subject
*/
export const getIncourseResults = (subjectId) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/final-results/incourse-list`, {
        params: { subject: subjectId },
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Utility to get subject details by code and batch
*/
export const getSubjectByCodeAndBatch = (courseCode, batch) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/subjects`, {
        params: { courseCode, batch },
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Create a new subject
*/
export const createSubject = (subjectData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API}/subjects`, subjectData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Get subject by ID
*/
export const getSubjectById = (id) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/subjects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Update an existing subject
*/
export const updateSubject = (id, subjectData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API}/subjects/${id}`, subjectData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Save or update incourse results for a student
*/
export const saveIncourseResult = (resultData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API}/incourse/save`, resultData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Get all incourse results for a specific subject
*/
export const getIncourseResultsBySubject = (subjectId) => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/incourse`, {
        params: { subject: subjectId },
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Update lecturer profile fields
*/
export const updateLecturerProfile = (profileData) => {
    const token = localStorage.getItem("token");
    return axios.put(`${API}/user/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Change password for logged-in lecturer
*/
export const changeLecturerPassword = (passwordData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API}/auth/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Delete an incourse result record
*/
export const deleteIncourseResult = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API}/incourse/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Save or update final result (end exam mark)
*/
export const saveFinalResult = (resultData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API}/final-results/save`, resultData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Fetch complaints for the logged-in lecturer
*/
export const getLecturerComplaints = () => {
    const token = localStorage.getItem("token");
    return axios.get(`${API}/complaints/my-complaints`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Create a complaint (e.g. to admin)
*/
export const createComplaint = (complaintData) => {
    const token = localStorage.getItem("token");
    return axios.post(`${API}/complaints`, complaintData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

/*
Update complaint status
*/
export const updateComplaintStatus = (complaintId, status) => {
    const token = localStorage.getItem("token");
    return axios.patch(`${API}/complaints/${complaintId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
    });
};