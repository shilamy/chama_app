// app/ngumbato/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import {
  Users,
  DollarSign,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Download,
  Filter,
  Search,
  Eye,
  Edit,
  X,
  FileText,
  Calculator,
  Ban
} from 'lucide-react';
import { Ngumbato, NgumbatoSummary, Payment } from '@/types';
import { mockNgumbatos, mockSummary } from '@/data/mockData';



export default function NgumbatoPage() {
  const { user } = useAuth();
  const [ngumbatos, setNgumbatos] = useState<Ngumbato[]>([]);
  const [summary, setSummary] = useState<NgumbatoSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedNgumbato, setSelectedNgumbato] = useState<Ngumbato | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isFineModalOpen, setIsFineModalOpen] = useState(false);

  // Form states
  const [createForm, setCreateForm] = useState({
    memberId: '',
    principleAmount: '',
    startDate: '',
    duration: '12',
    fineRate: '5' // Default 5% fine
  });

  const [paymentForm, setPaymentForm] = useState({
    amount: '',
    paymentDate: '',
    fineAmount: '0',
    notes: ''
  });

  const [fineForm, setFineForm] = useState({
    fineAmount: '',
    reason: '',
    applyDate: ''
  });

  // Calculate fines for overdue payments
  const calculateFines = (ngumbato: Ngumbato) => {
    const today = new Date();
    let totalFines = 0;
    let hasOverdue = false;

    const updatedPayments = ngumbato.payments.map(payment => {
      if (payment.status === 'paid') {
        return payment; // No changes for paid payments
      }

      const dueDate = new Date(payment.dueDate);
      const daysLate = Math.max(0, Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24)));
      
      if (daysLate > 0 && payment.status !== 'overdue') {
        hasOverdue = true;
        
        // Calculate fine: 5% of monthly contribution per month (or custom rate)
        const monthsLate = Math.ceil(daysLate / 30);
        const fineAmount = ngumbato.monthlyContribution * (ngumbato.fineRate / 100) * monthsLate;
        
        totalFines += fineAmount;
        
        return {
          ...payment,
          status: 'overdue' as const,
          fineAmount: Math.max(payment.fineAmount, fineAmount), // Keep the highest fine
          daysLate
        };
      }
      
      return payment;
    });

    return {
      updatedPayments,
      totalFines: ngumbato.fines + totalFines,
      hasOverdue
    };
  };

  // Check and update fines periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setNgumbatos(prev => prev.map(ngumbato => {
        if (ngumbato.status === 'active') {
          const { updatedPayments, totalFines, hasOverdue } = calculateFines(ngumbato);
          return {
            ...ngumbato,
            payments: updatedPayments,
            fines: totalFines,
            status: hasOverdue ? 'defaulted' : ngumbato.status
          };
        }
        return ngumbato;
      }));
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    loadNgumbatoData();
  }, []);

  const loadNgumbatoData = async () => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock data with fine calculations


      // Apply fine calculations to mock data
      const updatedNgumbatos = mockNgumbatos.map(ngumbato => {
        const { updatedPayments, totalFines, hasOverdue } = calculateFines(ngumbato);
        return {
          ...ngumbato,
          payments: updatedPayments,
          fines: totalFines,
          status: hasOverdue && ngumbato.status === 'active' ? 'defaulted' : ngumbato.status
        };
      });

      setNgumbatos(updatedNgumbatos);
      setSummary(mockSummary);
    } catch (error) {
      console.error('Error loading ngumbato data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMonthlyContribution = (principle: number) => {
    return principle * 0.1; // 10% monthly contribution
  };

  const handleCreateNgumbato = async () => {
    try {
      const principle = parseFloat(createForm.principleAmount);
      const monthlyContribution = calculateMonthlyContribution(principle);
      const fineRate = parseFloat(createForm.fineRate);
      
      const startDate = new Date(createForm.startDate);
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + parseInt(createForm.duration));

      // Generate payment schedule
      const payments: Payment[] = [];
      for (let i = 0; i < parseInt(createForm.duration); i++) {
        const paymentDueDate = new Date(startDate);
        paymentDueDate.setMonth(paymentDueDate.getMonth() + i);
        
        payments.push({
          id: `payment-${i}`,
          date: '',
          dueDate: paymentDueDate.toISOString().split('T')[0],
          amount: monthlyContribution,
          status: 'pending',
          fineAmount: 0,
          finePaid: false,
          daysLate: 0
        });
      }

      const newNgumbato: Ngumbato = {
        id: Date.now().toString(),
        memberId: createForm.memberId,
        memberName: 'New Member', // In real app, get from memberId
        principleAmount: principle,
        monthlyContribution,
        startDate: createForm.startDate,
        dueDate: dueDate.toISOString().split('T')[0],
        status: 'active',
        totalPaid: 0,
        remainingBalance: principle,
        fines: 0,
        fineRate,
        payments
      };

      setNgumbatos(prev => [...prev, newNgumbato]);
      setIsCreateModalOpen(false);
      setCreateForm({ memberId: '', principleAmount: '', startDate: '', duration: '12', fineRate: '5' });
      
      alert('Ngumbato created successfully!');
    } catch (error) {
      console.error('Error creating ngumbato:', error);
      alert('Error creating ngumbato. Please try again.');
    }
  };

  const handleRecordPayment = async (ngumbato: Ngumbato) => {
    setSelectedNgumbato(ngumbato);
    
    // Calculate automatic fine for overdue payments
    const overduePayment = ngumbato.payments.find(p => p.status === 'overdue');
    const autoFine = overduePayment ? overduePayment.fineAmount : 0;
    
    setPaymentForm({
      amount: ngumbato.monthlyContribution.toString(),
      paymentDate: new Date().toISOString().split('T')[0],
      fineAmount: autoFine.toString(),
      notes: ''
    });
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = async () => {
    if (!selectedNgumbato) return;

    try {
      const paymentAmount = parseFloat(paymentForm.amount);
      const fineAmount = parseFloat(paymentForm.fineAmount);

      // Update the ngumbato
      setNgumbatos(prev => prev.map(ng => {
        if (ng.id === selectedNgumbato.id) {
          const newTotalPaid = ng.totalPaid + paymentAmount;
          const newRemainingBalance = Math.max(0, ng.remainingBalance - paymentAmount);
          const newFines = ng.fines + fineAmount;
          
          // Mark the oldest overdue payment as paid, or create a new payment record
          const updatedPayments = [...ng.payments];
          const paymentToUpdate = updatedPayments.find(p => p.status === 'overdue') || updatedPayments.find(p => p.status === 'pending');
          
          if (paymentToUpdate) {
            paymentToUpdate.date = paymentForm.paymentDate;
            paymentToUpdate.status = 'paid';
            paymentToUpdate.fineAmount = fineAmount;
            paymentToUpdate.finePaid = fineAmount > 0;
          }

          const newStatus = newRemainingBalance === 0 ? 'completed' : ng.status;

          return {
            ...ng,
            totalPaid: newTotalPaid,
            remainingBalance: newRemainingBalance,
            fines: newFines,
            status: newStatus,
            payments: updatedPayments
          };
        }
        return ng;
      }));

      setIsPaymentModalOpen(false);
      setSelectedNgumbato(null);
      alert('Payment recorded successfully!');
    } catch (error) {
      console.error('Error recording payment:', error);
      alert('Error recording payment. Please try again.');
    }
  };

  const handleAddFine = (ngumbato: Ngumbato) => {
    setSelectedNgumbato(ngumbato);
    setFineForm({
      fineAmount: '',
      reason: '',
      applyDate: new Date().toISOString().split('T')[0]
    });
    setIsFineModalOpen(true);
  };

  const handleSubmitFine = async () => {
    if (!selectedNgumbato) return;

    try {
      const fineAmount = parseFloat(fineForm.fineAmount);

      setNgumbatos(prev => prev.map(ng => {
        if (ng.id === selectedNgumbato.id) {
          // Add fine to the first overdue payment, or create a new fine record
          const updatedPayments = [...ng.payments];
          const paymentToFine = updatedPayments.find(p => p.status === 'overdue') || updatedPayments.find(p => p.status === 'pending');
          
          if (paymentToFine) {
            paymentToFine.fineAmount += fineAmount;
            paymentToFine.status = 'overdue';
          }

          return {
            ...ng,
            fines: ng.fines + fineAmount
          };
        }
        return ng;
      }));

      setIsFineModalOpen(false);
      setSelectedNgumbato(null);
      alert('Fine added successfully!');
    } catch (error) {
      console.error('Error adding fine:', error);
      alert('Error adding fine. Please try again.');
    }
  };

  const getFineDescription = (daysLate: number, fineRate: number) => {
    if (daysLate === 0) return 'No fine';
    
    const monthsLate = Math.ceil(daysLate / 30);
    const finePercentage = fineRate * monthsLate;
    return `${finePercentage}% fine (${monthsLate} month${monthsLate > 1 ? 's' : ''} late)`;
  };

  const filteredNgumbatos = ngumbatos.filter(ngumbato => {
    const matchesSearch = ngumbato.memberName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ngumbato.status === statusFilter;
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

  const getProgressPercentage = (ngumbato: Ngumbato) => {
    return (ngumbato.totalPaid / ngumbato.principleAmount) * 100;
  };

  const getNextDueDate = (ngumbato: Ngumbato) => {
    const pendingPayment = ngumbato.payments.find(p => p.status === 'pending' || p.status === 'overdue');
    return pendingPayment ? pendingPayment.dueDate : ngumbato.dueDate;
  };

  // Add this new function to calculate overdue payments count
  const getOverduePaymentsCount = (ngumbato: Ngumbato) => {
    return ngumbato.payments.filter(p => p.status === 'overdue').length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-200">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ngumbato Management</h1>
              <p className="text-gray-600">Track special contributions and emergency funds for your chama</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button className="px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Ngumbato
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Active Ngumbatos */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Active Ngumbatos</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.totalActive}</p>
            <p className="text-sm text-green-600">Currently running</p>
          </div>

          {/* Total Collected */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="h-5 w-5 text-blue-600" />
              </div>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Collected</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalCollected.toLocaleString()}
            </p>
            <p className="text-sm text-blue-600">This month</p>
          </div>

          {/* Total Fines */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-orange-600" />
              </div>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Fines</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              KSh {summary?.totalFines.toLocaleString()}
            </p>
            <p className="text-sm text-orange-600">Outstanding</p>
          </div>

          {/* Overdue Payments */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <Clock className="h-5 w-5 text-red-600" />
              </div>
              <Clock className="h-4 w-4 text-red-600" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Overdue</h3>
            <p className="text-2xl font-bold text-gray-900 mb-1">{summary?.overduePayments}</p>
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
                placeholder="Search by member name..."
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

        {/* Ngumbatos Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Ngumbato Contributions</h3>
              <span className="text-sm text-gray-500">
                {filteredNgumbatos.length} ngumbato{filteredNgumbatos.length !== 1 ? 's' : ''} found
              </span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Principle & Monthly
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Next Due & Fines
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
                {filteredNgumbatos.map((ngumbato) => (
                  <tr key={ngumbato.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {ngumbato.memberName}
                        </p>
                        <p className="text-sm text-gray-500">
                          Started {new Date(ngumbato.startDate).toLocaleDateString()}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="text-sm font-semibold text-gray-900">
                        KSh {ngumbato.principleAmount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        KSh {ngumbato.monthlyContribution.toLocaleString()}/month (10%)
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProgressPercentage(ngumbato)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600 w-16">
                          {getProgressPercentage(ngumbato).toFixed(1)}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        KSh {ngumbato.totalPaid.toLocaleString()} paid • KSh {ngumbato.remainingBalance.toLocaleString()} left
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {new Date(getNextDueDate(ngumbato)).toLocaleDateString()}
                        </span>
                      </div>
                      {ngumbato.fines > 0 && (
                        <div className="mt-1">
                          <p className="text-xs text-red-600">
                            KSh {ngumbato.fines.toLocaleString()} in fines
                          </p>
                          <p className="text-xs text-orange-600">
                            {getOverduePaymentsCount(ngumbato)} payment{getOverduePaymentsCount(ngumbato) !== 1 ? 's' : ''} overdue
                          </p>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(ngumbato.status)}`}>
                        {getStatusIcon(ngumbato.status)}
                        <span className="ml-1 capitalize">{ngumbato.status}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button 
                          onClick={() => {
                            setSelectedNgumbato(ngumbato);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        
                        {ngumbato.status === 'active' && (
                          <>
                            <button 
                              onClick={() => handleRecordPayment(ngumbato)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                              title="Record Payment"
                            >
                              <DollarSign className="h-4 w-4" />
                            </button>
                            
                            <button 
                              onClick={() => handleAddFine(ngumbato)}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                              title="Add Fine"
                            >
                              <Ban className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredNgumbatos.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No ngumbatos found</p>
              <p className="text-gray-400 mb-4">Start by creating your first ngumbato</p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Ngumbato
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Ngumbato Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Create New Ngumbato</h3>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Member
                </label>
                <select
                  value={createForm.memberId}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, memberId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Select a member</option>
                  <option value="1">Jane Wanjiku</option>
                  <option value="2">Michael Otieno</option>
                  <option value="3">Sarah Muthoni</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Principle Amount (KSh)
                </label>
                <input
                  type="number"
                  value={createForm.principleAmount}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, principleAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter principle amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fine Rate (% per month)
                </label>
                <input
                  type="number"
                  value={createForm.fineRate}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, fineRate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="5"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Percentage charged monthly for late payments</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={createForm.startDate}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration (Months)
                </label>
                <select
                  value={createForm.duration}
                  onChange={(e) => setCreateForm(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="6">6 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                </select>
              </div>

              {/* Calculation Preview */}
              {createForm.principleAmount && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>Monthly Contribution: <span className="font-semibold">KSh {calculateMonthlyContribution(parseFloat(createForm.principleAmount)).toLocaleString()}</span></p>
                    <p>Fine Rate: <span className="font-semibold">{createForm.fineRate}% per month</span></p>
                    <p>Total Amount: <span className="font-semibold">KSh {parseFloat(createForm.principleAmount).toLocaleString()}</span></p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNgumbato}
                disabled={!createForm.memberId || !createForm.principleAmount || !createForm.startDate}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Ngumbato
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isPaymentModalOpen && selectedNgumbato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Record Payment</h3>
              <button 
                onClick={() => setIsPaymentModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedNgumbato.memberName}</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Principle: KSh {selectedNgumbato.principleAmount.toLocaleString()}</p>
                  <p>Monthly: KSh {selectedNgumbato.monthlyContribution.toLocaleString()}</p>
                  <p>Paid: KSh {selectedNgumbato.totalPaid.toLocaleString()}</p>
                  <p>Remaining: KSh {selectedNgumbato.remainingBalance.toLocaleString()}</p>
                  {selectedNgumbato.fines > 0 && (
                    <p className="text-red-600">Outstanding Fines: KSh {selectedNgumbato.fines.toLocaleString()}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount (KSh)
                </label>
                <input
                  type="number"
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fine Amount (KSh)
                </label>
                <input
                  type="number"
                  value={paymentForm.fineAmount}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, fineAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Automatic fine calculated based on {selectedNgumbato.fineRate}% monthly rate
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Date
                </label>
                <input
                  type="date"
                  value={paymentForm.paymentDate}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, paymentDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm(prev => ({ ...prev, notes: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add any notes about this payment..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsPaymentModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitPayment}
                disabled={!paymentForm.amount || !paymentForm.paymentDate}
                className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Fine Modal */}
      {isFineModalOpen && selectedNgumbato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Fine</h3>
              <button 
                onClick={() => setIsFineModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-medium text-red-900 mb-2">{selectedNgumbato.memberName}</h4>
                <div className="text-sm text-red-800 space-y-1">
                  <p>Current Fines: KSh {selectedNgumbato.fines.toLocaleString()}</p>
                  <p>Fine Rate: {selectedNgumbato.fineRate}% per month</p>
                  <p>Overdue Payments: {getOverduePaymentsCount(selectedNgumbato)}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fine Amount (KSh)
                </label>
                <input
                  type="number"
                  value={fineForm.fineAmount}
                  onChange={(e) => setFineForm(prev => ({ ...prev, fineAmount: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Enter fine amount"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Fine
                </label>
                <select
                  value={fineForm.reason}
                  onChange={(e) => setFineForm(prev => ({ ...prev, reason: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="">Select reason</option>
                  <option value="late_payment">Late Payment</option>
                  <option value="missed_payment">Missed Payment</option>
                  <option value="partial_payment">Partial Payment</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Apply Date
                </label>
                <input
                  type="date"
                  value={fineForm.applyDate}
                  onChange={(e) => setFineForm(prev => ({ ...prev, applyDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                />
              </div>

              {fineForm.reason === 'other' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Reason
                  </label>
                  <input
                    type="text"
                    placeholder="Specify reason for fine..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
              <button
                onClick={() => setIsFineModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitFine}
                disabled={!fineForm.fineAmount || !fineForm.reason}
                className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Fine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Ngumbato Details Modal */}
      {isViewModalOpen && selectedNgumbato && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Ngumbato Details</h3>
              <button 
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Member</label>
                    <p className="font-medium text-gray-900">{selectedNgumbato.memberName}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Principle Amount</label>
                    <p className="font-medium text-gray-900">KSh {selectedNgumbato.principleAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Monthly Contribution</label>
                    <p className="font-medium text-gray-900">KSh {selectedNgumbato.monthlyContribution.toLocaleString()} (10%)</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Fine Rate</label>
                    <p className="font-medium text-red-600">{selectedNgumbato.fineRate}% per month</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Start Date</label>
                    <p className="font-medium text-gray-900">{new Date(selectedNgumbato.startDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">End Date</label>
                    <p className="font-medium text-gray-900">{new Date(selectedNgumbato.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Total Fines</label>
                    <p className="font-medium text-red-600">KSh {selectedNgumbato.fines.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Overdue Payments</label>
                    <p className="font-medium text-orange-600">{getOverduePaymentsCount(selectedNgumbato)} payments</p>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-600 mb-2">Repayment Progress</label>
                <div className="flex items-center space-x-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${getProgressPercentage(selectedNgumbato)}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    {getProgressPercentage(selectedNgumbato).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>KSh {selectedNgumbato.totalPaid.toLocaleString()} paid</span>
                  <span>KSh {selectedNgumbato.remainingBalance.toLocaleString()} remaining</span>
                </div>
              </div>

              {/* Payment History */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Schedule & History</h4>
                <div className="space-y-3">
                  {selectedNgumbato.payments.map(payment => (
                    <div key={payment.id} className={`flex items-center justify-between p-4 border rounded-lg ${
                      payment.status === 'overdue' ? 'border-red-200 bg-red-50' :
                      payment.status === 'paid' ? 'border-green-200 bg-green-50' :
                      'border-gray-200'
                    }`}>
                      <div>
                        <p className="font-medium text-gray-900">
                          KSh {payment.amount.toLocaleString()} 
                          {payment.fineAmount > 0 && (
                            <span className="text-red-600 ml-2">+ KSh {payment.fineAmount.toLocaleString()} fine</span>
                          )}
                        </p>
                        <p className="text-sm text-gray-500">
                          Due: {new Date(payment.dueDate).toLocaleDateString()}
                          {payment.date && ` • Paid: ${new Date(payment.date).toLocaleDateString()}`}
                        </p>
                        {payment.daysLate > 0 && (
                          <p className="text-xs text-orange-600 mt-1">
                            {getFineDescription(payment.daysLate, selectedNgumbato.fineRate)} • {payment.daysLate} days late
                          </p>
                        )}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'paid' ? 'bg-green-100 text-green-800' :
                          payment.status === 'overdue' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {payment.status}
                        </span>
                        {payment.fineAmount > 0 && !payment.finePaid && (
                          <p className="text-xs text-red-600 mt-1">
                            Fine unpaid
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 p-6 border-t border-gray-200">
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