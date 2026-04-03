import axios from "axios";

const API = "http://localhost:5000/api/academic-calendar";

/*
  Fetch all academic calendars
  Endpoint: GET /api/academic-calendar (Public/Logged in)
*/
export const getCalendars = () => {
    return axios.get(API);
};

/*
  Upload a new academic calendar (Admin only)
  Endpoint: POST /api/academic-calendar
*/
export const uploadCalendar = (formData) => {
    const token = localStorage.getItem("token");
    return axios.post(API, formData, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
        }
    });
};

/*
  Delete an academic calendar (Admin only)
  Endpoint: DELETE /api/academic-calendar/:id
*/
export const deleteCalendar = (id) => {
    const token = localStorage.getItem("token");
    return axios.delete(`${API}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};
