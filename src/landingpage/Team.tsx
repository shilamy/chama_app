import { team } from '@/constants';
import { TeamMember } from '@/types';
import { Linkedin, Twitter, Mail } from 'lucide-react';

export default function Team() {
  return (
    <section className="py-16 bg-gradient-to-b from-gray-50 to-white" id="team">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-base font-semibold text-blue-600 tracking-wide uppercase mb-2">Our Team</h2>
          <p className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Leadership
          </p>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Passionate individuals dedicated to revolutionizing Chama management across Kenya
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((person: TeamMember) => (
            <div 
              key={person.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group"
            >
              <div className="relative h-60 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {person.name.split(' ').map(n => n[0]).join('')}
                </div>
                
                {/* Social links */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50">
                    <Linkedin className="h-4 w-4" />
                  </button>
                  <button className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50">
                    <Twitter className="h-4 w-4" />
                  </button>
                  <button className="bg-white text-blue-600 p-2 rounded-full hover:bg-blue-50">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-1">{person.name}</h3>
                <p className="text-blue-600 font-medium mb-4">{person.role}</p>
                <p className="text-gray-600 text-sm">
                  {person.role.includes('Founder') && 'Visionary leader with 10+ years in fintech'}
                  {person.role.includes('Partner') && 'Strategic partnerships and business development expert'}
                  {person.role.includes('Investor') && 'Investor focused on financial inclusion'}
                  {person.role.includes('Developer') && 'Full-stack developer passionate about user experience'}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-2xl p-8 md:p-12 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Join Our Team</h3>
            <p className="text-blue-100 max-w-2xl mx-auto mb-6">
              We&apos;re always looking for passionate individuals who want to make a difference in financial inclusion
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-6 py-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                View Open Positions
              </button>
              <button className="px-6 py-3 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
