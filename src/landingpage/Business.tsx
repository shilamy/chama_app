import { Shield, BarChart3, Users, Clock, Zap, HeartHandshake } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: 'Secure Transactions',
    description: 'Bank-level security for all your financial transactions and member data.',
    color: 'blue',
  },
  {
    icon: BarChart3,
    title: 'Financial Insights',
    description: 'Get detailed reports and analytics to make informed decisions about your group\'s finances.',
    color: 'green',
  },
  {
    icon: Users,
    title: 'Member Management',
    description: 'Easily manage members, roles, and permissions with our intuitive interface.',
    color: 'purple',
  },
  {
    icon: Clock,
    title: 'Time Saving',
    description: 'Automate repetitive tasks and focus on growing your savings group.',
    color: 'yellow',
  },
  {
    icon: Zap,
    title: 'Instant Updates',
    description: 'Real-time notifications and updates for all group activities and transactions.',
    color: 'red',
  },
  {
    icon: HeartHandshake,
    title: 'Community Building',
    description: 'Foster stronger relationships with built-in communication tools and event planning.',
    color: 'pink',
  },
];

const colorMap = {
  blue: { bg: 'bg-blue-100', icon: 'text-blue-600' },
  green: { bg: 'bg-green-100', icon: 'text-green-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600' },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600' },
  red: { bg: 'bg-red-100', icon: 'text-red-600' },
  pink: { bg: 'bg-pink-100', icon: 'text-pink-600' },
};

export default function Business() {
  return (
    <section id='features' className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-2">Why Choose Us</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Designed Specifically for Chamas
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform is built from the ground up to address the unique needs of savings groups and community banking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colorClass = colorMap[feature.color as keyof typeof colorMap];
            
            return (
              <div 
                key={index} 
                className="group relative bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className={`inline-flex items-center justify-center p-3 ${colorClass.bg} rounded-lg mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`h-6 w-6 ${colorClass.icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
                
                {/* Hover effect decoration */}
                <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-blue-200 group-hover:opacity-50 transition-all duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        {/* Stats section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 text-white shadow-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">2,400+</div>
              <div className="text-blue-100">Active Chamas</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">KSh 12.8M</div>
              <div className="text-blue-100">Total Savings</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Support Available</div>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Ready to transform your Chama management?</h3>
          <p className="text-xl text-gray-600 mb-8">Join thousands of Chamas already using our platform</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md">
              Start Free Trial
            </button>
            <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}