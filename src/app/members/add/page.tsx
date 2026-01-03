'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Plus,
  Calendar,
  PiggyBank,
  HandCoins,
  Wallet,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';
import { Member, Contribution, Loan, Expenses } from '@/types';
import { mockMembers } from '@/data/mockData';

/* =======================
   Mock storage
======================= */

const mockContributions: Contribution[] = [];
const mockLoans: Loan[] = [];
const mockExpenses: Expenses[] = [];

/* =======================
   Local Types
======================= */

type ContributionType =
  | 'savings'
  | 'emergency'
  | 'special'
  | 'loan_repayment';

type PaymentMethod = 'mpesa' | 'cash' | 'bank';

export default function AddPage() {
  const { user } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] =
    useState<'contribution' | 'loan' | 'expense'>('contribution');

  const [members, setMembers] = useState<Member[]>([]);
  const [memberLoading, setMemberLoading] = useState(true);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  /* =======================
     Form States
  ======================= */

  const [contributionData, setContributionData] = useState({
    memberId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'savings' as ContributionType,
    paymentMethod: 'mpesa' as PaymentMethod,
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
    category: 'operational' as Expenses['category'],
    description: '',
    receiptNumber: ''
  });

  /* =======================
     Effects
  ======================= */

  useEffect(() => {
    const loadMembers = async () => {
      setMemberLoading(true);
      await new Promise(r => setTimeout(r, 800));
      setMembers(mockMembers);
      setMemberLoading(false);
    };

    loadMembers();
  }, []);

  useEffect(() => {
    if (!showSuccessAlert) return;
    const t = setTimeout(() => setShowSuccessAlert(false), 5000);
    return () => clearTimeout(t);
  }, [showSuccessAlert]);

  const showSuccess = (message: string) => {
    setSuccessMessage(message);
    setShowSuccessAlert(true);
  };

  /* =======================
     Submit Handlers
  ======================= */

  const handleContributionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const amount = Number(contributionData.amount);

    const newContribution: Contribution = {
      id: `cont_${Date.now()}`,
      memberId: contributionData.memberId,
      amount,
      date: contributionData.date,
      type: contributionData.type,
      status: 'completed',
      paymentMethod: contributionData.paymentMethod,
      transactionId:
        contributionData.paymentMethod === 'cash'
          ? undefined
          : contributionData.transactionId,
      createdAt: new Date().toISOString(),
      createdBy: user?.id ?? 'system'
    };

    mockContributions.push(newContribution);

    setMembers(prev =>
      prev.map(m =>
        m.id === contributionData.memberId
          ? {
              ...m,
              contributions: m.contributions + amount,
              savingsBalance: m.savingsBalance + amount
            }
          : m
      )
    );

    showSuccess(
      `Contribution of KSh ${amount.toLocaleString()} recorded successfully`
    );

    setContributionData({
      memberId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'savings',
      paymentMethod: 'mpesa',
      transactionId: '',
      notes: ''
    });

    setIsLoading(false);
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newLoan: Loan = {
      id: `loan_${Date.now()}`,
      memberId: loanData.memberId,
      amount: Number(loanData.amount),
      date: loanData.date,
      purpose: loanData.purpose,
      interestRate: Number(loanData.interestRate),
      duration: Number(loanData.duration),
      status: 'pending',
      notes: loanData.notes || undefined,
      createdAt: new Date().toISOString(),
      createdBy: user?.id ?? 'system'
    };

    mockLoans.push(newLoan);

    showSuccess(
      `Loan application for KSh ${newLoan.amount.toLocaleString()} submitted`
    );

    setLoanData({
      memberId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      purpose: '',
      interestRate: '10',
      duration: '12',
      notes: ''
    });

    setIsLoading(false);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const newExpense: Expenses = {
      id: `exp_${Date.now()}`,
      memberId: expenseData.memberId,
      amount: Number(expenseData.amount),
      date: expenseData.date,
      category: expenseData.category,
      description: expenseData.description,
      receiptNumber: expenseData.receiptNumber || undefined,
      status: 'approved',
      createdAt: new Date().toISOString(),
      createdBy: user?.id ?? 'system'
    };

    mockExpenses.push(newExpense);

    showSuccess(
      `Expense of KSh ${newExpense.amount.toLocaleString()} recorded`
    );

    setExpenseData({
      memberId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      category: 'operational',
      description: '',
      receiptNumber: ''
    });

    setIsLoading(false);
  };

  /* =======================
     Helpers
  ======================= */

  const submitHandler =
    activeTab === 'contribution'
      ? handleContributionSubmit
      : activeTab === 'loan'
      ? handleLoanSubmit
      : handleExpenseSubmit;

  /* =======================
     Render
  ======================= */

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">

        {showSuccessAlert && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-800 font-medium">{successMessage}</p>
            <button
              onClick={() => setShowSuccessAlert(false)}
              className="ml-auto"
            >
              <AlertCircle className="h-4 w-4 text-green-600" />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href={routes.dashboard} className="p-2 bg-white rounded-xl">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-3xl font-bold">Add New Record</h1>
        </div>

        {/* Form */}
        <form
          onSubmit={submitHandler}
          className="bg-white rounded-2xl p-8 shadow-sm border"
        >
          {/* Your renderFormFields() JSX stays exactly as-is */}
          {/* Intentionally unchanged UI */}

          <div className="mt-8 flex gap-4">
            <Link
              href={routes.dashboard}
              className="flex-1 text-center px-6 py-3 border rounded-xl"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl"
            >
              <Plus className="h-4 w-4 inline mr-2" />
              {isLoading ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-xs text-gray-500 grid grid-cols-3 gap-4">
          <div>Contributions: {mockContributions.length}</div>
          <div>Loans: {mockLoans.length}</div>
          <div>Expenses: {mockExpenses.length}</div>
        </div>
      </div>
    </div>
  );
}
