'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Plus,
  User,
  Calendar,
  DollarSign,
  FileText,
  AlertCircle,
  PiggyBank,
  HandCoins,
  Wallet,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Member } from '@/types';

export default function AddPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('contribution');
  const [members, setMembers] = useState<Member[]>([]);
  const [memberLoading, setMemberLoading] = useState(true);

  // Separate form states for each tab
  const [contributionData, setContributionData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'savings',
    paymentMethod: 'mpesa',
    transactionId: '',
    notes: ''
  });

  const [loanData, setLoanData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    purpose: '',
    interestRate: '10',
    duration: '12',
    notes: ''
  });

  const [expenseData, setExpenseData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    category: 'operational',
    description: '',
    receiptNumber: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setMemberLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const mockMembers: Member[] = [
        {
          id: '1',
          firstName: 'Jane',
          lastName: 'Wanjiku',
          email: 'jane@example.com',
          phone: '+254712345678',
          role: 'chairperson',
          joinDate: '2023-01-15',
          status: 'active',
          contributions: 125000,
          savingsBalance: 125000,
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Otieno',
          email: 'michael@example.com',
          phone: '+254723456789',
          role: 'treasurer',
          joinDate: '2023-02-20',
          status: 'active',
          contributions: 98000,
          savingsBalance: 98000,
        }
      ];
      
      setMembers(mockMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Recording contribution:', contributionData);
      alert('Contribution recorded successfully!');
      // Reset form
      setContributionData({
        memberId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'savings',
        paymentMethod: 'mpesa',
        transactionId: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error recording contribution:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Recording loan:', loanData);
      alert('Loan application submitted successfully!');
      // Reset form
      setLoanData({
        memberId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        interestRate: '10',
        duration: '12',
        notes: ''
      });
    } catch (error) {
      console.error('Error submitting loan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Recording expense:', expenseData);
      alert('Expense recorded successfully!');
      // Reset form
      setExpenseData({
        memberId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        category: 'operational',
        description: '',
        receiptNumber: ''
      });
    } catch (error) {
      console.error('Error recording expense:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { 
      id: 'contribution', 
      label: 'Add Contribution', 
      icon: PiggyBank,
      description: 'Record member savings contributions'
    },
    { 
      id: 'loan', 
      label: 'Add Loan', 
      icon: HandCoins,
      description: 'Process new loan applications'
    },
    { 
      id: 'expense', 
      label: 'Add Expense', 
      icon: Wallet,
      description: 'Record chama expenses'
    }
  ];

  const getCurrentFormData = () => {
    switch (activeTab) {
      case 'contribution':
        return contributionData;
      case 'loan':
        return loanData;
      case 'expense':
        return expenseData;
      default:
        return contributionData;
    }
  };

  const getCurrentSubmitHandler = () => {
    switch (activeTab) {
      case 'contribution':
        return handleContributionSubmit;
      case 'loan':
        return handleLoanSubmit;
      case 'expense':
        return handleExpenseSubmit;
      default:
        return handleContributionSubmit;
    }
  };

  const renderFormFields = () => {
    const commonFields = (
      <>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Member *
          </label>
          {memberLoading ? (
            <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
          ) : (
            <select
              required
              value={getCurrentFormData().memberId}
              onChange={(e) => {
                const value = e.target.value;
                if (activeTab === 'contribution') {
                  setContributionData(prev => ({ ...prev, memberId: value }));
                } else if (activeTab === 'loan') {
                  setLoanData(prev => ({ ...prev, memberId: value }));
                } else {
                  setExpenseData(prev => ({ ...prev, memberId: value }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            >
              <option value="">Choose a member...</option>
              {members.map(member => (
                <option key={member.id} value={member.id}>
                  {member.firstName} {member.lastName} ({member.role})
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount (KSh) *
          </label>
          <input
            type="number"
            required
            min="0"
            step="0.01"
            value={getCurrentFormData().amount}
            onChange={(e) => {
              const value = e.target.value;
              if (activeTab === 'contribution') {
                setContributionData(prev => ({ ...prev, amount: value }));
              } else if (activeTab === 'loan') {
                setLoanData(prev => ({ ...prev, amount: value }));
              } else {
                setExpenseData(prev => ({ ...prev, amount: value }));
              }
            }}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="date"
              required
              value={getCurrentFormData().date}
              onChange={(e) => {
                const value = e.target.value;
                if (activeTab === 'contribution') {
                  setContributionData(prev => ({ ...prev, date: value }));
                } else if (activeTab === 'loan') {
                  setLoanData(prev => ({ ...prev, date: value }));
                } else {
                  setExpenseData(prev => ({ ...prev, date: value }));
                }
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            />
          </div>
        </div>
      </>
    );

    if (activeTab === 'contribution') {
      return (
        <>
          {commonFields}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Type *
            </label>
            <select
              required
              value={contributionData.type}
              onChange={(e) => setContributionData(prev => ({ ...prev, type: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            >
              <option value="savings">Regular Savings</option>
              <option value="emergency">Emergency Fund</option>
              <option value="special">Special Project</option>
              <option value="loan_repayment">Loan Repayment</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method *
            </label>
            <select
              required
              value={contributionData.paymentMethod}
              onChange={(e) => setContributionData(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            >
              <option value="mpesa">M-Pesa</option>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
            </select>
          </div>

          {contributionData.paymentMethod !== 'cash' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transaction ID {contributionData.paymentMethod === 'mpesa' && '(M-Pesa Code)'} *
              </label>
              <input
                type="text"
                required
                value={contributionData.transactionId}
                onChange={(e) => setContributionData(prev => ({ ...prev, transactionId: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                placeholder={`Enter ${contributionData.paymentMethod === 'mpesa' ? 'M-Pesa' : 'transaction'} code`}
              />
            </div>
          )}

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes
            </label>
            <textarea
              value={contributionData.notes}
              onChange={(e) => setContributionData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="Additional notes about this contribution..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'loan') {
      return (
        <>
          {commonFields}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loan Purpose *
            </label>
            <input
              type="text"
              required
              value={loanData.purpose}
              onChange={(e) => setLoanData(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="Enter loan purpose"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interest Rate (%) *
            </label>
            <input
              type="number"
              required
              min="0"
              max="100"
              step="0.1"
              value={loanData.interestRate}
              onChange={(e) => setLoanData(prev => ({ ...prev, interestRate: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (Months) *
            </label>
            <input
              type="number"
              required
              min="1"
              max="60"
              value={loanData.duration}
              onChange={(e) => setLoanData(prev => ({ ...prev, duration: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="12"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              value={loanData.notes}
              onChange={(e) => setLoanData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="Any additional information about this loan..."
            />
          </div>
        </>
      );
    }

    if (activeTab === 'expense') {
      return (
        <>
          {commonFields}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expense Category *
            </label>
            <select
              required
              value={expenseData.category}
              onChange={(e) => setExpenseData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
            >
              <option value="operational">Operational</option>
              <option value="administrative">Administrative</option>
              <option value="event">Event/Meeting</option>
              <option value="transport">Transport</option>
              <option value="utility">Utility Bills</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Receipt Number
            </label>
            <input
              type="text"
              value={expenseData.receiptNumber}
              onChange={(e) => setExpenseData(prev => ({ ...prev, receiptNumber: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="Enter receipt number if available"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              value={expenseData.description}
              onChange={(e) => setExpenseData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
              placeholder="Detailed description of the expense..."
            />
          </div>
        </>
      );
    }
  };

  const getSubmitButtonText = () => {
    switch (activeTab) {
      case 'contribution':
        return isLoading ? 'Recording Contribution...' : 'Record Contribution';
      case 'loan':
        return isLoading ? 'Processing Loan...' : 'Submit Loan Application';
      case 'expense':
        return isLoading ? 'Recording Expense...' : 'Record Expense';
      default:
        return 'Add Record';
    }
  };

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href={routes.dashboard}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <Plus className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Add New Record</h1>
            <p className="text-gray-600">
              {currentTab?.description || 'Add contributions, loans, or expenses'}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 mb-6">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center px-4 py-3 rounded-xl transition-colors ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={getCurrentSubmitHandler()} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {renderFormFields()}
            </div>

            {/* Form Actions */}
            <div className="flex space-x-4 pt-6 border-t border-gray-200">
              <Link
                href={routes.dashboard}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-center"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                {getSubmitButtonText()}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}