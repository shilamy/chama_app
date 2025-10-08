import { clients } from '@/constants';
import { Client } from '@/types';

export default function Clients() {
  return (
    <section id='clients' className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-2">Our Partners</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by Leading Organizations
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with financial institutions and organizations to provide the best services for your Chama
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
          {clients.map((client: Client) => (
            <div 
              key={client.id} 
              className="flex justify-center items-center p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {client.name.charAt(0)}
                </div>
                <span className="text-gray-700 font-medium">{client.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials section */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">What Our Partners Say</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                text: "ChamaConnect has revolutionized how we serve savings groups. Their platform is intuitive and powerful.",
                author: "Sarah Johnson",
                role: "Director, Financial Services"
              },
              {
                text: "The seamless integration with our banking systems has allowed us to serve more Chamas efficiently.",
                author: "Michael Chen",
                role: "Fintech Partnerships"
              },
              {
                text: "We've seen a 40% increase in Chama signups since partnering with ChamaConnect's platform.",
                author: "Amina Okello",
                role: "Community Banking Manager"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="text-blue-600 text-4xl mb-4"> &quot; </div>
                <p className="text-gray-700 mb-4 italic">{testimonial.text}</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}