// src/socket/socketEvents.js

export const SOCKET_EVENTS = {
  // Connection events
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  RECONNECT: 'reconnect',
  RECONNECT_ATTEMPT: 'reconnect_attempt',

  // Chat events
  MESSAGE_SEND: 'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  TYPING_START: 'typing:start',
  TYPING_STOP: 'typing:stop',
  MARK_READ: 'message:read',

  // Notification events
  NOTIFICATION_RECEIVE: 'notification:receive',

  // User events
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
  USER_STATUS: 'user:status',

  // Post events
  POST_LIKE: 'post:like',
  POST_COMMENT: 'post:comment',
}