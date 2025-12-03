'use client';

import { useState, useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import {
  ArrowRightIcon,
  PlayIcon,
  SparklesIcon,
  Building2Icon,
  ShoppingCartIcon,
  HeartIcon,
  BookOpenIcon,
  BriefcaseIcon,
  Gamepad2Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  PackageIcon,
  CpuIcon,
  GraduationCapIcon,
  ScaleIcon,
  MapIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ScrollIndicator } from './scroll-indicator';

export const HeroSection = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [hoveredItem, setHoveredItem] = useState<number | null>(null);
  const [currentCarouselIndex, setCurrentCarouselIndex] = useState(0);
  const [visibleItems, setVisibleItems] = useState(4);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const { isSignedIn } = useUser();

  // 创建扩展的行业场景数组，用于无限轮播
  const industryScenarios = [
    {
      icon: <Building2Icon className="w-5 h-5 text-white" />,
      title: '企业服务',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      icon: <ShoppingCartIcon className="w-5 h-5 text-white" />,
      title: '电商平台',
      gradient: 'from-purple-500 to-purple-600',
    },
    {
      icon: <HeartIcon className="w-5 h-5 text-white" />,
      title: '医疗健康',
      gradient: 'from-pink-500 to-pink-600',
    },
    {
      icon: <BookOpenIcon className="w-5 h-5 text-white" />,
      title: '教育培训',
      gradient: 'from-green-500 to-green-600',
    },
    {
      icon: <BriefcaseIcon className="w-5 h-5 text-white" />,
      title: '金融服务',
      gradient: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: <Gamepad2Icon className="w-5 h-5 text-white" />,
      title: '游戏娱乐',
      gradient: 'from-red-500 to-red-600',
    },
    {
      icon: <HomeIcon className="w-5 h-5 text-white" />,
      title: '物业服务',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: <PackageIcon className="w-5 h-5 text-white" />,
      title: '装机客服',
      gradient: 'from-teal-500 to-teal-600',
    },
    {
      icon: <CpuIcon className="w-5 h-5 text-white" />,
      title: '智能家居',
      gradient: 'from-orange-500 to-orange-600',
    },
    {
      icon: <GraduationCapIcon className="w-5 h-5 text-white" />,
      title: '在线教育',
      gradient: 'from-cyan-500 to-cyan-600',
    },
    {
      icon: <ScaleIcon className="w-5 h-5 text-white" />,
      title: '法律咨询',
      gradient: 'from-violet-500 to-violet-600',
    },
    {
      icon: <MapIcon className="w-5 h-5 text-white" />,
      title: '旅游规划',
      gradient: 'from-emerald-500 to-emerald-600',
    },
  ];

  // 创建无限轮播的数组（前后各添加一组数据）
  const infiniteScenarios = [
    ...industryScenarios.slice(-visibleItems), // 添加最后几个项目到前面
    ...industryScenarios, // 原始数据
    ...industryScenarios.slice(0, visibleItems), // 添加前几个项目到后面
  ];

  // 响应式处理：根据屏幕宽度调整可见项目数量
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setVisibleItems(2);
      } else if (width < 768) {
        setVisibleItems(3);
      } else if (width < 1024) {
        setVisibleItems(4);
      } else {
        setVisibleItems(3);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 触摸滑动处理
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0);
    if (e.targetTouches && e.targetTouches[0]) {
      setTouchStart(e.targetTouches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.targetTouches && e.targetTouches[0]) {
      setTouchEnd(e.targetTouches[0].clientX);
    }
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNext();
    }
    if (isRightSwipe) {
      handlePrev();
    }
  };

  // 无限轮播控制函数
  const handleNext = () => {
    setCurrentCarouselIndex((prev) => {
      if (prev >= industryScenarios.length) {
        // 当到达末尾时，重置到开始位置（无缝过渡）
        setTimeout(() => {
          setCurrentCarouselIndex(visibleItems);
        }, 50);
        return industryScenarios.length + visibleItems;
      }
      return prev + 1;
    });
  };

  const handlePrev = () => {
    setCurrentCarouselIndex((prev) => {
      if (prev <= visibleItems) {
        // 当到达开始时，重置到末尾位置（无缝过渡）
        setTimeout(() => {
          setCurrentCarouselIndex(industryScenarios.length);
        }, 50);
        return 0;
      }
      return prev - 1;
    });
  };

  // 初始化轮播位置
  useEffect(() => {
    setCurrentCarouselIndex(visibleItems);
  }, [visibleItems]);
  const dynamicTexts = [
    '下一代AI驱动的企业对话平台',
    '让客户服务变得智能而高效',
    '24/7不间断的AI助手支持',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % dynamicTexts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 动态背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent" />
      </div>

      {/* 粒子效果背景 */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000" />
      </div>

      {/* 主要内容 */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* 品牌标识 */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Echo
            </span>
          </div>
        </div>

        {/* 动态标题 - 固定高度容器 */}
        <div className="h-32 flex items-center justify-center mb-6">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {dynamicTexts[currentTextIndex]}
            </span>
          </h1>
        </div>

        {/* 描述文本 */}
        <p className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
          革命性的AI对话平台，为您的企业提供智能客服、知识库管理、多平台集成等全方位解决方案。
          让AI技术为您的业务增长赋能。
        </p>

        {/* 核心价值点 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
          {[
            { title: '智能对话', desc: '先进的AI理解能力' },
            { title: '轻松集成', desc: '一行代码即可部署' },
            { title: '24/7服务', desc: '全天候不间断支持' },
          ].map((point, index) => (
            <div
              key={index}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
            >
              <h3 className="text-lg font-semibold text-blue-400 mb-2">
                {point.title}
              </h3>
              <p className="text-gray-400 text-sm">{point.desc}</p>
            </div>
          ))}
        </div>

        {/* CTA按钮组 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {isSignedIn ? (
            <Link href="/conversations">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
              >
                进入控制台
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          ) : (
            <Link href="/conversations">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-6 text-lg font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-300 transform hover:scale-105"
              >
                开始免费试用
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          )}
        </div>

        {/* 行业应用展示 - 横向轮播 */}
        <section className="mt-16 text-center pb-20">
          <h3 className="text-gray-500 text-xl mb-8 items-center">
            潜在应用场景
          </h3>
          <div className="relative max-w-3xl mx-auto">
            {/* 轮播容器 */}
            <div className="overflow-hidden rounded-lg">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{
                  transform: `translateX(-${currentCarouselIndex * 136}px)`,
                }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {infiniteScenarios.map((item, index) => (
                  <div key={index} className="flex-shrink-0 w-32">
                    <div className="flex flex-col items-center space-y-2">
                      <div
                        className={`w-12 h-12 flex items-center justify-center bg-gradient-to-br ${item.gradient} rounded-full shadow-lg transform transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}
                      >
                        {item.icon}
                      </div>
                      <span className="text-xs font-medium text-gray-300">
                        {item.title}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 轮播控制按钮 */}
            <button
              onClick={handlePrev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-full p-2 text-white opacity-0 hover:opacity-100 transition-opacity sm:opacity-100"
            >
              <ChevronLeftIcon className="w-4 h-4" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-full p-2 text-white opacity-0 hover:opacity-100 transition-opacity sm:opacity-100"
            >
              <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        </section>
      </div>

      {/* 底部滚动提示 - 使用新的ScrollIndicator组件 */}
      <ScrollIndicator targetId="features" title="点击查看功能特性" />

      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};
