'use client';

import React, { useState, useEffect } from 'react';
import { PiggyBank, Save, ArrowLeft, Calendar } from 'lucide-react';
import { Contribution, Member } from '@/types';
import { Link } from 'react-router-dom';

export default function RecordContributionPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<Omit<Contribution, 'id' | 'status'> & { paymentMethod: 'mpesa' | 'cash' | 'bank' }>({
    memberId: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    type: 'monthly',
    paymentMethod: 'mpesa',
    transactionId: '',
  });
  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setMemberLoading(true);
    // Simulate API call
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
        status: 'active'
      },
      {
        id: '2',
        firstName: 'Michael',
        lastName: 'Otieno',
        email: 'michael@example.com',
        phone: '+254723456789',
        role: 'treasurer',
        joinDate: '2023-02-20',
        status: 'active'
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
      console.log('Recording contribution:', formData);
      alert('Contribution recorded successfully!');
      setFormData({
        memberId: '',
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        type: 'monthly',
        paymentMethod: 'mpesa',
        transactionId: '',
      });
    } catch (error) {
      console.error('Error recording contribution:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? Number(value) : value,
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
          <PiggyBank className="h-8 w-8 text-green-600 mr-3" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Record Contribution</h1>
            <p className="text-gray-600">Log member savings and contributions</p>
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
                      {member.firstName} {member.lastName} ({member.role})
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Amount */}
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">
                Amount (KSh) *
              </label>
              <input
                type="number"
                id="amount"
                name="amount"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter amount"
              />
            </div>

            {/* Contribution Type */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Type *
              </label>
              <select
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="monthly">Monthly Contribution</option>
                <option value="special">Special Project</option>
                <option value="emergency">Emergency Fund</option>
              </select>
            </div>

            {/* Payment Method */}
            <div>
              <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-2">
                Payment Method *
              </label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                required
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="mpesa">M-Pesa</option>
                <option value="cash">Cash</option>
                <option value="bank">Bank Transfer</option>
              </select>
            </div>

            {/* Transaction ID */}
            {formData.paymentMethod !== 'cash' && (
              <div>
                <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700 mb-2">
                  Transaction ID {formData.paymentMethod === 'mpesa' && '(M-Pesa Code)'} *
                </label>
                <input
                  type="text"
                  id="transactionId"
                  name="transactionId"
                  required={formData.paymentMethod !== 'cash'}
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder={`Enter ${formData.paymentMethod === 'mpesa' ? 'M-Pesa' : 'transaction'} code`}
                />
              </div>
            )}

            {/* Date */}
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                Contribution Date *
              </label>
              <div className="relative">
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full pl-10 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
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
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-4 w-4 mr-2" />
              {loading ? 'Recording...' : 'Record Contribution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}