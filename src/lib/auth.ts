import { NextAuthOptions } from 'next-auth'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        // Update last seen
        await prisma.user.update({
          where: { id: user.id },
          data: { 
            lastSeen: new Date(),
            status: 'online'
          }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          image: user.image,
          role: user.role,
          rank: user.rank,
          points: user.points,
          wins: user.wins,
          losses: user.losses,
          level: user.level,
          xp: user.xp
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