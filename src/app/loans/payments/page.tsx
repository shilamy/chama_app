// app/loans/payments/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  HandCoins,
  TrendingUp,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  X
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

interface LoanRepayment {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  loanAmount: number;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  paymentDate?: string;
  status: 'pending' | 'paid' | 'overdue' | 'partial';
  paymentMethod?: 'mpesa' | 'cash' | 'bank';
  transactionId?: string;
  notes?: string;
}

interface RepaymentSummary {
  totalDue: number;
  totalPaid: number;
  overdueAmount: number;
  pendingPayments: number;
  collectionRate: number;
}

export default function LoanRepaymentsPage() {
  const { user } = useAuth();
  const [repayments, setRepayments] = useState<LoanRepayment[]>([]);
  const [summary, setSummary] = useState<RepaymentSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedRepayment, setSelectedRepayment] = useState<LoanRepayment | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  useEffect(() => {
    loadRepaymentsData();
  }, []);

  const loadRepaymentsData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockRepayments: LoanRepayment[] = [
        {
          id: '1',
          loanId: 'L-001',
          memberId: '1',
          memberName: 'Jane Wanjiku',
          loanAmount: 50000,
          amountDue: 4450,
          amountPaid: 4450,
          dueDate: '2024-02-15',
          paymentDate: '2024-02-14',
          status: 'paid',
          paymentMethod: 'mpesa',
          transactionId: 'MPE34567890'
        },
        {
          id: '2',
          loanId: 'L-002',
          memberId: '2',
          memberName: 'Michael Otieno',
          loanAmount: 25000,
          amountDue: 4300,
          amountPaid: 0,
          dueDate: '2024-02-20',
          status: 'pending'
        },
        {
          id: '3',
          loanId: 'L-003',
          memberId: '3',
          memberName: 'Sarah Muthoni',
          loanAmount: 100000,
          amountDue: 4615,
          amountPaid: 4615,
          dueDate: '2024-02-10',
          paymentDate: '2024-02-09',
          status: 'paid',
          paymentMethod: 'bank',
          transactionId: 'BNK89012345'
        },
        {
          id: '4',
          loanId: 'L-001',
          memberId: '1',
          memberName: 'Jane Wanjiku',
          loanAmount: 50000,
          amountDue: 4450,
          amountPaid: 2000,
          dueDate: '2024-01-15',
          status: 'partial',
          paymentMethod: 'cash',
          notes: 'Partial payment, balance to be paid next week'
        },
        {
          id: '5',
          loanId: 'L-004',
          memberId: '4',
          memberName: 'David Kimani',
          loanAmount: 75000,
          amountDue: 4850,
          amountPaid: 0,
          dueDate: '2024-01-30',
          status: 'overdue'
        }
      ];

      const mockSummary: RepaymentSummary = {
        totalDue: 22665,
        totalPaid: 9065,
        overdueAmount: 4850,
        pendingPayments: 3,
        collectionRate: 85.2
      };

      setRepayments(mockRepayments);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading repayments data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (repayment: LoanRepayment) => {
    setSelectedRepayment(repayment);
    setIsViewModalOpen(true);
  };

  const handleRecordPayment = (repayment: LoanRepayment) => {
    // In a real app, this would open a payment recording modal
    console.log('Record payment for:', repayment);
    alert(`Record payment for ${repayment.memberName} - KSh ${repayment.amountDue}`);
  };

  const filteredRepayments = repayments.filter(repayment => {
    const matchesSearch = repayment.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         repayment.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || repayment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
      partial: 'bg-blue-100 text-blue-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      paid: CheckCircle,
      pending: Clock,
      overdue: AlertCircle,
      partial: TrendingUp
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6">
        <div className="max-w-7xl mx-auto">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <HandCoins className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan Repayments</h1>
              <p className="text-gray-600">Track and manage loan repayment collections</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <Link
              href={routes.loans.payments.add}
              className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Payment
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Due */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <HandCoins className="h-5 w-5 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Due</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalDue.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">Current month</p>
          </div>

          {/* Total Collected */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Collected</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalPaid.toLocaleString()}
            </p>
            <p className="text-sm text-green-600">{summary?.collectionRate}% rate</p>
          </div>

          {/* Overdue */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Overdue</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.overdueAmount.toLocaleString()}
            </p>
            <p className="text-sm text-red-600">Requires follow-up</p>
          </div>

          {/* Pending */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.pendingPayments}</p>
            <p className="text-sm text-orange-600">Awaiting payment</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member or loan ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
                <option value="partial">Partial</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="overdue">Overdue Only</option>
              </select>
              
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Repayments Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Repayment Schedule</h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member & Loan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Due
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Due Date
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
                {filteredRepayments.map((repayment) => (
                  <tr key={repayment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {repayment.memberName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Loan {repayment.loanId} • KSh {repayment.loanAmount.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        KSh {repayment.amountDue.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className={`text-sm font-semibold ${
                        repayment.amountPaid > 0 ? 'text-green-600' : 'text-gray-900'
                      }`}>
                        KSh {repayment.amountPaid.toLocaleString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${
                          isOverdue(repayment.dueDate) && repayment.status !== 'paid' 
                            ? 'text-red-600 font-semibold' 
                            : 'text-gray-900'
                        }`}>
                          {new Date(repayment.dueDate).toLocaleDateString()}
                        </span>
                        {isOverdue(repayment.dueDate) && repayment.status !== 'paid' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(repayment.status)}`}>
                        {getStatusIcon(repayment.status)}
                        <span className="ml-1 capitalize">{repayment.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleView(repayment)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {repayment.status !== 'paid' && (
                          <button 
                            onClick={() => handleRecordPayment(repayment)}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors" 
                            title="Record Payment"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredRepayments.length === 0 && (
            <div className="text-center py-12">
              <HandCoins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No repayments found</p>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Link
                href={routes.loans.payments.add}
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Record First Payment
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRepayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Repayment Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Member:</span>
                <span className="font-medium">{selectedRepayment.memberName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan ID:</span>
                <span className="font-medium">{selectedRepayment.loanId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Loan Amount:</span>
                <span className="font-medium">KSh {selectedRepayment.loanAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Due:</span>
                <span className="font-medium">KSh {selectedRepayment.amountDue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid:</span>
                <span className="font-medium text-green-600">KSh {selectedRepayment.amountPaid.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Due Date:</span>
                <span className="font-medium">{new Date(selectedRepayment.dueDate).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(selectedRepayment.status)}`}>
                  {getStatusIcon(selectedRepayment.status)}
                  <span className="ml-1 capitalize">{selectedRepayment.status}</span>
                </span>
              </div>
              {selectedRepayment.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="font-medium capitalize">{selectedRepayment.paymentMethod}</span>
                </div>
              )}
              {selectedRepayment.transactionId && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Transaction ID:</span>
                  <span className="font-medium">{selectedRepayment.transactionId}</span>
                </div>
              )}
              {selectedRepayment.paymentDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Date:</span>
                  <span className="font-medium">{new Date(selectedRepayment.paymentDate).toLocaleDateString()}</span>
                </div>
              )}
              {selectedRepayment.notes && (
                <div>
                  <span className="text-gray-600 block mb-1">Notes:</span>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedRepayment.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-xl hover:bg-gray-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}