# 🔄 Frontend Updates for PHP API Migration

## 📋 Overview
This guide details the frontend changes needed to make your Next.js frontend work with the new PHP APIs.

## 🔧 Required Changes

### 1. API Base URL Configuration

Update your API configuration to handle both development and production:

```typescript
// lib/api.ts or utils/api.ts
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'  // For Next.js dev server
  : 'https://yourdomain.com'  // For production with PHP APIs

export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include', // Important for PHP sessions
    ...options,
  }
  
  const response = await fetch(url, defaultOptions)
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Network error' }))
    throw new Error(error.error || 'API request failed')
  }
  
  return response.json()
}
```

### 2. Authentication Updates

Update your authentication logic:

```typescript
// lib/auth.ts or hooks/useAuth.ts
export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await apiCall('/api/auth/session')
      setUser(response.authenticated ? response.user : null)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await apiCall('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    if (response.user) {
      setUser(response.user)
      return response.user
    }
    throw new Error(response.error || 'Login failed')
  }

  const logout = async () => {
    await apiCall('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const register = async (userData: {
    email: string
    password: string
    username: string
    name?: string
  }) => {
    const response = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    })
    
    if (response.user) {
      setUser(response.user)
      return response.user
    }
    throw new Error(response.error || 'Registration failed')
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return { user, loading, login, logout, register, checkAuth }
}
```

### 3. Update Form Handlers

Update your form submission handlers:

```typescript
// Before (Next.js API route)
const handleSubmit = async (data: FormData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  
  if (!response.ok) {
    throw new Error('Registration failed')
  }
  
  return response.json()
}

// After (PHP API compatible)
const handleSubmit = async (data: FormData) => {
  try {
    const result = await apiCall('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    
    // Handle success
    return result
  } catch (error) {
    // Handle error
    throw error
  }
}
```

### 4. Data Fetching Updates

Update your data fetching patterns:

```typescript
// hooks/useUsers.ts
export const useUsers = (params?: {
  search?: string
  limit?: number
  offset?: number
  orderBy?: string
  order?: 'asc' | 'desc'
}) => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const queryParams = new URLSearchParams()
      
      if (params?.search) queryParams.append('search', params.search)
      if (params?.limit) queryParams.append('limit', params.limit.toString())
      if (params?.offset) queryParams.append('offset', params.offset.toString())
      if (params?.orderBy) queryParams.append('orderBy', params.orderBy)
      if (params?.order) queryParams.append('order', params.order)
      
      const url = `/api/users${queryParams.toString() ? `?${queryParams}` : ''}`
      const response = await apiCall(url)
      
      setUsers(response.users)
      setError(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchUsers()
  }, [params?.search, params?.limit, params?.offset, params?.orderBy, params?.order])
  
  return { users, loading, error, refetch: fetchUsers }
}
```

### 5. Update Tournament Components

```typescript
// components/tournaments/TournamentsClient.tsx
export const TournamentsClient = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchTournaments = async (status?: string) => {
    try {
      setLoading(true)
      const params = status ? `?status=${status}` : ''
      const response = await apiCall(`/api/tournaments${params}`)
      setTournaments(response.tournaments)
    } catch (error) {
      console.error('Error fetching tournaments:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const registerForTournament = async (tournamentId: string) => {
    try {
      await apiCall('/api/tournaments/register', {
        method: 'POST',
        body: JSON.stringify({ tournamentId }),
      })
      
      // Refresh tournaments list
      fetchTournaments()
    } catch (error) {
      alert(error.message)
    }
  }
  
  // Component render logic...
}
```

### 6. Update Forum Components

```typescript
// components/forum/ForumClient.tsx
export const ForumClient = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  
  const fetchPosts = async (filters?: {
    category?: string
    sort?: string
    search?: string
    page?: number
  }) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (filters?.category) params.append('category', filters.category)
      if (filters?.sort) params.append('sort', filters.sort)
      if (filters?.search) params.append('search', filters.search)
      if (filters?.page) params.append('page', filters.page.toString())
      
      const url = `/api/forum/posts${params.toString() ? `?${params}` : ''}`
      const response = await apiCall(url)
      
      setPosts(response.posts)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }
  
  const likePost = async (postId: string) => {
    try {
      await apiCall('/api/forum/posts/like', {
        method: 'POST',
        body: JSON.stringify({ postId }),
      })
      
      // Update post in state
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, isLiked: true, likes: post.likes + 1 }
          : post
      ))
    } catch (error) {
      console.error('Error liking post:', error)
    }
  }
  
  // Component render logic...
}
```

### 7. Update Messages Component

```typescript
// components/messages/MessagesClient.tsx
export const MessagesClient = () => {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState([])
  const [selectedUser, setSelectedUser] = useState(null)
  
  const fetchConversations = async () => {
    try {
      const response = await apiCall('/api/messages')
      setConversations(response)
    } catch (error) {
      console.error('Error fetching conversations:', error)
    }
  }
  
  const fetchMessages = async (userId: string) => {
    try {
      const response = await apiCall(`/api/messages?with=${userId}`)
      setMessages(response)
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }
  
  const sendMessage = async (receiverId: string, content: string) => {
    try {
      const response = await apiCall('/api/messages', {
        method: 'POST',
        body: JSON.stringify({ receiverId, content }),
      })
      
      // Add message to state
      setMessages([...messages, response])
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }
  
  // Component render logic...
}
```

### 8. Environment Variables

Update your environment variables:

```bash
# .env.local (for development)
NEXT_PUBLIC_API_URL=http://localhost:3000

# .env.production (for production)
NEXT_PUBLIC_API_URL=https://yourdomain.com
```

### 9. Update Next.js Configuration

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // For production build to work with PHP APIs
  trailingSlash: true,
  
  // API routes only for development
  ...(process.env.NODE_ENV === 'development' && {
    rewrites: async () => [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8080/api/:path*', // PHP dev server
      },
    ],
  }),
  
  // Static export for production
  ...(process.env.NODE_ENV === 'production' && {
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
    },
  }),
}

module.exports = nextConfig
```

### 10. Build Script Updates

Update your package.json scripts:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:premium": "NODE_ENV=production next build",
    "start": "next start",
    "lint": "next lint",
    "export": "next export"
  }
}
```

## 🚀 Building for Production

### For Static Hosting (Hostinger Premium)

```bash
# Build the static version
npm run build:premium

# The 'out' directory will contain the static files
# Upload the contents of 'out/' to your public_html/ alongside the PHP APIs
```

### Development Workflow

```bash
# For development with PHP APIs
npm run dev

# For development with Next.js APIs (original)
npm run dev:original
```

## ✅ Testing Your Changes

### 1. Authentication Flow
- [ ] Registration works
- [ ] Login/logout functionality
- [ ] Session persistence across page reloads
- [ ] Protected routes redirect properly

### 2. Data Operations
- [ ] User listings load with search/pagination
- [ ] Tournament registration works
- [ ] Forum posts create and display
- [ ] Messages send and receive
- [ ] Clan operations function

### 3. Error Handling
- [ ] Network errors display properly
- [ ] Validation errors show correct messages
- [ ] Loading states work correctly
- [ ] Retry mechanisms function

## 🐛 Common Issues & Solutions

### Issue 1: CORS Errors
```typescript
// Solution: Ensure credentials are included
fetch(url, {
  credentials: 'include',
  // ... other options
})
```

### Issue 2: Session Not Persisting
```typescript
// Solution: Check cookie settings and domain
// Ensure PHP APIs set proper cookie domain and path
```

### Issue 3: Date Format Issues
```typescript
// Solution: Handle date parsing consistently
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString()
}
```

### Issue 4: Response Format Differences
```typescript
// Solution: Create response adapters
const adaptUserResponse = (phpUser: any) => ({
  id: phpUser.id,
  email: phpUser.email,
  username: phpUser.username,
  name: phpUser.name,
  joinedAt: phpUser.joinedAt || phpUser.joined_at,
  // ... map other fields
})
```

## 📱 Mobile Responsiveness

Ensure all components remain mobile-friendly:

```typescript
// Use consistent responsive design patterns
const ComponentName = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Component content */}
    </div>
  )
}
```

## 🎉 Deployment Checklist

- [ ] All API calls updated to use new format
- [ ] Authentication flow tested
- [ ] Error handling implemented
- [ ] Loading states working
- [ ] Mobile responsiveness maintained
- [ ] Environment variables configured
- [ ] Build process updated
- [ ] Static files optimized

Your frontend is now ready to work with the PHP APIs! 🚀