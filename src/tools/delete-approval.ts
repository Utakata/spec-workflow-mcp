import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { ApprovalStorage } from '../dashboard/approval-storage.js';
import { validateProjectPath } from '../core/path-utils.js';
import { join } from 'path';
import i18n from '../core/i18n.js';

export const deleteApprovalTool: Tool = {
  name: 'delete-approval',
  description: i18n.t('tools.deleteApproval.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: i18n.t('tools.deleteApproval.projectPathDescription')
      },
      approvalId: {
        type: 'string',
        description: i18n.t('tools.deleteApproval.approvalIdDescription')
      }
    },
    required: ['approvalId']
  }
};

export async function deleteApprovalHandler(
  args: { projectPath?: string; approvalId: string },
  context: ToolContext
): Promise<ToolResponse> {
  try {
    // Use provided projectPath or fall back to context
    const projectPath = args.projectPath || context.projectPath;
    if (!projectPath) {
      return {
        success: false,
        message: i18n.t('tools.deleteApproval.projectPathRequired')
      };
    }
    
    // Validate and resolve project path
    const validatedProjectPath = await validateProjectPath(projectPath);
    
    const approvalStorage = new ApprovalStorage(validatedProjectPath);
    await approvalStorage.start();

    // Check if approval exists and its status
    const approval = await approvalStorage.getApproval(args.approvalId);
    if (!approval) {
      return {
        success: false,
        message: i18n.t('tools.deleteApproval.notFound', { approvalId: args.approvalId }),
        nextSteps: [
          i18n.t('tools.deleteApproval.verifyId'),
          i18n.t('tools.deleteApproval.checkStatus')
        ]
      };
    }

    // Only allow deletion of approved requests
    if (approval.status !== 'approved') {
      return {
        success: false,
        message: i18n.t('tools.deleteApproval.blocked', { status: approval.status }),
        data: {
          approvalId: args.approvalId,
          currentStatus: approval.status,
          title: approval.title,
          blockProgress: true,
          canProceed: false
        },
        nextSteps: [
          i18n.t('tools.deleteApproval.stop'),
          i18n.t('tools.deleteApproval.wait'),
          i18n.t('tools.deleteApproval.poll')
        ]
      };
    }

    // Delete the approval
    const deleted = await approvalStorage.deleteApproval(args.approvalId);
    await approvalStorage.stop();

    if (deleted) {
      return {
        success: true,
        message: i18n.t('tools.deleteApproval.successMessage', { approvalId: args.approvalId }),
        data: {
          deletedApprovalId: args.approvalId,
          title: approval.title,
          category: approval.category,
          categoryName: approval.categoryName
        },
        nextSteps: [
          i18n.t('tools.deleteApproval.cleanupComplete'),
          i18n.t('tools.deleteApproval.continue')
        ],
        projectContext: {
          projectPath: validatedProjectPath,
          workflowRoot: join(validatedProjectPath, '.spec-workflow'),
          dashboardUrl: context.dashboardUrl
        }
      };
    } else {
      return {
        success: false,
        message: i18n.t('tools.deleteApproval.failureMessage', { approvalId: args.approvalId }),
        nextSteps: [
          i18n.t('tools.deleteApproval.checkPermissions'),
          i18n.t('tools.deleteApproval.verifyExists'),
          i18n.t('tools.deleteApproval.retry')
        ]
      };
    }

  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.deleteApproval.genericFail', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.deleteApproval.checkPath'),
        i18n.t('tools.deleteApproval.verifyPermissions'),
        i18n.t('tools.deleteApproval.checkSystem')
      ]
    };
  }
}