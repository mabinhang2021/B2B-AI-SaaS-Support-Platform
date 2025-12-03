'use client';

import { Button } from '@workspace/ui/components/button';
import { SparklesIcon, MailIcon, GithubIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo - 在一行显示 */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <SparklesIcon className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Echo
            </span>
          </Link>

          {/* 描述 */}
          <p className="text-gray-400 text-center max-w-md">
            下一代AI驱动的企业对话平台，为您的业务提供智能、高效、24/7不间断的客户服务解决方案。
          </p>

          {/* 社交媒体链接 */}
          <div className="flex space-x-6">
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 group"
              onClick={() => window.open('https://github.com', '_blank')}
              aria-label="GitHub"
            >
              <GithubIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 group"
              onClick={() => window.open('https://zhihu.com', '_blank')}
              aria-label="知乎"
            >
              <Image
                src="/modules/landing/zhihu-brands-solid-full.svg"
                alt="知乎"
                width={24}
                height={24}
                className="filter brightness-0 invert group-hover:brightness-0 group-hover:invert-0 transition-all duration-200"
              />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-200 group"
              onClick={() =>
                (window.location.href = 'mailto:contact@example.com')
              }
              aria-label="Gmail"
            >
              <MailIcon className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors duration-200" />
            </Button>
          </div>

          {/* 分界线 */}
          <div className="w-full max-w-2xl border-t border-gray-800"></div>

          {/* 联系信息 */}
          <div className="flex flex-col items-center space-y-2 text-gray-400 text-sm">
            <div className="flex items-center space-x-2">
              <MailIcon className="w-4 h-4" />
              <span>mabinhang22@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              <span>+86-18246016817</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span>陕西省西安市长安区学府大街1号</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
