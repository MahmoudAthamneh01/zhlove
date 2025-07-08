'use client';

import { useState, useEffect, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare,
  Users,
  TrendingUp,
  Clock,
  Heart,
  Reply,
  Share,
  Flag,
  Pin,
  Star,
  Search,
  Plus,
  User,
  Calendar,
  Eye,
  MessageCircle,
  ThumbsUp,
  Filter,
  Send,
  Image,
  Link,
  X,
  Edit,
  Trash2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  MoreHorizontal
} from 'lucide-react';
import { AnimatedBackground } from '@/components/ui/animated-background';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    username: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  updatedAt: string;
  replies: number;
  likes: number;
  views: number;
  isPinned: boolean;
  tags: string[];
  category: string;
  isLiked?: boolean;
  isBookmarked?: boolean;
}

interface ForumComment {
  id: string;
  content: string;
  author: {
    id: string;
    username: string;
    name: string;
    image?: string;
  };
  createdAt: string;
  likes: number;
  isLiked?: boolean;
  replies?: ForumComment[];
}

const categories = [
  { id: 'all', name: { en: 'All Posts', ar: 'جميع المنشورات' }, icon: MessageSquare, count: 156 },
  { id: 'strategy', name: { en: 'Strategy', ar: 'الاستراتيجيات' }, icon: TrendingUp, count: 42 },
  { id: 'tournament', name: { en: 'Tournaments', ar: 'البطولات' }, icon: Star, count: 18 },
  { id: 'clans', name: { en: 'Clans', ar: 'العشائر' }, icon: Users, count: 23 },
  { id: 'discussion', name: { en: 'Discussion', ar: 'النقاشات' }, icon: MessageCircle, count: 73 }
];

const sortOptions = [
  { id: 'recent', name: { en: 'Most Recent', ar: 'الأحدث' } },
  { id: 'popular', name: { en: 'Most Popular', ar: 'الأكثر شعبية' } },
  { id: 'liked', name: { en: 'Most Liked', ar: 'الأكثر إعجاباً' } },
  { id: 'replied', name: { en: 'Most Replied', ar: 'الأكثر رداً' } }
];

function formatTimeAgo(dateString: string, locale: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (locale === 'ar') {
    if (diffInHours < 1) return 'الآن';
    if (diffInHours < 24) return `منذ ${diffInHours} ساعة`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `منذ ${diffInDays} يوم`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `منذ ${diffInWeeks} أسبوع`;
  } else {
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w ago`;
  }
}

export default function ForumClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [showPostDetails, setShowPostDetails] = useState<string | null>(null);
  const [forumStats, setForumStats] = useState({
    totalPosts: 0,
    activeMembers: 0,
    todaysPosts: 0,
    onlineNow: 0
  });

  // New Post Form
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'discussion',
    tags: [] as string[]
  });
  const [newPostTag, setNewPostTag] = useState('');

  // Load posts and stats
  useEffect(() => {
    loadPosts();
    loadStats();
  }, [selectedCategory, sortBy, searchQuery]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        category: selectedCategory,
        sort: sortBy,
        search: searchQuery,
        language: locale
      });
      
      const response = await fetch(`/api/forum/posts?${params}`);
      if (response.ok) {
        const data = await response.json();
        setPosts(data.posts);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    }
    setLoading(false);
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/forum/stats');
      if (response.ok) {
        const data = await response.json();
        setForumStats(data);
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return;

    try {
      const response = await fetch('/api/forum/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newPost,
          language: locale
        }),
      });

      if (response.ok) {
        setNewPost({ title: '', content: '', category: 'discussion', tags: [] });
        setShowNewPostModal(false);
        loadPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/like`, {
        method: 'POST',
      });

      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { 
                ...post, 
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked 
              }
            : post
        ));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleBookmarkPost = async (postId: string) => {
    try {
      const response = await fetch(`/api/forum/posts/${postId}/bookmark`, {
        method: 'POST',
      });

      if (response.ok) {
        setPosts(prev => prev.map(post => 
          post.id === postId 
            ? { ...post, isBookmarked: !post.isBookmarked }
            : post
        ));
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
    }
  };

  const addTag = () => {
    if (newPostTag.trim() && !newPost.tags.includes(newPostTag.trim())) {
      setNewPost(prev => ({
        ...prev,
        tags: [...prev.tags, newPostTag.trim()]
      }));
      setNewPostTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewPost(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <AnimatedBackground variant="subtle" className="py-16">
        <div className="zh-container text-center">
          <MessageSquare className="h-16 w-16 text-zh-accent mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {locale === 'ar' ? 'منتدى المجتمع' : 'Community Forum'}
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            {locale === 'ar' 
              ? 'انضم للنقاشات، شارك الاستراتيجيات، وتواصل مع لاعبي Zero Hour الآخرين'
              : 'Join discussions, share strategies, and connect with fellow Zero Hour players'
            }
          </p>
        </div>
      </AnimatedBackground>

      {/* Forum Stats */}
      <section className="py-12 bg-zh-primary/20">
        <div className="zh-container">
          <div className="grid md:grid-cols-4 gap-6">
            <Card className="zh-card text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{forumStats.totalPosts.toLocaleString()}</div>
                <div className="text-sm text-gray-400">
                  {locale === 'ar' ? 'إجمالي المنشورات' : 'Total Posts'}
                </div>
              </CardContent>
            </Card>

            <Card className="zh-card text-center">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{forumStats.activeMembers.toLocaleString()}</div>
                <div className="text-sm text-gray-400">
                  {locale === 'ar' ? 'الأعضاء النشطون' : 'Active Members'}
                </div>
              </CardContent>
            </Card>

            <Card className="zh-card text-center">
              <CardContent className="p-6">
                <TrendingUp className="h-12 w-12 text-orange-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{forumStats.todaysPosts}</div>
                <div className="text-sm text-gray-400">
                  {locale === 'ar' ? 'منشورات اليوم' : "Today's Posts"}
                </div>
              </CardContent>
            </Card>

            <Card className="zh-card text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <div className="text-2xl font-bold text-white mb-1">{forumStats.onlineNow}</div>
                <div className="text-sm text-gray-400">
                  {locale === 'ar' ? 'متصل الآن' : 'Online Now'}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Forum Content */}
      <section className="py-16">
        <div className="zh-container">
          <div className="grid lg:grid-cols-4 gap-8">
            
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <Card className="zh-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    {locale === 'ar' ? 'الفئات' : 'Categories'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "gaming" : "ghost"}
                        className="w-full justify-between text-left"
                        onClick={() => setSelectedCategory(category.id)}
                      >
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {category.name[locale as 'ar' | 'en']}
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="zh-card mt-6">
                <CardHeader>
                  <CardTitle className="text-white">
                    {locale === 'ar' ? 'الإجراءات السريعة' : 'Quick Actions'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="gaming" 
                    className="w-full flex items-center gap-2"
                    onClick={() => setShowNewPostModal(true)}
                  >
                    <Plus className="h-4 w-4" />
                    {locale === 'ar' ? 'منشور جديد' : 'New Post'}
                  </Button>
                  <Button variant="outline" className="w-full flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    {locale === 'ar' ? 'البحث في المنشورات' : 'Search Posts'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Posts Feed */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <h2 className="text-2xl font-bold text-white">
                  {locale === 'ar' ? 'المنشورات الحديثة' : 'Recent Posts'}
                </h2>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-zh-primary border border-gray-600 text-white px-3 py-2 rounded-md text-sm"
                    >
                      {sortOptions.map((option) => (
                        <option key={option.id} value={option.id}>
                          {option.name[locale as 'ar' | 'en']}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Input 
                    placeholder={locale === 'ar' ? 'البحث في النقاشات...' : 'Search discussions...'}
                    className="w-64"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    variant="gaming" 
                    className="flex items-center gap-2"
                    onClick={() => setShowNewPostModal(true)}
                  >
                    <Plus className="h-4 w-4" />
                    {locale === 'ar' ? 'منشور جديد' : 'New Post'}
                  </Button>
                </div>
              </div>

              {/* Posts List */}
              <div className="space-y-4">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Card key={i} className="zh-card">
                        <CardContent className="p-6">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-600 rounded mb-3 w-3/4"></div>
                            <div className="h-3 bg-gray-700 rounded mb-2"></div>
                            <div className="h-3 bg-gray-700 rounded mb-2 w-5/6"></div>
                            <div className="flex gap-4 mt-4">
                              <div className="h-8 bg-gray-600 rounded w-16"></div>
                              <div className="h-8 bg-gray-600 rounded w-16"></div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : posts.length === 0 ? (
                  <Card className="zh-card">
                    <CardContent className="p-8 text-center">
                      <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {locale === 'ar' ? 'لا توجد منشورات' : 'No Posts Found'}
                      </h3>
                      <p className="text-gray-400 mb-4">
                        {locale === 'ar' 
                          ? 'كن أول من ينشر في هذه الفئة!'
                          : 'Be the first to post in this category!'
                        }
                      </p>
                      <Button 
                        variant="gaming"
                        onClick={() => setShowNewPostModal(true)}
                      >
                        {locale === 'ar' ? 'إنشاء منشور' : 'Create Post'}
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  posts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      locale={locale}
                      onLike={() => handleLikePost(post.id)}
                      onBookmark={() => handleBookmarkPost(post.id)}
                      onReply={() => setShowPostDetails(post.id)}
                    />
                  ))
                )}
              </div>

              {/* Load More */}
              {!loading && posts.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" className="flex items-center gap-2 mx-auto">
                    <Clock className="h-4 w-4" />
                    {locale === 'ar' ? 'تحميل المزيد' : 'Load More Posts'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="zh-card w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">
                  {locale === 'ar' ? 'منشور جديد' : 'New Post'}
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowNewPostModal(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'ar' ? 'العنوان' : 'Title'}
                </label>
                <Input
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={locale === 'ar' ? 'اكتب عنوان المنشور...' : 'Write post title...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'ar' ? 'الفئة' : 'Category'}
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full bg-zh-primary border border-gray-600 text-white px-3 py-2 rounded-md"
                >
                  {categories.filter(cat => cat.id !== 'all').map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name[locale as 'ar' | 'en']}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'ar' ? 'المحتوى' : 'Content'}
                </label>
                <Textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={locale === 'ar' ? 'اكتب محتوى المنشور...' : 'Write your post content...'}
                  rows={8}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {locale === 'ar' ? 'العلامات' : 'Tags'}
                </label>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newPostTag}
                    onChange={(e) => setNewPostTag(e.target.value)}
                    placeholder={locale === 'ar' ? 'أضف علامة...' : 'Add tag...'}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button onClick={addTag} variant="outline" size="sm">
                    {locale === 'ar' ? 'إضافة' : 'Add'}
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newPost.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag}
                      <X className="h-3 w-3" />
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowNewPostModal(false)}
                >
                  {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                </Button>
                <Button
                  variant="gaming"
                  onClick={handleCreatePost}
                  disabled={!newPost.title.trim() || !newPost.content.trim()}
                >
                  {locale === 'ar' ? 'نشر' : 'Post'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Post Card Component
function PostCard({ 
  post, 
  locale, 
  onLike, 
  onBookmark, 
  onReply 
}: { 
  post: ForumPost; 
  locale: string;
  onLike: () => void;
  onBookmark: () => void;
  onReply: () => void;
}) {
  return (
    <Card className="zh-card hover:border-zh-accent/50 transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <img 
            src={post.author.image || `/assets/placeholders/chat.svg`}
            alt={post.author.username}
            className="w-12 h-12 rounded-full"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {post.isPinned && (
                <Pin className="h-4 w-4 text-yellow-400" />
              )}
              <h3 className="text-lg font-semibold text-white hover:text-zh-accent cursor-pointer">
                {post.title}
              </h3>
            </div>
            
            <p className="text-gray-300 mb-3 line-clamp-2">
              {post.content}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {post.author.username}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {formatTimeAgo(post.createdAt, locale)}
                </div>
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  {post.views}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={`flex items-center gap-1 ${post.isLiked ? 'text-red-400' : ''}`}
                  onClick={onLike}
                >
                  <Heart className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm" className="flex items-center gap-1" onClick={onReply}>
                  <MessageCircle className="h-4 w-4" />
                  {post.replies}
                </Button>
                <Button variant="ghost" size="sm" onClick={onBookmark}>
                  <Bookmark className={`h-4 w-4 ${post.isBookmarked ? 'fill-current text-yellow-400' : ''}`} />
                </Button>
                <Button variant="ghost" size="sm">
                  <Share className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 