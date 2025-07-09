// API Configuration for PHP Backend
const getApiBaseUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    if (process.env.NODE_ENV === 'development') {
      return 'http://localhost:3000/api';
    }
    throw new Error('NEXT_PUBLIC_API_URL is required in production');
  }
  return apiUrl;
};

export const API_CONFIG = {
  baseUrl: getApiBaseUrl(),
  endpoints: {
    // Authentication
    auth: {
      register: '/auth/register',
      login: '/auth/login', 
      logout: '/auth/logout',
      session: '/auth/session'
    },
    
    // Users
    users: {
      list: '/users',
      profile: '/users/profile'
    },
    
    // Messages
    messages: '/messages',
    
    // Notifications  
    notifications: '/notifications',
    
    // Forum
    forum: {
      posts: '/forum/posts',
      like: '/forum/posts/like',
      stats: '/forum/stats'
    },
    
    // Tournaments
    tournaments: {
      list: '/tournaments',
      register: '/tournaments/register'
    },
    
    // Clans
    clans: '/clans',
    
    // Statistics
    stats: '/stats'
  }
};

// Helper function to build full API URL
export function buildApiUrl(endpoint: string): string {
  return `${API_CONFIG.baseUrl}${endpoint}`;
}

// API request helper with error handling
export async function apiRequest(
  endpoint: string,
  options: RequestInit = {}
): Promise<any> {
  const url = buildApiUrl(endpoint);
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for session cookies
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Request failed:', error);
    throw error;
  }
} 