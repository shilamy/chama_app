import { ArrowRight, Users, DollarSign, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function Hero() {
  const stats = [
    { icon: Users, label: 'Active Members', value: '2,400+' },
    { icon: DollarSign, label: 'Total Savings', value: 'KSh 12.8M' },
    { icon: TrendingUp, label: 'Active Loans', value: 'KSh 3.2M' },
    { icon: Calendar, label: 'Monthly Meetings', value: '500+' },
  ];

  return (
    <section id='home' className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Manage Your Chama <span className="text-yellow-300">Effortlessly</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 leading-relaxed">
              Streamline your savings group operations with our comprehensive platform. 
              Track contributions, manage loans, and grow your finances together.
            </p>
            
            {/* Stats grid for mobile */}
            <div className="grid grid-cols-2 gap-4 mb-8 lg:hidden">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-yellow-300" />
                    <div className="text-lg font-bold">{stat.value}</div>
                    <div className="text-xs text-blue-100">{stat.label}</div>
                  </div>
                );
              })}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/register" 
                className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition-colors shadow-lg"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link 
                href="#features" 
                className="inline-flex items-center justify-center px-6 py-4 border border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-blue-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          {/* Visual dashboard preview */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-white text-lg font-semibold">Group Overview</h3>
                <span className="text-blue-200 text-sm">June 2023</span>
              </div>
              
              {/* Stats grid for desktop */}
              <div className="hidden lg:grid grid-cols-2 gap-4 mb-6">
                {stats.map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={index} className="bg-white/10 rounded-lg p-3 text-center">
                      <Icon className="h-5 w-5 mx-auto mb-1 text-yellow-300" />
                      <div className="text-sm font-bold text-white">{stat.value}</div>
                      <div className="text-xs text-blue-200">{stat.label}</div>
                    </div>
                  );
                })}
              </div>
              
              <div className="bg-white/5 rounded-xl p-4 mb-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-blue-200 text-sm">Contributions Progress</span>
                  <span className="text-white text-sm font-semibold">75%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div 
                    className="bg-yellow-400 h-2 rounded-full" 
                    style={{ width: '75%' }}
                  ></div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-3 text-center">
                  <div className="text-xs text-blue-100 mb-1">Next Meeting</div>
                  <div className="text-sm font-bold text-white">15th June</div>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-3 text-center">
                  <div className="text-xs text-purple-100 mb-1">Loan Due</div>
                  <div className="text-sm font-bold text-white">KSh 42,500</div>
                </div>
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-purple-400 rounded-full opacity-30 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}