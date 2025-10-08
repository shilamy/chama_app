'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useParams, useRouter } from 'next/navigation';
import { 
  ArrowLeft,
  Save,
  EyeOff,
  Eye as EyeIcon,
  RefreshCw,
  CheckCircle2,
  X,
  AlertCircle,
  User
} from 'lucide-react';
import Link from 'next/link';
import { routes } from '@/lib/routes';




export default function EditMemberPage() {
  const { user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const memberId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Initialize form data with proper typing
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    joinDate: new Date().toISOString().split('T')[0],
    role: 'member' as 'admin' | 'member' | 'treasurer',
    status: 'active' as 'active' | 'inactive' | 'pending',
    password: ''
  });

  // Load member data when component mounts
  useEffect(() => {
    loadMemberData();
  }, [memberId]);

  // Simulate loading member data from API
  const loadMemberData = async () => {
    setIsLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - in real app, you'd fetch from your API
      const mockMembers: Member[] = [
        {
          id: '1',
          name: 'Jane Wanjiku',
          email: 'jane@example.com',
          phone: '+254712345678',
          joinDate: '2023-01-15',
          status: 'active',
          totalSavings: 125000,
          totalLoans: 50000,
          lastContribution: '2024-01-10',
          role: 'treasurer',
          performance: 95,
          password: 'encrypted_password_1'
        },
        {
          id: '2',
          name: 'Michael Otieno',
          email: 'michael@example.com',
          phone: '+254723456789',
          joinDate: '2023-02-20',
          status: 'active',
          totalSavings: 98000,
          totalLoans: 75000,
          lastContribution: '2024-01-08',
          role: 'admin',
          performance: 87,
          password: 'encrypted_password_2'
        },
        {
          id: '3',
          name: 'Grace Auma',
          email: 'grace@example.com',
          phone: '+254734567890',
          joinDate: '2023-03-10',
          status: 'inactive',
          totalSavings: 45000,
          totalLoans: 0,
          lastContribution: '2023-12-15',
          role: 'member',
          performance: 62,
          password: 'encrypted_password_3'
        }
      ];

      const member = mockMembers.find(m => m.id === memberId);
      
      if (member) {
        setFormData({
          name: member.name,
          phone: member.phone,
          email: member.email,
          joinDate: member.joinDate,
          role: member.role || 'member',
          status: member.status,
          password: '' // Don't pre-fill password for security
        });
      } else {
        console.error('Member not found');
        // Handle member not found - redirect or show error
        router.push(routes.members.base);
      }
    } catch (error) {
      console.error('Error loading member data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Reset save status when user makes changes
    if (saveStatus !== 'idle') {
      setSaveStatus('idle');
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      // Simulate API call to update member
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically make an API call to update the member
    
      console.log('Updating member with data:', { id: memberId, ...formData });
      
      // Simulate successful save
      setSaveStatus('success');
      
      // Optional: Redirect back to members page after successful save
      // setTimeout(() => {
      //   router.push(routes.members.base);
      // }, 2000);
      
    } catch (error) {
      console.error('Error updating member:', error);
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  // Status color helper function
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href={routes.members.base}
              className="p-2 hover:bg-white rounded-xl transition-colors border border-gray-200"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </Link>
            <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
             <User className="h-6 w-6 text-blue-600" />
               </div>
            <div></div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Edit Member</h1>
              <p className="text-lg text-gray-600 mt-1">
                Update member information and settings
              </p>
            </div>
          </div>

          {/* Save Status Indicator */}
          {saveStatus === 'success' && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-green-100 text-green-800 rounded-lg border border-green-200">
              <CheckCircle2 className="h-4 w-4" />
              <span className="font-medium">Changes saved successfully!</span>
            </div>
          )}
          {saveStatus === 'error' && (
            <div className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-800 rounded-lg border border-red-200">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Error saving changes</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Member Information</h2>
              <p className="text-gray-600 mt-1">
                Update basic member details and contact information
              </p>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      placeholder="Enter full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                      placeholder="+254 XXX XXX XXX"
                    />
                  </div>
                </div>

                {/* Account Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                  
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900 pr-12"
                        placeholder="Leave blank to keep current password"
                        minLength={6}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Minimum 6 characters. Leave empty to keep current password.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                      Role
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="member">Member</option>
                      <option value="treasurer">Treasurer</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="joinDate" className="block text-sm font-medium text-gray-700 mb-2">
                      Join Date
                    </label>
                    <input
                      type="date"
                      id="joinDate"
                      name="joinDate"
                      value={formData.joinDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white text-gray-900"
                    />
                  </div>
                </div>
              </div>

              {/* Current Status Display */}
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Current Account Status</h4>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(formData.status)}`}>
                    <span className="capitalize">{formData.status}</span>
                  </span>
                  <span className="text-sm text-gray-600">
                    Member since {new Date(formData.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex space-x-3 justify-end">
                <Link
                  href={routes.members.base}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-colors font-medium"
                >
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}