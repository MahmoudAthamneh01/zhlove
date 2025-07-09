'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Award, Plus, Edit, Trash2, Search, Filter, Users } from 'lucide-react';

interface BadgeType {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  icon: string;
  color: string;
  type: string;
  requirement: string;
  isActive: boolean;
  createdAt: string;
  _count: {
    users: number;
  };
}

export default function BadgeManagementPage() {
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newBadge, setNewBadge] = useState({
    name: '',
    description: '',
    icon: '🏆',
    color: '#FFD700',
    type: 'achievement'
  });

  useEffect(() => {
    fetchBadges();
  }, []);

  const fetchBadges = async () => {
    try {
      const response = await fetch('/api/admin/badges');
      const data = await response.json();
      setBadges(data.badges || []);
    } catch (error) {
      console.error('Failed to fetch badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBadge = async () => {
    try {
      const response = await fetch('/api/admin/badges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBadge),
      });

      if (response.ok) {
        setShowCreateForm(false);
        setNewBadge({
          name: '',
          description: '',
          icon: '🏆',
          color: '#FFD700',
          type: 'achievement'
        });
        fetchBadges();
      }
    } catch (error) {
      console.error('Failed to create badge:', error);
    }
  };

  const toggleBadgeStatus = async (badgeId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/badges/${badgeId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchBadges();
      }
    } catch (error) {
      console.error('Failed to update badge status:', error);
    }
  };

  const deleteBadge = async (badgeId: string) => {
    if (!confirm('Are you sure you want to delete this badge?')) return;

    try {
      const response = await fetch(`/api/admin/badges/${badgeId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBadges();
      }
    } catch (error) {
      console.error('Failed to delete badge:', error);
    }
  };

  const getBadgeTypeColor = (type: string) => {
    switch (type) {
      case 'achievement': return 'bg-yellow-500';
      case 'rank': return 'bg-blue-500';
      case 'special': return 'bg-purple-500';
      case 'event': return 'bg-green-500';
      default: return 'bg-gray-500';
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
            <Award className="h-8 w-8" />
            Badge Management
          </h1>
          <p className="text-zh-border">Create and manage user badges</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-zh-accent hover:bg-zh-accent/80">
          <Plus className="h-4 w-4 mr-2" />
          Create Badge
        </Button>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {badges.map((badge) => (
          <Card key={badge.id} className="zh-card">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                    style={{ backgroundColor: badge.color }}
                  >
                    {badge.icon}
                  </div>
                  <div>
                    <CardTitle className="text-white text-lg">{badge.name}</CardTitle>
                    <Badge className={`${getBadgeTypeColor(badge.type)} text-white text-xs`}>
                      {badge.type}
                    </Badge>
                  </div>
                </div>
                <Badge className={badge.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                  {badge.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-zh-border text-sm mb-4">{badge.description}</p>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-sm text-zh-border">
                  <Users className="h-4 w-4" />
                  {badge._count.users} users have this badge
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleBadgeStatus(badge.id, badge.isActive)}
                >
                  {badge.isActive ? 'Deactivate' : 'Activate'}
                </Button>
                <Button variant="secondary" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => deleteBadge(badge.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {badges.length === 0 && (
        <Card className="zh-card">
          <CardContent className="text-center py-12">
            <Award className="h-12 w-12 text-zh-border mx-auto mb-4" />
            <div className="text-zh-border">No badges found.</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 