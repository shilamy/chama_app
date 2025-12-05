// app/loans/schedule/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  TrendingUp,
  Users,
  Download,
  Filter,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Edit,
  FileText
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { routes } from '@/lib/routes';

interface LoanSchedule {
  id: string;
  loanId: string;
  memberId: string;
  memberName: string;
  loanAmount: number;
  installmentAmount: number;
  startDate: string;
  endDate: string;
  totalInstallments: number;
  completedInstallments: number;
  nextDueDate: string;
  status: 'active' | 'completed' | 'defaulted';
  remainingBalance: number;
}

interface ScheduleSummary {
  activeLoans: number;
  completedLoans: number;
  totalMonthlyCollection: number;
  defaultRate: number;
}

export default function LoanSchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [schedules, setSchedules] = useState<LoanSchedule[]>([]);
  const [summary, setSummary] = useState<ScheduleSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedSchedule, setSelectedSchedule] = useState<LoanSchedule | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  
  // Reschedule Modal States
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [reschedulingLoan, setReschedulingLoan] = useState<LoanSchedule | null>(null);
  const [rescheduleForm, setRescheduleForm] = useState({
    newTerm: 0,
    newInstallmentAmount: 0,
    newStartDate: '',
    newEndDate: '',
    reason: '',
    adjustmentType: 'term' as 'term' | 'amount' | 'both'
  });
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    loadScheduleData();
  }, []);

  // Update installment amount when term changes
  useEffect(() => {
    if (reschedulingLoan && rescheduleForm.adjustmentType === 'term') {
      const remainingAmount = reschedulingLoan.remainingBalance;
      const newInstallment = remainingAmount / rescheduleForm.newTerm;
      setRescheduleForm(prev => ({
        ...prev,
        newInstallmentAmount: Number(newInstallment.toFixed(2))
      }));
    }
  }, [rescheduleForm.newTerm, rescheduleForm.adjustmentType, reschedulingLoan]);

  // Update end date when start date or term changes
  useEffect(() => {
    if (rescheduleForm.newStartDate && rescheduleForm.newTerm > 0) {
      const startDate = new Date(rescheduleForm.newStartDate);
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + rescheduleForm.newTerm);
      
      setRescheduleForm(prev => ({
        ...prev,
        newEndDate: endDate.toISOString().split('T')[0]
      }));
    }
  }, [rescheduleForm.newStartDate, rescheduleForm.newTerm]);

  const loadScheduleData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockSchedules: LoanSchedule[] = [
        {
          id: '1',
          loanId: 'L-001',
          memberId: '1',
          memberName: 'Jane Wanjiku',
          loanAmount: 50000,
          installmentAmount: 4450,
          startDate: '2024-01-15',
          endDate: '2025-01-15',
          totalInstallments: 12,
          completedInstallments: 1,
          nextDueDate: '2024-03-15',
          status: 'active',
          remainingBalance: 44550
        },
        {
          id: '2',
          loanId: 'L-002',
          memberId: '2',
          memberName: 'Michael Otieno',
          loanAmount: 25000,
          installmentAmount: 4300,
          startDate: '2024-02-01',
          endDate: '2024-08-01',
          totalInstallments: 6,
          completedInstallments: 0,
          nextDueDate: '2024-03-01',
          status: 'active',
          remainingBalance: 25000
        },
        {
          id: '3',
          loanId: 'L-003',
          memberId: '3',
          memberName: 'Sarah Muthoni',
          loanAmount: 100000,
          installmentAmount: 4615,
          startDate: '2023-12-01',
          endDate: '2025-12-01',
          totalInstallments: 24,
          completedInstallments: 3,
          nextDueDate: '2024-03-01',
          status: 'active',
          remainingBalance: 86155
        },
        {
          id: '4',
          loanId: 'L-004',
          memberId: '4',
          memberName: 'David Kimani',
          loanAmount: 30000,
          installmentAmount: 2650,
          startDate: '2023-06-01',
          endDate: '2024-06-01',
          totalInstallments: 12,
          completedInstallments: 12,
          nextDueDate: '2024-06-01',
          status: 'completed',
          remainingBalance: 0
        },
        {
          id: '5',
          loanId: 'L-005',
          memberId: '5',
          memberName: 'Grace Achieng',
          loanAmount: 45000,
          installmentAmount: 3950,
          startDate: '2023-09-01',
          endDate: '2024-09-01',
          totalInstallments: 12,
          completedInstallments: 4,
          nextDueDate: '2024-02-01',
          status: 'defaulted',
          remainingBalance: 31600
        }
      ];

      const mockSummary: ScheduleSummary = {
        activeLoans: 3,
        completedLoans: 1,
        totalMonthlyCollection: 13415,
        defaultRate: 8.5
      };

      setSchedules(mockSchedules);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading schedule data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (schedule: LoanSchedule) => {
    setSelectedSchedule(schedule);
    setIsViewModalOpen(true);
  };

  const handleOpenReschedule = (schedule: LoanSchedule) => {
    setReschedulingLoan(schedule);
    setRescheduleForm({
      newTerm: schedule.totalInstallments - schedule.completedInstallments,
      newInstallmentAmount: schedule.installmentAmount,
      newStartDate: new Date().toISOString().split('T')[0],
      newEndDate: schedule.endDate,
      reason: '',
      adjustmentType: 'term'
    });
    setIsRescheduleModalOpen(true);
  };

  const handleRescheduleSubmit = async () => {
    if (!reschedulingLoan) return;

    setIsRescheduling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the schedule in local state
      setSchedules(prev => prev.map(schedule => {
        if (schedule.id === reschedulingLoan.id) {
          const updatedSchedule = {
            ...schedule,
            installmentAmount: rescheduleForm.newInstallmentAmount,
            totalInstallments: rescheduleForm.newTerm + schedule.completedInstallments,
            startDate: rescheduleForm.newStartDate,
            endDate: rescheduleForm.newEndDate,
            remainingBalance: rescheduleForm.newInstallmentAmount * rescheduleForm.newTerm,
            nextDueDate: new Date(rescheduleForm.newStartDate).toISOString().split('T')[0]
          };
          return updatedSchedule;
        }
        return schedule;
      }));

      // Close modal and reset
      setIsRescheduleModalOpen(false);
      setReschedulingLoan(null);
      
      console.log('Loan rescheduled successfully:', {
        loanId: reschedulingLoan.loanId,
        ...rescheduleForm
      });
      
      // Show success message
      alert('Loan schedule updated successfully!');
    } catch (error) {
      console.error('Error rescheduling loan:', error);
      alert('Error rescheduling loan. Please try again.');
    } finally {
      setIsRescheduling(false);
    }
  };

  // Export functionality
  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate API call for export
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create CSV content
      const headers = ['Loan ID', 'Member Name', 'Loan Amount', 'Installment Amount', 'Start Date', 'End Date', 'Total Installments', 'Completed Installments', 'Next Due Date', 'Status', 'Remaining Balance'];
      const csvData = filteredSchedules.map(schedule => [
        schedule.loanId,
        schedule.memberName,
        schedule.loanAmount.toString(),
        schedule.installmentAmount.toString(),
        schedule.startDate,
        schedule.endDate,
        schedule.totalInstallments.toString(),
        schedule.completedInstallments.toString(),
        schedule.nextDueDate,
        schedule.status,
        schedule.remainingBalance.toString()
      ]);

      const csvContent = [headers, ...csvData].map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `loan-schedules-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      console.log('Export completed successfully');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Error exporting data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Handle new schedule navigation
  const handleNewSchedule = () => {
    router.push(routes.loans.schedule.add);
  };

  const filteredSchedules = schedules.filter(schedule => {
    const matchesSearch = schedule.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         schedule.loanId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || schedule.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      defaulted: 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      active: Clock,
      completed: CheckCircle,
      defaulted: AlertCircle
    };
    const IconComponent = icons[status as keyof typeof icons] || Clock;
    return <IconComponent className="h-4 w-4" />;
  };

  const getProgressPercentage = (schedule: LoanSchedule) => {
    return (schedule.completedInstallments / schedule.totalInstallments) * 100;
  };

  const isDueSoon = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysDiff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7 && daysDiff > 0;
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Loan Schedules</h1>
              <p className="text-gray-600">Manage and track loan repayment schedules</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button 
              onClick={handleExport}
              disabled={isExporting || filteredSchedules.length === 0}
              className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </>
              )}
            </button>
            <button
              onClick={handleNewSchedule}
              className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium flex items-center shadow-sm hover:shadow-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Schedule
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Loans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Loans</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.activeLoans}</p>
            <p className="text-sm text-green-600">Currently running</p>
          </div>

          {/* Monthly Collection */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Monthly Collection</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalMonthlyCollection.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">Expected this month</p>
          </div>

          {/* Completed Loans */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <CheckCircle className="h-5 w-5 text-purple-600" />
              </div>
              <CheckCircle className="h-4 w-4 text-purple-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Completed</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.completedLoans}</p>
            <p className="text-sm text-purple-600">Fully repaid</p>
          </div>

          {/* Default Rate */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              <ArrowDownRight className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Default Rate</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.defaultRate}%</p>
            <p className="text-sm text-red-600">Requires attention</p>
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              />
            </div>
            
            <div className="flex space-x-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="defaulted">Defaulted</option>
              </select>
              
              <button className="p-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors">
                <Filter className="h-4 w-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Schedules Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Loan Repayment Schedules</h3>
              <span className="text-sm text-gray-500">
                {filteredSchedules.length} schedule{filteredSchedules.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member & Loan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installment
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due Date
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
                {filteredSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {schedule.memberName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Loan {schedule.loanId} • KSh {schedule.loanAmount.toLocaleString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        KSh {schedule.installmentAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">per month</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(schedule)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-12">
                          {schedule.completedInstallments}/{schedule.totalInstallments}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        KSh {schedule.remainingBalance.toLocaleString()} remaining
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className={`text-sm ${
                          isOverdue(schedule.nextDueDate) 
                            ? 'text-red-600 font-semibold' 
                            : isDueSoon(schedule.nextDueDate)
                            ? 'text-orange-600 font-semibold'
                            : 'text-gray-900'
                        }`}>
                          {new Date(schedule.nextDueDate).toLocaleDateString()}
                        </span>
                        {isOverdue(schedule.nextDueDate) && <AlertCircle className="h-4 w-4 text-red-500" />}
                        {isDueSoon(schedule.nextDueDate) && <Clock className="h-4 w-4 text-orange-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(schedule.status)}`}>
                        {getStatusIcon(schedule.status)}
                        <span className="ml-1 capitalize">{schedule.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-3">
                        {/* Improved View Button */}
                        <button 
                          onClick={() => handleView(schedule)}
                          className="group relative p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-200"
                          title="View Schedule Details"
                        >
                          <Eye className="h-4 w-4" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            View Details
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </button>
                        
                        {/* Improved Reschedule Button - Only for active loans */}
                        {schedule.status === 'active' && (
                          <button 
                            onClick={() => handleOpenReschedule(schedule)}
                            className="group relative p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all duration-200 border border-transparent hover:border-purple-200"
                            title="Reschedule Loan"
                          >
                            <Edit className="h-4 w-4" />
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                              Reschedule
                              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                            </div>
                          </button>
                        )}

                        {/* Download Schedule Button */}
                        <button 
                          onClick={() => handleExport()}
                          className="group relative p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200 border border-transparent hover:border-green-200"
                          title="Download Schedule"
                        >
                          <FileText className="h-4 w-4" />
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                            Download
                            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-2 h-2 bg-gray-800 rotate-45"></div>
                          </div>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredSchedules.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No loan schedules found</p>
              <p className="text-gray-400 mb-4">Try adjusting your search or filters</p>
              <button
                onClick={handleNewSchedule}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors shadow-sm hover:shadow-md"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Schedule
              </button>
            </div>
          )}
        </div>
      </div>

      {/* View Schedule Modal */}
      {isViewModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Loan Schedule Details</h3>
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
                  <p className="font-medium text-gray-900">{selectedSchedule.memberName}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Loan ID</label>
                  <p className="font-medium text-gray-900">{selectedSchedule.loanId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Loan Amount</label>
                  <p className="font-medium text-gray-900">KSh {selectedSchedule.loanAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedSchedule.startDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Installment</label>
                  <p className="font-medium text-gray-900">KSh {selectedSchedule.installmentAmount.toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Progress</label>
                  <p className="font-medium text-gray-900">
                    {selectedSchedule.completedInstallments} of {selectedSchedule.totalInstallments} payments
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                  <p className="font-medium text-gray-900">{new Date(selectedSchedule.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Remaining Balance</label>
                  <p className="font-medium text-gray-900">KSh {selectedSchedule.remainingBalance.toLocaleString()}</p>
                </div>
              </div>
              {/* Progress Bar */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600 mb-2">Repayment Progress</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-green-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(selectedSchedule)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getProgressPercentage(selectedSchedule).toFixed(1)}%
                  </span>
                </div>
              </div>
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

      {/* Reschedule Modal */}
      {isRescheduleModalOpen && reschedulingLoan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">Reschedule Loan</h3>
              <button 
                onClick={() => setIsRescheduleModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Loan Information */}
              <div className="bg-gray-50 p-4 rounded-xl">
                <h4 className="font-medium text-gray-900 mb-2">Loan Details</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Member:</span>
                    <p className="font-medium">{reschedulingLoan.memberName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Loan ID:</span>
                    <p className="font-medium">{reschedulingLoan.loanId}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Original Amount:</span>
                    <p className="font-medium">KSh {reschedulingLoan.loanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Completed Payments:</span>
                    <p className="font-medium">{reschedulingLoan.completedInstallments}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Remaining Balance:</span>
                    <p className="font-medium">KSh {reschedulingLoan.remainingBalance.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Adjustment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'term', label: 'Extend Term', description: 'Change repayment period' },
                    { value: 'amount', label: 'Adjust Amount', description: 'Change installment amount' },
                    { value: 'both', label: 'Both', description: 'Change both term and amount' }
                  ].map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setRescheduleForm(prev => ({ ...prev, adjustmentType: option.value as any }))}
                      className={`p-4 border rounded-xl text-left transition-colors ${
                        rescheduleForm.adjustmentType === option.value
                          ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{option.label}</div>
                      <div className="text-xs text-gray-600 mt-1">{option.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Term */}
                {(rescheduleForm.adjustmentType === 'term' || rescheduleForm.adjustmentType === 'both') && (
                  <div>
                    <label htmlFor="newTerm" className="block text-sm font-medium text-gray-700 mb-2">
                      Remaining Term (Months) *
                    </label>
                    <input
                      type="number"
                      id="newTerm"
                      min="1"
                      max="60"
                      value={rescheduleForm.newTerm}
                      onChange={(e) => setRescheduleForm(prev => ({ 
                        ...prev, 
                        newTerm: Number(e.target.value) 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current remaining: {reschedulingLoan.totalInstallments - reschedulingLoan.completedInstallments} months
                    </p>
                  </div>
                )}

                {/* New Installment Amount */}
                {(rescheduleForm.adjustmentType === 'amount' || rescheduleForm.adjustmentType === 'both') && (
                  <div>
                    <label htmlFor="newInstallmentAmount" className="block text-sm font-medium text-gray-700 mb-2">
                      New Monthly Installment (KSh) *
                    </label>
                    <input
                      type="number"
                      id="newInstallmentAmount"
                      min="100"
                      step="100"
                      value={rescheduleForm.newInstallmentAmount}
                      onChange={(e) => setRescheduleForm(prev => ({ 
                        ...prev, 
                        newInstallmentAmount: Number(e.target.value) 
                      }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Current: KSh {reschedulingLoan.installmentAmount.toLocaleString()}
                    </p>
                  </div>
                )}

                {/* New Start Date */}
                <div>
                  <label htmlFor="newStartDate" className="block text-sm font-medium text-gray-700 mb-2">
                    New Start Date *
                  </label>
                  <input
                    type="date"
                    id="newStartDate"
                    value={rescheduleForm.newStartDate}
                    onChange={(e) => setRescheduleForm(prev => ({ 
                      ...prev, 
                      newStartDate: e.target.value 
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                {/* New End Date (Read-only) */}
                <div>
                  <label htmlFor="newEndDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Projected End Date
                  </label>
                  <input
                    type="date"
                    id="newEndDate"
                    value={rescheduleForm.newEndDate}
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                  />
                  <p className="text-xs text-gray-500 mt-1">Calculated automatically</p>
                </div>
              </div>

              {/* Reason for Rescheduling */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Rescheduling *
                </label>
                <textarea
                  id="reason"
                  rows={3}
                  value={rescheduleForm.reason}
                  onChange={(e) => setRescheduleForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Explain why this loan needs to be rescheduled..."
                />
              </div>

              {/* Summary of Changes */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <h4 className="font-medium text-blue-900 mb-3">Summary of Changes</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Remaining Balance:</span>
                    <p className="font-semibold text-blue-900">
                      KSh {reschedulingLoan.remainingBalance.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">New Monthly Payment:</span>
                    <p className="font-semibold text-blue-900">
                      KSh {rescheduleForm.newInstallmentAmount.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Remaining Term:</span>
                    <p className="font-semibold text-blue-900">
                      {rescheduleForm.newTerm} months
                    </p>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Remaining Payment:</span>
                    <p className="font-semibold text-blue-900">
                      KSh {(rescheduleForm.newInstallmentAmount * rescheduleForm.newTerm).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Warning for Significant Changes */}
              {Math.abs(rescheduleForm.newInstallmentAmount - reschedulingLoan.installmentAmount) > 1000 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Significant Change Detected</p>
                      <p className="mt-1">
                        The monthly installment is changing by more than KSh 1,000. 
                        Please ensure the member can afford the new payment amount.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={() => setIsRescheduleModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleRescheduleSubmit}
                disabled={!rescheduleForm.reason.trim() || rescheduleForm.newTerm <= 0 || rescheduleForm.newInstallmentAmount <= 0 || isRescheduling}
                className="px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isRescheduling ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  'Apply Reschedule'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}