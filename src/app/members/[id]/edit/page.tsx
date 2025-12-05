"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  joinDate: string;
  status: string;
  contributions: number;
  savingsBalance: number;
  creditScore?: number; // optional
}


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
    contributions: 50000,
    savingsBalance: 125000,
    creditScore: 750 // REQUIRED FIELD
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
    contributions: 33000,
    savingsBalance: 98000,
    creditScore: 680 // REQUIRED FIELD
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
    contributions: 12000,
    savingsBalance: 45000,
    creditScore: 540 // REQUIRED FIELD
  }
];


export default function EditMemberPage({ searchParams }: any) {
  const memberId = searchParams.id;

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    joinDate: "",
    role: "member",
    status: "active",
    password: ""
  });

  useEffect(() => {
    const member = mockMembers.find(m => m.id === memberId);

    if (member) {
      setFormData({
        name: member.name,
        email: member.email,
        phone: member.phone,
        joinDate: member.joinDate,
        role: member.role,
        status: member.status,
        password: ""
      });
    }
  }, [memberId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Updated data:", formData);
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <Link
          href="/members"
          className="p-2 hover:bg-white rounded-xl transition-colors border border-transparent hover:border-gray-200"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </Link>

        <div>
          <h1 className="text-xl font-bold">Edit Member</h1>
          <p className="text-gray-500 text-sm">{memberId}</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Join Date</label>
          <input
            type="date"
            name="joinDate"
            value={formData.joinDate}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          >
            <option value="admin">Admin</option>
            <option value="treasurer">Treasurer</option>
            <option value="secretary">Secretary</option>
            <option value="member">Member</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block font-medium mb-1">New Password</label>
          <input
            name="password"
            type="password"
            placeholder="Leave blank to keep current password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 rounded border"
          />
        </div>

        <div className="md:col-span-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-900 transition"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
