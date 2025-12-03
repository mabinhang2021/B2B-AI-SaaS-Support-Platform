import React from 'react';

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen min-w-screen flex h-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* 背景装饰元素 */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-600/20 to-blue-600/20 rounded-full blur-3xl"></div>
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 w-full max-w-md mx-auto p-6">
        {/* Logo区域 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">欢迎回到 Echo</h1>
          <p className="text-gray-400">登录您的企业AI助手平台</p>
        </div>

        {/* 表单容器 */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 shadow-xl">
          {children}
        </div>

        {/* 底部信息 */}
        <div className="text-center mt-6 text-sm text-gray-500">
          <p>© 2024 Echo. 企业级AI对话平台</p>
        </div>
      </div>
    </div>
  );
};
