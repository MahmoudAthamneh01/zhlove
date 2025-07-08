export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  clan?: Clan;
  badges: Badge[];
  rankPoints: number;
  xp: number;
  isOnline: boolean;
  lastSeen: Date;
  createdAt: Date;
}

export interface Clan {
  id: string;
  name: string;
  tag: string;
  logo?: string;
  members: User[];
  leader: User;
  wins: number;
  losses: number;
  points: number;
  trophies: Trophy[];
  createdAt: Date;
}

export interface Tournament {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'single-elimination' | 'double-elimination' | 'round-robin' | 'ffa';
  maxParticipants: number;
  currentParticipants: number;
  status: 'upcoming' | 'registration' | 'active' | 'ended';
  prize?: string;
  streamer?: string;
  startDate: Date;
  endDate: Date;
  registrationDeadline: Date;
  rules: string;
  mapFile?: string;
  participants: User[];
  host: User;
  createdAt: Date;
}

export interface Challenge {
  id: string;
  challenger: User;
  challenged: User;
  type: '1v1' | '2v2' | '3v3' | '4v4';
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  prize?: string;
  rules: string;
  scheduledAt?: Date;
  completedAt?: Date;
  winner?: User;
  streamer?: string;
  notes?: string;
  createdAt: Date;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: User;
  likes: number;
  comments: ForumComment[];
  images?: string[];
  isPinned: boolean;
  isReported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ForumComment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  likes: number;
  replies: ForumComment[];
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  type: 'achievement' | 'rank' | 'tournament' | 'special';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Trophy {
  id: string;
  name: string;
  description: string;
  icon: string;
  achievedAt: Date;
}

export interface Replay {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  author: User;
  category: 'highlight' | 'tournament' | 'tutorial';
  map: string;
  players: string[];
  likes: number;
  downloads: number;
  duration: number;
  createdAt: Date;
}

export interface Streamer {
  id: string;
  name: string;
  channelUrl: string;
  platform: 'youtube' | 'twitch';
  avatar: string;
  isLive: boolean;
  followers: number;
  latestVideos: StreamerVideo[];
  isApproved: boolean;
}

export interface StreamerVideo {
  id: string;
  title: string;
  thumbnail: string;
  url: string;
  views: number;
  publishedAt: Date;
}

export interface GameStats {
  playersOnline: number;
  forumPosts: number;
  activeTournaments: number;
  totalMembers: number;
  totalClans: number;
  totalReplays: number;
}

export interface NavigationItem {
  href: string;
  label: string;
  icon?: string;
  children?: NavigationItem[];
  requireAuth?: boolean;
  adminOnly?: boolean;
} 