import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Search,
  ArrowRight,
  Shield,
  UserCircle,
  FileText,
  BarChart3,
  Settings,
  RefreshCw,
  XCircle
} from "lucide-react";
import type { User, Developer, Payment, MarketData } from "@shared/schema";

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading: usersLoading, isError: usersError, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: developers = [], isLoading: developersLoading, isError: developersError } = useQuery<Developer[]>({
    queryKey: ["/api/admin/developers"],
  });

  const { data: payments = [], isLoading: paymentsLoading, isError: paymentsError } = useQuery<Payment[]>({
    queryKey: ["/api/admin/payments"],
  });

  const { data: marketData = [], isLoading: marketDataLoading, isError: marketDataError } = useQuery<MarketData[]>({
    queryKey: ["/api/admin/market-data"],
  });

  const totalRevenue = payments
    .filter(p => p.paymentStatus === 'completed')
    .reduce((sum, p) => sum + Number(p.amount), 0);

  const clientCount = users.filter(u => u.role === 'client').length;
  const developerCount = developers.length;
  const adminCount = users.filter(u => u.role === 'admin').length;
  const pendingPayments = payments.filter(p => p.paymentStatus === 'pending').length;

  // Filter recent users
  const recentUsers = users
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10)
    .filter(user => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.customerCode?.toLowerCase().includes(query)
      );
    });

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'admin':
        return 'default';
      case 'developer':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-3 w-3" />;
      case 'developer':
        return <Building2 className="h-3 w-3" />;
      default:
        return <UserCircle className="h-3 w-3" />;
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent mb-2">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">
            Monitor platform performance and manage all operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/admin/analytics">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button variant="outline" className="gap-2" asChild>
            <Link href="/admin/cms">
              <FileText className="h-4 w-4" />
              CMS
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-elevate border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">
              ${totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {payments.filter(p => p.paymentStatus === 'completed').length} transactions
              </Badge>
              {pendingPayments > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {pendingPayments} pending
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{users.length}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs gap-1">
                <UserCircle className="h-3 w-3" />
                {clientCount} clients
              </Badge>
              <Badge variant="outline" className="text-xs gap-1">
                <Shield className="h-3 w-3" />
                {adminCount} admins
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Developers
            </CardTitle>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
              <Building2 className="h-5 w-5" style={{color: '#ffd700'}} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{developerCount}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {developers.filter(d => d.verified).length} verified
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {developers.filter(d => !d.verified).length} pending
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate border-border/50 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Market Data
            </CardTitle>
            <div className="w-10 h-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-chart-3" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{marketData.length}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Active data points
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/users">
          <Card className="hover-elevate cursor-pointer active-elevate-2 border-border/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Manage Users</h3>
                    <p className="text-sm text-muted-foreground">View and edit all users</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/developers">
          <Card className="hover-elevate cursor-pointer active-elevate-2 border-border/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{backgroundColor: 'rgba(255,215,0,0.1)'}}>
                    <Building2 className="h-6 w-6" style={{color: '#ffd700'}} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Developers</h3>
                    <p className="text-sm text-muted-foreground">Review and verify</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/payments">
          <Card className="hover-elevate cursor-pointer active-elevate-2 border-border/50 transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-chart-2" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Payments</h3>
                    <p className="text-sm text-muted-foreground">Track transactions</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent Users Table */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Recent Users</CardTitle>
              <CardDescription>Latest user registrations with customer codes</CardDescription>
            </div>
            <div className="relative w-full md:w-[300px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-users"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {usersError ? (
            <Alert variant="destructive" data-testid="alert-users-error">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Users</AlertTitle>
              <AlertDescription className="space-y-2">
                <p>Failed to load users data. Please try again.</p>
                <Button 
                  onClick={() => refetchUsers()} 
                  variant="outline" 
                  size="sm" 
                  className="mt-2"
                  data-testid="button-retry-users"
                >
                  <RefreshCw className="h-3 w-3 me-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          ) : usersLoading ? (
            <div className="space-y-3" data-testid="skeleton-users-loading">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : recentUsers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Code</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id} className="hover-elevate" data-testid={`row-user-${user.id}`}>
                      <TableCell>
                        <Badge variant="outline" className="font-mono font-semibold">
                          {user.customerCode || 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                            <span className="text-sm font-bold text-primary-foreground">
                              {user.firstName?.[0]}{user.lastName?.[0]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {user.firstName} {user.lastName}
                            </p>
                            {user.notes && (
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {user.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={getRoleBadgeVariant(user.role)} className="gap-1">
                          {getRoleIcon(user.role)}
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{user.phone || 'N/A'}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href="/admin/users">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
          {!usersLoading && recentUsers.length > 0 && (
            <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {recentUsers.length} of {users.length} users
              </p>
              <Button variant="outline" asChild>
                <Link href="/admin/users">
                  View All Users
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
