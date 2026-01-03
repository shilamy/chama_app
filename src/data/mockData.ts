import { LoanApplication, LoanProduct, Member, Ngumbato, NgumbatoSummary } from "@/types";

// ----------------------------
// Members
// ----------------------------

export const mockMembers: Member[] = [
  {
    id: "1",
    firstName: "Jane",
    lastName: "Wanjiku",
    email: "jane@example.com",
    phone: "+254712345678",
    role: "chairperson",
    joinDate: "2023-01-15",
    status: "active",
    contributions: 125000,
    savingsBalance: 50000,
    creditScore: 82
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Otieno",
    email: "michael@example.com",
    phone: "+254723456789",
    role: "secretary",
    joinDate: "2023-02-20",
    status: "active",
    contributions: 98000,
    savingsBalance: 75000,
    creditScore: 75
  },
  {
    id: "3",
    firstName: "Grace",
    lastName: "Auma",
    email: "grace@example.com",
    phone: "+254734567890",
    role: "member",
    joinDate: "2023-03-10",
    status: "inactive",
    contributions: 45000,
    savingsBalance: 0,
    creditScore: 52
  }
];

// ----------------------------
// Loan Products
// ----------------------------
export const loanProducts: LoanProduct[] = [
  {
    id: '1',
    name: 'Business Loan',
    interestRate: 12,
    maxAmount: 500000,
    minAmount: 10000,
    maxTerm: 36,
    minTerm: 3,
  },
  {
    id: '2',
    name: 'Emergency Loan',
    interestRate: 8,
    maxAmount: 100000,
    minAmount: 5000,
    maxTerm: 12,
    minTerm: 1,
  },
  {
    id: '3',
    name: 'Education Loan',
    interestRate: 6,
    maxAmount: 300000,
    minAmount: 15000,
    maxTerm: 24,
    minTerm: 6,
  },
  {
    id: '4',
    name: 'Asset Financing',
    interestRate: 10,
    maxAmount: 1000000,
    minAmount: 50000,
    maxTerm: 60,
    minTerm: 12,
  }
];

// ----------------------------
// Loan Applications
// ----------------------------
export const mockLoans: LoanApplication[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Jane Wanjiku',
    amount: 50000,
    purpose: 'Business Expansion',
    applicationDate: '2025-12-05',
    status: 'approved',
    interestRate: 5,
    term: 12,
    monthlyInstallment: 4375,
    disbursementDate: '2025-12-10',
    dueDate: '2026-12-10',
    creditScore: 85,
    collateral: 'Land Title',
    emergencyContact: 'Mary Wanjiku',
    emergencyPhone: '+254712345679',
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Michael Otieno',
    amount: 30000,
    purpose: 'Education Fees',
    applicationDate: '2025-11-20',
    status: 'pending',
    interestRate: 5,
    term: 6,
    monthlyInstallment: 5250,
    disbursementDate: '2025-11-25',
    dueDate: '2026-05-25',
    creditScore: 78,
    collateral: '',
    emergencyContact: 'Peter Otieno',
    emergencyPhone: '+254723456780',
  }
];

// ----------------------------
// Ngumbato (Savings Groups)
// ----------------------------
export const mockNgumbatos: Ngumbato[] = [
  {
    id: '1',
    memberId: '1',
    memberName: 'Jane Wanjiku',
    principleAmount: 50000,
    monthlyContribution: 5000,
    startDate: '2024-01-15',
    dueDate: '2025-01-15',
    status: 'active',
    totalPaid: 15000,
    remainingBalance: 35000,
    fines: 750,
    fineRate: 5,
    payments: [
      { id: '1', date: '2024-01-15', dueDate: '2024-01-15', amount: 5000, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '2', date: '2024-02-15', dueDate: '2024-02-15', amount: 5000, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '3', date: '2024-03-15', dueDate: '2024-03-15', amount: 5000, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '4', date: '', dueDate: '2024-04-15', amount: 5000, status: 'overdue', fineAmount: 750, finePaid: false, daysLate: 45 }
    ]
  },
  {
    id: '2',
    memberId: '2',
    memberName: 'Michael Otieno',
    principleAmount: 30000,
    monthlyContribution: 3000,
    startDate: '2024-02-01',
    dueDate: '2025-02-01',
    status: 'active',
    totalPaid: 6000,
    remainingBalance: 24000,
    fines: 300,
    fineRate: 5,
    payments: [
      { id: '1', date: '2024-02-01', dueDate: '2024-02-01', amount: 3000, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '2', date: '2024-03-01', dueDate: '2024-03-01', amount: 3000, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '3', date: '', dueDate: '2024-04-01', amount: 3000, status: 'overdue', fineAmount: 300, finePaid: false, daysLate: 30 }
    ]
  },
  {
    id: '3',
    memberId: '3',
    memberName: 'Sarah Muthoni',
    principleAmount: 75000,
    monthlyContribution: 7500,
    startDate: '2023-12-01',
    dueDate: '2024-12-01',
    status: 'completed',
    totalPaid: 75000,
    remainingBalance: 0,
    fines: 1500,
    fineRate: 5,
    payments: [
      { id: '1', date: '2023-12-01', dueDate: '2023-12-01', amount: 7500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '2', date: '2024-01-01', dueDate: '2024-01-01', amount: 7500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
    ]
  },
  {
    id: '4',
    memberId: '4',
    memberName: 'David Kimani',
    principleAmount: 25000,
    monthlyContribution: 2500,
    startDate: '2024-01-01',
    dueDate: '2025-01-01',
    status: 'defaulted',
    totalPaid: 5000,
    remainingBalance: 20000,
    fines: 1250,
    fineRate: 5,
    payments: [
      { id: '1', date: '2024-01-01', dueDate: '2024-01-01', amount: 2500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '2', date: '2024-02-01', dueDate: '2024-02-01', amount: 2500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
      { id: '3', date: '', dueDate: '2024-03-01', amount: 2500, status: 'overdue', fineAmount: 1250, finePaid: false, daysLate: 90 }
    ]
  }
];

// ----------------------------
// Ngumbato Summary
// ----------------------------
export const mockSummary: NgumbatoSummary = {
  totalActive: 2,
  totalCollected: 21000,
  totalFines: 2300,
  overduePayments: 3,
  totalFinesCollected: 500
};
