'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import {
  Hero,
  Stats,
  Business,
  Product,
  Clients,
  CardDeals,
  Footer,
  Team,
  TryIt
} from '../landingpage';
import { navLinks } from '@/constants';
import { User, Auth } from '@/types';
import { Users } from 'lucide-react';

export default function Welcome() {
  const [auth, setAuth] = useState<Auth>({ user: null });
  const [isScrolled, setIsScrolled] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/user', {
          credentials: 'include',
        });
        
        if (response.ok) {
          const userData: User = await response.json();
          setAuth({ user: userData });
        } else {
          setAuth({ user: null });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setAuth({ user: null });
      }
    };

    checkAuth();

    // Handle scroll event for navbar
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <Head>
        <title>ChamaConnect - Manage Your Savings Group with Ease</title>
        <meta name="description" content="ChamaConnect helps you manage your savings group with ease. Track contributions, manage loans, schedule meetings, and generate reports all in one place." />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
      </Head>

      {/* Navigation */}
      <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center mr-2">
              <Users className="h-6 w-6 text-white" />
            </div>
            <span className={`text-xl font-bold ${isScrolled ? 'text-blue-600' : 'text-white'}`}>ChamaConnect</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <ul className="flex space-x-8 items-center">
              {navLinks.map((nav) => (
                <li key={nav.id}>
                  <a
                    href={`#${nav.id}`}
                    className={`text-sm font-medium transition-colors duration-200 ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}
                  >
                    {nav.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Auth Buttons */}
          <div className="flex gap-3 items-center">
            {auth.user ? (
              <Link
                href="/dashboard"
                className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${isScrolled ? 'border border-blue-600 text-blue-600 hover:bg-blue-50' : 'border border-white text-white hover:bg-white hover:text-blue-600'}`}
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className={`px-4 py-2 text-sm rounded-md font-medium transition-colors ${isScrolled ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-white text-blue-600 hover:bg-blue-50'}`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <div className="pt-20">
        <Hero />
        <Stats />
        <Business />
        <Product />
        <Clients />
        <CardDeals />
        <Team />
        <TryIt />
        <Footer />
      </div>
    </>
  );
}