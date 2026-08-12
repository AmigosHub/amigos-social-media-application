
// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import { authAPI } from '../api/auth'
import { userAPI } from '../api/user'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token')
      const userData = localStorage.getItem('user')
      
      if (token && userData) {
        try {
          // Get the stored user data
          const storedUser = JSON.parse(userData)
          const roleFromStorage = storedUser.role
          console.log('[AuthContext] Stored user role:', roleFromStorage)
          
          // Try to fetch fresh user data from API
          const response = await userAPI.getCurrentUser()
          if (response.success) {
            const user = response.data
            // PRESERVE the role from stored data
            user.role = roleFromStorage
            console.log('[AuthContext] Fetched fresh user profile with preserved role:', user)
            localStorage.setItem('user', JSON.stringify(user))
            setCurrentUser(user)
          } else {
            // Fallback to stored user data
            console.log('[AuthContext] Using stored user data:', storedUser)
            setCurrentUser(storedUser)
          }
        } catch (error) {
          console.error('Error fetching user:', error)
          // Use stored user data as fallback
          try {
            const parsedUser = JSON.parse(userData)
            setCurrentUser(parsedUser)
          } catch (parseError) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
          }
        }
      }
      setLoading(false)
    }
    
    initAuth()
  }, [])

  // Dark mode effect
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark-mode')
      document.body.classList.add('dark-mode')
    } else {
      document.documentElement.classList.remove('dark-mode')
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData)
      if (response.success) {
        const loginResponse = await authAPI.login({
          email: userData.email,
          password: userData.password,
        })
        if (loginResponse.success) {
          localStorage.setItem('token', loginResponse.data.token)
          
          // Get role from login response
          const roleFromLogin = loginResponse.data.role
          
          // Fetch full user profile after registration
          try {
            const userResponse = await userAPI.getCurrentUser()
            if (userResponse.success) {
              const user = userResponse.data
              // PRESERVE the role from login response
              user.role = roleFromLogin
              console.log('[AuthContext] Full user profile from API with preserved role:', user)
              localStorage.setItem('user', JSON.stringify(user))
              setCurrentUser(user)
            }
          } catch (error) {
            console.error('Error fetching user profile:', error)
            // Fallback to login response data
            const user = {
              id: loginResponse.data.userId,
              username: loginResponse.data.username,
              email: loginResponse.data.email,
              fullName: loginResponse.data.fullName,
              role: loginResponse.data.role,
              profilePic: loginResponse.data.profilePic || null,
              bio: loginResponse.data.bio || '',
              followersCount: 0,
              followingCount: 0,
              postsCount: 0,
            }
            localStorage.setItem('user', JSON.stringify(user))
            setCurrentUser(user)
          }
        }
        return response
      }
      throw new Error(response.message || 'Registration failed')
    } catch (error) {
      throw error
    }
  }

  // ========== FIXED: Login - Fetch full user profile and preserve role ==========
  const login = async (email, password) => {
    try {
      const response = await authAPI.login({ email, password })
      console.log('[AuthContext] Login response:', response)
      
      if (response.success) {
        // Store token
        localStorage.setItem('token', response.data.token)
        
        // Get the role from login response
        const roleFromLogin = response.data.role
        console.log('[AuthContext] Role from login response:', roleFromLogin)
        
        let user = null
        
        // Fetch full user profile from API
        try {
          const userResponse = await userAPI.getCurrentUser()
          console.log('[AuthContext] User profile from /api/users/me:', userResponse)
          
          if (userResponse.success) {
            // Use the profile data but PRESERVE the role from login response
            user = userResponse.data
            // IMPORTANT: Add the role from login response
            user.role = roleFromLogin
            console.log('[AuthContext] Full user profile with role:', user)
            console.log('[AuthContext] User profilePic:', user.profilePic)
            console.log('[AuthContext] User role after preserving:', user.role)
          } else {
            throw new Error('Failed to fetch user profile')
          }
        } catch (error) {
          console.error('[AuthContext] Error fetching user profile:', error)
          
          // Fallback to login response data
          user = {
            id: response.data.userId,
            username: response.data.username,
            email: response.data.email,
            fullName: response.data.fullName,
            role: response.data.role, // This has the role
            profilePic: response.data.profilePic || null,
            bio: response.data.bio || '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
          }
          console.log('[AuthContext] Using fallback user data with role:', user)
        }
        
        // Store user in localStorage and state
        localStorage.setItem('user', JSON.stringify(user))
        setCurrentUser(user)
        
        // Return the user object
        return user
      }
      throw new Error(response.message || 'Login failed')
    } catch (error) {
      console.error('[AuthContext] Login error:', error)
      throw error
    }
  }
  // ========== END OF FIX ==========

  const logout = () => {
    authAPI.logout()
    setCurrentUser(null)
  }

  const updateUser = async (params) => {
    try {
      const response = await userAPI.updateProfile(params)
      if (response.success) {
        // Fetch fresh user data after update
        const userResponse = await userAPI.getCurrentUser()
        if (userResponse.success) {
          const updatedUser = userResponse.data
          // Preserve role
          updatedUser.role = currentUser?.role || 'USER'
          setCurrentUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          return response
        }
        // Fallback
        const updatedUser = { ...currentUser, ...response.data }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return response
      }
      throw new Error(response.message || 'Update failed')
    } catch (error) {
      throw error
    }
  }

  const updateProfilePic = async (file) => {
    try {
      const response = await userAPI.updateProfilePic(file)
      if (response.success) {
        // Fetch fresh user data after profile pic update
        const userResponse = await userAPI.getCurrentUser()
        if (userResponse.success) {
          const updatedUser = userResponse.data
          // Preserve role
          updatedUser.role = currentUser?.role || 'USER'
          setCurrentUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          return response
        }
        // Fallback
        const updatedUser = { ...currentUser, profilePic: response.data }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return response
      }
      throw new Error(response.message || 'Update failed')
    } catch (error) {
      throw error
    }
  }

  const removeProfilePic = async () => {
    try {
      const response = await userAPI.removeProfilePic()
      if (response.success) {
        // Fetch fresh user data after removal
        const userResponse = await userAPI.getCurrentUser()
        if (userResponse.success) {
          const updatedUser = userResponse.data
          // Preserve role
          updatedUser.role = currentUser?.role || 'USER'
          setCurrentUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          return response
        }
        // Fallback
        const updatedUser = { ...currentUser, profilePic: null }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return response
      }
      throw new Error(response.message || 'Failed to remove profile picture')
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const response = await userAPI.changePassword(oldPassword, newPassword)
      return response
    } catch (error) {
      throw error
    }
  }

  const deactivateAccount = async () => {
    try {
      const response = await userAPI.deactivateAccount()
      if (response.success) {
        logout()
        return response
      }
      throw new Error(response.message || 'Deactivation failed')
    } catch (error) {
      throw error
    }
  }

  const updatePrivacy = async (isPrivate) => {
    try {
      const response = await userAPI.updatePrivacy(isPrivate)
      if (response.success) {
        // Fetch fresh user data after privacy update
        const userResponse = await userAPI.getCurrentUser()
        if (userResponse.success) {
          const updatedUser = userResponse.data
          // Preserve role
          updatedUser.role = currentUser?.role || 'USER'
          setCurrentUser(updatedUser)
          localStorage.setItem('user', JSON.stringify(updatedUser))
          return response
        }
        // Fallback
        const updatedUser = { ...currentUser, private: response.data.private }
        setCurrentUser(updatedUser)
        localStorage.setItem('user', JSON.stringify(updatedUser))
        return response
      }
      throw new Error(response.message || 'Failed to update privacy')
    } catch (error) {
      throw error
    }
  }

  const value = {
    currentUser,
    loading,
    darkMode,
    setDarkMode,
    register,
    login,
    logout,
    updateUser,
    updateProfilePic,
    removeProfilePic,
    changePassword,
    deactivateAccount,
    updatePrivacy,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}