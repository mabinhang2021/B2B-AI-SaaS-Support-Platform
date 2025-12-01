import {
  type IntegrationId,
  HTML_SCRIPT,
  REACT_SCRIPT,
  NEXTJS_SCRIPT,
  JAVASCRIPT_SCRIPT,
} from './constants';

export const createScript = (
  organizationId: string,
  integrationId: IntegrationId,
) => {
  if (integrationId === 'html') {
    return HTML_SCRIPT.replace('{{ORGANIZATION_ID}}', organizationId);
  }
  if (integrationId === 'react') {
    return REACT_SCRIPT.replace('{{ORGANIZATION_ID}}', organizationId);
  }
  if (integrationId === 'nextjs') {
    return NEXTJS_SCRIPT.replace('{{ORGANIZATION_ID}}', organizationId);
  }
  if (integrationId === 'javascript') {
    return JAVASCRIPT_SCRIPT.replace('{{ORGANIZATION_ID}}', organizationId);
  }
  return '';
};
