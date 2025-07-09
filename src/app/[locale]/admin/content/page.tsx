'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Eye, 
  Flag, 
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author: {
    username: string;
    name: string | null;
  };
  createdAt: string;
  status: string;
  _count: {
    comments: number;
    likes: number;
    reports: number;
  };
}

interface Report {
  id: string;
  type: string;
  reason: string;
  status: string;
  reportedAt: string;
  reporter: {
    username: string;
  };
  post?: {
    id: string;
    title: string;
    author: {
      username: string;
    };
  };
  comment?: {
    id: string;
    content: string;
    author: {
      username: string;
    };
  };
}

interface ContentManagementPageProps {
  params: {
    locale: string;
  };
}

export default function ContentModerationPage({ params: { locale } }: ContentManagementPageProps) {
  // Enable static rendering for this page
  if (typeof window === 'undefined') {
    setRequestLocale(locale);
  }

  const [activeTab, setActiveTab] = useState<'posts' | 'reports'>('posts');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (activeTab === 'posts') {
      fetchPosts();
    } else {
      fetchReports();
    }
  }, [activeTab, searchTerm]);

  const fetchPosts = async () => {
    try {
      const params = new URLSearchParams({
        search: searchTerm,
        includeReported: 'true',
      });

      const response = await fetch(`/api/admin/content/posts?${params}`);
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams({
        status: 'pending',
      });

      const response = await fetch(`/api/admin/content/reports?${params}`);
      const data = await response.json();
      setReports(data.reports || []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const moderatePost = async (postId: string, action: 'approve' | 'remove') => {
    try {
      const response = await fetch(`/api/admin/content/posts/${postId}/moderate`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Failed to moderate post:', error);
    }
  };

  const handleReport = async (reportId: string, action: 'approve' | 'dismiss') => {
    try {
      const response = await fetch(`/api/admin/content/reports/${reportId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: action === 'approve' ? 'approved' : 'dismissed' }),
      });

      if (response.ok) {
        fetchReports();
      }
    } catch (error) {
      console.error('Failed to handle report:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-zh-accent/20 border-t-zh-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-8 w-8" />
            Content Moderation
          </h1>
          <p className="text-zh-border">Moderate posts, comments, and handle reports</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-zh-border/20">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'posts'
              ? 'text-zh-accent border-b-2 border-zh-accent'
              : 'text-zh-border hover:text-white'
          }`}
        >
          Posts ({posts.length})
        </button>
        <button
          onClick={() => setActiveTab('reports')}
          className={`pb-4 px-2 font-medium transition-colors ${
            activeTab === 'reports'
              ? 'text-zh-accent border-b-2 border-zh-accent'
              : 'text-zh-border hover:text-white'
          }`}
        >
          Reports ({reports.length})
        </button>
      </div>

      {/* Search */}
      <Card className="zh-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zh-border" />
            <Input
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Posts Tab */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="zh-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{post.title}</CardTitle>
                    <p className="text-sm text-zh-border mt-1">
                      by @{post.author.username} • {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${
                        post.status === 'active' ? 'bg-green-500' : 
                        post.status === 'removed' ? 'bg-red-500' : 'bg-yellow-500'
                      } text-white`}
                    >
                      {post.status}
                    </Badge>
                    {post._count.reports > 0 && (
                      <Badge className="bg-red-500 text-white">
                        <Flag className="h-3 w-3 mr-1" />
                        {post._count.reports}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-zh-border text-sm mb-4 line-clamp-3">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-zh-border">
                    <span>{post._count.comments} comments</span>
                    <span>{post._count.likes} likes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    
                    {post.status === 'active' ? (
                      <Button 
                        variant="destructive" 
                        size="sm"
                        onClick={() => moderatePost(post.id, 'remove')}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    ) : (
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => moderatePost(post.id, 'approve')}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Restore
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          {reports.map((report) => (
            <Card key={report.id} className="zh-card">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      {report.type} Report
                    </CardTitle>
                    <p className="text-sm text-zh-border mt-1">
                      Reported by @{report.reporter.username} • {new Date(report.reportedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">
                    {report.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-2">Reason:</h4>
                  <p className="text-zh-border text-sm">{report.reason}</p>
                </div>

                {report.post && (
                  <div className="mb-4 p-3 bg-zh-container rounded-lg">
                    <h4 className="text-white font-medium mb-1">Reported Post:</h4>
                    <p className="text-sm text-zh-border">"{report.post.title}" by @{report.post.author.username}</p>
                  </div>
                )}

                {report.comment && (
                  <div className="mb-4 p-3 bg-zh-container rounded-lg">
                    <h4 className="text-white font-medium mb-1">Reported Comment:</h4>
                    <p className="text-sm text-zh-border">"{report.comment.content}" by @{report.comment.author.username}</p>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleReport(report.id, 'approve')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Take Action
                  </Button>
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={() => handleReport(report.id, 'dismiss')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Dismiss
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Empty States */}
      {((activeTab === 'posts' && posts.length === 0) || 
        (activeTab === 'reports' && reports.length === 0)) && (
        <Card className="zh-card">
          <CardContent className="text-center py-12">
            <div className="text-zh-border">
              {activeTab === 'posts' ? 'No posts found.' : 'No pending reports.'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 