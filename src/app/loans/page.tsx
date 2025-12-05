'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  HandCoins,
  TrendingUp,
  Users,
  Calendar,
  Download,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Edit,
  Trash2,
  X,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  Calculator,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { LoanApplication, LoanSummary } from '@/types';
import {mockLoans} from '@/data/mockData';




export default function LoansOverviewPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loans, setLoans] = useState<LoanApplication[]>([]);
  const [summary, setSummary] = useState<LoanSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modal states
  const [selectedLoan, setSelectedLoan] = useState<LoanApplication | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isProcessModalOpen, setIsProcessModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [processingLoan, setProcessingLoan] = useState<LoanApplication | null>(null);
  const [processAction, setProcessAction] = useState<'approve' | 'reject' | 'disburse'>('approve');
  const [processNotes, setProcessNotes] = useState('');

  // Loading states for actions
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Report state
  const [reportType, setReportType] = useState('portfolio');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadLoansData();
  }, []);

  const loadLoansData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data for loans
      


      // Mock summary data
      const mockSummary: LoanSummary = {
        totalLoans: 258000,
        activeLoans: 3,
        pendingApplications: 1,
        totalRepayments: 150000,
        overdueLoans: 1,
        loanPerformance: 94.5
      };

      setLoans(mockLoans);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading loans data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Action handlers
  const handleView = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setIsViewModalOpen(true);
  };

  const handleProcess = (loan: LoanApplication, action: 'approve' | 'reject' | 'disburse') => {
    setSelectedLoan(loan);
    setProcessingLoan(loan);
    setProcessAction(action);
    setProcessNotes('');
    setIsProcessModalOpen(true);
  };

  const handleDelete = (loan: LoanApplication) => {
    setSelectedLoan(loan);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedLoan) return;
    
    setIsDeleting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Remove from local state
      setLoans(prev => prev.filter(loan => loan.id !== selectedLoan.id));
      setIsDeleteModalOpen(false);
      setSelectedLoan(null);
      
      console.log('Loan application deleted successfully');
    } catch (error) {
      console.error('Error deleting loan application:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const processLoan = async () => {
    if (!processingLoan) return;
    
    setIsProcessing(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the loan status in the local state
      setLoans(prev => prev.map(loan => {
        if (loan.id === processingLoan.id) {
          const newStatus = (processAction === 'approve' ? 'approved' : 
                           processAction === 'reject' ? 'rejected' : 
                           'disbursed') as LoanApplication['status'];
          
          const updatedLoan: LoanApplication = { 
            ...loan, 
            status: newStatus,
            notes: processNotes || loan.notes
          };
          
          if (processAction === 'disburse') {
            updatedLoan.disbursementDate = new Date().toISOString().split('T')[0];
            // Calculate due date based on term
            const dueDate = new Date();
            dueDate.setMonth(dueDate.getMonth() + loan.term);
            updatedLoan.dueDate = dueDate.toISOString().split('T')[0];
          }
          
          return updatedLoan;
        }
        return loan;
      }));
      
      setIsProcessModalOpen(false);
      setSelectedLoan(null);
      setProcessingLoan(null);
      setProcessNotes('');
      
      console.log(`Loan ${processAction} successfully`);
    } catch (error) {
      console.error('Error processing loan:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReport = () => {
    setIsReportModalOpen(true);
  };

  const exportReport = async (type: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, this would generate and download the report
      const reportData = {
        type: reportType,
        dateRange,
        format: type,
        loans: filteredLoans
      };
      
      console.log('Generating report:', reportData);
      
      // Simulate download
      const blob = new Blob([`Report: ${reportType} (${dateRange.start} to ${dateRange.end})`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loans-report-${reportType}-${new Date().toISOString().split('T')[0]}.${type}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setIsReportModalOpen(false);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Export current filtered data as CSV
      const headers = ['Member Name', 'Amount', 'Purpose', 'Status', 'Application Date', 'Interest Rate', 'Term'];
      const csvData = filteredLoans.map(loan => [
        loan.memberName,
        loan.amount,
        loan.purpose,
        loan.status,
        loan.applicationDate,
        loan.interestRate,
        loan.term
      ]);
      
      const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `loans-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Error exporting data:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleFilterToggle = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateFilter('all');
  };

  // Filter loans based on search and filters
  const filteredLoans = loans.filter(loan => {
    const matchesSearch = loan.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         loan.purpose.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    // Date filtering logic
    let matchesDate = true;
    if (dateFilter !== 'all') {
      const applicationDate = new Date(loan.applicationDate);
      const now = new Date();
      
      switch (dateFilter) {
        case 'week':
          const weekAgo = new Date(now.setDate(now.getDate() - 7));
          matchesDate = applicationDate >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.setMonth(now.getMonth() - 1));
          matchesDate = applicationDate >= monthAgo;
          break;
        case 'quarter':
          const quarterAgo = new Date(now.setMonth(now.getMonth() - 3));
          matchesDate = applicationDate >= quarterAgo;
          break;
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLoans = filteredLoans.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const goToPreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      rejected: 'bg-red-100 text-red-800',
      disbursed: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      pending: Clock,
      approved: CheckCircle,
      rejected: AlertCircle,
      disbursed: TrendingUp,
      completed: CheckCircle
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent className="h-4 w-4" />;
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
              <HandCoins className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loans Management</h1>
              <p className="text-gray-600">Manage loan applications and track repayments</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              disabled={isExporting}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="h-4 w-4 mr-2" />
              {isExporting ? 'Exporting...' : 'Export'}
            </button>
            <button 
              onClick={generateReport}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center"
            >
              <FileText className="h-4 w-4 mr-2" />
              Reports
            </button>
            <Link
              href={routes.loans.add}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Application
            </Link>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Loans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <HandCoins className="h-5 w-5 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Loans</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalLoans.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              Active portfolio
            </p>
          </div>

          {/* Active Loans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Loans</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.activeLoans}</p>
            <p className="text-sm text-green-600">Currently running</p>
          </div>

          {/* Pending Applications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Pending</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.pendingApplications}</p>
            <p className="text-sm text-orange-600">Awaiting review</p>
          </div>

          {/* Loan Performance */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Performance</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.loanPerformance}%</p>
            <p className="text-sm text-purple-600">On-time repayments</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by member or purpose..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border text-gray-500 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="disbursed">Disbursed</option>
                <option value="completed">Completed</option>
              </select>
              
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="px-4 py-2 border text-gray-500 border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Time</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
              </select>
              
              <button 
                onClick={handleFilterToggle}
                className="p-2 border text-gray-500 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Filter className="h-4 w-4 text-gray-600" />
              </button>

              {(searchTerm || statusFilter !== 'all' || dateFilter !== 'all') && (
                <button 
                  onClick={clearFilters}
                  className="px-3 py-2 border text-gray-500 border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          {isFilterOpen && (
            <div className="mt-4 p-4 text-gray-500 bg-gray-50 rounded-xl border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term Range</label>
                  <div className="flex space-x-2">
                    <input
                      type="number"
                      placeholder="Min months"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max months"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Credit Score</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    <option value="">All Scores</option>
                    <option value="90">Excellent (90+)</option>
                    <option value="80">Good (80-89)</option>
                    <option value="70">Fair (70-79)</option>
                    <option value="60">Poor (60-69)</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Loans Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900">Loan Applications</h3>
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredLoans.length)} of {filteredLoans.length} results
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member & Purpose
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Term
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Application Date
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
                {currentLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {loan.memberName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {loan.purpose}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        KSh {loan.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {loan.interestRate}% interest
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {loan.term} months
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(loan.applicationDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(loan.status)}`}>
                        {getStatusIcon(loan.status)}
                        <span className="ml-1">{loan.status.charAt(0).toUpperCase() + loan.status.slice(1)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => handleView(loan)}
                          className="p-1 text-gray-400 hover:text-blue-600 transition-colors" 
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {loan.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => handleProcess(loan, 'approve')}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors" 
                              title="Approve"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleProcess(loan, 'reject')}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        
                        {loan.status === 'approved' && (
                          <button 
                            onClick={() => handleProcess(loan, 'disburse')}
                            className="p-1 text-gray-400 hover:text-green-600 transition-colors" 
                            title="Disburse Funds"
                          >
                            <TrendingUp className="h-4 w-4" />
                          </button>
                        )}
                        
                        <button 
                          onClick={() => handleDelete(loan)}
                          className="p-1 text-gray-400 hover:text-red-600 transition-colors" 
                          title="Delete"
                        >
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
          {filteredLoans.length === 0 && (
            <div className="text-center py-12">
              <HandCoins className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No loan applications found</p>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <Link
                href={routes.loans.add}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Application
              </Link>
            </div>
          )}

          {/* Pagination */}
          {filteredLoans.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">Show</span>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-2 py-1 border border-gray-300 rounded-lg text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-700">per page</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => goToPage(page)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Loan Application Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Member</label>
                  <p className="font-medium text-gray-900">{selectedLoan.memberName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Loan Purpose</label>
                  <p className="font-medium text-gray-900">{selectedLoan.purpose}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Application Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedLoan.applicationDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Credit Score</label>
                  <p className="font-medium text-gray-900">{selectedLoan.creditScore}/100</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Loan Amount</label>
                  <p className="font-medium text-gray-900">KSh {selectedLoan.amount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Interest Rate</label>
                  <p className="font-medium text-gray-900">{selectedLoan.interestRate}%</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Loan Term</label>
                  <p className="font-medium text-gray-900">{selectedLoan.term} months</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Installment</label>
                  <p className="font-medium text-gray-900">KSh {selectedLoan.monthlyInstallment.toLocaleString()}</p>
                </div>
              </div>
              {selectedLoan.collateral && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Collateral</label>
                  <p className="font-medium text-gray-900">{selectedLoan.collateral}</p>
                </div>
              )}
              {selectedLoan.notes && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-600 mb-1">Notes</label>
                  <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLoan.notes}</p>
                </div>
              )}
              {selectedLoan.disbursementDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Disbursement Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedLoan.disbursementDate).toLocaleDateString()}</p>
                </div>
              )}
              {selectedLoan.dueDate && (
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Due Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedLoan.dueDate).toLocaleDateString()}</p>
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

      {/* Process Loan Modal */}
      {isProcessModalOpen && processingLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {processAction === 'approve' && 'Approve Loan'}
                {processAction === 'reject' && 'Reject Loan'}
                {processAction === 'disburse' && 'Disburse Loan'}
              </h3>
              <button 
                onClick={() => setIsProcessModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-medium text-gray-900">{processingLoan.memberName}</p>
                <p className="text-sm text-gray-600">KSh {processingLoan.amount.toLocaleString()} • {processingLoan.term} months</p>
                <p className="text-sm text-gray-600">{processingLoan.purpose}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {processAction === 'approve' && 'Approval Notes'}
                  {processAction === 'reject' && 'Rejection Reason'}
                  {processAction === 'disburse' && 'Disbursement Details'}
                </label>
                <textarea
                  value={processNotes}
                  onChange={(e) => setProcessNotes(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={
                    processAction === 'approve' ? 'Add any notes about this approval...' :
                    processAction === 'reject' ? 'Explain the reason for rejection...' :
                    'Add disbursement details...'
                  }
                />
              </div>

              {processAction === 'disburse' && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Payment Summary</span>
                  </div>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Principal: KSh {processingLoan.amount.toLocaleString()}</p>
                    <p>Total Interest: KSh {(processingLoan.monthlyInstallment * processingLoan.term - processingLoan.amount).toLocaleString()}</p>
                    <p>Monthly Payment: KSh {processingLoan.monthlyInstallment.toLocaleString()}</p>
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsProcessModalOpen(false)}
                disabled={isProcessing}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={processLoan}
                disabled={isProcessing}
                className={`px-4 py-2 text-white rounded-xl transition-colors disabled:opacity-50 ${
                  processAction === 'reject' 
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-green-600 hover:bg-green-700'
                }`}
              >
                {isProcessing ? 'Processing...' : 
                  processAction === 'approve' ? 'Approve Loan' :
                  processAction === 'reject' ? 'Reject Loan' :
                  'Disburse Funds'
                }
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Delete Loan Application</h3>
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to delete the loan application for <strong>{selectedLoan.memberName}</strong> 
                of <strong>KSh {selectedLoan.amount.toLocaleString()}</strong>? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Delete Application'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {isReportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Generate Loan Report</h3>
              <button 
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                <select 
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portfolio">Loan Portfolio Summary</option>
                  <option value="pending">Pending Applications</option>
                  <option value="performance">Repayment Performance</option>
                  <option value="risk">Default Risk Analysis</option>
                  <option value="history">Member Loan History</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
                  <input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
                  <input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Format</label>
                <div className="flex space-x-4">
                  <button 
                    onClick={() => exportReport('pdf')}
                    disabled={isExporting}
                    className="flex-1 px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    {isExporting ? 'Generating...' : 'PDF'}
                  </button>
                  <button 
                    onClick={() => exportReport('excel')}
                    disabled={isExporting}
                    className="flex-1 px-4 py-2 border border-green-300 text-green-700 rounded-lg hover:bg-green-50 transition-colors disabled:opacity-50 flex items-center justify-center"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    {isExporting ? 'Generating...' : 'Excel'}
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => setIsReportModalOpen(false)}
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