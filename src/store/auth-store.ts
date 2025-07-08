import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: 'user' | 'admin' | 'moderator';
  rank?: string;
  points?: number;
  clanId?: string;
  isVerified: boolean;
  joinDate: string;
  country?: string;
  favoriteGameMode?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (userData: any) => Promise<void>;
  setUser: (user: User) => void;
  clearError: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Mock successful login
          const mockUser: User = {
            id: '1',
            username: 'zhpro_gamer',
            email: email,
            firstName: 'John',
            lastName: 'Doe',
            avatar: '/api/placeholder/64/64',
            role: 'user',
            rank: 'Master',
            points: 2847,
            isVerified: true,
            joinDate: '2023-01-15',
            country: 'US',
            favoriteGameMode: '1v1'
          };

          set({ 
            user: mockUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: 'Invalid email or password', 
            isLoading: false 
          });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        });
      },

      signup: async (userData: any) => {
        set({ isLoading: true, error: null });
        
        try {
          // Mock API call - replace with actual API
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          // Mock successful signup
          const newUser: User = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            role: 'user',
            rank: 'Rookie',
            points: 0,
            isVerified: false,
            joinDate: new Date().toISOString().split('T')[0],
            country: userData.country,
            favoriteGameMode: userData.favoriteGameMode
          };

          set({ 
            user: newUser, 
            isAuthenticated: true, 
            isLoading: false,
            error: null 
          });
        } catch (error) {
          set({ 
            error: 'Account creation failed. Please try again.', 
            isLoading: false 
          });
          throw error;
        }
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true });
      },

      clearError: () => {
        set({ error: null });
      },

      updateProfile: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({ 
            user: { ...user, ...updates } 
          });
        }
      }
    }),
    {
      name: 'zh-love-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);

// Selectors for common use cases
export const useUser = () => useAuthStore(state => state.user);
export const useIsAuthenticated = () => useAuthStore(state => state.isAuthenticated);
export const useAuthLoading = () => useAuthStore(state => state.isLoading);
export const useAuthError = () => useAuthStore(state => state.error); 