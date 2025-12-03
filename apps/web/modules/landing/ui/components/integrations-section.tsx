'use client';

import { useState } from 'react';
import { INTEGRATION_EXAMPLES } from '../../constants';
import { Button } from '@workspace/ui/components/button';
import { CopyIcon, CheckIcon, CodeIcon, GlobeIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ScrollIndicator } from './scroll-indicator';

export const IntegrationsSection = () => {
  const [selectedIntegration, setSelectedIntegration] = useState('html');
  const [copiedCode, setCopiedCode] = useState(false);

  const currentIntegration = INTEGRATION_EXAMPLES.find(
    (integration) => integration.id === selectedIntegration,
  );

  const handleCopyCode = async () => {
    if (!currentIntegration) return;

    try {
      await navigator.clipboard.writeText(currentIntegration.code);
      setCopiedCode(true);
      toast.success('代码已复制到剪贴板');
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (error) {
      toast.error('复制失败，请手动复制');
    }
  };

  return (
    <section className="min-h-screen md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* 内容容器 - 适应屏幕高度 */}
        <div className="flex-1 overflow-hidden py-4 md:py-6">
          {/* 标题区域 - 减少间距 */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                轻松集成到任何平台
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              无论您使用什么技术栈，Echo都能轻松集成。一行代码，即可为您的网站添加强大的AI对话功能
            </p>
          </div>

          {/* 集成选择标签 - 减少间距和大小 */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-6 md:mb-8">
            {INTEGRATION_EXAMPLES.map((integration) => (
              <button
                key={integration.id}
                onClick={() => setSelectedIntegration(integration.id)}
                className={`
                  px-3 py-2 md:px-6 md:py-3 rounded-lg font-medium transition-all duration-300 text-sm md:text-base
                  ${
                    selectedIntegration === integration.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20 border border-white/20'
                  }
                `}
              >
                {integration.title}
              </button>
            ))}
          </div>

          {/* 代码演示区域 - 调整布局和大小 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 flex-1">
            {/* 代码示例 */}
            <div className="bg-gray-900 rounded-xl md:rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <CodeIcon className="w-4 h-4 text-blue-400" />
                  <h3 className="text-sm md:text-lg font-semibold text-white">
                    {currentIntegration?.title} 集成示例
                  </h3>
                </div>
                <Button
                  onClick={handleCopyCode}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white p-1"
                >
                  {copiedCode ? (
                    <CheckIcon className="w-3 h-3 md:w-4 md:h-4 text-green-400" />
                  ) : (
                    <CopyIcon className="w-3 h-3 md:w-4 md:h-4" />
                  )}
                </Button>
              </div>

              <div className="p-4 flex-1 overflow-hidden flex flex-col">
                <p className="text-gray-400 text-sm mb-3">
                  {currentIntegration?.description}
                </p>
                <div className="relative flex-1">
                  <pre className="bg-black rounded-lg p-3 overflow-x-auto text-xs md:text-sm text-gray-300 font-mono h-full">
                    <code>{currentIntegration?.code}</code>
                  </pre>

                  {/* 语法高亮背景效果 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-900/10 to-purple-900/10 rounded-lg pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 实时预览 */}
            <div className="bg-gray-900 rounded-xl md:rounded-2xl border border-white/10 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <GlobeIcon className="w-4 h-4 text-green-400" />
                  <h3 className="text-sm md:text-lg font-semibold text-white">
                    实时预览
                  </h3>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-2 h-2 md:w-3 md:h-3 bg-green-500 rounded-full"></div>
                </div>
              </div>

              <div className="p-4 flex-1 flex items-center justify-center">
                <div className="text-center w-full">
                  {/* 模拟的Echo Widget - 缩小版本 */}
                  <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-3 md:p-6 shadow-2xl shadow-blue-500/25 max-w-xs mx-auto">
                    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 md:p-4">
                      <div className="flex items-center space-x-2 mb-2 md:mb-4">
                        <div className="w-6 h-6 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center">
                          <span className="text-xs md:text-lg">🤖</span>
                        </div>
                        <div>
                          <h4 className="text-white font-semibold text-xs md:text-base">
                            Echo AI助手
                          </h4>
                          <p className="text-blue-200 text-xs">随时为您服务</p>
                        </div>
                      </div>
                      <div className="space-y-1 md:space-y-2">
                        <div className="bg-white/10 rounded-lg p-2 text-xs text-blue-100">
                          您好！我是Echo AI助手
                        </div>
                        <div className="bg-white/20 rounded-lg p-2 text-xs text-white ml-4 md:ml-8">
                          请介绍一下您的功能
                        </div>
                      </div>
                      <div className="mt-2 md:mt-4 flex items-center space-x-1 md:space-x-2">
                        <input
                          type="text"
                          placeholder="输入您的问题..."
                          className="flex-1 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs text-white placeholder-blue-200"
                          disabled
                        />
                        <button className="bg-white/20 hover:bg-white/30 rounded-lg p-1 transition-colors">
                          <svg
                            className="w-3 h-3 md:w-4 md:h-4 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 mt-3 md:mt-6 text-xs">
                    这就是您的用户将看到的Echo对话界面
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 集成优势 - 简化版本 */}
          <div className="mt-6 md:mt-8 grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
            {[
              {
                title: '快速部署',
                description: '只需几分钟即可完成集成',
                icon: '⚡',
              },
              {
                title: '高度可定制',
                description: '完全自定义外观和行为',
                icon: '🎨',
              },
              {
                title: '实时同步',
                description: '所有更改实时生效',
                icon: '🔄',
              },
            ].map((advantage, index) => (
              <div key={index} className="text-center">
                <div className="w-10 h-10 md:w-16 md:h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl mx-auto mb-2 md:mb-4 shadow-lg shadow-blue-500/25">
                  {advantage.icon}
                </div>
                <h3 className="text-sm md:text-xl font-semibold text-white mb-1 md:mb-2">
                  {advantage.title}
                </h3>
                <p className="text-gray-400 text-xs md:text-sm">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 滚动指示器 */}
        <ScrollIndicator targetId="pricing" title="点击查看定价方案" />
      </div>
    </section>
  );
};
