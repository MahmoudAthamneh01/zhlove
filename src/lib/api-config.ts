// API Configuration for PHP Backend on Hostinger
const getApiBaseUrl = () => {
  // In production, use the same domain for API calls
  if (typeof window !== 'undefined') {
    // Client-side: use current origin
    return `${window.location.origin}/api`;
  }
  
  // Server-side fallback (shouldn't be used in static export)
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
      register: '/auth/register.php',
      login: '/auth/login.php', 
      logout: '/auth/logout.php',
      session: '/auth/session.php'
    },
    
    // Users
    users: {
      list: '/users/index.php',
      profile: '/users/profile.php'
    },
    
    // Messages
    messages: '/messages/index.php',
    
    // Notifications  
    notifications: '/notifications/index.php',
    
    // Forum
    forum: {
      posts: '/forum/posts.php',
      like: '/forum/posts/like.php',
      stats: '/forum/stats.php'
    },
    
    // Tournaments
    tournaments: {
      list: '/tournaments/index.php',
      register: '/tournaments/register.php'
    },
    
    // Clans
    clans: '/clans/index.php',
    
    // Statistics
    stats: '/stats/index.php'
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