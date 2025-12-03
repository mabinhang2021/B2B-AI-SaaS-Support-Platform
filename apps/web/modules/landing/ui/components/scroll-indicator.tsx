'use client';

import { useEffect, useState } from 'react';

interface ScrollIndicatorProps {
  targetId: string;
  title?: string;
  className?: string;
}

export const ScrollIndicator = ({
  targetId,
  title = '滚动到下一部分',
  className = '',
}: ScrollIndicatorProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const scrollToSection = () => {
    const element = document.querySelector(`#${targetId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 检测目标元素是否存在，如果不存在则隐藏指示器
  useEffect(() => {
    const checkTargetExists = () => {
      const element = document.querySelector(`#${targetId}`);
      setIsVisible(!!element);
    };

    checkTargetExists();
    // 监听DOM变化
    const observer = new MutationObserver(checkTargetExists);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [targetId]);

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToSection}
      className={`absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2 group ${className}`}
      title={title}
    >
      <div className="relative">
        {/* 外圆环 */}
        <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-gray-500 rounded-full group-hover:border-blue-400 transition-colors duration-300"></div>
        {/* 内圆点 */}
        <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full animate-ping"></div>
        {/* 中心点 */}
        <div className="absolute top-2.5 left-2.5 md:top-3 md:left-3 w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full"></div>
        {/* 向下箭头 */}
        <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="w-0 h-0 border-l-3 border-r-3 md:border-l-4 md:border-r-4 border-t-3 md:border-t-4 border-transparent border-t-gray-500 animate-bounce group-hover:border-t-blue-400 transition-colors duration-300"></div>
        </div>
      </div>
    </button>
  );
};
