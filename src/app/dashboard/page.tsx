'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  PiggyBank, 
  HandCoins, 
  TrendingUp, 
  ArrowUp, 
  ArrowDown,
  Calendar,
  Bell,
  Target,
  Wallet,
  PieChart,
  BarChart3,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Download,
  Filter,
  ChevronDown,
  FileText,
  Table,
  PieChart as PieChartIcon,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';
import { DashboardStats, QuickStat, RecentActivity, UpcomingEvent } from '@/types';
import { routes } from '@/lib/routes';

// Define types for our enhanced functionality
type ExportFormat = 'excel' | 'csv' | 'pdf';
type FilterType = 'dateRange' | 'status' | 'type' | 'member';
type DateRange = {
  start: string;
  end: string;
};

interface FilterState {
  dateRange: DateRange;
  status: string[];
  type: string[];
  member: string[];
}

export default function DashboardOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalMembers: 0,
    totalSavings: 0,
    activeLoans: 0,
    totalInvestments: 0,
    monthlyContributions: 0,
    nextMeeting: '',
    loanRepaymentsDue: 0,
    ngumbatoBalance: 0,
    performance: 0
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [quickStats, setQuickStats] = useState<QuickStat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Enhanced state for filters and exports
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(false);
  const [showExportOptions, setShowExportOptions] = useState<boolean>(false);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    dateRange: { start: '', end: '' },
    status: [],
    type: [],
    member: []
  });

  // Mobile menu state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Close mobile menu when clicking on links
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newStats: DashboardStats = {
      totalMembers: 24,
      totalSavings: 485000,
      activeLoans: 3,
      totalInvestments: 1200000,
      monthlyContributions: 125000,
      nextMeeting: '2024-01-15',
      loanRepaymentsDue: 75000,
      ngumbatoBalance: 150000,
      performance: 85
    };
    
    setStats(newStats);

    setQuickStats([
      {
        title: "Monthly Target",
        value: "125K/150K",
        change: "+83%",
        changeType: "positive",
        icon: Target,
        color: "bg-blue-500"
      },
      {
        title: "Avg Contribution",
        value: "KSh 5,208",
        change: "+12%",
        changeType: "positive",
        icon: Wallet,
        color: "bg-green-500"
      },
      {
        title: "Loan Recovery",
        value: "92%",
        change: "+5%",
        changeType: "positive",
        icon: PieChart,
        color: "bg-purple-500"
      },
      {
        title: "Active Projects",
        value: "3",
        change: "On track",
        changeType: "neutral",
        icon: BarChart3,
        color: "bg-orange-500"
      }
    ]);

    setRecentActivity([
      {
        id: '1',
        type: 'contribution',
        description: 'Monthly contribution',
        amount: 5000,
        date: '2024-01-10',
        member: 'Jane Wanjiku',
        status: 'completed'
      },
      {
        id: '2',
        type: 'loan',
        description: 'Loan disbursement',
        amount: 50000,
        date: '2024-01-08',
        member: 'Michael Otieno',
        status: 'completed'
      },
      {
        id: '3',
        type: 'meeting',
        description: 'Monthly meeting held',
        date: '2024-01-05',
        member: 'All members',
        status: 'completed'
      },
      {
        id: '4',
        type: 'ngumbato',
        description: 'Emergency fund contribution',
        amount: 2000,
        date: '2024-01-03',
        member: 'Grace Auma',
        status: 'completed'
      },
      {
        id: '5',
        type: 'investment',
        description: 'Real estate investment',
        amount: 300000,
        date: '2024-01-01',
        member: 'Chama Board',
        status: 'pending'
      }
    ]);

    setUpcomingEvents([
      {
        id: '1',
        type: 'meeting',
        title: 'Monthly General Meeting',
        date: '2024-01-15',
        description: 'Venue: Community Hall, 2:00 PM',
        priority: 'high'
      },
      {
        id: '2',
        type: 'loan_due',
        title: 'Loan Repayment Due',
        date: '2024-01-20',
        description: 'John Kamau - KSh 15,000',
        priority: 'medium'
      },
      {
        id: '3',
        type: 'contribution_deadline',
        title: 'Monthly Contributions Deadline',
        date: '2024-01-25',
        description: 'All members must complete contributions',
        priority: 'medium'
      }
    ]);

    setIsLoading(false);
  };

  // Enhanced filter functionality
  const handleFilterChange = (filterType: FilterType, value: string | string[] | DateRange) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearAllFilters = (): void => {
    setActiveFilters({
      dateRange: { start: '', end: '' },
      status: [],
      type: [],
      member: []
    });
    setShowFilterPanel(false);
  };

  const getActiveFilterCount = (): number => {
    let count = 0;
    if (activeFilters.dateRange.start || activeFilters.dateRange.end) count++;
    count += activeFilters.status.length;
    count += activeFilters.type.length;
    count += activeFilters.member.length;
    return count;
  };

  // Enhanced export functionality
  const handleExport = async (format: ExportFormat): Promise<void> => {
    setShowExportOptions(false);
    
    // Simulate export process
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log(`Exporting dashboard data as ${format.toUpperCase()} with filters:`, activeFilters);
    
    setIsLoading(false);
    
    // Show success message (you can replace with toast notification)
    alert(`Dashboard data exported successfully as ${format.toUpperCase()}`);
  };

  // Quick Actions with proper typing
  const quickActions = [
    {
      label: 'Add New Member',
      icon: Users,
      href: routes.members.add,
      description: 'Register new chama member',
    },
    {
      label: 'Record Contribution',
      icon: PiggyBank,
      href: routes.savings.add,
      description: 'Log member savings',
    },
    {
      label: 'Process Loan',
      icon: HandCoins,
      href: routes.loans.add,
      description: 'Approve or disburse loan',
    },
    {
      label: 'Schedule Meeting',
      icon: Calendar,
      href: routes.meetings.schedule, 
      description: 'Plan next meeting',
    },
    {
      label: 'View Reports',
      icon: PieChart,
      href: routes.reports.overview,
      description: 'Analyze chama performance',
    },
    {
      label: 'Manage Investments',
      icon: Target,
      href: routes.investments.add,
      description: 'Oversee investment portfolio',
    },
    { 
      label: 'Ngumbato Fund',
      icon: Wallet,
      href: routes.ngumbato.contribute,
      description: 'Handle emergency funds',
    },
    {
      label: 'Withdrawals',
      icon: AlertCircle,
      href: routes.withdrawals.request,
      description: 'Member withdrawal requests',
    },
    {
      label: 'Fines',
      icon: XCircle,
      href: routes.fines.add,
      description: 'Manage member fines',
    },
    {
      label: 'Articles',
      icon: FileText,
      href: routes.articles.add,
      description: 'Chama news & updates',
    },
    {    
      label: 'Podcasts',
      icon: MoreVertical,
      href: routes.podcasts.add,
      description: 'Listen to chama talks',
    },
    {
      label: 'Settings',
      icon: AlertCircle,
      href: routes.dashboard + '/settings',
      description: 'Chama configuration',
    },
  ];

  const StatCard = ({ title, value, icon: Icon, change, changeType, subtitle, trend }: any) => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:scale-[1.02]">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {isLoading ? (
                <div className="h-8 bg-gray-200 rounded animate-pulse w-24"></div>
              ) : (
                value
              )}
            </div>
            {change && (
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                changeType === 'positive' 
                  ? 'bg-green-100 text-green-800' 
                  : changeType === 'negative'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {changeType === 'positive' ? <ArrowUp className="h-3 w-3 mr-1" /> : 
                 changeType === 'negative' ? <ArrowDown className="h-3 w-3 mr-1" /> : null}
                {change}
              </div>
            )}
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl ${trend?.color || 'bg-blue-100'}`}>
            <Icon className={`h-6 w-6 ${trend?.iconColor || 'text-blue-600'}`} />
          </div>
        </div>
      </div>
    </div>
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4 text-blue-500" />;
      case 'loan_due':
        return <HandCoins className="h-4 w-4 text-red-500" />;
      case 'contribution_deadline':
        return <PiggyBank className="h-4 w-4 text-green-500" />;
      default:
        return <Calendar className="h-4 w-4 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-l-4 border-red-500';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-l-4 border-yellow-500';
      case 'low':
        return 'bg-green-100 text-green-800 border-l-4 border-green-500';
      default:
        return 'bg-gray-100 text-gray-800 border-l-4 border-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">


        {/* Main Content */}
        <div className="flex-1 lg:ml-0">
          {/* Top Navigation */}
          <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
               

                <div className="flex-1 flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <h1 className="text-2xl font-bold text-gray-900 hidden sm:block">
                      Dashboard
                    </h1>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user?.name?.charAt(0) || 'U'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Content */}
          <main className="p-4 sm:p-6 lg:p-8">
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name}! 👋
                  </h1>
                  <p className="mt-2 text-lg text-gray-600">
                    Here&apos;s what&apos;s happening with your chama today.
                  </p>
                </div>
                
                {/* Enhanced Action Buttons */}
                <div className="mt-4 lg:mt-0 flex items-center space-x-3 relative">
                  {/* Enhanced Filter Button */}
                  <div className="relative">
                    <button 
                      onClick={() => setShowFilterPanel(!showFilterPanel)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors relative"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filter
                      {getActiveFilterCount() > 0 && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          {getActiveFilterCount()}
                        </span>
                      )}
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>

                    {/* Filter Panel */}
                    {showFilterPanel && (
                      <div className="absolute right-0 mt-2 w-80 bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 z-20 p-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                          <button 
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                          >
                            Clear all
                          </button>
                        </div>

                        {/* Date Range Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date Range
                          </label>
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="date"
                              value={activeFilters.dateRange.start}
                              onChange={(e) => handleFilterChange('dateRange', { ...activeFilters.dateRange, start: e.target.value })}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                            <input
                              type="date"
                              value={activeFilters.dateRange.end}
                              onChange={(e) => handleFilterChange('dateRange', { ...activeFilters.dateRange, end: e.target.value })}
                              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                            />
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Status
                          </label>
                          <div className="space-y-2">
                            {['completed', 'pending', 'failed'].map((status) => (
                              <label key={status} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={activeFilters.status.includes(status)}
                                  onChange={(e) => {
                                    const newStatus = e.target.checked
                                      ? [...activeFilters.status, status]
                                      : activeFilters.status.filter(s => s !== status);
                                    handleFilterChange('status', newStatus);
                                  }}
                                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="ml-2 text-sm text-gray-700 capitalize">
                                  {status}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Member Filter */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Member
                          </label>
                          <input
                            type="text"
                            value={activeFilters.member[0] || ''}
                            onChange={(e) => handleFilterChange('member', [e.target.value])}
                            placeholder="Search by member name"
                            className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
                          />
                        </div>

                        <button 
                          onClick={() => setShowFilterPanel(false)}
                          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Apply Filters
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Export Button */}
                  <div className="relative">
                    <button
                      onClick={() => setShowExportOptions(!showExportOptions)}
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export
                      <ChevronDown className="h-4 w-4 ml-2" />
                    </button>

                    {showExportOptions && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                        <div className="py-2">
                          <button 
                            onClick={() => handleExport('excel')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <Table className="h-4 w-4 mr-2 text-green-600" />
                            Export to Excel
                          </button>
                          <button 
                            onClick={() => handleExport('csv')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <FileText className="h-4 w-4 mr-2 text-blue-600" />
                            Export to CSV
                          </button>
                          <button 
                            onClick={() => handleExport('pdf')}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            <PieChartIcon className="h-4 w-4 mr-2 text-red-600" />
                            Export to PDF
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Main Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                  title="Total Savings"
                  value={`KSh ${stats.totalSavings.toLocaleString()}`}
                  icon={PiggyBank}
                  change="+12.5%"
                  changeType="positive"
                  subtitle="Across all members"
                  trend={{ color: 'bg-green-100', iconColor: 'text-green-600' }}
                />
                <StatCard
                  title="Active Members"
                  value={stats.totalMembers.toString()}
                  icon={Users}
                  change="+2 new"
                  changeType="positive"
                  subtitle="24 active, 0 inactive"
                  trend={{ color: 'bg-blue-100', iconColor: 'text-blue-600' }}
                />
                <StatCard
                  title="Loan Portfolio"
                  value={`KSh ${(stats.activeLoans * 50000).toLocaleString()}`}
                  icon={HandCoins}
                  change={`${stats.activeLoans} active`}
                  changeType="neutral"
                  subtitle="KSh 75K due this month"
                  trend={{ color: 'bg-purple-100', iconColor: 'text-purple-600' }}
                />
                <StatCard
                  title="Performance"
                  value={`${stats.performance}%`}
                  icon={TrendingUp}
                  change="+5% this month"
                  changeType="positive"
                  subtitle="Meeting targets"
                  trend={{ color: 'bg-orange-100', iconColor: 'text-orange-600' }}
                />
              </div>

              {/* Secondary Stats and Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {quickStats.map((stat, index) => {
                      const Icon = stat.icon;
                      return (
                        <div key={index} className="bg-white rounded-xl p-4 border border-gray-100">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-xs font-medium text-gray-500">{stat.title}</p>
                              <p className="text-lg font-semibold text-gray-900 mt-1">{stat.value}</p>
                              <span className={`text-xs font-medium ${
                                stat.changeType === 'positive' ? 'text-green-600' :
                                stat.changeType === 'negative' ? 'text-red-600' : 'text-blue-600'
                              }`}>
                                {stat.change}
                              </span>
                            </div>
                            <div className={`p-2 rounded-lg ${stat.color}`}>
                              <Icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Recent Activity Enhanced */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                      <Link href="/dashboard/activity" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                        View all
                      </Link>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {isLoading ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="flex items-center space-x-4 animate-pulse">
                              <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))
                        ) : (
                          recentActivity.map((activity) => (
                            <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                              <div className="flex items-center space-x-4">
                                <div className={`p-2 rounded-lg ${
                                  activity.type === 'contribution' ? 'bg-green-100' :
                                  activity.type === 'loan' ? 'bg-blue-100' :
                                  activity.type === 'investment' ? 'bg-purple-100' :
                                  activity.type === 'ngumbato' ? 'bg-orange-100' : 'bg-gray-100'
                                }`}>
                                  {getStatusIcon(activity.status)}
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {activity.description}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {activity.member} • {new Date(activity.date).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                {activity.amount && (
                                  <span className="text-sm font-semibold text-gray-900">
                                    KSh {activity.amount.toLocaleString()}
                                  </span>
                                )}
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                                  activity.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-red-100 text-red-800'
                                }`}>
                                  {activity.status}
                                </span>
                                <button className="text-gray-400 hover:text-gray-600">
                                  <MoreVertical className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - Upcoming Events & Quick Actions */}
                <div className="space-y-6">
                  {/* Upcoming Events */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                        <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                        Upcoming Events
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {isLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="animate-pulse">
                              <div className="h-4 bg-gray-200 rounded mb-2"></div>
                              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                            </div>
                          ))
                        ) : (
                          upcomingEvents.map((event) => (
                            <div key={event.id} className={`p-4 rounded-lg ${getPriorityColor(event.priority)}`}>
                              <div className="flex items-start space-x-3">
                                {getEventIcon(event.type)}
                                <div className="flex-1">
                                  <h4 className="text-sm font-semibold">{event.title}</h4>
                                  <p className="text-xs text-gray-600 mt-1">{event.description}</p>
                                  <p className="text-xs text-gray-500 mt-2">
                                    {new Date(event.date).toLocaleDateString('en-US', { 
                                      weekday: 'long', 
                                      year: 'numeric', 
                                      month: 'long', 
                                      day: 'numeric' 
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Quick Actions */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-2xl shadow-lg p-6 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Quick Actions</h3>
                      <span className="text-blue-200 text-sm">Most used</span>
                    </div>
                    <div className="space-y-3">
                      {quickActions.slice(0, 4).map((action, index) => {
                        const Icon = action.icon;
                        return (
                        <Link
                        key={index}
                        href={typeof action.href === 'string' ? action.href : '#'}
                        className="flex items-center justify-between p-3 bg-white/10 rounded-lg hover:bg-white/20"
                      >

                            <div className="flex items-center">
                              <div className="p-2 bg-white/20 rounded-lg mr-3 group-hover:bg-white/30 transition-colors">
                                <Icon className="h-4 w-4" />
                              </div>
                              <div>
                                <span className="text-sm font-medium block">{action.label}</span>
                                <span className="text-xs text-blue-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {action.description}
                                </span>
                              </div>
                            </div>
                            <ArrowUp className="h-4 w-4 transform rotate-45 opacity-70 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* System Alerts */}
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-200 flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2 text-yellow-500" />
                      <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                          <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-yellow-600 mr-2" />
                            <span className="text-sm text-yellow-800">3 pending loan applications</span>
                          </div>
                          <Link href="/dashboard/loans" className="text-xs text-yellow-600 hover:text-yellow-500 font-medium">
                            Review
                          </Link>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                          <div className="flex items-center">
                            <Bell className="h-4 w-4 text-blue-600 mr-2" />
                            <span className="text-sm text-blue-800">Meeting in 5 days</span>
                          </div>
                          <Link href="/dashboard/meetings" className="text-xs text-blue-600 hover:text-blue-500 font-medium">
                            View
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
  );
}