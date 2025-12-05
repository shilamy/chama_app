// app/loans/add/page.tsx
'use client';
import { useState, useEffect } from 'react';
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
  FileText,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Member, LoanApplication } from '@/types';



export default function ApplyForLoanPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState<LoanApplication>({
    memberId: '',
    amount: 0,
    purpose: '',
    requestedTerm: 12,
    collateral: '',
    businessPlan: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [loading, setLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

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
          creditScore: 85
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
          creditScore: 78
        }
      ];
      
      setMembers(sampleMembers);
    } catch (error) {
      console.error('Error loading members:', error);
    } finally {
      setMemberLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Loan application submitted:', formData);
      
      // Show success message
      setShowSuccess(true);
      
      // Reset form
      setFormData({
        memberId: '',
        amount: 0,
        purpose: '',
        requestedTerm: 12,
        collateral: '',
        businessPlan: '',
        emergencyContact: '',
        emergencyPhone: ''
      });
      
      // Hide success message after 4 seconds
      setTimeout(() => {
        setShowSuccess(false);
        router.push(routes.loans.list);
      }, 4000);
      
    } catch (error) {
      console.error('Error submitting loan application:', error);
      alert('Error submitting application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' || name === 'requestedTerm' ? Number(value) : value,
    }));
  };

  const selectedMember = members.find(m => m.id === formData.memberId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Success Alert */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-in slide-in-from-top duration-500">
            <Target className="h-5 w-5 text-green-600" />
            <div className="flex-1">
              <p className="text-green-800 font-medium">
                Loan application submitted successfully!
              </p>
              <p className="text-green-600 text-sm">
                Your application for KSh {formData.amount.toLocaleString()} is under review.
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
            <HandCoins className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Apply for Loan</h1>
            <p className="text-gray-600">Submit your loan application for chama approval</p>
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
                    Select Your Profile *
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
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="">Choose your member profile...</option>
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
                      Your Profile Information
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
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
                    </div>
                  </div>
                )}

                {/* Loan Amount */}
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-4">
                    Loan Amount Requested (KSh) *
                  </label>
                  <input
                    type="number"
                    id="amount"
                    name="amount"
                    required
                    min="1000"
                    max="500000"
                    step="1000"
                    value={formData.amount || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Enter the amount you need"
                  />
                  <p className="text-xs text-gray-500 mt-2">Maximum loan amount: 3x your savings balance</p>
                </div>

                {/* Loan Purpose */}
                <div>
                  <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-4">
                    Purpose of Loan *
                  </label>
                  <select
                    id="purpose"
                    name="purpose"
                    required
                    value={formData.purpose}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  >
                    <option value="">Select loan purpose...</option>
                    <option value="Business Expansion">Business Expansion</option>
                    <option value="Education Fees">Education Fees</option>
                    <option value="Medical Emergency">Medical Emergency</option>
                    <option value="Home Renovation">Home Renovation</option>
                    <option value="Agriculture">Agriculture</option>
                    <option value="Vehicle Purchase">Vehicle Purchase</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Requested Term */}
                <div>
                  <label htmlFor="requestedTerm" className="block text-sm font-medium text-gray-700 mb-4">
                    Preferred Repayment Period (Months) *
                  </label>
                  <select
                    id="requestedTerm"
                    name="requestedTerm"
                    required
                    value={formData.requestedTerm}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                  >
                    <option value="1">1 Month</option>
                    <option value="2">2 Months</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                    <option value="18">18 Months</option>
                    <option value="24">24 Months</option>
                    <option value="36">36 Months</option>
                  </select>
                </div>

                {/* Collateral */}
                <div>
                  <label htmlFor="collateral" className="block text-sm font-medium text-gray-700 mb-4">
                    Collateral Offered
                  </label>
                  <input
                    type="text"
                    id="collateral"
                    name="collateral"
                    value={formData.collateral}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="e.g., Land Title, Car Logbook, Guarantor"
                  />
                  <p className="text-xs text-gray-500 mt-2">Optional but increases approval chances</p>
                </div>

                {/* Business Plan */}
                <div>
                  <label htmlFor="businessPlan" className="block text-sm font-medium text-gray-700 mb-4">
                    Business Plan or Usage Details
                  </label>
                  <textarea
                    id="businessPlan"
                    name="businessPlan"
                    rows={4}
                    value={formData.businessPlan}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    placeholder="Describe how you plan to use the loan and generate income for repayment..."
                  />
                </div>

                {/* Emergency Contact */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Name
                    </label>
                    <input
                      type="text"
                      id="emergencyContact"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label htmlFor="emergencyPhone" className="block text-sm font-medium text-gray-700 mb-2">
                      Emergency Contact Phone
                    </label>
                    <input
                      type="tel"
                      id="emergencyPhone"
                      name="emergencyPhone"
                      value={formData.emergencyPhone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      placeholder="+254..."
                    />
                  </div>
                </div>

                {/* Terms Agreement */}
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div className="text-sm text-yellow-800">
                      <p className="font-medium">Important Notice</p>
                      <p className="mt-1">
                        By submitting this application, you agree to the chama's loan terms and conditions. 
                        Approval is subject to committee review and available funds. Maximum loan amount is 
                        3 times your total savings balance.
                      </p>
                    </div>
                  </div>
                </div>
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
                  disabled={loading || !formData.memberId}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Submitting Application...' : 'Submit Loan Application'}
                </button>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Application Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Application Tips
              </h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• Ensure your savings balance is sufficient</p>
                <p>• Provide clear purpose and repayment plan</p>
                <p>• Collateral increases approval chances</p>
                <p>• Review will take 3-5 business days</p>
                <p>• Maximum loan: 3x your savings</p>
              </div>
            </div>

            {/* Eligibility Criteria */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Target className="h-5 w-5 mr-2 text-purple-600" />
                Eligibility
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${selectedMember?.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Active membership status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${(selectedMember?.savingsBalance || 0) >= 5000 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Minimum KSh 5,000 savings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${(selectedMember?.creditScore || 0) >= 50 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>Credit score above 50</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  <span>No active defaulted loans</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}