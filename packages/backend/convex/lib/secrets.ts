// 这个文件现在只提供类型定义和辅助函数
// 实际的secrets存储已经迁移到Convex数据库中

export interface VapiSecretData {
  publicApiKey: string;
  privateApiKey: string;
}

export type SecretData = Record<string, unknown> & VapiSecretData;

// 类型守卫函数
export function isVapiSecretData(data: unknown): data is VapiSecretData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'publicApiKey' in data &&
    'privateApiKey' in data &&
    typeof (data as any).publicApiKey === 'string' &&
    typeof (data as any).privateApiKey === 'string'
  );
}

// 验证secret数据的完整性
export function validateSecretData(service: string, data: unknown): boolean {
  switch (service) {
    case 'vapi':
      return isVapiSecretData(data);
    default:
      return false;
  }
}

// 生成secret数据的摘要（用于日志记录，不包含敏感信息）
export function generateSecretSummary(service: string, data: unknown): string {
  switch (service) {
    case 'vapi':
      if (isVapiSecretData(data)) {
        return `Vapi API keys (public: ${data.publicApiKey.substring(0, 8)}...)`;
      }
      return 'Invalid Vapi secret data';
    default:
      return `${service} secret data`;
  }
}
