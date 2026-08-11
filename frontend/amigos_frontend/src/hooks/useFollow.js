// src/hooks/useFollow.js
import { useFollow as useFollowContext } from '../context/FollowContext'

export const useFollow = () => {
  const follow = useFollowContext()
  return follow
}