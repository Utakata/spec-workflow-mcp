import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { ApprovalStorage } from '../dashboard/approval-storage.js';
import { join } from 'path';
import { validateProjectPath } from '../core/path-utils.js';
import i18n from '../core/i18n.js';

export const requestApprovalTool: Tool = {
  name: 'request-approval',
  description: i18n.t('tools.requestApproval.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: i18n.t('tools.requestApproval.projectPathDescription')
      },
      title: {
        type: 'string',
        description: i18n.t('tools.requestApproval.titleDescription')
      },
      filePath: {
        type: 'string', 
        description: i18n.t('tools.requestApproval.filePathDescription')
      },
      type: {
        type: 'string',
        enum: ['document', 'action'],
        description: i18n.t('tools.requestApproval.typeDescription')
      },
      category: {
        type: 'string',
        enum: ['spec', 'steering'],
        description: i18n.t('tools.requestApproval.categoryDescription')
      },
      categoryName: {
        type: 'string',
        description: i18n.t('tools.requestApproval.categoryNameDescription')
      }
    },
    required: ['projectPath', 'title', 'filePath', 'type', 'category', 'categoryName']
  }
};

export async function requestApprovalHandler(
  args: { projectPath: string; title: string; filePath: string; type: 'document' | 'action'; category: 'spec' | 'steering'; categoryName: string },
  context: ToolContext
): Promise<ToolResponse> {
  try {
    // Validate and resolve project path
    const validatedProjectPath = await validateProjectPath(args.projectPath);
    
    const approvalStorage = new ApprovalStorage(validatedProjectPath);
    await approvalStorage.start();

    const approvalId = await approvalStorage.createApproval(
      args.title,
      args.filePath,
      args.category,
      args.categoryName,
      args.type
    );

    await approvalStorage.stop();

    return {
      success: true,
      message: i18n.t('tools.requestApproval.successMessage', {
        dashboardUrl: context.dashboardUrl || i18n.t('tools.requestApproval.dashboardNotAvailable')
      }),
      data: {
        approvalId,
        title: args.title,
        filePath: args.filePath,
        type: args.type,
        status: 'pending',
        dashboardUrl: context.dashboardUrl
      },
      nextSteps: [
        i18n.t('tools.requestApproval.blocking'),
        i18n.t('tools.requestApproval.verbalNotAccepted'),
        i18n.t('tools.requestApproval.noVerbalConfirmation'),
        context.dashboardUrl
          ? i18n.t('tools.requestApproval.useDashboard', { dashboardUrl: context.dashboardUrl })
          : i18n.t('tools.requestApproval.useExtension'),
        i18n.t('tools.requestApproval.pollStatus', { approvalId })
      ],
      projectContext: {
        projectPath: validatedProjectPath,
        workflowRoot: join(validatedProjectPath, '.spec-workflow'),
        dashboardUrl: context.dashboardUrl
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.requestApproval.failureMessage', { errorMessage: error.message })
    };
  }
}