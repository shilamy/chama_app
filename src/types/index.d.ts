import { LucideIcon } from "lucide-react";
import { people01 } from "../assets";



// Navigation Types
export interface NavLink {
  id: string;
  title: string;
}

// Stats Types
export interface StatItem {
  id: number;
  name: string;
  value: string;
  icon: LucideIcon;
  change: string;
  changeType: 'positive' | 'negative';
}

// Features Types
export interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  content: string;
}

// Clients Types
export interface Client {
  id: string;
  name: string;
  logo?: unknown; // Replace with specific type if you have one
}

// Team Types
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  profile?: people01; // Replace with specific type if you have one
}

// Footer Types
export interface FooterLinkSection {
  title: string;
  links: FooterLink[];
}

export interface FooterLink {
  name: string;
  link: string;
}

// Social Media Types
export interface SocialMedia {
  id: string;
  name: string;
  icon?: unknown; // Replace with specific type if you have one
  link: string;
}

// Auth Types
export interface User {
  id: number;
  name: string;
  email: string;
  profilePhoto?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}
export interface Auth {
  user: User | null;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

// Chama Types
export interface Chama {
  id: number;
  name: string;
  description: string;
  balance: number;
  membersCount: number;
  nextMeeting: string;
}

export interface Transaction {
  id: number;
  chamaId: number;
  type: 'contribution' | 'loan' | 'withdrawal' | 'dividend';
  amount: number;
  date: string;
  member: string;
  status: 'pending' | 'completed' | 'failed';
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

// Props Types
export interface SectionProps {
  className?: string;
}

export interface CardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface DashboardStats {
  totalMembers: number;
  totalSavings: number;
  activeLoans: number;
  totalInvestments: number;
  monthlyContributions: number;
  nextMeeting: string;
  loanRepaymentsDue: number;
  ngumbatoBalance: number;
  performance: number;
}

interface RecentActivity {
  id: string;
  type: 'contribution' | 'loan' | 'withdrawal' | 'meeting' | 'investment' | 'ngumbato';
  description: string;
  amount?: number;
  date: string;
  member: string;
  status: 'completed' | 'pending' | 'failed';
}

interface UpcomingEvent {
  id: string;
  type: 'meeting' | 'loan_due' | 'contribution_deadline';
  title: string;
  date: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}

interface QuickStat {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color: string;
}
interface QuickAction {
  label: string;
  icon: React.ComponentType<LucideIcon>;
  href: string;
  description: string;
}


export interface Contribution {
  id: string;
  memberId: string;
  amount: number;
  date: string;
  type: 'monthly' | 'special' | 'emergency';
  paymentMethod: 'cash' | 'mpesa' | 'bank';
  transactionId?: string;
  status: 'completed' | 'pending' | 'failed';
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed';
  applicationDate: string;
  approvalDate?: string;
  disbursementDate?: string;
  interestRate: number;
  termMonths: number;
  monthlyPayment: number;
}
interface LoanProduct {
  id: string;
  name: string;
  interestRate: number;
  maxAmount: number;
  minAmount: number;
  maxTerm: number;
  minTerm: number;
}
export interface LoanSummary {
  totalLoans: number;
  activeLoans: number;
  pendingApplications: number;
  totalRepayments: number;
  overdueLoans: number;
  loanPerformance: number; // percentage
}
export interface LoanApplication {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  purpose: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'disbursed' | 'completed';
  interestRate: number;
  term: number; // in months
  monthlyInstallment: number;
  disbursementDate?: string;
  dueDate?: string;
  notes?: string;
  creditScore: number;
  collateral?: string;
  businessPlan?: string;
  emergencyContact: string;
  emergencyPhone: string;
}



export interface Meeting {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  agenda: string[];
  attendees: string[];
  minutes?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

// types/member.ts
export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'member' | 'chairperson' | 'secretary' | 'treasurer';
  joinDate: string;
  status: 'active' | 'inactive';
  contributions: number;
  savingsBalance: number;
}


type MemberRoutes = {
  base: string; // Add the missing property
  list: string;
  add: string;
  details: string;
  edit: string;
  withdrawals: string;
  reques: string;
};

interface Ngumbato {
  id: string;
  memberId: string;
  memberName: string;
  principleAmount: number;
  monthlyContribution: number;
  startDate: string;
  dueDate: string;
  status: 'active' | 'completed' | 'defaulted';
  totalPaid: number;
  remainingBalance: number;
  fines: number;
  payments: Payment[];
  fineRate: number; // Fine percentage
}

interface Payment {
  id: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
  fineAmount: number;
  finePaid: boolean;
  daysLate: number;
}

interface NgumbatoSummary {
  totalActive: number;
  totalCollected: number;
  totalFines: number;
  overduePayments: number;
  totalFinesCollected: number;
}


interface SavingsTransaction {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  type: 'savings' | 'emergency' | 'special' | 'loan_repayment';
  date: string;
  paymentMethod: 'mpesa' | 'cash' | 'bank';
  transactionId: string;
  notes?: string;
  status: 'completed' | 'pending' | 'failed';
}

interface SavingsSummary {
  totalSavings: number;
  totalMembers: number;
  monthlyContribution: number;
  growthRate: number;
  emergencyFund: number;
  specialProjects: number;
}

export interface Expenses {
  id: string;
  title: string;
  amount: number;
  date: string;
  category: 'operational' | 'administrative' | 'miscellaneous';
  incurredBy: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  notes?: string;

}



