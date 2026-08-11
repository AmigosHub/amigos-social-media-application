// src/utils/validators.js

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{3,20}$/
  return regex.test(username)
}

export const validateFullName = (name) => {
  return name.trim().length >= 2
}

export const validateBio = (bio) => {
  return bio.length <= 150
}

export const validatePostContent = (content) => {
  return content.trim().length > 0
}

export const validateComment = (comment) => {
  return comment.trim().length > 0
}

export const validateImageUrl = (url) => {
  if (!url) return false
  const regex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg|webp))/i
  return regex.test(url)
}