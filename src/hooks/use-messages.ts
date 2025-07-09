import { useState, useEffect, useCallback } from 'react'
import { apiRequest, API_CONFIG } from '@/lib/api-config'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  sender: {
    id: string
    username: string
    image?: string
  }
  receiver: {
    id: string
    username: string
    image?: string
  }
  createdAt: string
  read: boolean
}

interface Conversation {
  participant: {
    id: string
    username: string
    image?: string
    status: string
  }
  lastMessage: {
    content: string
    createdAt: string
    read: boolean
  }
  unreadCount: number
}

export function useMessages() {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.messages)
      if (response.success) {
        setConversations(response.conversations || [])
      } else {
        setError(response.message || 'Failed to fetch conversations')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch conversations')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchMessages = useCallback(async (participantId: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(
        `${API_CONFIG.endpoints.messages}?participant=${participantId}`
      )
      if (response.success) {
        setMessages(response.messages || [])
      } else {
        setError(response.message || 'Failed to fetch messages')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch messages')
    } finally {
      setLoading(false)
    }
  }, [])

  const sendMessage = useCallback(async (receiverId: string, content: string) => {
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.messages, {
        method: 'POST',
        body: JSON.stringify({
          receiverId,
          content
        })
      })

      if (response.success) {
        // Add new message to current messages if we're viewing this conversation
        if (messages.length > 0 && 
            (messages[0]?.senderId === receiverId || messages[0]?.receiverId === receiverId)) {
          setMessages(prev => [...prev, response.message])
        }
        
        // Refresh conversations to update last message
        await fetchConversations()
        return true
      } else {
        setError(response.message || 'Failed to send message')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'Failed to send message')
      return false
    }
  }, [messages, fetchConversations])

  const markAsRead = useCallback(async (conversationId: string) => {
    try {
      await apiRequest(API_CONFIG.endpoints.messages, {
        method: 'PUT',
        body: JSON.stringify({
          action: 'mark_read',
          conversationId
        })
      })
      
      // Update local state
      setConversations(prev => 
        prev.map(conv => 
          conv.participant.id === conversationId 
            ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } }
            : conv
        )
      )
    } catch (err) {
      console.error('Failed to mark messages as read:', err)
    }
  }, [])

  return {
    conversations,
    messages,
    loading,
    error,
    fetchConversations,
    fetchMessages,
    sendMessage,
    markAsRead,
    clearError: () => setError(null)
  }
} 