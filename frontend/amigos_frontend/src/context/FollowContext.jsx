// src/context/FollowContext.jsx
import React, { createContext, useContext, useState } from 'react'
import axios from '../api/axios'
import { useAuth } from './AuthContext'
import { usePosts } from './PostContext'

const FollowContext = createContext()

export const useFollow = () => useContext(FollowContext)

export const FollowProvider = ({ children }) => {
  const { currentUser, updateUser } = useAuth()
  const { refreshFeed } = usePosts() // Import refreshFeed from PostContext
  const [followingStatus, setFollowingStatus] = useState({})

  const followUser = async (userId) => {
    try {
      console.log('Following user:', userId)
      
      // Get current users
      const users = (await axios.get('/users')).data
      const userToFollow = users.find(u => u.id === userId)
      const currentUserData = users.find(u => u.id === currentUser.id)
      
      if (!userToFollow) {
        throw new Error('User to follow not found')
      }
      
      if (!currentUserData.following) {
        currentUserData.following = []
      }
      
      // Add to following if not already following
      if (!currentUserData.following.includes(userId)) {
        currentUserData.following.push(userId)
        
        // Update userToFollow's followers
        if (!userToFollow.followers) {
          userToFollow.followers = []
        }
        if (!userToFollow.followers.includes(currentUser.id)) {
          userToFollow.followers.push(currentUser.id)
        }
        
        // Update both users in the users array
        const updatedUsers = users.map(u => {
          if (u.id === currentUser.id) return currentUserData
          if (u.id === userId) return userToFollow
          return u
        })
        
        // Save to localStorage
        await axios.post('/users', updatedUsers)
        
        // Update current user in state
        await updateUser({ following: currentUserData.following })
        
        // Refresh the feed to show posts from newly followed user
        await refreshFeed()
        
        setFollowingStatus(prev => ({ ...prev, [userId]: true }))
        console.log('Successfully followed user:', userId)
        return true
      }
    } catch (error) {
      console.error('Error following user:', error)
      throw error
    }
  }

  const unfollowUser = async (userId) => {
    try {
      console.log('Unfollowing user:', userId)
      
      // Get current users
      const users = (await axios.get('/users')).data
      const userToUnfollow = users.find(u => u.id === userId)
      const currentUserData = users.find(u => u.id === currentUser.id)
      
      if (!userToUnfollow) {
        throw new Error('User to unfollow not found')
      }
      
      // Remove from following
      currentUserData.following = currentUserData.following.filter(id => id !== userId)
      
      // Remove from userToUnfollow's followers
      if (userToUnfollow.followers) {
        userToUnfollow.followers = userToUnfollow.followers.filter(id => id !== currentUser.id)
      }
      
      // Update both users in the users array
      const updatedUsers = users.map(u => {
        if (u.id === currentUser.id) return currentUserData
        if (u.id === userId) return userToUnfollow
        return u
      })
      
      // Save to localStorage
      await axios.post('/users', updatedUsers)
      
      // Update current user in state
      await updateUser({ following: currentUserData.following })
      
      // Refresh the feed to remove posts from unfollowed user
      await refreshFeed()
      
      setFollowingStatus(prev => ({ ...prev, [userId]: false }))
      console.log('Successfully unfollowed user:', userId)
      return true
    } catch (error) {
      console.error('Error unfollowing user:', error)
      throw error
    }
  }

  const isFollowing = (userId) => {
    if (!currentUser) return false
    if (followingStatus[userId] !== undefined) {
      return followingStatus[userId]
    }
    const isFollower = currentUser?.following?.includes(userId) || false
    return isFollower
  }

  const getFollowStats = async (userId) => {
    const users = (await axios.get('/users')).data
    const user = users.find(u => u.id === userId)
    return {
      followers: user?.followers?.length || 0,
      following: user?.following?.length || 0
    }
  }

  return (
    <FollowContext.Provider value={{
      followUser,
      unfollowUser,
      isFollowing,
      getFollowStats
    }}>
      {children}
    </FollowContext.Provider>
  )
}