'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, Users, PiggyBank, HandCoins, TrendingUp, 
  BarChart3, Settings, FileText, X, Menu, ChevronLeft, ChevronRight,
  Podcast, BookOpen, LogOut, Wallet, AlertCircle, Target,
  ChevronDown,
} from 'lucide-react';
import { routes } from '@/lib/routes';

type SubmenuItem = {
  name: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

export default function DashboardSidebar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  // Toggle dropdown open/closed state
  const toggleDropdown = (name: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Define submenus for each navigation item
  const submenus: Record<string, SubmenuItem[]> = {
    'Members': [
      { name: 'View All Members', href: routes.members.list },
      { name: 'Add New Record', href: routes.members.add },
    ],
    'Savings': [
      { name: 'Savings Overview', href: routes.savings.list },
      { name: 'Add Savings', href: routes.savings.add },
    ],
    'Loans': [
      { name: 'Loan Applications', href: routes.loans.list },          
      { name: 'Apply for Loan', href: routes.loans.add },                
      { name: 'Process Loan', href: routes.loans.process.list },
      { name: 'Loan Schedule', href: routes.loans.schedule.list },
    ],
    'Ngumbato': [
      { name: 'Ngumbato Overview', href: routes.ngumbato.list },
      { name: 'Add Ngumbato', href: routes.ngumbato.add },
    ],
    'Content Management': [
      { name: 'Podcasts', href: routes.podcasts.add, icon: Podcast },
      { name: 'Articles', href: routes.articles.add, icon: BookOpen },
    ],
  };

  const navigation = [
    { name: 'Overview', href: routes.dashboard, icon: Home, hasSubmenu: false },
    { name: 'Members', href: routes.members.list, icon: Users, hasSubmenu: true },
    { name: 'Savings', href: routes.savings.list, icon: PiggyBank, hasSubmenu: true },
    { name: 'Loans', href: routes.loans.list, icon: HandCoins, hasSubmenu: true },
    { name: 'Ngumbato', href: routes.ngumbato.list, icon: TrendingUp, hasSubmenu: false },
    { name: 'Investments', href: routes.investments.list, icon: Target, hasSubmenu: false },
    { name: 'Withdrawals', href: routes.withdrawals.list, icon: Wallet, hasSubmenu: false },
    { name: 'Fines', href: routes.fines.list, icon: AlertCircle, hasSubmenu: false },
    { name: 'Reports', href: routes.reports.overview, icon: BarChart3, hasSubmenu: false },
    { name: 'Content Management', href: routes.content.base, icon: FileText, hasSubmenu: true },
    { name: 'Settings', href: routes.settings, icon: Settings, hasSubmenu: false },
  ];

  // Check if a navigation item is active
  const isNavItemActive = (href: string, itemName?: string) => {
    if (pathname === href) return true;
    if (itemName && submenus[itemName]) {
      return submenus[itemName].some(item => pathname === item.href);
    }
    return false;
  };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-50 p-2 md:hidden bg-blue-600 text-white rounded-lg shadow-lg"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out
        bg-white border-r border-gray-200 flex flex-col
        ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
        ${!isOpen && !isCollapsed ? 'md:translate-x-0 md:w-64' : ''}
        ${isCollapsed ? 'md:translate-x-0 md:w-20' : ''}`}
      >
        {/* Header with Logo and Name */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {(!isCollapsed || isOpen) ? (
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="font-bold text-gray-900">ChamaPro</span>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-gray-100 rounded md:hidden"
            >
              <X className="h-4 w-4" />
            </button>
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1 hover:bg-gray-100 rounded hidden md:block"
            >
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* User Info */}
        {(!isCollapsed || isOpen) && (
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                {user?.name?.charAt(0) ?? 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = isNavItemActive(item.href, item.name);
              const hasSubmenu = item.hasSubmenu;
              const isDropdownOpen = openDropdowns[item.name];
              const itemSubmenus = submenus[item.name] || [];

              return (
                <li key={item.name}>
                  <div className="flex flex-col">
                    {hasSubmenu ? (
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className={`flex items-center justify-between p-3 text-sm font-medium rounded-lg transition-colors group w-full text-left
                          ${isActive ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                          ${isCollapsed && !isOpen ? 'justify-center' : ''}`}
                      >
                        <div className="flex items-center">
                          <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                          {(!isCollapsed || isOpen) && (
                            <span className="ml-3">{item.name}</span>
                          )}
                        </div>
                        {(!isCollapsed || isOpen) && hasSubmenu && (
                          <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </button>
                    ) : (
                      <Link
                        href={item.href}
                        className={`flex items-center p-3 text-sm font-medium rounded-lg transition-colors group
                          ${isActive ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'}
                          ${isCollapsed && !isOpen ? 'justify-center' : ''}`}
                        onClick={() => setIsOpen(false)}
                      >
                        <Icon className={`h-5 w-5 ${isActive ? 'text-blue-700' : 'text-gray-500'}`} />
                        {(!isCollapsed || isOpen) && (
                          <span className="ml-3">{item.name}</span>
                        )}
                      </Link>
                    )}

                    {/* Dropdown submenu */}
                    {hasSubmenu && isDropdownOpen && (!isCollapsed || isOpen) && (
                      <ul className="ml-4 mt-1 space-y-1 border-l border-gray-200 pl-4">
                        {itemSubmenus.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          const SubIcon = subItem.icon;

                          return (
                            <li key={subItem.name}>
                              <Link
                                href={subItem.href}
                                className={`flex items-center p-2 text-sm rounded-lg transition-colors
                                  ${isSubActive ? 'text-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
                                onClick={() => setIsOpen(false)}
                              >
                                {SubIcon ? <SubIcon className="h-4 w-4 mr-2" /> : <ChevronRight className="h-3 w-3 mr-2" />}
                                {subItem.name}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="mt-auto p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className={`flex items-center w-full p-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors ${
              isCollapsed && !isOpen ? 'justify-center' : ''
            }`}
          >
            <LogOut className="h-5 w-5" />
            {(!isCollapsed || isOpen) && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content margin for desktop sidebar */}
      <div className={`hidden md:block transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}></div>
    </>
  );
}
