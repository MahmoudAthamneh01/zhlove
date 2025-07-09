'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Shield, Search, Filter, Edit, Trash2, Users, Trophy, Target } from 'lucide-react';

interface Clan {
  id: string;
  name: string;
  tag: string;
  points: number;
  wins: number;
  losses: number;
  foundedAt: string;
  leaderId: string;
  leader: {
    username: string;
    name: string | null;
  };
  _count: {
    members: number;
  };
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
                    Led by @{clan.leader.username} • Founded {new Date(clan.foundedAt).toLocaleDateString()}
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
                {/* Members List */}
                {expandedClan === clan.id && (
                  <div className="mt-4 p-4 bg-zh-container rounded-lg">
                    <h4 className="text-white font-medium mb-3">Clan Members</h4>
                    <div className="space-y-2">
                      {/* The original code had members here, but the new_code removed the members array from the interface.
                          Assuming the intent was to remove the members list from the expanded view as well,
                          or that the members array is no longer available in the new_code's interface.
                          For now, removing the members list as it's not in the new_code's interface. */}
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