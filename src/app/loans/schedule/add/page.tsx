// src/app/loans/schedule/add/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { routes } from '@/lib/routes'; // adjust the path if needed

export default function AddLoanSchedulePage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        {/* Back to schedule list */}
        <Link
          href={routes.loans.schedule.list} // string route, not object
          className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Add Loan Schedule</h1>
          <p className="text-gray-500">Fill in the details to create a new schedule</p>
        </div>
      </div>

      {/* Form */}
      <form className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label htmlFor="loanName" className="block text-sm font-medium text-gray-700">
            Loan Name
          </label>
          <input
            id="loanName"
            name="loanName"
            type="text"
            placeholder="Enter loan name"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            id="amount"
            name="amount"
            type="number"
            placeholder="Enter amount"
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Link
            href={routes.loans.schedule.list}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
