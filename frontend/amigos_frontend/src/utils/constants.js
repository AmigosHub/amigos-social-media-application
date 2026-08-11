// src/utils/constants.js

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'
export const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8080/ws'

export const APP_NAME = 'Amigos'

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'video/mp4']

export const PAGINATION = {
  DEFAULT_PAGE: 0,
  DEFAULT_SIZE: 20,
  CHAT_SIZE: 50,
}

export const ROUTES = {
  HOME: '/home',
  LOGIN: '/login',
  REGISTER: '/register',
  PROFILE: '/profile/:id',
  CREATE_POST: '/create-post',
  EDIT_POST: '/edit-post/:id',
  SEARCH: '/search',
  FOLLOWING: '/following',
  CHAT: '/chat',
}

export const NOTIFICATION_TYPES = {
  LIKE: 'POST_LIKED',
  COMMENT: 'POST_COMMENTED',
  FOLLOW: 'NEW_FOLLOWER',
  MESSAGE: 'NEW_MESSAGE',
}