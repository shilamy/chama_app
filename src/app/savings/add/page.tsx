'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Plus,
  PiggyBank,
  Calendar,
  User,
  CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Member } from '@/types';

export default function AddSavingsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [memberLoading, setMemberLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'savings',
    paymentMethod: 'mpesa',
    transactionId: '',
    notes: ''
  });

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setMemberLoading(true);
    try {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would send this data to your API
      console.log('Saving contribution:', {
        ...formData,
        amount: parseFloat(formData.amount)
      });
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        memberId: '',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        type: 'savings',
        paymentMethod: 'mpesa',
        transactionId: '',
        notes: ''
      });
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        // Optionally redirect to members page
        // router.push(routes.members.list);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving contribution:', error);
      alert('Error saving contribution. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-2xl mx-auto">
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top duration-500">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">
                Savings contribution of KSh {parseFloat(formData.amount).toLocaleString()} recorded successfully!
              </p>
              <p className="text-green-600 text-sm">The member&apos;s balance has been updated.</p>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link 
            href={routes.dashboard}
            className="p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
            <PiggyBank className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Record Savings Contribution</h1>
            <p className="text-gray-600">Add member savings and contributions to the chama</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Member Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Member *
                </label>
                {memberLoading ? (
                  <div className="animate-pulse text-gray-200 bg-gray-200 h-12 rounded-xl"></div>
                ) : (
                  <select
                    name="memberId"
                    required
                    value={formData.memberId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  >
                    <option value="">Choose a member...</option>
                    {members.map(member => (
                      <option key={member.id} value={member.id}>
                        {member.firstName} {member.lastName} - KSh {member.savingsBalance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Member Info Panel */}
              {selectedMember && (
                <div className="md:col-span-2 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Member Information</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-600">Current Balance:</span>
                      <p className="font-semibold text-gray-900">KSh {selectedMember.savingsBalance.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Total Contributions:</span>
                      <p className="font-semibold text-gray-900">KSh {selectedMember.contributions.toLocaleString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Member Since:</span>
                      <p className="font-semibold text-gray-900">{new Date(selectedMember.joinDate).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-blue-600">Status:</span>
                      <p className="font-semibold capitalize text-gray-900">{selectedMember.status}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Amount */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Amount (KSh) *
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  placeholder="0.00"
                />
              </div>

              {/* Contribution Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Type *
                </label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                >
                  <option value="savings">Regular Savings</option>
                  <option value="emergency">Emergency Fund</option>
                  <option value="special">Special Project</option>
                  <option value="loan_repayment">Loan Repayment</option>
                </select>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contribution Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method *
                </label>
                <select
                  name="paymentMethod"
                  required
                  value={formData.paymentMethod}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                >
                  <option value="mpesa">M-Pesa</option>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>

              {/* Transaction ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {formData.paymentMethod === 'mpesa' ? 'M-Pesa Code' : 'Transaction ID'} 
                  {formData.paymentMethod !== 'cash' && ' *'}
                </label>
                <input
                  type="text"
                  name="transactionId"
                  required={formData.paymentMethod !== 'cash'}
                  value={formData.transactionId}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  placeholder={formData.paymentMethod === 'mpesa' ? 'Enter M-Pesa code' : 'Enter transaction ID'}
                />
              </div>

              {/* Notes */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  placeholder="Additional notes about this contribution..."
                />
              </div>
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
                className="flex-1 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? 'Saving Contribution...' : 'Save Contribution'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}