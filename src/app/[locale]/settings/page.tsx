import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { MainLayout } from '@/components/layout/main-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Settings,
  User,
  Shield,
  Bell,
  Globe,
  Eye,
  Lock,
  Mail,
  Camera,
  Save,
  X,
  Check,
  AlertTriangle,
  Moon,
  Sun,
  Volume2,
  Gamepad2,
  Monitor,
  Smartphone,
  Trash2
} from 'lucide-react';

// Export static params for all supported locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'ar' }];
}

// Mock user settings data
const mockUserSettings = {
  profile: {
    avatar: "/assets/placeholders/general.svg",
    username: "ZH_ProPlayer",
    firstName: "Ahmed",
    lastName: "Hassan",
    email: "ahmed@example.com",
    bio: "Professional Zero Hour player with 5+ years experience.",
    country: "Egypt",
    dateOfBirth: "1995-05-15",
    website: "https://zh-player.com"
  },
  preferences: {
    language: "en",
    theme: "dark",
    timezone: "UTC+2",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    gameInvites: true,
    clanNotifications: true,
    tournamentUpdates: true,
    forumReplies: true
  },
  privacy: {
    profileVisibility: "public",
    showOnlineStatus: true,
    allowMessages: "friends",
    showEmail: false,
    showStats: true,
    showClan: true,
    showRank: true
  },
  security: {
    twoFactorEnabled: false,
    lastPasswordChange: "2024-01-15",
    activeSessions: 3,
    loginAlerts: true
  }
};

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'preferences', label: 'Preferences', icon: Settings }
];

export default function SettingsPage({
  params: { locale }
}: {
  params: { locale: string };
}) {
  // Enable static rendering
  setRequestLocale(locale);
  
  const t = useTranslations();

  return (
    <MainLayout>
      <div className="min-h-screen py-8">
        <div className="zh-container">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
            <p className="text-gray-400">Manage your account preferences and security settings</p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Settings Navigation */}
            <div className="lg:col-span-1">
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white">Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {settingsSections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant="ghost"
                        className="w-full justify-start"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {section.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-3 space-y-6">
              
              {/* Profile Settings */}
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-6">
                    <img 
                      src={mockUserSettings.profile.avatar} 
                      alt="Profile"
                      className="w-24 h-24 rounded-full border-4 border-zh-accent"
                    />
                    <div>
                      <Button variant="outline" className="mb-2">
                        <Camera className="h-4 w-4 mr-2" />
                        Change Avatar
                      </Button>
                      <p className="text-sm text-gray-400">
                        Recommended: 400x400px, max 2MB
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Username
                      </label>
                      <Input 
                        value={mockUserSettings.profile.username}
                        placeholder="Enter username"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Email
                      </label>
                      <Input 
                        value={mockUserSettings.profile.email}
                        type="email"
                        placeholder="Enter email"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        First Name
                      </label>
                      <Input 
                        value={mockUserSettings.profile.firstName}
                        placeholder="Enter first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Last Name
                      </label>
                      <Input 
                        value={mockUserSettings.profile.lastName}
                        placeholder="Enter last name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Country
                      </label>
                      <Input 
                        value={mockUserSettings.profile.country}
                        placeholder="Enter country"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Website
                      </label>
                      <Input 
                        value={mockUserSettings.profile.website}
                        placeholder="https://example.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      Bio
                    </label>
                    <textarea 
                      className="w-full h-20 p-3 rounded-md border border-zh-border bg-zh-secondary text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-zh-accent focus:border-transparent"
                      value={mockUserSettings.profile.bio}
                      placeholder="Tell us about yourself..."
                    />
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="gaming">
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Privacy Settings */}
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Profile Visibility
                      </label>
                      <select className="w-full p-3 rounded-md border border-zh-border bg-zh-secondary text-white">
                        <option value="public">Public</option>
                        <option value="friends">Friends Only</option>
                        <option value="private">Private</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Who can message you
                      </label>
                      <select className="w-full p-3 rounded-md border border-zh-border bg-zh-secondary text-white">
                        <option value="everyone">Everyone</option>
                        <option value="friends">Friends Only</option>
                        <option value="none">No One</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show online status</h4>
                        <p className="text-sm text-gray-400">Others can see when you're online</p>
                      </div>
                      <div className="w-12 h-6 bg-zh-accent rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show game statistics</h4>
                        <p className="text-sm text-gray-400">Display your wins, losses, and rank</p>
                      </div>
                      <div className="w-12 h-6 bg-zh-accent rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Show clan membership</h4>
                        <p className="text-sm text-gray-400">Display your clan affiliation</p>
                      </div>
                      <div className="w-12 h-6 bg-zh-accent rounded-full relative">
                        <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notification Settings */}
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Email Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" checked />
                          <span className="text-sm text-gray-300">Game invites</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" checked />
                          <span className="text-sm text-gray-300">Tournament updates</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-300">Forum replies</span>
                        </label>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-white font-medium">Push Notifications</h4>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" checked />
                          <span className="text-sm text-gray-300">Clan activities</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" checked />
                          <span className="text-sm text-gray-300">Friend requests</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" className="rounded" />
                          <span className="text-sm text-gray-300">Match results</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Security Settings */}
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Security & Login
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-zh-primary/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-400">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline">
                      Enable 2FA
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-zh-primary/30 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">Change Password</h4>
                      <p className="text-sm text-gray-400">Last changed: January 15, 2024</p>
                    </div>
                    <Button variant="outline">
                      <Lock className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-zh-primary/30 rounded-lg">
                    <h4 className="text-white font-medium mb-2">Active Sessions</h4>
                    <p className="text-sm text-gray-400 mb-3">
                      You have 3 active sessions. Sign out of sessions you don't recognize.
                    </p>
                    <Button variant="outline" size="sm">
                      <Monitor className="h-4 w-4 mr-2" />
                      Manage Sessions
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="zh-card border-red-500/50">
                <CardHeader>
                  <CardTitle className="text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Danger Zone
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                    <div>
                      <h4 className="text-white font-medium">Delete Account</h4>
                      <p className="text-sm text-gray-400">
                        Permanently delete your account and all associated data
                      </p>
                    </div>
                    <Button variant="outline" className="border-red-500/50 text-red-400 hover:bg-red-500/20">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
} 