import useAuthStore from "@/store/authStore"
import axios from "axios"
import type { AxiosError, AxiosResponse } from "axios"
const baseURL = import.meta.env.VITE_API_URL

if (!baseURL) {
  console.log("VITE_API_URL is not defined in your environment variables.")
}

const api = axios.create({
  baseURL: baseURL,
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().access_token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export default api
