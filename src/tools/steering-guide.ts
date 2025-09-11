import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import i18n from '../core/i18n.js';

export const steeringGuideTool: Tool = {
  name: 'steering-guide',
  description: i18n.t('tools.steeringGuide.description'),
  inputSchema: {
    type: 'object',
    properties: {},
    additionalProperties: false
  }
};

export async function steeringGuideHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  return {
    success: true,
    message: i18n.t('tools.steeringGuide.successMessage'),
    data: {
      guide: i18n.t('tools.steeringGuide.guide'),
      dashboardUrl: context.dashboardUrl
    },
    nextSteps: [
      i18n.t('tools.steeringGuide.onlyIfRequested'),
      i18n.t('tools.steeringGuide.createProductFirst'),
      i18n.t('tools.steeringGuide.thenCreateTechAndStructure'),
      i18n.t('tools.steeringGuide.referenceInFuture'),
      context.dashboardUrl
        ? i18n.t('tools.steeringGuide.dashboardAvailable', { dashboardUrl: context.dashboardUrl })
        : i18n.t('tools.steeringGuide.dashboardUnavailable')
    ]
  };
}