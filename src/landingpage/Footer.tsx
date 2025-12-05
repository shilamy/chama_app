import Link from 'next/link';
import { footerLinks, socialMedia } from '@/constants';
import { FooterLinkSection, SocialMedia } from '@/types';

export default function Footer() {
  return (
    <footer className="bg-gray-900">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-white text-2xl font-bold">ChamaConnect</h3>
            <p className="mt-4 text-gray-300">
              Simplifying Chama management for savings groups across Kenya. 
              Our platform helps you track contributions, manage loans, and grow your finances together.
            </p>
            <div className="mt-6 flex space-x-6">
              {socialMedia.map((item: SocialMedia) => (
                <a 
                  key={item.id} 
                  href={item.link} 
                  className="text-gray-400 hover:text-white"
                  aria-label={item.name}
                >
                  <span className="sr-only">{item.name}</span>
                  {/* If you have icon components, use them here: */}
                  {/* <item.icon className="h-6 w-6" aria-hidden="true" /> */}
                  <span className="text-lg font-semibold">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
          
          {footerLinks.map((section: FooterLinkSection, index: number) => (
            <div key={index}>
              <h3 className="text-white text-sm font-semibold uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-4 space-y-4">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link 
                      href={link.link} 
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} ChamaConnect. All rights reserved @Shilamy_dev.
          </p>
        
        </div>
      </div>
    </footer>
  );
}