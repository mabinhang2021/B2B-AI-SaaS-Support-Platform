'use client';

import { useState } from 'react';
import { PRICING_PLANS } from '../../constants';
import { Button } from '@workspace/ui/components/button';
import { CheckIcon, XIcon, StarIcon } from 'lucide-react';
import Link from 'next/link';
import { ScrollIndicator } from './scroll-indicator';

export const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(
    'monthly',
  );

  return (
    <section
      id="pricing"
      className="min-h-screen md:min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-gray-900 relative overflow-hidden pt-20"
    >
      <div className="max-w-7xl mx-auto w-full h-full flex flex-col">
        {/* 内容容器 - 适应屏幕高度 */}
        <div className="flex-1 overflow-hidden py-4 md:py-6">
          {/* 标题区域 - 减少间距 */}
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                选择适合您的方案
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-6">
              从个人开发者到大型企业，我们为每个阶段的企业提供灵活的定价方案
            </p>

            {/* 计费周期切换 - 减小尺寸 */}
            <div className="inline-flex items-center bg-white/10 rounded-lg p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1.5 md:px-6 md:py-2 rounded-md font-medium transition-all text-sm md:text-base ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                按月付费
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-3 py-1.5 md:px-6 md:py-2 rounded-md font-medium transition-all text-sm md:text-base ${
                  billingCycle === 'annual'
                    ? 'bg-white text-black'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                按年付费
                <span className="ml-1 md:ml-2 text-xs bg-green-500 text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-full">
                  省20%
                </span>
              </button>
            </div>
          </div>

          {/* 定价卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {PRICING_PLANS.map((plan, index) => {
              const isPopular = plan.popular;
              const price =
                billingCycle === 'annual' && plan.price !== '定制'
                  ? `¥${Math.round(parseInt(plan.price.replace('¥', '')) * 12 * 0.8)}`
                  : plan.price;
              const period =
                billingCycle === 'annual' && plan.price !== '定制'
                  ? '/年'
                  : plan.period;

              return (
                <div
                  key={plan.id}
                  className={`
                  relative rounded-2xl border transition-all duration-300 hover:transform hover:scale-105
                  ${
                    isPopular
                      ? 'border-gradient-to-r from-blue-500 to-purple-500 shadow-2xl shadow-blue-500/25'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }
                `}
                >
                  {/* 热门标签 */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                        <StarIcon className="w-4 h-4" />
                        <span>最受欢迎</span>
                      </div>
                    </div>
                  )}

                  <div className="p-8 h-full flex flex-col">
                    {/* 方案名称和价格 */}
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {plan.name}
                      </h3>
                      <div className="mb-2">
                        <span className="text-4xl font-bold text-white">
                          {price}
                        </span>
                        <span className="text-gray-400 ml-1">{period}</span>
                      </div>
                      <p className="text-gray-400 text-sm">
                        {plan.description}
                      </p>
                    </div>

                    {/* 功能列表 */}
                    <div className="flex-grow space-y-4 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start space-x-3"
                        >
                          <CheckIcon className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">
                            {feature}
                          </span>
                        </div>
                      ))}

                      {/* 不包含的功能 */}
                      {plan.notIncluded.map((feature, featureIndex) => (
                        <div
                          key={featureIndex}
                          className="flex items-start space-x-3 opacity-50"
                        >
                          <XIcon className="w-5 h-5 text-gray-500 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-500 text-sm line-through">
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA按钮 */}
                    <Link
                      href={plan.id === 'enterprise' ? '#contact' : '/billing'}
                    >
                      <Button
                        className={`
                        w-full py-3 font-semibold transition-all duration-300
                        ${
                          isPopular
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/25'
                            : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        }
                      `}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </div>

                  {/* 发光边框效果 */}
                  {isPopular && (
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 opacity-20 blur-xl -z-10" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 滚动指示器 */}
        <ScrollIndicator targetId="show" title="点击了解我们" />
      </div>
    </section>
  );
};
