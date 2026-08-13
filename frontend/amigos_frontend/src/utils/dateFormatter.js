
// src/utils/dateFormatter.js
import { format, formatDistanceToNow, formatDistanceToNowStrict } from 'date-fns'

// Force IST timezone (UTC+5:30)
const convertUTCToIST = (date) => {
  if (!date) return null
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  
  // Add 5 hours 30 minutes to convert UTC to IST
  const istTime = new Date(d.getTime() + (5.5 * 60 * 60 * 1000))
  return istTime
}

// Get user's local timezone offset
const getUserOffset = () => {
  return -new Date().getTimezoneOffset() / 60
}

// Auto-detect and convert
const convertUTCToLocal = (date) => {
  if (!date) return null
  
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  
  const offsetHours = getUserOffset()
  const localTime = new Date(d.getTime() + (offsetHours * 60 * 60 * 1000))
  return localTime
}

export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return ''
  const d = convertUTCToLocal(date)
  if (!d) return ''
  return format(d, formatStr)
}

export const formatDateTime = (date, formatStr = 'MMM dd, yyyy HH:mm') => {
  if (!date) return ''
  const d = convertUTCToLocal(date)
  if (!d) return ''
  return format(d, formatStr)
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  const d = convertUTCToLocal(date)
  if (!d) return ''
  return formatDistanceToNow(d, { addSuffix: true })
}

export const formatTimeAgo = (date) => {
  if (!date) return ''
  const d = convertUTCToLocal(date)
  if (!d) return ''
  return formatDistanceToNowStrict(d, { addSuffix: true })
}

export const getTimeAgo = (date) => {
  if (!date) return ''
  const d = convertUTCToLocal(date)
  if (!d) return ''
  
  const diff = Date.now() - d.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const months = Math.floor(days / 30)
  const years = Math.floor(months / 12)

  if (seconds < 60) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 30) return `${days}d ago`
  if (months < 12) return `${months}mo ago`
  return `${years}y ago`
}