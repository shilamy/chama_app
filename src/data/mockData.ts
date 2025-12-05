import { Member, Ngumbato, NgumbatoSummary } from "@/types";

// data/mockData.ts
export const mockMembers: Member[] = [
  {
    id: '1',
    firstName: 'Jane',
    lastName: 'Wanjiku',
    email: 'jane@example.com',
    phone: '+254712345678',
    role: 'chairperson',
    joinDate: '2023-01-15',
    status: 'active',
    contributions: 12500,
    savingsBalance: 85000,
    creditScore: 85, // ✅ add this
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
    contributions: 11800,
    savingsBalance: 72000,
    creditScore: 78, // ✅ add this
  },
  {
    id: '3',
    firstName: 'Grace',
    lastName: 'Auma',
    email: 'grace@example.com',
    phone: '+254734567890',
    role: 'member',
    joinDate: '2023-03-10',
    status: 'inactive',
    contributions: 8500,
    savingsBalance: 45000,
    creditScore: 62, // ✅ add this
  }
];


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
          fines: 750, // 15% fine for being 3 months late (5% per month)
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
          fines: 300, // 10% fine for 2 months late
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
          fines: 1250, // 50% fine for severe delay
          fineRate: 5,
          payments: [
            { id: '1', date: '2024-01-01', dueDate: '2024-01-01', amount: 2500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
            { id: '2', date: '2024-02-01', dueDate: '2024-02-01', amount: 2500, status: 'paid', fineAmount: 0, finePaid: true, daysLate: 0 },
            { id: '3', date: '', dueDate: '2024-03-01', amount: 2500, status: 'overdue', fineAmount: 1250, finePaid: false, daysLate: 90 }
          ]
        }
      ];

      export const mockSummary: NgumbatoSummary = {
        totalActive: 2,
        totalCollected: 21000,
        totalFines: 2300,
        overduePayments: 3,
        totalFinesCollected: 500
      };