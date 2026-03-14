import axios from "axios";

/*
Backend API base URL
Change if server port changes
*/

const API = "http://localhost:5000/api";

/*
Fetch lecturer details from backend
Example endpoint:
GET /api/lecturer/:id
*/

export const getLecturerDetails = (id) => {
  return axios.get(`${API}/lecturer/${id}`);
};