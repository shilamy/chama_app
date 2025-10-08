import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function TryIt() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-3xl shadow-xl overflow-hidden">
          <div className="px-6 py-12 sm:px-16 sm:py-16 lg:py-20 lg:px-24">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-0 lg:flex-1">
                <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  Ready to get started?
                </h2>
                <p className="mt-4 max-w-3xl text-lg text-blue-100">
                  Join thousands of Chamas already using our platform to manage their savings and investments.
                </p>
              </div>
              <div className="mt-10 lg:mt-0 lg:ml-10 lg:flex-shrink-0">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-white hover:bg-blue-50"
                >
                  Get started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}