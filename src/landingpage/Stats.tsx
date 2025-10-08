import { Users, DollarSign, TrendingUp, Calendar, Heart, Shield } from 'lucide-react';
import { StatItem } from '@/types';
import { stats } from '@/constants';

export default function Stats() {
  return (
    <section className="py-16 bg-gradient-to-br from-gray-900 to-blue-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-400 tracking-wide uppercase mb-2">Our Impact</h2>
          <p className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by Chamas Nationwide
          </p>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Join thousands of savings groups managing their finances with our platform
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat: StatItem) => {
            const IconComponent = stat.icon;
            return (
              <div 
                key={stat.id} 
                className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 hover:border-blue-400/30 transition-all duration-300 hover:scale-105"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-3 bg-blue-500/20 rounded-full mb-4">
                    <IconComponent className="h-8 w-8 text-blue-300" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-blue-200 font-medium mb-2">{stat.name}</div>
                  <div className={`flex items-center text-sm ${
                    stat.changeType === 'positive' ? 'text-green-400' : 'text-red-400'
                  }`}>
                    <span className="font-semibold">{stat.change}</span>
                    <span className="ml-1">from last month</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional stats section */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Heart className="h-6 w-6 text-pink-300 mr-2" />
              <h3 className="text-lg font-semibold">Member Satisfaction</h3>
            </div>
            <div className="text-3xl font-bold mb-2">98%</div>
            <p className="text-blue-100">of members report improved financial management</p>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-2xl p-6 text-white">
            <div className="flex items-center mb-4">
              <Shield className="h-6 w-6 text-green-300 mr-2" />
              <h3 className="text-lg font-semibold">Secure Transactions</h3>
            </div>
            <div className="text-3xl font-bold mb-2">100%</div>
            <p className="text-green-100">zero security breaches since launch</p>
          </div>
        </div>
      </div>
    </section>
  );
}