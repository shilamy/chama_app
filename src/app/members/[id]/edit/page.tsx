"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Member } from "@/types";
import { mockMembers } from "@/data/mockData";

type PageProps = {
  searchParams: {
    id?: string;
  };
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  joinDate: string;
  role: Member["role"];
  status: Member["status"];
  password: string;
  creditScore: number;
};

export default function EditMemberPage({ searchParams }: PageProps) {
  const memberId = searchParams.id;

  const [formData, setFormData] = useState<FormState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    joinDate: "",
    role: "member",
    status: "active",
    password: "",
    creditScore: 0
  });

  useEffect(() => {
    if (!memberId) return;

    const member = mockMembers.find(m => m.id === memberId);
    if (!member) return;

    setFormData({
      firstName: member.firstName,
      lastName: member.lastName,
      email: member.email,
      phone: member.phone,
      joinDate: member.joinDate,
      role: member.role,
      status: member.status,
      password: "",
      creditScore: member.creditScore ?? 0
    });
  }, [memberId]);

  if (!memberId) {
    return <div className="p-6">Member not found</div>;
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: name === "creditScore" ? Number(value) : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      fullName: `${formData.firstName} ${formData.lastName}`
    };

    console.log("Updated data:", payload);
  };

  // Render the form
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
          <p className="text-gray-500 text-sm">ID: {memberId}</p>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow"
      >
        <div>
          <label className="block font-medium mb-1">First Name</label>
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full p-2 rounded border"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Last Name</label>
          <input
            name="lastName"
            value={formData.lastName}
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
            <option value="chairperson">Chairperson</option>
            <option value="treasurer">Treasurer</option>
            <option value="secretary">Secretary</option>
            <option value="member">Member</option>
            <option value="admin">Admin</option>
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

        <div>
          <label className="block font-medium mb-1">Credit Score</label>
          <input
            value={formData.creditScore}
            disabled
            className="w-full p-2 rounded border bg-gray-100"
          />
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
