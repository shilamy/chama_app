'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  PiggyBank,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { SavingsTransaction, SavingsSummary } from '@/types';

export default function SavingsOverviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [transactions, setTransactions] = useState<SavingsTransaction[]>([]);
  const [summary, setSummary] = useState<SavingsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    loadSavingsData();
  }, []);

  const loadSavingsData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for transactions
      const mockTransactions: SavingsTransaction[] = [
        {
          id: '1',
          memberId: '1',
          memberName: 'Jane Wanjiku',
          amount: 5000,
          type: 'savings',
          date: '2024-01-15',
          paymentMethod: 'mpesa',
          transactionId: 'MPE23456789',
          status: 'completed',
          notes: 'Monthly savings contribution'
        },
        {
          id: '2',
          memberId: '2',
          memberName: 'Michael Otieno',
          amount: 7500,
          type: 'savings',
          date: '2024-01-15',
          paymentMethod: 'mpesa',
          transactionId: 'MPE23456790',
          status: 'completed'
        },
        {
          id: '3',
          memberId: '3',
          memberName: 'Sarah Muthoni',
          amount: 10000,
          type: 'emergency',
          date: '2024-01-14',
          paymentMethod: 'bank',
          transactionId: 'BNK78901234',
          status: 'completed',
          notes: 'Emergency fund contribution'
        },
        {
          id: '4',
          memberId: '1',
          memberName: 'Jane Wanjiku',
          amount: 3000,
          type: 'loan_repayment',
          date: '2024-01-13',
          paymentMethod: 'mpesa',
          transactionId: 'MPE23456791',
          status: 'completed'
        },
        {
          id: '5',
          memberId: '4',
          memberName: 'David Kimani',
          amount: 2000,
          type: 'special',
          date: '2024-01-12',
          paymentMethod: 'cash',
          transactionId: '',
          status: 'pending'
        }
      ];

      // Mock summary data
      const mockSummary: SavingsSummary = {
        totalSavings: 458200,
        totalMembers: 24,
        monthlyContribution: 125000,
        growthRate: 12.5,
        emergencyFund: 125000,
        specialProjects: 75000
      };

      setTransactions(mockTransactions);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading savings data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.transactionId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    // Add date filtering logic here if needed
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      savings: 'bg-green-100 text-green-800',
      emergency: 'bg-orange-100 text-orange-800',
      special: 'bg-purple-100 text-purple-800',
      loan_repayment: 'bg-blue-100 text-blue-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Loading skeletons */}
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-2xl"></div>
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <PiggyBank className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Savings Overview</h1>
              <p className="text-gray-600">Manage and track all chama savings activities</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <Link
              href={routes.savings.add}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Contribution
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Savings */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <PiggyBank className="h-5 w-5 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Savings</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalSavings.toLocaleString()}
            </p>
            <p className="text-sm text-green-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +{summary?.growthRate}% this month
            </p>
          </div>

          {/* Active Members */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Members</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.totalMembers}</p>
            <p className="text-sm text-blue-600">All contributing members</p>
          </div>

          {/* Monthly Contributions */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">This Month</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.monthlyContribution.toLocaleString()}
            </p>
            <p className="text-sm text-purple-600">Total contributions</p>
          </div>

          {/* Emergency Fund */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <PiggyBank className="h-5 w-5 text-orange-600" />
              </div>
              <ArrowDownRight className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Emergency Fund</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.emergencyFund.toLocaleString()}
            </p>
            <p className="text-sm text-orange-600">Dedicated fund</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Types</option>
                <option value="savings">Savings</option>
                <option value="emergency">Emergency</option>
                <option value="special">Special Projects</option>
                <option value="loan_repayment">Loan Repayment</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Payment Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {transaction.memberName}
                        </p>
                        {transaction.transactionId && (
                          <p className="text-sm text-gray-500">
                            {transaction.transactionId}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        KSh {transaction.amount.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(transaction.type)}`}>
                        {transaction.type.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                      {transaction.paymentMethod}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors" title="View Details">
                          <Eye className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors" title="Edit">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <PiggyBank className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No transactions found</p>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Link
                href={routes.savings.add}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Record First Contribution
              </Link>
            </div>
          )}

          {/* Pagination */}
          {filteredTransactions.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredTransactions.length}</span> of{' '}
                <span className="font-medium">{filteredTransactions.length}</span> results
              </p>
              <div className="flex space-x-2">
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                <button className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}