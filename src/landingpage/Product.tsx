import { CheckCircle, BarChart3, Users, CreditCard, Calendar, Shield } from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Financial Tracking',
    description: 'Monitor contributions, expenses, and loans in real-time with detailed analytics.',
  },
  {
    icon: Users,
    title: 'Member Management',
    description: 'Easily manage members, roles, and permissions with our intuitive interface.',
  },
  {
    icon: CreditCard,
    title: 'Payment Processing',
    description: 'Seamlessly handle payments, contributions, and disbursements with secure transactions.',
  },
  {
    icon: Calendar,
    title: 'Meeting Scheduling',
    description: 'Schedule meetings, set agendas, and track attendance automatically.',
  },
  {
    icon: Shield,
    title: 'Security First',
    description: 'Bank-level security for all your financial data and transactions.',
  },
];

export default function Product() {
  return (
    <section id='product' className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-2">Our Product</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need in One Platform
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive solution brings all your Chama management needs together in one easy-to-use interface.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index} 
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-100"
              >
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-lg mb-4">
                  <Icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            );
          })}
          
          {/* CTA Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-6 text-white shadow-lg md:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-semibold mb-2">Ready to Get Started?</h3>
            <p className="mb-4">Join thousands of Chamas already using our platform.</p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-yellow-300 mr-2" />
                <span>No credit card required</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Free 14-day trial</span>
              </li>
              <li className="flex items-center">
                <CheckCircle className="h-5 w-5 text-yellow-300 mr-2" />
                <span>Cancel anytime</span>
              </li>
            </ul>
            <button className="w-full bg-white text-blue-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Free Trial
            </button>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 bg-red-400 rounded-full"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            </div>
            <div className="flex-1 text-center text-sm text-gray-500 font-medium">
              dashboard.chamaconnect.com
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Total Balance</div>
                <div className="text-2xl font-bold text-gray-900">KSh 245,800</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-green-700 mb-1">This Month</div>
                <div className="text-2xl font-bold text-gray-900">KSh 42,500</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700 mb-1">Members</div>
                <div className="text-2xl font-bold text-gray-900">24</div>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-900">Recent Contributions</h4>
                <span className="text-sm text-blue-600">View All</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Jane Doe', amount: 'KSh 2,000', date: '2 hours ago', status: 'completed' },
                  { name: 'John Smith', amount: 'KSh 5,000', date: '5 hours ago', status: 'completed' },
                  { name: 'Mary Johnson', amount: 'KSh 1,500', date: '1 day ago', status: 'pending' },
                ].map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium mr-3">
                        {transaction.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{transaction.name}</div>
                        <div className="text-sm text-gray-500">{transaction.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-gray-900">{transaction.amount}</div>
                      <div className={`text-xs ${transaction.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {transaction.status}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}