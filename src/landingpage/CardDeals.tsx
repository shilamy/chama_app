

export default function CardDeals() {
  return (
    <section id='products' className="py-16 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <h2 className="text-3xl font-bold mb-6">Find a better card deal in few easy steps.</h2>
            <p className="text-blue-100 mb-8">
              Our platform helps you manage your Chama&apos;s financial transactions securely and efficiently. 
              Track contributions, loans, and expenses all in one place.
            </p>
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-blue-50 transition">
              Get Started
            </button>
          </div>
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Recent Transactions</h3>
                <span className="text-sm text-blue-600">View All</span>
              </div>
              <div className="space-y-4">
                {[
                  { name: 'Jane Doe', amount: 'KSh 2,000', type: 'Contribution', status: 'Completed' },
                  { name: 'John Smith', amount: 'KSh 5,000', type: 'Loan Payment', status: 'Completed' },
                  { name: 'Mary Johnson', amount: 'KSh 1,500', type: 'Contribution', status: 'Pending' },
                  { name: 'Peter Kimani', amount: 'KSh 10,000', type: 'Loan Disbursement', status: 'Completed' },
                ].map((transaction, index) => (
                  <div key={index} className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-gray-900">{transaction.name}</p>
                      <p className="text-sm text-gray-500">{transaction.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{transaction.amount}</p>
                      <p className={`text-sm ${transaction.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                        {transaction.status}
                      </p>
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