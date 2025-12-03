'use client';

import { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  ArrowRightIcon,
  RocketIcon,
  UsersIcon,
  TrendingUpIcon,
  DatabaseIcon,
  SettingsIcon,
  PuzzleIcon,
  MicIcon,
  PlayIcon,
} from 'lucide-react';
import Link from 'next/link';
import { ScrollIndicator } from './scroll-indicator';

export const CtaSection = () => {
  const [selectedFeature, setSelectedFeature] = useState('rag');

  const stats = [
    { label: '企业用户', value: '1000+', icon: UsersIcon },
    { label: '月活跃对话', value: '10M+', icon: TrendingUpIcon },
    { label: '客户满意度', value: '98%', icon: RocketIcon },
  ];

  const features = [
    {
      id: 'rag',
      name: 'RAG技术',
      icon: DatabaseIcon,
      description: '基于检索增强生成的智能问答系统，结合您的知识库提供准确回答',
      videoUrl: '#', // 预留视频链接
    },
    {
      id: 'custom',
      name: '自定义组件',
      icon: SettingsIcon,
      description: '完全可定制的UI组件，匹配您的品牌风格和用户需求',
      videoUrl: '#', // 预留视频链接
    },
    {
      id: 'integration',
      name: '集成组件',
      icon: PuzzleIcon,
      description: '轻松集成到现有系统，支持多种平台和开发框架',
      videoUrl: '#', // 预留视频链接
    },
    {
      id: 'voice',
      name: '语音助手',
      icon: MicIcon,
      description: '先进的语音识别和合成技术，提供自然的语音交互体验',
      videoUrl: '#', // 预留视频链接
    },
  ];

  return (
    <section className="min-h-screen md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-black relative overflow-hidden">
      {/* 背景装饰 - 调整大小 */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-16 h-16 md:w-24 md:h-24 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse" />
        <div className="absolute bottom-10 right-10 w-16 h-16 md:w-24 md:h-24 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto relative z-10 text-center w-full h-full flex flex-col">
       

        {/* 新增：功能演示区域 */}
        <div className="mt-6 md:mt-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 text-center">
            体验核心功能
          </h3>

          {/* 功能选择器 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setSelectedFeature(feature.id)}
                className={`
        relative p-4 rounded-xl border transition-all duration-300 transform hover:scale-105
        ${
          selectedFeature === feature.id
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 border-blue-400 shadow-lg shadow-blue-500/25'
            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
        }
      `}
              >
                <div className="flex flex-col items-center space-y-2">
                  <feature.icon
                    className={`w-8 h-8 ${
                      selectedFeature === feature.id
                        ? 'text-white'
                        : 'text-blue-400'
                    }`}
                  />
                  <span
                    className={`text-sm font-medium ${
                      selectedFeature === feature.id
                        ? 'text-white'
                        : 'text-gray-300'
                    }`}
                  >
                    {feature.name}
                  </span>
                </div>

                {/* 选中状态指示器 */}
                {selectedFeature === feature.id && (
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-400 rounded-full animate-pulse" />
                )}
              </button>
            ))}
          </div>

          {/* 视频展示区域 */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="aspect-video bg-black/50 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* 视频占位符 */}
              <div className="text-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlayIcon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <h4 className="text-xl md:text-2xl font-semibold text-white mb-2">
                  {features.find((f) => f.id === selectedFeature)?.name}
                </h4>
                <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto mb-4">
                  {features.find((f) => f.id === selectedFeature)?.description}
                </p>
                <p className="text-blue-400 text-sm md:text-base">
                  视频即将上线，敬请期待
                </p>
              </div>

              {/* 装饰性背景元素 */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-4 left-4 w-32 h-32 bg-blue-500 rounded-full filter blur-xl" />
                <div className="absolute bottom-4 right-4 w-32 h-32 bg-purple-500 rounded-full filter blur-xl" />
              </div>
            </div>
          </div>
        </div>

        
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.1;
          }
          50% {
            opacity: 0.2;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </section>
  );
};
