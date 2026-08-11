
// src/context/PostContext.jsx
import React, { createContext, useState, useContext, useCallback, useMemo } from 'react'
import { postAPI } from '../api/post'
import { likeAPI } from '../api/like'
import { commentAPI } from '../api/comment'
import { useAuth } from './AuthContext'
import cache from '../utils/cache'

const PostContext = createContext()

export const usePosts = () => useContext(PostContext)

export const PostProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [posts, setPosts] = useState([])
  const [feedPosts, setFeedPosts] = useState([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(0)
  const [totalElements, setTotalElements] = useState(0)

  const loadPosts = useCallback(async (reset = true) => {
    setLoading(true)
    try {
      const currentPage = reset ? 0 : page
      const response = await postAPI.getFeed(currentPage, 20)
      
      if (response.success) {
        const newPosts = response.data.content || []
        setTotalElements(response.data.totalElements || 0)
        
        if (reset) {
          setFeedPosts(newPosts)
          setPage(1)
        } else {
          setFeedPosts(prev => [...prev, ...newPosts])
          setPage(prev => prev + 1)
        }
        setHasMore(!response.data.last)
        setPosts(prev => reset ? newPosts : [...prev, ...newPosts])
      }
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [page])

  const createPost = useCallback(async (formData) => {
    try {
      let response
      
      if (formData instanceof FormData) {
        response = await postAPI.createPostWithMedia(formData)
      } else {
        const { caption } = formData
        response = await postAPI.createPost(caption)
      }
      
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        await loadPosts(true)
        return response
      }
      throw new Error(response.message || 'Failed to create post')
    } catch (error) {
      throw error
    }
  }, [loadPosts])

  const updatePost = useCallback(async (postId, updatedData) => {
    try {
      const response = await postAPI.updatePost(postId, updatedData)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        await loadPosts(true)
        return response
      }
      throw new Error(response.message || 'Failed to update post')
    } catch (error) {
      throw error
    }
  }, [loadPosts])

  const deletePost = useCallback(async (postId) => {
    try {
      const response = await postAPI.deletePost(postId)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        setFeedPosts(prev => prev.filter(post => post.id !== postId))
        return response
      }
      throw new Error(response.message || 'Failed to delete post')
    } catch (error) {
      throw error
    }
  }, [])

  const likePost = useCallback(async (postId) => {
    try {
      const response = await likeAPI.likePost(postId)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        setFeedPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likedByCurrentUser: true,
              likesCount: (post.likesCount || 0) + 1
            }
          }
          return post
        }))
        return response
      }
      throw new Error(response.message || 'Failed to like post')
    } catch (error) {
      throw error
    }
  }, [])

  const unlikePost = useCallback(async (postId) => {
    try {
      const response = await likeAPI.unlikePost(postId)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        setFeedPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              likedByCurrentUser: false,
              likesCount: Math.max((post.likesCount || 0) - 1, 0)
            }
          }
          return post
        }))
        return response
      }
      throw new Error(response.message || 'Failed to unlike post')
    } catch (error) {
      throw error
    }
  }, [])

  const addComment = useCallback(async (postId, commentText) => {
    try {
      const response = await commentAPI.createComment(postId, commentText)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        setFeedPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: (post.commentsCount || 0) + 1
            }
          }
          return post
        }))
        return response
      }
      throw new Error(response.message || 'Failed to add comment')
    } catch (error) {
      throw error
    }
  }, [])

  const deleteComment = useCallback(async (postId, commentId) => {
    try {
      const response = await commentAPI.deleteComment(commentId)
      if (response.success) {
        cache.invalidateEndpoint('/api/posts/feed')
        setFeedPosts(prev => prev.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              commentsCount: Math.max((post.commentsCount || 0) - 1, 0)
            }
          }
          return post
        }))
        return response
      }
      throw new Error(response.message || 'Failed to delete comment')
    } catch (error) {
      throw error
    }
  }, [])

  const getUserPosts = useCallback(async (userId) => {
    try {
      const response = await postAPI.getUserPosts(userId)
      return response.data
    } catch (error) {
      console.error('Error getting user posts:', error)
      return { content: [] }
    }
  }, [])

  const refreshFeed = useCallback(async () => {
    cache.invalidateEndpoint('/api/posts/feed')
    await loadPosts(true)
  }, [loadPosts])

  const value = useMemo(() => ({
    posts,
    feedPosts,
    loading,
    hasMore,
    totalElements,
    createPost,
    updatePost,
    deletePost,
    likePost,
    unlikePost,
    addComment,
    deleteComment,
    getUserPosts,
    loadPosts,
    refreshFeed,
  }), [posts, feedPosts, loading, hasMore, totalElements, createPost, updatePost, deletePost, likePost, unlikePost, addComment, deleteComment, getUserPosts, loadPosts, refreshFeed])

  return <PostContext.Provider value={value}>{children}</PostContext.Provider>
}