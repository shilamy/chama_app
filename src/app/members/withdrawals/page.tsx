'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { 
  ArrowLeft,
  Download,
  Filter,
  Calendar,
  User,
  CreditCard
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';

interface Withdrawal {
  id: string;
  memberName: string;
  memberId: string;
  amount: number;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  type: 'savings' | 'emergency' | 'dividend';
  reason?: string;
}

export default function WithdrawalPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([
    {
      id: '1',
      memberName: 'Jane Wanjiku',
      memberId: 'M001',
      amount: 15000,
      date: '2024-01-15',
      status: 'pending',
      type: 'savings',
      reason: 'School fees payment'
    },
    {
      id: '2',
      memberName: 'Michael Otieno',
      memberId: 'M002',
      amount: 25000,
      date: '2024-01-14',
      status: 'approved',
      type: 'emergency'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'savings':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'emergency':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'dividend':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Withdrawal Management</h1>
                <p className="mt-1 text-lg text-gray-600">
                  Manage member withdrawals and approval requests
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-3">
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { 
              label: 'Total Withdrawals', 
              value: 'KSh 85,000', 
              color: 'from-blue-500 to-blue-600',
              change: '+12%'
            },
            { 
              label: 'Pending Approval', 
              value: '3 Requests',
              color: 'from-yellow-500 to-yellow-600',
              change: '2 new'
            },
            { 
              label: 'Approved This Month', 
              value: 'KSh 45,000',
              color: 'from-green-500 to-green-600',
              change: '+8%'
            },
            { 
              label: 'Rejected', 
              value: '1 Request',
              color: 'from-red-500 to-red-600',
              change: '-5%'
            }
          ].map((stat, index) => (
            <div key={index} className="bg-gradient-to-br text-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
              <div className={`bg-gradient-to-r ${stat.color} p-1`}>
                <div className="bg-white/10 backdrop-blur-sm p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm font-medium">{stat.label}</p>
                      <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      <span className="text-blue-200 text-xs font-medium bg-white/20 px-2 py-1 rounded-full mt-2 inline-block">
                        {stat.change}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Withdrawals Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Withdrawal Requests ({withdrawals.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {withdrawal.memberName.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {withdrawal.memberName}
                          </div>
                          <div className="text-xs text-gray-500">ID: {withdrawal.memberId}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        KSh {withdrawal.amount.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold border ${getTypeColor(withdrawal.type)}`}>
                        {withdrawal.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                        {new Date(withdrawal.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(withdrawal.status)}`}>
                        {withdrawal.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        {withdrawal.status === 'pending' && (
                          <>
                            <button className="px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm">
                              Approve
                            </button>
                            <button className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                              Reject
                            </button>
                          </>
                        )}
                        <button className="px-3 py-1 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}