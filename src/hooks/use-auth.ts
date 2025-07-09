import { useState, useCallback } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { apiRequest, API_CONFIG } from '@/lib/api-config'

interface RegisterData {
  email: string
  password: string
  username: string
  name?: string
}

interface LoginData {
  email: string
  password: string
}

export function useAuth() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const register = useCallback(async (data: RegisterData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.auth.register, {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (response.success) {
        // Auto login after successful registration
        await signIn('credentials', {
          email: data.email,
          password: data.password,
          redirect: false
        })
        return true
      } else {
        setError(response.message || 'Registration failed')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (data: LoginData) => {
    setLoading(true)
    setError(null)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false
      })

      if (result?.error) {
        setError('Invalid credentials')
        return false
      }

      return true
    } catch (err: any) {
      setError(err.message || 'Login failed')
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    setLoading(true)
    
    try {
      // Call PHP backend logout
      await apiRequest(API_CONFIG.endpoints.auth.logout, {
        method: 'POST'
      })
    } catch (err) {
      console.error('Backend logout error:', err)
    }

    // NextAuth logout
    await signOut({ redirect: false })
    setLoading(false)
  }, [])

  return {
    session,
    loading: loading || status === 'loading',
    error,
    isAuthenticated: !!session?.user,
    user: session?.user,
    register,
    login,
    logout,
    clearError: () => setError(null)
  }
} 