
// src/context/FollowContext.jsx
import React, { createContext, useContext, useState } from 'react'
import { followAPI } from '../api/follow'
import { useAuth } from './AuthContext'
import { usePosts } from './PostContext'

const FollowContext = createContext()

export const useFollow = () => useContext(FollowContext)

export const FollowProvider = ({ children }) => {
  const { currentUser, updateUser } = useAuth()  // Removed updateFollowing
  const { refreshFeed } = usePosts()
  const [followingStatus, setFollowingStatus] = useState({})
  const [pendingRequests, setPendingRequests] = useState([])

  const followUser = async (userId) => {
    try {
      if (currentUser?.following?.includes(userId)) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'following' }))
        return { success: true, message: 'Already following' }
      }

      const response = await followAPI.followUser(userId)
      if (response.success) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'following' }))
        
        // Update following list using updateUser
        const updatedFollowing = [...(currentUser.following || []), userId]
        const updatedUser = {
          ...currentUser,
          following: updatedFollowing
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        await updateUser({ following: updatedFollowing })
        
        await refreshFeed()
        return response
      }
      throw new Error(response.message || 'Failed to follow user')
    } catch (error) {
      if (error.response?.status === 400) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'following' }))
        return { success: true, message: 'Already following' }
      }
      console.error('Error following user:', error)
      throw error
    }
  }

  const sendFollowRequest = async (userId) => {
    try {
      if (currentUser?.pendingFollowRequests?.includes(userId)) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'pending' }))
        return { success: true, message: 'Request already sent' }
      }

      const response = await followAPI.followUser(userId)
      if (response.success) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'pending' }))
        
        const updatedPending = [...(currentUser.pendingFollowRequests || []), userId]
        const updatedUser = {
          ...currentUser,
          pendingFollowRequests: updatedPending
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        await updateUser({ pendingFollowRequests: updatedPending })
        
        return response
      }
      throw new Error(response.message || 'Failed to send follow request')
    } catch (error) {
      console.error('Error sending follow request:', error)
      throw error
    }
  }

  const unfollowUser = async (userId) => {
    try {
      if (!currentUser?.following?.includes(userId)) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'not_following' }))
        return { success: true, message: 'Already unfollowed' }
      }

      const response = await followAPI.unfollowUser(userId)
      if (response.success) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'not_following' }))
        
        // Update following list using updateUser
        const updatedFollowing = (currentUser.following || []).filter(id => id !== userId)
        const updatedUser = {
          ...currentUser,
          following: updatedFollowing
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        await updateUser({ following: updatedFollowing })
        
        await refreshFeed()
        return response
      }
      throw new Error(response.message || 'Failed to unfollow user')
    } catch (error) {
      if (error.response?.status === 400) {
        setFollowingStatus(prev => ({ ...prev, [userId]: 'not_following' }))
        return { success: true, message: 'Already unfollowed' }
      }
      console.error('Error unfollowing user:', error)
      throw error
    }
  }

  const acceptFollowRequest = async (followId) => {
    try {
      const response = await followAPI.acceptFollowRequest(followId)
      if (response.success) {
        await loadPendingRequests()
        await refreshFeed()
        if (currentUser) {
          const updatedUser = {
            ...currentUser,
            followersCount: (currentUser.followersCount || 0) + 1
          }
          localStorage.setItem('user', JSON.stringify(updatedUser))
          await updateUser({ followersCount: updatedUser.followersCount })
        }
        return response
      }
      throw new Error(response.message || 'Failed to accept follow request')
    } catch (error) {
      console.error('Error accepting follow request:', error)
      throw error
    }
  }

  const rejectFollowRequest = async (followId) => {
    try {
      const response = await followAPI.rejectFollowRequest(followId)
      if (response.success) {
        await loadPendingRequests()
        return response
      }
      throw new Error(response.message || 'Failed to reject follow request')
    } catch (error) {
      console.error('Error rejecting follow request:', error)
      throw error
    }
  }

  const loadPendingRequests = async () => {
    try {
      const response = await followAPI.getPendingRequests()
      if (response.success) {
        const requests = response.data || { content: [] }
        setPendingRequests(requests)
        return requests
      }
      return { content: [] }
    } catch (error) {
      console.error('Error loading pending requests:', error)
      return { content: [] }
    }
  }

  const getFollowStatus = async (userId) => {
    try {
      if (currentUser?.following?.includes(userId)) {
        return { isFollowing: true, status: 'following' }
      }
      
      if (currentUser?.pendingFollowRequests?.includes(userId)) {
        return { isFollowing: false, status: 'pending' }
      }
      
      const response = await followAPI.getFollowStatus(userId)
      return response.data
    } catch (error) {
      console.error('Error getting follow status:', error)
      if (currentUser?.following?.includes(userId)) {
        return { isFollowing: true, status: 'following' }
      }
      if (currentUser?.pendingFollowRequests?.includes(userId)) {
        return { isFollowing: false, status: 'pending' }
      }
      return { isFollowing: false, status: 'not_following' }
    }
  }

  const isFollowing = (userId) => {
    if (!currentUser) return false
    if (followingStatus[userId] === 'following') return 'following'
    if (followingStatus[userId] === 'pending') return 'pending'
    if (followingStatus[userId] === 'not_following') return 'not_following'
    
    if (currentUser?.following?.includes(userId)) {
      return 'following'
    }
    
    if (currentUser?.pendingFollowRequests?.includes(userId)) {
      return 'pending'
    }
    
    return 'not_following'
  }

  const value = {
    followUser,
    sendFollowRequest,
    unfollowUser,
    isFollowing,
    getFollowStatus,
    acceptFollowRequest,
    rejectFollowRequest,
    loadPendingRequests,
    pendingRequests,
  }

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>
}