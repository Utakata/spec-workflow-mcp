import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { ApprovalStorage } from '../dashboard/approval-storage.js';
import { join } from 'path';
import { validateProjectPath } from '../core/path-utils.js';
import i18n from '../core/i18n.js';

export const getApprovalStatusTool: Tool = {
  name: 'get-approval-status',
  description: i18n.t('tools.getApprovalStatus.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: i18n.t('tools.getApprovalStatus.projectPathDescription')
      },
      approvalId: {
        type: 'string',
        description: i18n.t('tools.getApprovalStatus.approvalIdDescription')
      }
    },
    required: ['approvalId']
  }
};

export async function getApprovalStatusHandler(
  args: { projectPath?: string; approvalId: string },
  context: ToolContext
): Promise<ToolResponse> {
  try {
    // Use provided projectPath or fall back to context
    const projectPath = args.projectPath || context.projectPath;
    if (!projectPath) {
      return {
        success: false,
        message: i18n.t('tools.getApprovalStatus.projectPathRequired')
      };
    }
    
    // Validate and resolve project path
    const validatedProjectPath = await validateProjectPath(projectPath);
    
    const approvalStorage = new ApprovalStorage(validatedProjectPath);
    await approvalStorage.start();

    const approval = await approvalStorage.getApproval(args.approvalId);
    
    if (!approval) {
      await approvalStorage.stop();
      return {
        success: false,
        message: i18n.t('tools.getApprovalStatus.notFound', { approvalId: args.approvalId })
      };
    }

    await approvalStorage.stop();

    const isCompleted = approval.status === 'approved' || approval.status === 'rejected';
    const canProceed = approval.status === 'approved';
    const mustWait = approval.status !== 'approved';
    const nextSteps: string[] = [];

    if (approval.status === 'pending') {
      nextSteps.push(i18n.t('tools.getApprovalStatus.blocked'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.verbalApprovalNotAccepted'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.useDashboardOrVSCode'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.continuePolling'));
    } else if (approval.status === 'approved') {
      nextSteps.push(i18n.t('tools.getApprovalStatus.approvedCanProceed'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.runDeleteApproval'));
      if (approval.response) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.response', { response: approval.response }));
      }
    } else if (approval.status === 'rejected') {
      nextSteps.push(i18n.t('tools.getApprovalStatus.blockedRejected'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.blocked')); // "Do not proceed"
      nextSteps.push(i18n.t('tools.getApprovalStatus.reviewAndRevise'));
      if (approval.response) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.reason', { response: approval.response }));
      }
      if (approval.annotations) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.notes', { annotations: approval.annotations }));
      }
    } else if (approval.status === 'needs-revision') {
      nextSteps.push(i18n.t('tools.getApprovalStatus.blocked'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.updateDocument'));
      nextSteps.push(i18n.t('tools.getApprovalStatus.createNewRequest'));
      if (approval.response) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.feedback', { response: approval.response }));
      }
      if (approval.annotations) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.notes', { annotations: approval.annotations }));
      }
      if (approval.comments && approval.comments.length > 0) {
        nextSteps.push(i18n.t('tools.getApprovalStatus.comments', { count: approval.comments.length }));
      }
    }

    return {
      success: true,
      message: approval.status === 'pending'
        ? i18n.t('tools.getApprovalStatus.messagePending', { status: approval.status })
        : i18n.t('tools.getApprovalStatus.messageDefault', { status: approval.status }),
      data: {
        approvalId: args.approvalId,
        title: approval.title,
        type: approval.type,
        status: approval.status,
        createdAt: approval.createdAt,
        respondedAt: approval.respondedAt,
        response: approval.response,
        annotations: approval.annotations,
        isCompleted,
        canProceed,
        mustWait,
        blockNext: !canProceed,
        dashboardUrl: context.dashboardUrl
      },
      nextSteps,
      projectContext: {
        projectPath: validatedProjectPath,
        workflowRoot: join(validatedProjectPath, '.spec-workflow'),
        dashboardUrl: context.dashboardUrl
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.getApprovalStatus.failureMessage', { errorMessage: error.message })
    };
  }
}