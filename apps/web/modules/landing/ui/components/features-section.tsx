'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FEATURES } from '../../constants';
import { Button } from '@workspace/ui/components/button';
import { ArrowRightIcon, CheckCircleIcon } from 'lucide-react';
import { ScrollIndicator } from './scroll-indicator';

export const FeaturesSection = () => {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  const handleLearnMore = (featureId: string) => {
    const docPaths: Record<string, string> = {
      conversations: '/docs/conversations-docs',
      'knowledge-base': '/docs/knowledge-base-docs',
      integrations: '/docs/integrations-docs',
      customization: '/docs/customization-docs',
      'voice-calls': '/docs/voice-calls-docs',
      billing: '/docs/billing-docs',
    };

    const path = docPaths[featureId];
    if (path) {
      router.push(path);
    }
  };

  return (
    <section className="min-h-screen md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* 内容容器 - 缩小整个section，给底部留空间 */}
        <div className="flex-1 overflow-hidden py-6 ">
          {/* 标题区域 - 减少间距 */}

          <div className="text-center mb-8 ">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                全面的AI对话解决方案
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto">
              从智能对话到语音通话，从知识库管理到品牌定制，Echo为您提供企业级AI助手的全套工具
            </p>
          </div>
          {/* 功能网格 - 调整间距和大小，给底部留空间 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 flex-1">
            {FEATURES.map((feature, index) => (
              <div
                key={feature.id}
                className="relative group"
                onMouseEnter={() => setHoveredFeature(feature.id)}
                onMouseLeave={() => setHoveredFeature(null)}
              >
                {/* 功能卡片 - 中等尺寸 */}
                <div
                  className={`
                  relative h-full p-4 lg:p-5 rounded-2xl border transition-all duration-500 transform
                  ${
                    hoveredFeature === feature.id
                      ? 'border-transparent scale-105 shadow-2xl'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}
                >
                  {/* 背景渐变 */}
                  <div
                    className={`
                  absolute inset-0 rounded-2xl bg-gradient-to-br opacity-0 transition-opacity duration-500
                  ${hoveredFeature === feature.id ? 'opacity-100' : ''}
                  ${feature.gradient}
                `}
                  />

                  {/* 内容 */}
                  <div className="relative z-10 h-full flex flex-col">
                    {/* 图标 - 缩小 */}
                    <div
                      className={`
                    w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center text-2xl lg:text-3xl mb-4
                    bg-gradient-to-br ${feature.gradient} shadow-lg
                    ${hoveredFeature === feature.id ? 'animate-pulse' : ''}
                  `}
                    >
                      {feature.icon}
                    </div>

                    {/* 标题和描述 - 缩小字体 */}
                    <h3 className="text-lg lg:text-xl font-bold text-white mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 flex-grow">
                      {feature.description}
                    </p>

                    {/* 特性列表 - 显示全部特性 */}
                    <div className="space-y-2 mb-5">
                      {getFeatureHighlights(feature.id).map(
                        (highlight, idx) => (
                          <div
                            key={idx}
                            className="flex items-center space-x-2"
                          >
                            <CheckCircleIcon className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span className="text-sm text-gray-300">
                              {highlight}
                            </span>
                          </div>
                        ),
                      )}
                    </div>

                    {/* 了解更多按钮 - 缩小 */}
                    <Button
                      variant="ghost"
                      className="justify-start p-0 h-auto text-blue-400 hover:text-blue-300 hover:bg-transparent text-sm"
                      onClick={() => handleLearnMore(feature.id)}
                    >
                      了解更多
                      <ArrowRightIcon className="ml-2 w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                  </div>

                  {/* 发光边框效果 */}
                  {hoveredFeature === feature.id && (
                    <div
                      className={`
                    absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.gradient} opacity-20 blur-xl -z-10
                  `}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 滚动指示器 */}
        <ScrollIndicator targetId="integrations" title="点击查看集成方案" />
      </div>
    </section>
  );
};

// 获取每个功能的亮点特性
const getFeatureHighlights = (featureId: string): string[] => {
  const highlights: Record<string, string[]> = {
    conversations: ['多轮对话上下文理解', '智能回复建议', '实时对话监控'],
    'knowledge-base': ['支持多种文件格式', 'AI自动知识提取', '智能搜索和检索'],
    integrations: ['一行代码集成', '支持主流框架', '实时同步更新'],
    customization: ['完全自定义外观', '品牌色彩匹配', '多语言支持'],
    'voice-calls': ['高清语音通话', '电话号码支持', '语音转文字'],
    billing: ['透明定价', '按需付费', '企业级安全'],
  };

  return highlights[featureId] || [];
};
