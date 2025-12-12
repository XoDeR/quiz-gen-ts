import axios from "axios";

const api = axios.create({
  // Uses URL of local server API
  baseURL: "http://localhost:5002/api",
});

export default api;