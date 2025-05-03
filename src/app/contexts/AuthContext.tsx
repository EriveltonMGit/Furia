"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import {
  login as authLogin,
  logout as authLogout,
  getCurrentUser,
  register as authRegister,
  type AuthResponse,
} from "../services/auth.service"
import { signInWithGoogle as firebaseGoogleLogin } from "../types/firebase"

interface RegisterData {
  name: string
  email: string
  password: string
}

interface User {
  id: string
  name: string
  email: string
  role?: string
  created_at?: string | Date
  token?: string // Adicionamos o token aqui
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<AuthResponse>
  register: (data: RegisterData) => Promise<AuthResponse>
  googleLogin: () => Promise<AuthResponse>
  logout: () => Promise<void>
  checkAuth: () => Promise<boolean>
  isAuthenticated: boolean
  getToken: () => string | undefined // Alterado para string | undefined
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Função para extrair o token JWT do cookie
  const getTokenFromCookie = (): string | undefined => {
    if (typeof document === "undefined") return undefined // Verificação para SSR

    const cookies = document.cookie.split(";")
    const jwtCookie = cookies.find((cookie) => cookie.trim().startsWith("jwt="))

    if (!jwtCookie) return undefined

    return jwtCookie.split("=")[1]
  }

  // Função pública para obter o token
  const getToken = (): string | undefined => {
    return user?.token || getTokenFromCookie()
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const userData = await getCurrentUser()
        if (userData) {
          // Obter o token do cookie
          const token = getTokenFromCookie()

          setUser({
            ...userData,
            token,
          })
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string): Promise<AuthResponse> => {
    setLoading(true)
    try {
      const result = await authLogin({ email, password })
      if (result.success && result.user) {
        // Obter o token do cookie após o login
        const token = getTokenFromCookie()

        setUser({
          ...result.user,
          token,
        })
        setIsAuthenticated(true)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: RegisterData): Promise<AuthResponse> => {
    setLoading(true)
    try {
      const result = await authRegister(data)
      if (result.success && result.user) {
        // Obter o token do cookie após o registro
        const token = getTokenFromCookie()

        setUser({
          ...result.user,
          token,
        })
        setIsAuthenticated(true)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const googleLogin = async (): Promise<AuthResponse> => {
    setLoading(true)
    try {
      const result = await firebaseGoogleLogin()
      if (result.success && result.user) {
        // Obter o token do cookie após o login com Google
        const token = getTokenFromCookie()

        setUser({
          ...result.user,
          token,
        })
        setIsAuthenticated(true)
      }
      return result
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Erro ao fazer login com Google",
      }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await authLogout()
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const checkAuth = async () => {
    try {
      const userData = await getCurrentUser()
      if (userData) {
        // Obter o token do cookie
        const token = getTokenFromCookie()

        setUser({
          ...userData,
          token,
        })
        setIsAuthenticated(true)
        return true
      } else {
        setUser(null)
        setIsAuthenticated(false)
        return false
      }
    } catch {
      setUser(null)
      setIsAuthenticated(false)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        checkAuth,
        isAuthenticated,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
