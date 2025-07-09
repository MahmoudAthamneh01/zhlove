'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search, 
  Filter, 
  Edit, 
  Ban, 
  CheckCircle, 
  XCircle,
  Crown,
  Shield,
  User
} from 'lucide-react';
import { setRequestLocale } from 'next-intl/server';

interface User {
  id: string;
  username: string;
  name: string | null;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
  lastSeen: string | null;
  points: number;
  wins: number;
  losses: number;
  isAdmin: boolean;
  isModerator: boolean;
}

interface UserManagementPageProps {
  params: { locale: string };
}

export default function UserManagementPage({ params: { locale } }: UserManagementPageProps) {
  // Enable static rendering for this page
  if (typeof window === 'undefined') {
    setRequestLocale(locale);
  }

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, roleFilter, statusFilter, searchTerm]);

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        search: searchTerm,
        role: roleFilter,
        status: statusFilter,
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();
      
      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user role:', error);
    }
  };

  const updateUserStatus = async (userId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchUsers();
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-4 w-4" />;
      case 'moderator': return <Shield className="h-4 w-4" />;
      default: return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-500';
      case 'moderator': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'banned': return 'bg-red-500';
      case 'suspended': return 'bg-yellow-500';
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
            <Users className="h-8 w-8" />
            User Management
          </h1>
          <p className="text-zh-border">Manage users, roles, and permissions</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="zh-card">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-zh-border" />
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              className="flex h-10 w-full appearance-none rounded-md border border-zh-border bg-zh-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zh-accent"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="user">User</option>
            </select>

            <select
              className="flex h-10 w-full appearance-none rounded-md border border-zh-border bg-zh-secondary px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-zh-accent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="suspended">Suspended</option>
            </select>

            <Button onClick={fetchUsers} variant="secondary">
              <Filter className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="zh-card">
        <CardHeader>
          <CardTitle className="text-white">Users ({users.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zh-border/20">
                <tr className="text-left">
                  <th className="p-4 text-zh-border font-medium">User</th>
                  <th className="p-4 text-zh-border font-medium">Role</th>
                  <th className="p-4 text-zh-border font-medium">Status</th>
                  <th className="p-4 text-zh-border font-medium">Stats</th>
                  <th className="p-4 text-zh-border font-medium">Joined</th>
                  <th className="p-4 text-zh-border font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zh-border/10">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-zh-container/50">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-white">{user.name || user.username}</div>
                        <div className="text-sm text-zh-border">{user.email}</div>
                        <div className="text-xs text-zh-border">@{user.username}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getRoleBadgeColor(user.role)} text-white flex items-center gap-1 w-fit`}>
                        {getRoleIcon(user.role)}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <Badge className={`${getStatusBadgeColor(user.status)} text-white w-fit`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div className="text-white">{user.points} pts</div>
                        <div className="text-zh-border">{user.wins}W - {user.losses}L</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-zh-border">
                        {new Date(user.joinedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <select
                          className="w-32 px-2 py-1 rounded bg-zh-container border border-zh-border text-white text-sm"
                          value={user.role}
                          onChange={(e) => updateUserRole(user.id, e.target.value)}
                        >
                          <option value="user">User</option>
                          <option value="moderator">Moderator</option>
                          <option value="admin">Admin</option>
                        </select>

                        {user.status === 'active' ? (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => updateUserStatus(user.id, 'banned')}
                          >
                            <Ban className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => updateUserStatus(user.id, 'active')}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-zh-border/20 flex items-center justify-between">
              <div className="text-sm text-zh-border">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 