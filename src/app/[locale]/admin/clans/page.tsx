'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, Users, Trophy, Edit, Trash2 } from 'lucide-react';

interface Clan {
  id: string;
  name: string;
  tag: string;
  description: string | null;
  points: number;
  wins: number;
  losses: number;
  foundedAt: string;
  ownerId: string;
  owner: {
    username: string;
    name: string | null;
  };
  _count: {
    members: number;
  };
  members: Array<{
    id: string;
    user: {
      username: string;
      name: string | null;
    };
    role: string;
    joinedAt: string;
  }>;
}

export default function ClanManagementPage() {
  const [clans, setClans] = useState<Clan[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedClan, setExpandedClan] = useState<string | null>(null);

  useEffect(() => {
    fetchClans();
  }, [searchTerm]);

  const fetchClans = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/admin/clans?${params}`);
      const data = await response.json();
      setClans(data.clans || []);
    } catch (error) {
      console.error('Failed to fetch clans:', error);
    } finally {
      setLoading(false);
    }
  };

  const dissolveClan = async (clanId: string) => {
    if (!confirm('Are you sure you want to dissolve this clan? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/admin/clans/${clanId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClans();
      }
    } catch (error) {
      console.error('Failed to dissolve clan:', error);
    }
  };

  const removeMember = async (clanId: string, userId: string) => {
    if (!confirm('Are you sure you want to remove this member from the clan?')) return;

    try {
      const response = await fetch(`/api/admin/clans/${clanId}/members/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchClans();
      }
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'leader': return 'bg-yellow-500';
      case 'officer': return 'bg-blue-500';
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
            <Shield className="h-8 w-8" />
            Clan Management
          </h1>
          <p className="text-zh-border">View and manage all clans</p>
        </div>
      </div>

      {/* Search */}
      <Card className="zh-card">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-zh-border" />
            <Input
              placeholder="Search clans..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clans List */}
      <div className="space-y-4">
        {clans.map((clan) => (
          <Card key={clan.id} className="zh-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    {clan.name}
                    <Badge className="bg-zh-accent text-white">
                      [{clan.tag}]
                    </Badge>
                  </CardTitle>
                  <p className="text-sm text-zh-border mt-1">
                    Led by @{clan.owner.username} • Founded {new Date(clan.foundedAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 text-white">
                    {clan._count.members} members
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clan.description && (
                  <p className="text-zh-border text-sm">{clan.description}</p>
                )}
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-zh-border">Points:</span>
                    <div className="text-white font-medium">{clan.points}</div>
                  </div>
                  <div>
                    <span className="text-zh-border">Wins:</span>
                    <div className="text-white font-medium">{clan.wins}</div>
                  </div>
                  <div>
                    <span className="text-zh-border">Losses:</span>
                    <div className="text-white font-medium">{clan.losses}</div>
                  </div>
                  <div>
                    <span className="text-zh-border">Win Rate:</span>
                    <div className="text-white font-medium">
                      {clan.wins + clan.losses > 0 
                        ? Math.round((clan.wins / (clan.wins + clan.losses)) * 100) 
                        : 0}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zh-border/20">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setExpandedClan(
                        expandedClan === clan.id ? null : clan.id
                      )}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      {expandedClan === clan.id ? 'Hide' : 'Show'} Members
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => dissolveClan(clan.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Members List */}
                {expandedClan === clan.id && (
                  <div className="mt-4 p-4 bg-zh-container rounded-lg">
                    <h4 className="text-white font-medium mb-3">Clan Members</h4>
                    <div className="space-y-2">
                      {clan.members.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-2 bg-zh-secondary rounded">
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="text-white font-medium">
                                {member.user.name || member.user.username}
                              </div>
                              <div className="text-sm text-zh-border">
                                @{member.user.username}
                              </div>
                            </div>
                            <Badge className={`${getRoleColor(member.role)} text-white`}>
                              {member.role}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-zh-border">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </span>
                            {member.role !== 'leader' && (
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeMember(clan.id, member.user.username)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {clans.length === 0 && (
        <Card className="zh-card">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-zh-border mx-auto mb-4" />
            <div className="text-zh-border">No clans found.</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 