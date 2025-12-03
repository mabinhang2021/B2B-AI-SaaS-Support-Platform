'use client';

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { MenuIcon, XIcon, SparklesIcon, ArrowRightIcon } from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { UserButton } from '@clerk/nextjs';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isSignedIn, user } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: '功能', href: '#features' },
    { label: '集成', href: '#integrations' },
    { label: '定价', href: '#pricing' },
    { label: '演示', href: '#show' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${
        isScrolled
          ? 'bg-black/80 backdrop-blur-md border-b border-white/10'
          : 'bg-transparent'
      }
    `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <SparklesIcon className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Echo
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => scrollToSection(item.href)}
                className="text-gray-300 hover:text-white transition-colors duration-200 font-medium"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link href="/conversations">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    进入控制台
                    <ArrowRightIcon className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      rootBox: 'w-8 h-8',
                      avatarBox: 'w-8 h-8',
                      userButtonTrigger: 'p-0 hover:bg-transparent',
                      userButtonBox: 'w-full h-full',
                    },
                  }}
                />
              </>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button
                    variant="ghost"
                    className="text-gray-300 hover:text-white"
                  >
                    登录
                  </Button>
                </Link>
                <Link href="/conversations">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                    免费开始
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isOpen ? (
              <XIcon className="w-6 h-6" />
            ) : (
              <MenuIcon className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="block w-full text-left px-3 py-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-md font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="pt-4 pb-2 border-t border-white/10">
                {isSignedIn ? (
                  <>
                    <Link href="/conversations">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white mb-2">
                        进入控制台
                        <ArrowRightIcon className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                    <div className="flex items-center justify-center p-2">
                      <UserButton
                        appearance={{
                          elements: {
                            rootBox: 'w-8 h-8',
                            avatarBox: 'w-8 h-8',
                            userButtonTrigger: 'p-0 hover:bg-transparent',
                            userButtonBox: 'w-full h-full',
                          },
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-300 hover:text-white mb-2"
                      >
                        登录
                      </Button>
                    </Link>
                    <Link href="/conversations">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                        免费开始
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
