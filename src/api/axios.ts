import axios from "axios"

const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.error('VITE_API_URL is not defined in your environment variables.');
}

const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});


export default api
