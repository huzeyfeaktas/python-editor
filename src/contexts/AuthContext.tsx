import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { AuthContextType, User } from '@/types'
import api from '@/utils/api'
import toast from 'react-hot-toast'

const AuthContext = createContext<AuthContextType | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  console.log('🎯 AuthProvider render ediliyor...')
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Geçici olarak API çağrısını devre dışı bırak
    console.log('🔍 AuthContext useEffect - checkAuth çağrılacak')
    // checkAuth()
    
    // Geçici fix: direkt loading'i false yap
    setTimeout(() => {
      console.log('⏱️ Loading false yapılıyor...')
      setLoading(false)
    }, 100)
  }, [])

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me')
      if (response.data.success) {
        setUser(response.data.data.user)
      }
    } catch (error) {
      // Kullanıcı giriş yapmamış
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/login', { username, password })
      if (response.data.success) {
        setUser(response.data.data.user)
        toast.success('Giriş başarılı!')
        return true
      } else {
        toast.error(response.data.message || 'Giriş başarısız!')
        return false
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Giriş başarısız!')
      return false
    }
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.post('/auth/register', { username, email, password })
      if (response.data.success) {
        setUser(response.data.data.user)
        toast.success('Kayıt başarılı!')
        return true
      } else {
        toast.error(response.data.message || 'Kayıt başarısız!')
        return false
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Kayıt başarısız!')
      return false
    }
  }

  const logout = async () => {
    try {
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      toast.success('Çıkış yapıldı!')
    }
  }

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
