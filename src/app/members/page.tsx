'use client';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  ChevronDown,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  ArrowUp,
  ArrowDown,
  X,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  Shield,
  Award,
  TrendingUp,
  Grid,
  Table,
  EyeOff,
  Eye as EyeIcon
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'pending';
  totalSavings: number;
  totalLoans: number;
  lastContribution: string;
  avatar?: string;
  role?: 'admin' | 'member' | 'treasurer';
  performance?: number;
  password?: string;
}

type SortField = 'name' | 'joinDate' | 'totalSavings' | 'status' | 'performance';

export default function MembersPage() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table');
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'member' as 'admin' | 'member' | 'treasurer',
    status: 'active' as 'active' | 'inactive' | 'pending',
    initialSavings: '',
    notes: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    filterAndSortMembers();
  }, [members, searchTerm, statusFilter, roleFilter, sortField, sortOrder]);

  const loadMembers = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockMembers: Member[] = [
      {
        id: '1',
        name: 'Jane Wanjiku',
        email: 'jane@example.com',
        phone: '+254712345678',
        joinDate: '2023-01-15',
        status: 'active',
        totalSavings: 125000,
        totalLoans: 50000,
        lastContribution: '2024-01-10',
        role: 'treasurer',
        performance: 95,
        password: 'encrypted_password_1'
      },
      {
        id: '2',
        name: 'Michael Otieno',
        email: 'michael@example.com',
        phone: '+254723456789',
        joinDate: '2023-02-20',
        status: 'active',
        totalSavings: 98000,
        totalLoans: 75000,
        lastContribution: '2024-01-08',
        role: 'admin',
        performance: 87,
        password: 'encrypted_password_2'
      },
      {
        id: '3',
        name: 'Grace Auma',
        email: 'grace@example.com',
        phone: '+254734567890',
        joinDate: '2023-03-10',
        status: 'inactive',
        totalSavings: 45000,
        totalLoans: 0,
        lastContribution: '2023-12-15',
        role: 'member',
        performance: 62,
        password: 'encrypted_password_3'
      }
    ];

    setMembers(mockMembers);
    setIsLoading(false);
  };

  const filterAndSortMembers = () => {
    let filtered = members.filter(member => {
      const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          member.phone.includes(searchTerm);
      
      const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
      const matchesRole = roleFilter === 'all' || member.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });

    filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'joinDate') {
        aValue = new Date(a.joinDate);
        bValue = new Date(b.joinDate);
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredMembers(filtered);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // ✅ FIXED: Added export functionality
  const handleExport = () => {
    const headers = ['Name', 'Email', 'Phone', 'Join Date', 'Status', 'Total Savings', 'Role', 'Performance'];
    
    const csvContent = [
      headers.join(','),
      ...filteredMembers.map(member => [
        `"${member.name}"`,
        member.email,
        member.phone,
        member.joinDate,
        member.status,
        member.totalSavings,
        member.role || 'member',
        member.performance || 0
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `members-export-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = (member: Member) => {
    setSelectedMember(member);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedMember) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMembers(members.filter(m => m.id !== selectedMember.id));
      setShowDeleteModal(false);
      setSelectedMember(null);
      setIsLoading(false);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMemberData: Member = {
      id: (members.length + 1).toString(),
      name: newMember.name,
      email: newMember.email,
      phone: newMember.phone,
      joinDate: new Date().toISOString().split('T')[0],
      status: newMember.status,
      totalSavings: parseInt(newMember.initialSavings) || 0,
      totalLoans: 0,
      lastContribution: new Date().toISOString().split('T')[0],
      role: newMember.role,
      performance: Math.floor(Math.random() * 40) + 60,
      password: `encrypted_${newMember.password}`
    };

    setMembers(prev => [newMemberData, ...prev]);
    setShowAddMemberModal(false);
    resetNewMemberForm();
    setIsLoading(false);
  };

  const resetNewMemberForm = () => {
    setNewMember({
      name: '',
      email: '',
      phone: '',
      password: '',
      role: 'member',
      status: 'active',
      initialSavings: '',
      notes: ''
    });
    setShowPassword(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle2 className="h-3 w-3" />;
      case 'inactive':
        return <X className="h-3 w-3" />;
      case 'pending':
        return <Clock className="h-3 w-3" />;
      default:
        return <AlertCircle className="h-3 w-3" />;
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4 text-purple-600" />;
      case 'treasurer':
        return <Award className="h-4 w-4 text-blue-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center space-x-1 font-medium text-gray-700 hover:text-gray-900 group"
    >
      <span>{children}</span>
      <div className="flex flex-col">
        <ArrowUp className={`h-3 w-3 transition-colors ${
          sortField === field && sortOrder === 'asc' 
            ? 'text-blue-600' 
            : 'text-gray-400 group-hover:text-gray-600'
        }`} />
        <ArrowDown className={`h-3 w-3 -mt-1 transition-colors ${
          sortField === field && sortOrder === 'desc' 
            ? 'text-blue-600' 
            : 'text-gray-400 group-hover:text-gray-600'
        }`} />
      </div>
    </button>
  );

  const PerformanceBar = ({ performance }: { performance?: number }) => {
    if (!performance) return null;
    
    const getColor = (score: number) => {
      if (score >= 80) return 'bg-green-500';
      if (score >= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    };

    return (
      <div className="flex items-center space-x-2">
        <div className="w-16 bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full ${getColor(performance)} transition-all duration-300`}
            style={{ width: `${performance}%` }}
          />
        </div>
        <span className="text-xs font-medium text-gray-600">{performance}%</span>
      </div>
    );
  };

  // ✅ FIXED: Grid View Component
  const GridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {filteredMembers.map((member) => (
        <div key={member.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center space-x-4 mb-4">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
              {member.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{member.name}</h4>
              <p className="text-sm text-gray-500">{member.email}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Phone:</span>
              <span className="font-medium">{member.phone}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Join Date:</span>
              <span className="font-medium">{new Date(member.joinDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Savings:</span>
              <span className="font-medium">KSh {member.totalSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status:</span>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(member.status)}`}>
                {getStatusIcon(member.status)}
                <span className="ml-1 capitalize">{member.status}</span>
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Performance:</span>
              <PerformanceBar performance={member.performance} />
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 mt-4 pt-4 border-t border-gray-200">
            <Link
              href={`${routes.members.list}/${member.id}`}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="h-4 w-4" />
            </Link>
            <Link
              href={`${routes.members.base}/${member.id}/edit`}
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
              title="Edit Member"
            >
              <Edit className="h-4 w-4" />
            </Link>
            <button
              onClick={() => handleDeleteClick(member)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete Member"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Members Management</h1>
                <p className="mt-1 text-lg text-gray-600">
                  Manage {members.length} chama members and their activities
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button
              onClick={() => setViewMode(viewMode === 'table' ? 'grid' : 'table')}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm"
            >
              {viewMode === 'table' ? (
                <>
                  <Grid className="h-4 w-4 mr-2" />
                  Grid View
                </>
              ) : (
                <>
                  <Table className="h-4 w-4 mr-2" />
                  Table View
                </>
              )}
            </button>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Add Member
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Members', 
              value: members.length, 
              icon: Users, 
              color: 'from-blue-500 to-blue-600',
              change: '+12%'
            },
            { 
              label: 'Active Members', 
              value: members.filter(m => m.status === 'active').length,
              icon: CheckCircle2, 
              color: 'from-green-500 to-green-600',
              change: '+5%'
            },
            { 
              label: 'Total Savings', 
              value: `KSh ${members.reduce((acc, m) => acc + m.totalSavings, 0).toLocaleString()}`,
              icon: TrendingUp, 
              color: 'from-purple-500 to-purple-600',
              change: '+8.2%'
            },
            { 
              label: 'Pending Approval', 
              value: members.filter(m => m.status === 'pending').length,
              icon: Clock, 
              color: 'from-orange-500 to-orange-600',
              change: '2 new'
            }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-gradient-to-br text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className={`bg-gradient-to-r ${stat.color} p-1`}>
                  <div className="bg-white/10 backdrop-blur-sm p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        <span className="text-blue-200 text-xs font-medium bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">
                          {stat.change}
                        </span>
                      </div>
                      <div className="p-3 bg-white/20 rounded-xl">
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search members by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 placeholder-gray-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                  {(statusFilter !== 'all' || roleFilter !== 'all') && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {[statusFilter, roleFilter].filter(f => f !== 'all').length}
                    </span>
                  )}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>

              {/* ✅ FIXED: Export button with working functionality */}
              <button 
                onClick={handleExport}
                className="inline-flex items-center px-4 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>

              <button 
                onClick={loadMembers}
                disabled={isLoading}
                className="p-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Filters & Sorting</h3>
                <button
                  onClick={() => {
                    setStatusFilter('all');
                    setRoleFilter('all');
                    setShowFilters(false);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-500 font-medium"
                >
                  Clear all
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Status</label>
                  <div className="space-y-2">
                    {['all', 'active', 'inactive', 'pending'].map((status) => (
                      <label key={status} className="flex items-center">
                        <input
                          type="radio"
                          name="status"
                          checked={statusFilter === status}
                          onChange={() => setStatusFilter(status)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {status}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Role</label>
                  <div className="space-y-2">
                    {['all', 'admin', 'treasurer', 'member'].map((role) => (
                      <label key={role} className="flex items-center">
                        <input
                          type="radio"
                          name="role"
                          checked={roleFilter === role}
                          onChange={() => setRoleFilter(role)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {role}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Sort By</label>
                  <div className="space-y-2">
                    {['name', 'joinDate', 'totalSavings', 'performance'].map((field) => (
                      <label key={field} className="flex items-center">
                        <input
                          type="radio"
                          name="sort"
                          checked={sortField === field}
                          onChange={() => handleSort(field as SortField)}
                          className="text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">
                          {field.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Order</label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="order"
                        checked={sortOrder === 'asc'}
                        onChange={() => setSortOrder('asc')}
                        className="text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Ascending</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="order"
                        checked={sortOrder === 'desc'}
                        onChange={() => setSortOrder('desc')}
                        className="text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <span className="ml-2 text-sm text-gray-700">Descending</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ✅ FIXED: Conditional rendering for Grid and Table views */}
        {viewMode === 'table' ? (
          /* Table View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Members ({filteredMembers.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredMembers.length} of {members.length} members
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortButton field="name">Member</SortButton>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortButton field="joinDate">Join Date</SortButton>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortButton field="totalSavings">Savings</SortButton>
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <SortButton field="status">Status</SortButton>
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                            <div className="ml-4 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-24"></div>
                              <div className="h-3 bg-gray-200 rounded w-32"></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            <div className="h-3 bg-gray-200 rounded w-32"></div>
                            <div className="h-3 bg-gray-200 rounded w-24"></div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-3 bg-gray-200 rounded w-16"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-2 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="h-6 bg-gray-200 rounded w-20"></div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="h-8 bg-gray-200 rounded w-24 ml-auto"></div>
                        </td>
                      </tr>
                    ))
                  ) : filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <Users className="h-16 w-16 text-gray-300 mb-4" />
                          <p className="text-gray-500 text-lg font-medium">No members found</p>
                          <p className="text-gray-400 mt-2 max-w-md">
                            {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                              ? 'Try adjusting your search criteria or filters to find what you\'re looking for.' 
                              : 'Get started by adding your first member to the chama.'
                            }
                          </p>
                          {!searchTerm && statusFilter === 'all' && roleFilter === 'all' && (
                            <button
                              onClick={() => setShowAddMemberModal(true)}
                              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mt-6"
                            >
                              <UserPlus className="h-4 w-4 mr-2" />
                              Add Your First Member
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg">
                              {member.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-semibold text-gray-900 flex items-center">
                                {member.name}
                                {member.role === 'admin' && (
                                  <span className="ml-2 bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                                    Admin
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">ID: {member.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {member.email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center mt-1">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {member.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            {getRoleIcon(member.role)}
                            <span className="ml-2 capitalize">{member.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            {new Date(member.joinDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-semibold text-gray-900">
                            KSh {member.totalSavings.toLocaleString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            Last: {new Date(member.lastContribution).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <PerformanceBar performance={member.performance} />
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(member.status)}`}>
                            {getStatusIcon(member.status)}
                            <span className="ml-1 capitalize">{member.status}</span>
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link
                              href={`${routes.members.base}/${member.id}`}
                              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>
                            <Link
                              href={`${routes.members.base}/${member.id}/edit`}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit Member"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                            <button
                              onClick={() => handleDeleteClick(member)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Member"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* ✅ FIXED: Grid View */
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Members ({filteredMembers.length})
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  Showing {filteredMembers.length} of {members.length} members in grid view
                </p>
              </div>
            </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2 mt-4">
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center">
                  <Users className="h-16 w-16 text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg font-medium">No members found</p>
                  <p className="text-gray-400 mt-2 max-w-md">
                    {searchTerm || statusFilter !== 'all' || roleFilter !== 'all'
                      ? 'Try adjusting your search criteria or filters to find what you\'re looking for.' 
                      : 'Get started by adding your first member to the chama.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <GridView />
            )}
          </div>
        )}

        {/* Add Member Modal */}
        {showAddMemberModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Add New Member</h2>
                  <button
                    onClick={() => {
                      setShowAddMemberModal(false);
                      resetNewMemberForm();
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleAddMember} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={newMember.name}
                        onChange={(e) => setNewMember(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                        placeholder="Enter full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={newMember.email}
                        onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                        placeholder="Enter email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={newMember.phone}
                        onChange={(e) => setNewMember(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                        placeholder="+254 XXX XXX XXX"
                      />
                    </div>
                  </div>

                  {/* Account Settings */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password *
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          value={newMember.password}
                          onChange={(e) => setNewMember(prev => ({ ...prev, password: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 pr-12"
                          placeholder="Enter password"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select
                        value={newMember.role}
                        onChange={(e) => setNewMember(prev => ({ ...prev, role: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      >
                        <option value="member">Member</option>
                        <option value="treasurer">Treasurer</option>
                        <option value="admin">Administrator</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={newMember.status}
                        onChange={(e) => setNewMember(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Initial Savings (KSh)
                      </label>
                      <input
                        type="number"
                        value={newMember.initialSavings}
                        onChange={(e) => setNewMember(prev => ({ ...prev, initialSavings: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={newMember.notes}
                    onChange={(e) => setNewMember(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Any additional notes about this member..."
                  />
                </div>

                {/* Form Actions */}
                <div className="flex space-x-3 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddMemberModal(false);
                      resetNewMemberForm();
                    }}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                        Adding Member...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Member
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedMember && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-3 bg-red-100 rounded-xl">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Delete Member</h3>
                  <p className="text-sm text-gray-600">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedMember.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{selectedMember.name}</p>
                    <p className="text-sm text-gray-600">{selectedMember.email}</p>
                  </div>
                </div>
                <p className="text-sm text-red-700 mt-3">
                  This will permanently delete <strong>{selectedMember.name}</strong> and all associated data including savings records, loan history, and contributions.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Member
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}