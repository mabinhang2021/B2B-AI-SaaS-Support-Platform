export const FEATURES = [
  {
    id: 'conversations',
    title: '智能对话管理',
    description:
      '强大的AI对话系统，支持多轮对话、上下文理解和智能回复，为客户提供24/7不间断服务。',
    icon: '💬',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'knowledge-base',
    title: '知识库管理',
    description:
      '轻松上传和管理文档，AI自动学习和理解您的业务知识，提供准确的专业回答。',
    icon: '📚',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    id: 'integrations',
    title: '多平台集成',
    description:
      '支持HTML、React、Next.js、JavaScript等多种平台，一行代码即可集成到您的网站。',
    icon: '🔗',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    id: 'customization',
    title: '品牌定制',
    description:
      '完全自定义的外观设置，匹配您的品牌形象，包括颜色、字体、布局等全方位定制。',
    icon: '🎨',
    gradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'voice-calls',
    title: '语音通话',
    description:
      '集成Vapi语音技术，支持网页语音通话和电话功能，让客户沟通更加自然便捷。',
    icon: '📞',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'billing',
    title: '灵活计费',
    description:
      '从免费到企业级的多种定价方案，按需付费，支持多种支付方式，透明无隐藏费用。',
    icon: '💰',
    gradient: 'from-yellow-500 to-orange-500',
  },
];

export const PRICING_PLANS = [
  {
    id: 'free',
    name: '免费版',
    price: '¥0',
    period: '/月',
    description: '适合个人和小型项目试用',
    features: ['每月200次对话', '基础AI模型'],
    notIncluded: [
      '文件上传',
      '标准集成支持',
      '社区支持',
      '自定义品牌',
      '语音通话',
      '优先支持',
      'API访问',
    ],
    cta: '开始免费试用',
    popular: false,
  },
  {
    id: 'professional',
    name: '专业版',
    price: '¥9.9',
    period: '/月',
    description: '适合成长型企业',
    features: [
      '每月10000次对话',
      '高级AI模型',
      '小文件上传',
      '自定义品牌',
      '语音通话支持',
      '优先技术支持',
    ],
    notIncluded: ['API访问', '专属客户经理', '定制开发'],
    cta: '立即升级',
    popular: true,
  },
  {
    id: 'enterprise',
    name: '企业版',
    price: '定制',
    period: '',
    description: '适合大型企业定制需求',
    features: [
      '无限对话次数',
      '最先进AI模型',
      '无限文件上传',
      '完全自定义品牌',
      '高级语音功能',
      '专属客户经理',
      'SLA保证',
      '定制开发支持',
    ],
    notIncluded: [],
    cta: '联系销售',
    popular: false,
  },
];

export const INTEGRATION_EXAMPLES = [
  {
    id: 'html',
    title: 'HTML',
    description: '简单的HTML页面集成',
    code: `<script src="https://localhost:3001/widget.js" 
        data-organization-id="YOUR_ORG_ID"></script>`,
    language: 'html',
  },
  {
    id: 'react',
    title: 'React',
    description: 'React组件集成',
    code: `import { EchoWidget } from '@echo/widget';

function App() {
  return (
    <EchoWidget 
      organizationId="YOUR_ORG_ID" 
    />
  );
}`,
    language: 'jsx',
  },
  {
    id: 'nextjs',
    title: 'Next.js',
    description: 'Next.js应用集成',
    code: `import { EchoWidget } from '@echo/widget';

export default function Home() {
  return (
    <div>
      <EchoWidget 
        organizationId="YOUR_ORG_ID"
        theme="dark"
      />
    </div>
  );
}`,
    language: 'jsx',
  },
  {
    id: 'javascript',
    title: 'JavaScript',
    description: '原生JavaScript集成',
    code: `// 加载Echo Widget
const script = document.createElement('script');
script.src = 'https://localhost:3001/widget.js';
script.setAttribute('data-organization-id', 'YOUR_ORG_ID');
document.head.appendChild(script);`,
    language: 'javascript',
  },
];
