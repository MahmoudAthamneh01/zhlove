import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
}

interface AppState {
  // UI State
  sidebarOpen: boolean;
  theme: 'dark' | 'light';
  locale: 'en' | 'ar';
  
  // Notifications
  notifications: Notification[];
  unreadNotificationsCount: number;
  
  // Game Stats (real-time data)
  onlinePlayersCount: number;
  activeMatches: number;
  activeTournaments: number;
  
  // Loading states
  isPageLoading: boolean;
  
  // Actions
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setLocale: (locale: 'en' | 'ar') => void;
  
  // Notification actions
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Game stats actions
  updateGameStats: (stats: { onlinePlayersCount?: number; activeMatches?: number; activeTournaments?: number }) => void;
  
  // Loading actions
  setPageLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial UI state
      sidebarOpen: false,
      theme: 'dark',
      locale: 'en',
      
      // Initial notifications
      notifications: [
        {
          id: '1',
          type: 'info',
          title: 'Welcome to ZH-Love!',
          message: 'Thank you for joining our community. Check out the latest tournaments!',
          timestamp: Date.now() - 3600000, // 1 hour ago
          read: false
        },
        {
          id: '2',
          type: 'success',
          title: 'Tournament Registration Open',
          message: 'ZH World Championship 2024 registration is now open!',
          timestamp: Date.now() - 7200000, // 2 hours ago
          read: false
        }
      ],
      unreadNotificationsCount: 2,
      
      // Initial game stats
      onlinePlayersCount: 1247,
      activeMatches: 156,
      activeTournaments: 8,
      
      // Initial loading state
      isPageLoading: false,

      // UI Actions
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }));
      },

      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open });
      },

      setTheme: (theme: 'dark' | 'light') => {
        set({ theme });
      },

      setLocale: (locale: 'en' | 'ar') => {
        set({ locale });
      },

      // Notification Actions
      addNotification: (notification) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString(),
          timestamp: Date.now(),
          read: false
        };

        set(state => ({
          notifications: [newNotification, ...state.notifications],
          unreadNotificationsCount: state.unreadNotificationsCount + 1
        }));
      },

      markNotificationAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
          ),
          unreadNotificationsCount: Math.max(0, state.unreadNotificationsCount - 1)
        }));
      },

      markAllNotificationsAsRead: () => {
        set(state => ({
          notifications: state.notifications.map(notif => ({ ...notif, read: true })),
          unreadNotificationsCount: 0
        }));
      },

      removeNotification: (id: string) => {
        set(state => {
          const notification = state.notifications.find(n => n.id === id);
          const wasUnread = notification && !notification.read;
          
          return {
            notifications: state.notifications.filter(notif => notif.id !== id),
            unreadNotificationsCount: wasUnread 
              ? Math.max(0, state.unreadNotificationsCount - 1)
              : state.unreadNotificationsCount
          };
        });
      },

      clearAllNotifications: () => {
        set({
          notifications: [],
          unreadNotificationsCount: 0
        });
      },

      // Game stats actions
      updateGameStats: (stats) => {
        set(state => ({
          ...state,
          ...stats
        }));
      },

      // Loading actions
      setPageLoading: (loading: boolean) => {
        set({ isPageLoading: loading });
      }
    }),
    {
      name: 'zh-love-app',
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        sidebarOpen: state.sidebarOpen,
        notifications: state.notifications,
        unreadNotificationsCount: state.unreadNotificationsCount
      })
    }
  )
);

// Selectors for common use cases
export const useSidebarOpen = () => useAppStore(state => state.sidebarOpen);
export const useTheme = () => useAppStore(state => state.theme);
export const useLocale = () => useAppStore(state => state.locale);
export const useNotifications = () => useAppStore(state => state.notifications);
export const useUnreadNotificationsCount = () => useAppStore(state => state.unreadNotificationsCount);
export const useGameStats = () => useAppStore(state => ({
  onlinePlayersCount: state.onlinePlayersCount,
  activeMatches: state.activeMatches,
  activeTournaments: state.activeTournaments
}));
export const usePageLoading = () => useAppStore(state => state.isPageLoading); 