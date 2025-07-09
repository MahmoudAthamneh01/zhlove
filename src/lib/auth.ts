import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { apiRequest, API_CONFIG } from './api-config'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || 'zh-love-super-secret-key-2024-change-in-production',
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Call PHP backend for authentication
          const response = await apiRequest(API_CONFIG.endpoints.auth.login, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          })

          if (response.success && response.user) {
            const user = response.user
            return {
              id: user.id,
              email: user.email,
              name: user.name || user.username,
              username: user.username,
              image: user.image,
              role: user.role,
              rank: user.rank,
              points: user.points || 0,
              wins: user.wins || 0,
              losses: user.losses || 0,
              level: user.level || 1,
              xp: user.xp || 0
            }
          }
          
          return null
        } catch (error) {
          console.error('Authentication error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.username = user.username
        token.role = user.role
        token.rank = user.rank
        token.points = user.points
        token.wins = user.wins
        token.losses = user.losses
        token.level = user.level
        token.xp = user.xp
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.username = token.username as string
        session.user.role = token.role as string
        session.user.rank = token.rank as string
        session.user.points = token.points as number
        session.user.wins = token.wins as number
        session.user.losses = token.losses as number
        session.user.level = token.level as number
        session.user.xp = token.xp as number
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
} 