'use client';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/app/dashboard/Sidebar';
import Footer from '@/app/dashboard/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        {children}
         <Footer />
      </main>
    </div>
  );
}