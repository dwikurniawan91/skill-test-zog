export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData extends LoginCredentials {
  name: string
}

export interface APIErrorResponse {
  message: string
  errors?: {
    [key: string]: string[]
  }
}
