import api from "@/api/axios"
import useAuthStore from "@/store/authStore"
import type { APIErrorResponse, AuthResponse, LoginCredentials } from "@/types/auth"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { AxiosError } from "axios"

export const useLogin = () => {
  const queryClient = useQueryClient()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation<AuthResponse, AxiosError<APIErrorResponse>, LoginCredentials>({
    mutationFn: async (credentials) => {
      const response = await api.post<AuthResponse>("/auth/login", credentials)

      return response.data
    },
    onSuccess: (data) => {
      console.log(data, "useMutation")

      setAuth({ access_token: data.access_token, refresh_token: data.refresh_token })
      queryClient.invalidateQueries({ queryKey: ["token"] })
    },
    onError: (error) => {
      if (error.response) {
        console.error(error.response.data.message)
      } else {
        console.error(error.message)
      }
    },
  })
}
