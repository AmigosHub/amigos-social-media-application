
// src/context/PostContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from '../api/axios'
import { useAuth } from './AuthContext'

const PostContext = createContext()

export const usePosts = () => useContext(PostContext)

export const PostProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [feedPosts, setFeedPosts] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (currentUser) {
      loadPosts()
    }
  }, [currentUser])

  // Helper function to enrich posts with latest user data
  const enrichPostsWithUserData = async (postsData) => {
    // Get all users to fetch latest profile information
    const users = (await axios.get('/users')).data
    
    // Create a map of user data for quick lookup
    const userMap = new Map()
    users.forEach(user => {
      userMap.set(user.id, {
        username: user.username,
        userAvatar: user.profileImageUrl,
        userFullName: user.fullName,
        userBio: user.bio
      })
    })
    
    // Enrich each post with the latest user data
    const enrichedPosts = postsData.map(post => ({
      ...post,
      username: userMap.get(post.userId)?.username || post.username,
      userAvatar: userMap.get(post.userId)?.userAvatar || post.userAvatar,
      userFullName: userMap.get(post.userId)?.userFullName || post.userFullName,
    }))
    
    // Also enrich comments with latest user data
    enrichedPosts.forEach(post => {
      if (post.comments && post.comments.length > 0) {
        post.comments = post.comments.map(comment => ({
          ...comment,
          username: userMap.get(comment.userId)?.username || comment.username,
          userAvatar: userMap.get(comment.userId)?.userAvatar || comment.userAvatar,
        }))
      }
    })
    
    return enrichedPosts
  }

  const loadPosts = async () => {
    setLoading(true)
    try {
      // Get all posts
      const allPosts = (await axios.get('/posts')).data
      
      // Enrich posts with latest user data (including profile images)
      const enrichedPosts = await enrichPostsWithUserData(allPosts)
      
      setPosts(enrichedPosts)
      
      if (currentUser) {
        const following = currentUser.following || []
        // Filter posts from current user and followed users
        const feed = enrichedPosts
          .filter(post => post.userId === currentUser.id || following.includes(post.userId))
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setFeedPosts(feed)
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const createPost = async (postData) => {
    try {
      // Get latest user data
      const users = (await axios.get('/users')).data
      const currentUserData = users.find(u => u.id === currentUser.id)
      
      const newPost = {
        id: Date.now().toString(),
        userId: currentUser.id,
        userAvatar: currentUserData?.profileImageUrl || currentUser.profileImageUrl,
        username: currentUserData?.username || currentUser.username,
        userFullName: currentUserData?.fullName || currentUser.fullName,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        ...postData
      }
      
      const allPosts = (await axios.get('/posts')).data
      await axios.post('/posts', [...allPosts, newPost])
      await loadPosts() // Reload to get enriched data
      return newPost
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  const updatePost = async (postId, updatedData) => {
    try {
      const allPosts = (await axios.get('/posts')).data
      const updatedPosts = allPosts.map(post => 
        post.id === postId ? { ...post, ...updatedData } : post
      )
      await axios.post('/posts', updatedPosts)
      await loadPosts() // Reload to get enriched data
    } catch (error) {
      console.error('Error updating post:', error)
      throw error
    }
  }

  const deletePost = async (postId) => {
    try {
      const allPosts = (await axios.get('/posts')).data
      const filteredPosts = allPosts.filter(post => post.id !== postId)
      await axios.post('/posts', filteredPosts)
      await loadPosts() // Reload to get enriched data
    } catch (error) {
      console.error('Error deleting post:', error)
      throw error
    }
  }

  const likePost = async (postId) => {
    try {
      const allPosts = (await axios.get('/posts')).data
      const postIndex = allPosts.findIndex(p => p.id === postId)
      const post = allPosts[postIndex]
      
      if (post.likes.includes(currentUser.id)) {
        post.likes = post.likes.filter(id => id !== currentUser.id)
      } else {
        post.likes.push(currentUser.id)
      }
      
      allPosts[postIndex] = post
      await axios.post('/posts', allPosts)
      await loadPosts() // Reload to get enriched data
    } catch (error) {
      console.error('Error liking post:', error)
      throw error
    }
  }

  const addComment = async (postId, commentText) => {
    try {
      // Get latest user data for the comment
      const users = (await axios.get('/users')).data
      const currentUserData = users.find(u => u.id === currentUser.id)
      
      const allPosts = (await axios.get('/posts')).data
      const postIndex = allPosts.findIndex(p => p.id === postId)
      const post = allPosts[postIndex]
      
      const newComment = {
        id: Date.now().toString(),
        userId: currentUser.id,
        username: currentUserData?.username || currentUser.username,
        userAvatar: currentUserData?.profileImageUrl || currentUser.profileImageUrl,
        userFullName: currentUserData?.fullName || currentUser.fullName,
        text: commentText,
        createdAt: new Date().toISOString()
      }
      
      post.comments.push(newComment)
      allPosts[postIndex] = post
      await axios.post('/posts', allPosts)
      await loadPosts() // Reload to get enriched data
    } catch (error) {
      console.error('Error adding comment:', error)
      throw error
    }
  }

  const deleteComment = async (postId, commentId) => {
    try {
      const allPosts = (await axios.get('/posts')).data
      const postIndex = allPosts.findIndex(p => p.id === postId)
      const post = allPosts[postIndex]
      post.comments = post.comments.filter(c => c.id !== commentId)
      allPosts[postIndex] = post
      await axios.post('/posts', allPosts)
      await loadPosts() // Reload to get enriched data
    } catch (error) {
      console.error('Error deleting comment:', error)
      throw error
    }
  }

  const getUserPosts = (userId) => {
    return posts.filter(post => post.userId === userId)
  }

  // Refresh feed after follow/unfollow
  const refreshFeed = async () => {
    if (currentUser) {
      await loadPosts()
    }
  }

  return (
    <PostContext.Provider value={{
      posts,
      feedPosts,
      loading,
      createPost,
      updatePost,
      deletePost,
      likePost,
      addComment,
      deleteComment,
      getUserPosts,
      loadPosts,
      refreshFeed
    }}>
      {children}
    </PostContext.Provider>
  )
}