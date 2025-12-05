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





export default function AddLoanSchedulePage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1: Member & Loan Details
    memberId: '',
    loanProductId: '',
    loanAmount: '',
    purpose: '',
    
    // Step 2: Schedule Details
    interestRate: '',
    loanTerm: '',
    startDate: '',
    installmentFrequency: 'monthly',
    
    // Step 3: Review
    processingFee: '0',
    insuranceFee: '0',
    otherCharges: '0'
  });

  // Mock data - in real app, this would come from API
  const members: Member[] = [
    { id: '1', name: 'Jane Wanjiku', email: 'jane@email.com', phone: '+254712345678', status: 'active' },
    { id: '2', name: 'Michael Otieno', email: 'michael@email.com', phone: '+254723456789', status: 'active' },
    { id: '3', name: 'Sarah Muthoni', email: 'sarah@email.com', phone: '+254734567890', status: 'active' },
    { id: '4', name: 'David Kimani', email: 'david@email.com', phone: '+254745678901', status: 'inactive' },
  ];

  const loanProducts: LoanProduct[] = [
    { id: '1', name: 'Business Loan', interestRate: 12, maxAmount: 500000, minAmount: 10000, maxTerm: 36, minTerm: 3 },
    { id: '2', name: 'Emergency Loan', interestRate: 8, maxAmount: 100000, minAmount: 5000, maxTerm: 12, minTerm: 1 },
    { id: '3', name: 'Education Loan', interestRate: 6, maxAmount: 300000, minAmount: 15000, maxTerm: 24, minTerm: 6 },
    { id: '4', name: 'Asset Financing', interestRate: 10, maxAmount: 1000000, minAmount: 50000, maxTerm: 60, minTerm: 12 },
  ];

  const selectedMember = members.find(m => m.id === formData.memberId);
  const selectedProduct = loanProducts.find(p => p.id === formData.loanProductId);

  // Calculations
  const calculateInstallment = () => {
    if (!formData.loanAmount || !formData.interestRate || !formData.loanTerm) return 0;

    const principal = parseFloat(formData.loanAmount);
    const annualRate = parseFloat(formData.interestRate) / 100;
    const monthlyRate = annualRate / 12;
    const term = parseInt(formData.loanTerm);

    if (monthlyRate === 0) return principal / term;

    const installment = (principal * monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                       (Math.pow(1 + monthlyRate, term) - 1);
    
    return Number(installment.toFixed(2));
  };

  const calculateTotalInterest = () => {
    const installment = calculateInstallment();
    const principal = parseFloat(formData.loanAmount) || 0;
    const term = parseInt(formData.loanTerm) || 0;
    
    return (installment * term) - principal;
  };

  const calculateTotalPayment = () => {
    const principal = parseFloat(formData.loanAmount) || 0;
    return principal + calculateTotalInterest();
  };

  const calculateEndDate = () => {
    if (!formData.startDate || !formData.loanTerm) return '';
    
    const startDate = new Date(formData.startDate);
    const term = parseInt(formData.loanTerm);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + term);
    
    return endDate.toISOString().split('T')[0];
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, you would send the data to your API
      console.log('Creating loan schedule:', {
        ...formData,
        installmentAmount: calculateInstallment(),
        totalPayment: calculateTotalPayment(),
        endDate: calculateEndDate()
      });

      // Show success message and redirect
      alert('Loan schedule created successfully!');
      router.push(routes.loans.schedule.list);
    } catch (error) {
      console.error('Error creating loan schedule:', error);
      alert('Error creating loan schedule. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isStep1Valid = formData.memberId && formData.loanProductId && formData.loanAmount && formData.purpose;
  const isStep2Valid = formData.interestRate && formData.loanTerm && formData.startDate;
  const isStep3Valid = true; // Review step is always valid

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
          <Link
            href={routes.loans.schedule}
            className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200"
          >
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
                      {isCompleted ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <IconComponent className="h-5 w-5" />
                      )}
                    </div>
                    <span className={`text-sm mt-2 font-medium ${
                      isCurrent ? 'text-purple-600' : 'text-gray-500'
                    }`}>
                      {step.title}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`
                      w-24 h-0.5 mx-4
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Step 1: Member & Loan Details */}
          {currentStep === 1 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Member & Loan Details</h2>
              <p className="text-gray-600 mb-8">Select member and basic loan information</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Member Selection */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Member *
                  </label>
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
                            <p className="font-medium text-gray-900">{member.name}</p>
                            <p className="text-sm text-gray-500">{member.phone}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Loan Product */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Product *
                  </label>
                  <select
                    value={formData.loanProductId}
                    onChange={(e) => {
                      handleInputChange('loanProductId', e.target.value);
                      const product = loanProducts.find(p => p.id === e.target.value);
                      if (product) {
                        handleInputChange('interestRate', product.interestRate.toString());
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value="">Select a loan product</option>
                    {loanProducts.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.name} ({product.interestRate}% interest)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Loan Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (KSh) *
                  </label>
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
                      Min: KSh {selectedProduct.minAmount.toLocaleString()} • 
                      Max: KSh {selectedProduct.maxAmount.toLocaleString()}
                    </p>
                  )}
                </div>

                {/* Loan Purpose */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Purpose *
                  </label>
                  <input
                    type="text"
                    value={formData.purpose}
                    onChange={(e) => handleInputChange('purpose', e.target.value)}
                    placeholder="e.g., Business expansion, Education fees..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>

              {/* Next Button */}
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

          {/* Step 2: Schedule Details */}
          {currentStep === 2 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule Details</h2>
              <p className="text-gray-600 mb-8">Configure repayment terms and schedule</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Interest Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Annual Interest Rate (%) *
                  </label>
                  <div className="relative">
                    <Percent className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange('interestRate', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Loan Term */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Term (Months) *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="number"
                      value={formData.loanTerm}
                      onChange={(e) => handleInputChange('loanTerm', e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                    />
                  </div>
                  {selectedProduct && (
                    <p className="text-xs text-gray-500 mt-1">
                      Min: {selectedProduct.minTerm} months • 
                      Max: {selectedProduct.maxTerm} months
                    </p>
                  )}
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  />
                </div>

                {/* Installment Frequency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Installment Frequency
                  </label>
                  <select
                    value={formData.installmentFrequency}
                    onChange={(e) => handleInputChange('installmentFrequency', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  >
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
              </div>

              {/* Calculation Preview */}
              {(formData.loanAmount && formData.interestRate && formData.loanTerm) && (
                <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Calculator className="h-5 w-5 mr-2 text-purple-600" />
                    Payment Preview
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Monthly Installment</p>
                      <p className="font-semibold text-lg text-gray-900">
                        KSh {calculateInstallment().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Interest</p>
                      <p className="font-semibold text-lg text-orange-600">
                        KSh {calculateTotalInterest().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Total Payment</p>
                      <p className="font-semibold text-lg text-green-600">
                        KSh {calculateTotalPayment().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-semibold text-lg text-gray-900">
                        {new Date(calculateEndDate()).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleNext}
                  disabled={!isStep2Valid}
                  className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  Review & Create
                  <CheckCircle className="h-4 w-4 ml-2" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Review & Create */}
          {currentStep === 3 && (
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Review & Create</h2>
              <p className="text-gray-600 mb-8">Review all details before creating the schedule</p>

              <div className="space-y-6">
                {/* Member & Loan Summary */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Member & Loan Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Member</p>
                      <p className="font-semibold text-gray-900">{selectedMember?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Loan Product</p>
                      <p className="font-semibold text-gray-900">{selectedProduct?.name}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Loan Amount</p>
                      <p className="font-semibold text-gray-900">
                        KSh {parseFloat(formData.loanAmount).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Loan Purpose</p>
                      <p className="font-semibold text-gray-900">{formData.purpose}</p>
                    </div>
                  </div>
                </div>

                {/* Schedule Summary */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Schedule Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-600">Interest Rate</p>
                      <p className="font-semibold text-gray-900">{formData.interestRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Loan Term</p>
                      <p className="font-semibold text-gray-900">{formData.loanTerm} months</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Start Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(formData.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">End Date</p>
                      <p className="font-semibold text-gray-900">
                        {new Date(calculateEndDate()).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Frequency</p>
                      <p className="font-semibold text-gray-900 capitalize">
                        {formData.installmentFrequency}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Financial Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-blue-700">Monthly Installment</p>
                      <p className="font-bold text-xl text-blue-900">
                        KSh {calculateInstallment().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">Total Interest</p>
                      <p className="font-bold text-xl text-orange-600">
                        KSh {calculateTotalInterest().toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-blue-700">Total Payment</p>
                      <p className="font-bold text-xl text-green-600">
                        KSh {calculateTotalPayment().toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Warning for high interest */}
                {parseFloat(formData.interestRate) > 15 && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm text-yellow-800">
                        <p className="font-medium">High Interest Rate Notice</p>
                        <p className="mt-1">
                          The interest rate of {formData.interestRate}% is above the recommended threshold. 
                          Please ensure the member understands the terms.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium flex items-center"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Creating Schedule...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Create Loan Schedule
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}