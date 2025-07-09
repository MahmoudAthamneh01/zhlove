import { useState, useCallback } from 'react'
import { apiRequest, API_CONFIG } from '@/lib/api-config'

interface Tournament {
  id: string
  name: string
  description?: string
  maxParticipants: number
  currentParticipants: number
  startDate: string
  endDate?: string
  entryFee?: number
  prizePool?: number
  status: 'upcoming' | 'active' | 'completed' | 'cancelled'
  gameType: string
  format: string
  rules?: string
  organizer: {
    id: string
    username: string
  }
  isRegistered?: boolean
  createdAt: string
}

interface TournamentParticipant {
  id: string
  userId: string
  user: {
    id: string
    username: string
    rank: string
    points: number
    image?: string
  }
  registeredAt: string
  status: 'registered' | 'checked_in' | 'eliminated' | 'winner'
}

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [tournament, setTournament] = useState<Tournament | null>(null)
  const [participants, setParticipants] = useState<TournamentParticipant[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTournaments = useCallback(async (params?: {
    status?: string
    gameType?: string
    search?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      let url = API_CONFIG.endpoints.tournaments.list
      if (params) {
        const searchParams = new URLSearchParams()
        Object.entries(params).forEach(([key, value]) => {
          if (value) searchParams.append(key, value)
        })
        if (searchParams.toString()) {
          url += `?${searchParams.toString()}`
        }
      }

      const response = await apiRequest(url)
      if (response.success) {
        setTournaments(response.tournaments || [])
      } else {
        setError(response.message || 'Failed to fetch tournaments')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tournaments')
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchTournament = useCallback(async (id: string) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(`${API_CONFIG.endpoints.tournaments.list}/${id}`)
      if (response.success) {
        setTournament(response.tournament)
        setParticipants(response.participants || [])
      } else {
        setError(response.message || 'Failed to fetch tournament')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch tournament')
    } finally {
      setLoading(false)
    }
  }, [])

  const createTournament = useCallback(async (data: {
    name: string
    description?: string
    maxParticipants: number
    startDate: string
    endDate?: string
    entryFee?: number
    prizePool?: number
    gameType: string
    format: string
    rules?: string
  }) => {
    setLoading(true)
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.tournaments.list, {
        method: 'POST',
        body: JSON.stringify(data)
      })

      if (response.success) {
        await fetchTournaments()
        return response.tournament
      } else {
        setError(response.message || 'Failed to create tournament')
        return null
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create tournament')
      return null
    } finally {
      setLoading(false)
    }
  }, [fetchTournaments])

  const registerForTournament = useCallback(async (tournamentId: string) => {
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.tournaments.register, {
        method: 'POST',
        body: JSON.stringify({ tournamentId })
      })

      if (response.success) {
        // Update local tournament state if it's currently loaded
        if (tournament?.id === tournamentId) {
          setTournament(prev => prev ? {
            ...prev,
            currentParticipants: prev.currentParticipants + 1,
            isRegistered: true
          } : null)
        }
        
        // Refresh tournaments list
        await fetchTournaments()
        return true
      } else {
        setError(response.message || 'Failed to register for tournament')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'Failed to register for tournament')
      return false
    }
  }, [tournament, fetchTournaments])

  const unregisterFromTournament = useCallback(async (tournamentId: string) => {
    setError(null)

    try {
      const response = await apiRequest(API_CONFIG.endpoints.tournaments.register, {
        method: 'DELETE',
        body: JSON.stringify({ tournamentId })
      })

      if (response.success) {
        // Update local tournament state if it's currently loaded
        if (tournament?.id === tournamentId) {
          setTournament(prev => prev ? {
            ...prev,
            currentParticipants: prev.currentParticipants - 1,
            isRegistered: false
          } : null)
        }
        
        // Refresh tournaments list
        await fetchTournaments()
        return true
      } else {
        setError(response.message || 'Failed to unregister from tournament')
        return false
      }
    } catch (err: any) {
      setError(err.message || 'Failed to unregister from tournament')
      return false
    }
  }, [tournament, fetchTournaments])

  return {
    tournaments,
    tournament,
    participants,
    loading,
    error,
    fetchTournaments,
    fetchTournament,
    createTournament,
    registerForTournament,
    unregisterFromTournament,
    clearError: () => setError(null)
  }
} 