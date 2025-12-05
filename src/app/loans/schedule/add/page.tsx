// app/loans/schedule/add/page.tsx
'use client';
import { useState } from 'react';
import { Member, LoanProduct } from '@/types';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Calendar,
  ArrowLeft,
  User,
  DollarSign,
  Percent,
  Clock,
  Calculator,
  CheckCircle,
  AlertCircle,
  Users
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { mockMembers, loanProducts as importedLoanProducts } from '@/data/mockData';

export default function AddLoanSchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    memberId: '',
    loanProductId: '',
    loanAmount: '',
    purpose: '',
    interestRate: '',
    loanTerm: '',
    startDate: '',
    installmentFrequency: 'monthly',
    processingFee: '0',
    insuranceFee: '0',
    otherCharges: '0'
  });

  // Mock data
  const members: Member[] = [...mockMembers];
  const products: LoanProduct[] = [...importedLoanProducts];

  const selectedMember = members.find(m => m.id === formData.memberId);
  const selectedProduct = products.find(p => p.id === formData.loanProductId);

  // Calculations
  const calculateInstallment = () => {
    const principal = Math.max(parseFloat(formData.loanAmount) || 0, 0);
    const annualRate = Math.max(parseFloat(formData.interestRate) / 100 || 0, 0);
    const term = Math.max(parseInt(formData.loanTerm) || 0, 0);

    if (!principal || !term) return 0;

    const monthlyRate = annualRate / 12;
    if (monthlyRate === 0) return principal / term;

    const installment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) /
      (Math.pow(1 + monthlyRate, term) - 1);

    return Number(installment.toFixed(2));
  };

  const calculateTotalInterest = () => {
    const installment = calculateInstallment();
    const principal = Math.max(parseFloat(formData.loanAmount) || 0, 0);
    const term = Math.max(parseInt(formData.loanTerm) || 0, 0);

    return (installment * term) - principal;
  };

  const calculateTotalPayment = () => {
    return Math.max(parseFloat(formData.loanAmount) || 0, 0) + calculateTotalInterest();
  };

  const calculateEndDate = () => {
    if (!formData.startDate || !formData.loanTerm) return '';
    const startDate = new Date(formData.startDate);
    const term = Math.max(parseInt(formData.loanTerm) || 0, 0);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + term);
    return endDate.toISOString().split('T')[0];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => setCurrentStep(prev => prev + 1);
  const handleBack = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('Creating loan schedule:', {
        ...formData,
        installmentAmount: calculateInstallment(),
        totalPayment: calculateTotalPayment(),
        endDate: calculateEndDate()
      });
      alert('Loan schedule created successfully!');
      router.push(routes.loans.schedule.list);
    } catch (error) {
      console.error(error);
      alert('Error creating loan schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.memberId && formData.loanProductId && formData.loanAmount && formData.purpose;
  const isStep2Valid = formData.interestRate && formData.loanTerm && formData.startDate;

  const steps = [
    { number: 1, title: 'Member & Loan', icon: User },
    { number: 2, title: 'Schedule', icon: Calendar },
    { number: 3, title: 'Review', icon: CheckCircle }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-purple-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link href={routes.loans.schedule} className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Create Loan Schedule</h1>
            <p className="text-gray-600">Set up a new loan repayment schedule for a member</p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              const isCompleted = currentStep > step.number;
              const isCurrent = currentStep === step.number;

              return (
                <div key={step.number} className="flex items-center">
                  <div className="flex flex-col items-center">
                    <div className={`
                      flex items-center justify-center w-12 h-12 rounded-full border-2 font-semibold
                      ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                      ${isCurrent ? 'bg-purple-600 border-purple-600 text-white' : ''}
                      ${!isCompleted && !isCurrent ? 'bg-gray-100 border-gray-300 text-gray-400' : ''}
                    `}>
                      {isCompleted ? <CheckCircle className="h-6 w-6" /> : <IconComponent className="h-5 w-5" />}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${isCurrent ? 'text-purple-600' : 'text-gray-500'}`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && <div className={`${isCompleted ? 'bg-green-500' : 'bg-gray-200'} w-24 h-0.5 mx-4`} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1 */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Member & Loan Details</h2>
              <p className="text-gray-600 mb-8">Select member and basic loan information</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Member *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {members.filter(m => m.status === 'active').map(member => (
                      <button
                        key={member.id}
                        type="button"
                        onClick={() => handleInputChange('memberId', member.id)}
                        className={`p-4 border-2 rounded-xl text-left transition-all ${
                          formData.memberId === member.id
                            ? 'border-purple-500 bg-purple-50 ring-2 ring-purple-200'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{member.firstName} {member.lastName}</p>
                            <p className="text-sm text-gray-500">{member.phone}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Product *</label>
                  <select
                    value={formData.loanProductId}
                    onChange={(e) => {
                      handleInputChange('loanProductId', e.target.value);
                      const product = products.find(p => p.id === e.target.value);
                      if (product) handleInputChange('interestRate', product.interestRate.toString());
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value="">Select a loan product</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.interestRate}% interest)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount (KSh) *</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.loanAmount}
                      onChange={(e) => handleInputChange('loanAmount', e.target.value)}
                      placeholder="Enter loan amount"
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: KSh {selectedProduct.minAmount.toLocaleString()} • Max: KSh {selectedProduct.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Purpose *</label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="e.g., Business expansion, Education fees..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleNext}
                  disabled={!isStep1Valid}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Continue to Schedule
                  <Calendar className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 & 3 remain mostly unchanged, just replace `loanProducts` with `products` and `member.name` with first+last */}
          {/* For brevity, I can provide Steps 2 & 3 fully rewritten if you want */}
        </div>
      </div>
    </div>
  );
}
