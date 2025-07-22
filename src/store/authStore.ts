import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import type { PersistStorage, StorageValue } from "zustand/middleware"
import type { User } from "../types/auth"

interface AuthState {
  user: User | null
  token: string | null // Token is stored in Zustand state and persisted
  isAuthenticated: boolean
  setAuth: ({ user, token }: { user: User; token: string }) => void
  logout: () => void
}

type PersistedState = Pick<AuthState, "user" | "token">

const customStorage: PersistStorage<PersistedState> = {
  getItem: (name: string): StorageValue<PersistedState> | null => {
    try {
      const str = localStorage.getItem(name)
      if (!str) return null
      return JSON.parse(str) as StorageValue<PersistedState>
    } catch (error) {
      console.error("Error getting item from localStorage:", error)
      return null
    }
  },
  setItem: (name: string, value: StorageValue<PersistedState>): void => {
    try {
      localStorage.setItem(name, JSON.stringify(value))
    } catch (error) {
      console.error("Error setting item in localStorage:", error)
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name)
    } catch (error) {
      console.error("Error removing item from localStorage:", error)
    }
  },
}

const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        user: null,
        token: null,
        isAuthenticated: false,
        setAuth: ({ user, token }) => set({ user, token, isAuthenticated: !!token }),
        logout: () => set({ user: null, token: null, isAuthenticated: false }),
      }),
      {
        name: "auth-storage",
        storage: customStorage,
        partialize: (state) => ({
          user: state.user,
          token: state.token,
        }),
      }
    )
  )
)

export default useAuthStore
