import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

const getHeader = () => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

/*
Fetch logged-in student's basic details
*/
export const getStudentDetails = () => {
    return axios.get(`${API}/user/details`, getHeader());
};

/*
Fetch overall GPA for the logged-in student
*/
export const getStudentGPA = () => {
    return axios.get(`${API}/student/gpa`, getHeader());
};

/*
Fetch subjects the student is enrolled in
*/
export const getEnrolledSubjects = () => {
    return axios.get(`${API}/student/incourse/subjects`, getHeader());
};

/*
Fetch detailed incourse marks for a specific course code
*/
export const getIncourseMarks = (courseCode) => {
    return axios.get(`${API}/student/incourse/marks/${courseCode}`, getHeader());
};

/*
Fetch detailed academic results summary
Optional: pass semester string if needed
*/
export const getStudentAcademicSummary = (semester = "") => {
    const url = semester 
        ? `${API}/final-results/student/all?semester=${encodeURIComponent(semester)}`
        : `${API}/final-results/student/all`;
    return axios.get(url, getHeader());
};

/*
Fetch subject-wise analytics (grade distribution etc.)
*/
export const getSubjectAnalytics = (courseCode, batch) => {
    return axios.get(`${API}/final-results/student/analytics?courseCode=${courseCode}&batch=${batch}`, getHeader());
};

/*
Update logged-in student's profile information or password
*/
export const updateStudentProfile = (data) => {
    return axios.put(`${API}/user/update-profile`, data, getHeader());
};

/*
Download academic report PDF
*/
export const downloadReport = () => {
    return axios.get(`${API}/final-results/student/download-pdf`, {
        ...getHeader(),
        responseType: 'blob'
    });
};
