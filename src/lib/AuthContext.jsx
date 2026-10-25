import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)

// Публичный сайт: авторизация не требуется.
// Контекст оставлен как точка расширения для будущей логики входа.
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const logout = useCallback(() => {
    setUser(null)
    setIsAuthenticated(false)
  }, [])

  const navigateToLogin = useCallback(() => {}, [])

  const value = useMemo(() => ({
    user,
    isAuthenticated,
    isLoadingAuth: false,
    isLoadingPublicSettings: false,
    authError: null,
    appPublicSettings: {},
    logout,
    navigateToLogin,
  }), [user, isAuthenticated, logout, navigateToLogin])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
