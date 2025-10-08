'use client';
import React, { useState, useEffect } from 'react';
import { HandCoins, Save, ArrowLeft, Calendar, User, Target } from 'lucide-react';
import { Loan, Member } from '@/types';
import { Link } from 'react-router-dom';

export default function ProcessLoanPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Omit<Loan, 'id' | 'status' | 'applicationDate' | 'approvalDate' | 'disbursementDate'>>({
    memberId: '',
    amount: 0,
    purpose: '',
    interestRate: 10,
    termMonths: 12,
    monthlyPayment: 0,
  });
  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  useEffect(() => {
    // Calculate monthly payment when amount, interest rate, or term changes
    const { amount, interestRate, termMonths } = formData;
    if (amount > 0 && termMonths > 0) {
      const monthlyRate = interestRate / 100 / 12;
      const monthlyPayment = amount * monthlyRate * Math.pow(1 + monthlyRate, termMonths) / 
                           (Math.pow(1 + monthlyRate, termMonths) - 1);
      setFormData(prev => ({
        ...prev,
        monthlyPayment: Number(monthlyPayment.toFixed(2))
      }));
    }
  }, [formData, formData.amount, formData.interestRate, formData.termMonths]);

  const loadMembers = async () => {
    setMemberLoading(true);
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
        contributions: 0,
        savingsBalance: 0
      }
    ];
    
    setMembers(sampleMembers);
    setMemberLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Processing loan:', formData);
      alert('Loan application submitted successfully!');
      setFormData({
        memberId: '',
        amount: 0,
        purpose: '',
        interestRate: 10,
        termMonths: 12,
        monthlyPayment: 0,
      });
    } catch (error) {
      console.error('Error processing loan:', error);
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

  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-6">
          <Link to="/dashboard" className="mr-4 p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <HandCoins className="h-8 w-8 text-purple-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Process Loan</h1>
            <p className="text-gray-600">Approve or disburse loan to members</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="space-y-6">
            {/* Member Selection */}
            <div>
              <label htmlFor="memberId" className="block text-sm font-medium text-gray-700 mb-2">
                Select Member *
              </label>
              {memberLoading ? (
                <div className="animate-pulse bg-gray-200 h-12 rounded-lg"></div>
              ) : (
                <select
                  id="memberId"
                  name="memberId"
                  required
                  value={formData.memberId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                >
                  <option value="">Choose a member...</option>
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      {member.firstName} {member.lastName}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Loan Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Amount (KSh) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                required
                min="0"
                step="1000"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter loan amount"
              />
            </div>

            {/* Loan Purpose */}
            <div>
              <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                Loan Purpose *
              </label>
              <textarea
                id="purpose"
                name="purpose"
                required
                rows={3}
                value={formData.purpose}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Describe the purpose of this loan..."
              />
            </div>

            {/* Loan Terms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Interest Rate (%) *
                </label>
                <input
                  type="number"
                  id="interestRate"
                  name="interestRate"
                  required
                  min="0"
                  max="50"
                  step="0.1"
                  value={formData.interestRate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>
            </div>

            {/* Loan Summary */}
            {formData.amount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-2 flex items-center">
                  <Target className="h-4 w-4 mr-2" />
                  Loan Summary
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-blue-700">Total Loan:</span>
                    <div className="font-semibold text-blue-900">KSh {formData.amount.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Monthly Payment:</span>
                    <div className="font-semibold text-blue-900">KSh {formData.monthlyPayment.toLocaleString()}</div>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Interest:</span>
                    <div className="font-semibold text-blue-900">
                      KSh {((formData.monthlyPayment * formData.termMonths) - formData.amount).toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-blue-700">Total Repayment:</span>
                    <div className="font-semibold text-blue-900">
                      KSh {(formData.monthlyPayment * formData.termMonths).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end space-x-4">
            <Link
              to="/dashboard"
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Processing...' : 'Submit Loan Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}