'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Trophy, Plus, Edit, Trash2, Users, Calendar } from 'lucide-react';

interface Tournament {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  maxParticipants: number;
  prizePool: string | null;
  startDate: string;
  endDate: string | null;
  createdAt: string;
  organizerId: string;
  organizer: {
    username: string;
    name: string | null;
  };
  _count: {
    participants: number;
  };
}

export default function TournamentManagementPage() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, [statusFilter]);

  const fetchTournaments = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      const response = await fetch(`/api/admin/tournaments?${params}`);
      const data = await response.json();
      setTournaments(data.tournaments || []);
    } catch (error) {
      console.error('Failed to fetch tournaments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateTournamentStatus = async (tournamentId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/tournaments/${tournamentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchTournaments();
      }
    } catch (error) {
      console.error('Failed to update tournament status:', error);
    }
  };

  const deleteTournament = async (tournamentId: string) => {
    if (!confirm('Are you sure you want to delete this tournament?')) return;

    try {
      const response = await fetch(`/api/admin/tournaments/${tournamentId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTournaments();
      }
    } catch (error) {
      console.error('Failed to delete tournament:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'active': return 'bg-green-500';
      case 'completed': return 'bg-gray-500';
      case 'cancelled': return 'bg-red-500';
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
            <Trophy className="h-8 w-8" />
            Tournament Management
          </h1>
          <p className="text-zh-border">Create and manage tournaments</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)} className="bg-zh-accent hover:bg-zh-accent/80">
          <Plus className="h-4 w-4 mr-2" />
          Create Tournament
        </Button>
      </div>

      {/* Filters */}
      <Card className="zh-card">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <select
              className="w-48 px-3 py-2 rounded-md border border-zh-border bg-zh-secondary text-white focus:outline-none focus:ring-2 focus:ring-zh-accent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Tournaments</option>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Button onClick={fetchTournaments} variant="secondary">
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tournaments List */}
      <div className="grid gap-6">
        {tournaments.map((tournament) => (
          <Card key={tournament.id} className="zh-card">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    {tournament.title}
                  </CardTitle>
                  <p className="text-sm text-zh-border mt-1">
                    Organized by @{tournament.organizer.username}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`${getStatusBadgeColor(tournament.status)} text-white`}>
                    {tournament.status}
                  </Badge>
                  <Badge variant="secondary">
                    {tournament.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-zh-border text-sm">{tournament.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-zh-border">Participants:</span>
                    <div className="text-white font-medium">
                      {tournament._count.participants} / {tournament.maxParticipants}
                    </div>
                  </div>
                  <div>
                    <span className="text-zh-border">Prize Pool:</span>
                    <div className="text-white font-medium">
                      {tournament.prizePool || 'None'}
                    </div>
                  </div>
                  <div>
                    <span className="text-zh-border">Start Date:</span>
                    <div className="text-white font-medium">
                      {new Date(tournament.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-zh-border">Created:</span>
                    <div className="text-white font-medium">
                      {new Date(tournament.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-zh-border/20">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-zh-border" />
                    <span className="text-sm text-zh-border">
                      {tournament._count.participants} registered
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <select
                      className="w-32 px-2 py-1 rounded bg-zh-container border border-zh-border text-white text-sm"
                      value={tournament.status}
                      onChange={(e) => updateTournamentStatus(tournament.id, e.target.value)}
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <Button variant="secondary" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteTournament(tournament.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {tournaments.length === 0 && (
        <Card className="zh-card">
          <CardContent className="text-center py-12">
            <Trophy className="h-12 w-12 text-zh-border mx-auto mb-4" />
            <div className="text-zh-border">No tournaments found.</div>
            <Button 
              onClick={() => setShowCreateForm(true)} 
              className="mt-4 bg-zh-accent hover:bg-zh-accent/80"
            >
              Create Your First Tournament
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Create Tournament Modal would go here */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="zh-card w-full max-w-2xl mx-4">
            <CardHeader>
              <CardTitle className="text-white">Create New Tournament</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-white mb-2 block">
                  Tournament Title
                </label>
                <Input placeholder="Enter tournament name..." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Type
                  </label>
                  <select className="w-full px-3 py-2 rounded-md border border-zh-border bg-zh-secondary text-white focus:outline-none focus:ring-2 focus:ring-zh-accent">
                    <option value="">Select type</option>
                    <option value="1v1">1v1</option>
                    <option value="2v2">2v2</option>
                    <option value="3v3">3v3</option>
                    <option value="ffa">Free For All</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-white mb-2 block">
                    Max Participants
                  </label>
                  <Input type="number" placeholder="16" />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="secondary" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </Button>
                <Button className="bg-zh-accent hover:bg-zh-accent/80">
                  Create Tournament
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
} 