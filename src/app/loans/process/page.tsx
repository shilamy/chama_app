'use client';
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  HandCoins, 
  Save, 
  ArrowLeft, 
  Calendar, 
  User, 
  Target, 
  Calculator,
  CheckCircle,
  AlertCircle,
  PiggyBank,
  TrendingUp
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'suspended';
  contributions: number;
  savingsBalance: number;
  creditScore?: number;
  existingLoans?: number;
}

interface LoanFormData {
  memberId: string;
  amount: number;
  purpose: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
  collateral?: string;
  guarantorId?: string;
  disbursementDate: string;
  notes?: string;
}

export default function ProcessLoanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [guarantors, setGuarantors] = useState<Member[]>([]);
  const [formData, setFormData] = useState<LoanFormData>({
    memberId: '',
    amount: 0,
    purpose: '',
    interestRate: 12.5,
    termMonths: 12,
    monthlyPayment: 0,
    collateral: '',
    guarantorId: '',
    disbursementDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [calculationError, setCalculationError] = useState('');

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    // Calculate monthly payment when amount, interest rate, or term changes
    calculateMonthlyPayment();
  }, [formData.amount, formData.interestRate, formData.termMonths]);

  useEffect(() => {
    // Update guarantors list when member changes
    if (formData.memberId) {
      const availableGuarantors = members.filter(m => 
        m.id !== formData.memberId && 
        m.status === 'active' && 
        m.savingsBalance > formData.amount * 0.1 // Must have at least 10% of loan amount in savings
      );
      setGuarantors(availableGuarantors);
    } else {
      setGuarantors([]);
    }
  }, [formData.memberId, members, formData.amount]);

  const loadMembers = async () => {
    setMemberLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const sampleMembers: Member[] = [
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
          creditScore: 85,
          existingLoans: 0
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
          creditScore: 78,
          existingLoans: 1
        },
        {
          id: '3',
          firstName: 'Sarah',
          lastName: 'Muthoni',
          email: 'sarah@example.com',
          phone: '+254734567890',
          role: 'secretary',
          joinDate: '2023-03-10',
          status: 'active',
          contributions: 75000,
          savingsBalance: 75000,
          creditScore: 92,
          existingLoans: 0
        }
      ];
      
      setMembers(sampleMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setMemberLoading(false);
    }
  };

  const calculateMonthlyPayment = () => {
    const { amount, interestRate, termMonths } = formData;
    
    if (amount <= 0 || termMonths <= 0) {
      setFormData(prev => ({ ...prev, monthlyPayment: 0 }));
      setCalculationError('');
      return;
    }

    if (amount > 1000000) {
      setCalculationError('Loan amount cannot exceed KSh 1,000,000');
      return;
    }

    if (termMonths > 60) {
      setCalculationError('Loan term cannot exceed 60 months');
      return;
    }

    try {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                           (Math.pow(1 + monthlyRate, termMonths) - 1);
      
      setFormData(prev => ({
        ...prev,
        monthlyPayment: Number(monthlyPayment.toFixed(2))
      }));
      setCalculationError('');
    } catch (error) {
      console.error('Error calculating monthly payment:', error);
      setCalculationError('Error calculating monthly payment');
    }
  };

  const validateForm = (): boolean => {
    if (!formData.memberId) {
      alert('Please select a member');
      return false;
    }

    if (formData.amount <= 0) {
      alert('Please enter a valid loan amount');
      return false;
    }

    if (formData.amount > 1000000) {
      alert('Maximum loan amount is KSh 1,000,000');
      return false;
    }

    if (!formData.purpose.trim()) {
      alert('Please enter loan purpose');
      return false;
    }

    if (formData.termMonths < 1 || formData.termMonths > 60) {
      alert('Loan term must be between 1 and 60 months');
      return false;
    }

    const selectedMember = members.find(m => m.id === formData.memberId);
    if (selectedMember && formData.amount > selectedMember.savingsBalance * 3) {
      if (!confirm(`Loan amount exceeds 3x member's savings balance. Continue anyway?`)) {
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Processing loan:', {
        ...formData,
        totalRepayment: formData.monthlyPayment * formData.termMonths,
        totalInterest: (formData.monthlyPayment * formData.termMonths) - formData.amount
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        memberId: '',
        amount: 0,
        purpose: '',
        interestRate: 12.5,
        termMonths: 12,
        monthlyPayment: 0,
        collateral: '',
        guarantorId: '',
        disbursementDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      
      // Hide success message after 4 seconds and redirect
      setTimeout(() => {
        setShowSuccess(false);
        router.push(routes.loans.list);
      }, 4000);
      
    } catch (error) {
      console.error('Error processing loan:', error);
      alert('Error processing loan. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'interestRate' || name === 'termMonths' ? Number(value) : value,
    }));
  };

  const quickSelectAmount = (amount: number) => {
    setFormData(prev => ({ ...prev, amount }));
  };

  const selectedMember = members.find(m => m.id === formData.memberId);
  const totalRepayment = formData.monthlyPayment * formData.termMonths;
  const totalInterest = totalRepayment - formData.amount;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top duration-500">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">
                Loan application processed successfully!
              </p>
              <p className="text-green-600 text-sm">
                KSh {formData.amount.toLocaleString()} loan has been approved and will be disbursed.
              </p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href={routes.loans.list}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <HandCoins className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Process New Loan</h1>
            <p className="text-gray-600">Approve and disburse loans to chama members</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="space-y-8">
                {/* Member Selection */}
                <div>
                  <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-4">
                    Select Member *
                  </label>
                  {memberLoading ? (
                    <div className="animate-pulse bg-gray-200 h-12 rounded-xl"></div>
                  ) : (
                    <select
                      id="memberId"
                      name="memberId"
                      required
                      value={formData.memberId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Choose a member...</option>
                      {members.map(member => (
                        <option key={member.id} value={member.id}>
                          {member.firstName} {member.lastName} - KSh {member.savingsBalance.toLocaleString()} Savings
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                {/* Member Info Panel */}
                {selectedMember && (
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-3 flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Member Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-blue-600">Savings Balance:</span>
                        <p className="font-semibold">KSh {selectedMember.savingsBalance.toLocaleString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Credit Score:</span>
                        <p className="font-semibold">{selectedMember.creditScore}/100</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Member Since:</span>
                        <p className="font-semibold">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className="text-blue-600">Active Loans:</span>
                        <p className="font-semibold">{selectedMember.existingLoans || 0}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Loan Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-4">
                    Loan Amount (KSh) *
                  </label>
                  
                  {/* Quick Amount Buttons */}
                  <div className="flex space-x-3 mb-4">
                    {[5000, 10000, 25000, 50000, 100000].map(amount => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => quickSelectAmount(amount)}
                        className={`px-4 py-2 border rounded-xl transition-colors font-medium ${
                          formData.amount === amount
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {amount.toLocaleString()}
                      </button>
                    ))}
                  </div>
                  
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="1000"
                    max="1000000"
                    step="1000"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    placeholder="Enter loan amount"
                  />
                  <p className="text-xs text-gray-500 mt-2">Minimum: KSh 1,000 • Maximum: KSh 1,000,000</p>
                </div>

                {/* Loan Purpose */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-4">
                    Loan Purpose *
                  </label>
                  <textarea
                    id="purpose"
                    name="purpose"
                    required
                    rows={3}
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    placeholder="Describe the purpose of this loan..."
                  />
                </div>

                {/* Loan Terms */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                      Interest Rate (%) *
                    </label>
                    <input
                      type="number"
                      id="interestRate"
                      name="interestRate"
                      required
                      min="5"
                      max="25"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="termMonths" className="block text-sm font-medium text-gray-700 mb-2">
                      Term (Months) *
                    </label>
                    <input
                      type="number"
                      id="termMonths"
                      name="termMonths"
                      required
                      min="1"
                      max="60"
                      value={formData.termMonths}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="monthlyPayment" className="block text-sm font-medium text-gray-700 mb-2">
                      Monthly Payment (KSh)
                    </label>
                    <input
                      type="number"
                      id="monthlyPayment"
                      name="monthlyPayment"
                      readOnly
                      value={formData.monthlyPayment}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-600 font-semibold"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 mb-2">
                      Collateral (Optional)
                    </label>
                    <input
                      type="text"
                      id="collateral"
                      name="collateral"
                      value={formData.collateral}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                      placeholder="e.g., Land Title, Car Logbook"
                    />
                  </div>

                  <div>
                    <label htmlFor="guarantorId" className="block text-sm font-medium text-gray-700 mb-2">
                      Guarantor (Optional)
                    </label>
                    <select
                      id="guarantorId"
                      name="guarantorId"
                      value={formData.guarantorId}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Select a guarantor...</option>
                      {guarantors.map(guarantor => (
                        <option key={guarantor.id} value={guarantor.id}>
                          {guarantor.firstName} {guarantor.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Disbursement Date */}
                <div>
                  <label htmlFor="disbursementDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Disbursement Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="date"
                      id="disbursementDate"
                      name="disbursementDate"
                      required
                      value={formData.disbursementDate}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    name="notes"
                    rows={3}
                    value={formData.notes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors bg-white text-gray-900"
                    placeholder="Any additional notes or special conditions..."
                  />
                </div>

                {/* Error Display */}
                {calculationError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-600" />
                    <p className="text-red-800 text-sm">{calculationError}</p>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex space-x-4 pt-6 border-t border-gray-200">
                <Link
                  href={routes.loans.list}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium text-center"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={loading || !!calculationError}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Processing Loan...' : 'Approve & Disburse Loan'}
                </button>
              </div>
            </form>
          </div>

          {/* Loan Summary Sidebar */}
          <div className="space-y-6">
            {/* Loan Summary Card */}
            {formData.amount > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-purple-600" />
                  Loan Summary
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Principal Amount:</span>
                    <span className="font-semibold text-gray-900">KSh {formData.amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Interest Rate:</span>
                    <span className="font-semibold text-gray-900">{formData.interestRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Loan Term:</span>
                    <span className="font-semibold text-gray-900">{formData.termMonths} months</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Monthly Payment:</span>
                    <span className="font-semibold text-green-600">KSh {formData.monthlyPayment.toLocaleString()}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Interest:</span>
                      <span className="font-semibold text-orange-600">KSh {totalInterest.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center text-lg">
                      <span className="text-gray-800 font-medium">Total Repayment:</span>
                      <span className="font-bold text-purple-600">KSh {totalRepayment.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Risk Assessment Card */}
            {selectedMember && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-blue-600" />
                  Risk Assessment
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Credit Score:</span>
                    <span className={`font-semibold ${
                      selectedMember.creditScore! >= 80 ? 'text-green-600' :
                      selectedMember.creditScore! >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {selectedMember.creditScore}/100
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Savings Coverage:</span>
                    <span className={`font-semibold ${
                      formData.amount <= selectedMember.savingsBalance ? 'text-green-600' :
                      formData.amount <= selectedMember.savingsBalance * 2 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(selectedMember.savingsBalance / formData.amount * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Debt-to-Savings:</span>
                    <span className={`font-semibold ${
                      (formData.amount / selectedMember.savingsBalance) <= 1 ? 'text-green-600' :
                      (formData.amount / selectedMember.savingsBalance) <= 3 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {(formData.amount / selectedMember.savingsBalance).toFixed(1)}x
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-green-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => calculateMonthlyPayment()}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Recalculate Payments
                </button>
                <button
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      interestRate: 12.5,
                      termMonths: 12
                    }));
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Reset to Default Terms
                </button>
                <Link
                  href={routes.members.list}
                  className="block w-full px-4 py-2 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-sm font-medium text-center"
                >
                  View All Members
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}