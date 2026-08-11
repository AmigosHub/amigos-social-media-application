// src/hooks/useChat.js
import { useChat as useChatContext } from '../context/ChatContext'

export const useChat = () => {
  const chat = useChatContext()
  return chat
}