import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { SpecParser } from '../core/parser.js';
import i18n from '../core/i18n.js';

export const specStatusTool: Tool = {
  name: 'spec-status',
  description: i18n.t('tools.specStatus.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.specStatus.projectPathDescription')
      },
      specName: { 
        type: 'string',
        description: i18n.t('tools.specStatus.specNameDescription')
      }
    },
    required: ['projectPath', 'specName']
  }
};

export async function specStatusHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, specName } = args;

  try {
    const parser = new SpecParser(projectPath);
    const spec = await parser.getSpec(specName);
    
    if (!spec) {
      return {
        success: false,
        message: i18n.t('tools.specStatus.notFound', { specName }),
        nextSteps: [
          i18n.t('tools.specStatus.checkName'),
          i18n.t('tools.specStatus.useList'),
          i18n.t('tools.specStatus.createSpec')
        ]
      };
    }

    // Determine current phase and overall status
    let currentPhase = 'not-started';
    let overallStatus = i18n.t('tools.specStatus.statusNotStarted');
    
    if (!spec.phases.requirements.exists) {
      currentPhase = 'requirements';
      overallStatus = i18n.t('tools.specStatus.statusRequirementsNeeded');
    } else if (!spec.phases.design.exists) {
      currentPhase = 'design';
      overallStatus = i18n.t('tools.specStatus.statusDesignNeeded');
    } else if (!spec.phases.tasks.exists) {
      currentPhase = 'tasks';
      overallStatus = i18n.t('tools.specStatus.statusTasksNeeded');
    } else if (spec.taskProgress && spec.taskProgress.pending > 0) {
      currentPhase = 'implementation';
      overallStatus = i18n.t('tools.specStatus.statusImplementing');
    } else if (spec.taskProgress && spec.taskProgress.total > 0 && spec.taskProgress.completed === spec.taskProgress.total) {
      currentPhase = 'completed';
      overallStatus = i18n.t('tools.specStatus.statusCompleted');
    } else {
      currentPhase = 'implementation';
      overallStatus = i18n.t('tools.specStatus.statusReadyForImplementation');
    }

    // Phase details
    const phaseDetails = [
      {
        name: i18n.t('tools.specStatus.phaseRequirements'),
        status: spec.phases.requirements.exists ? (spec.phases.requirements.approved ? i18n.t('tools.specStatus.phaseApproved') : i18n.t('tools.specStatus.phaseCreated')) : i18n.t('tools.specStatus.phaseMissing'),
        lastModified: spec.phases.requirements.lastModified
      },
      {
        name: i18n.t('tools.specStatus.phaseDesign'),
        status: spec.phases.design.exists ? (spec.phases.design.approved ? i18n.t('tools.specStatus.phaseApproved') : i18n.t('tools.specStatus.phaseCreated')) : i18n.t('tools.specStatus.phaseMissing'),
        lastModified: spec.phases.design.lastModified
      },
      {
        name: i18n.t('tools.specStatus.phaseTasks'),
        status: spec.phases.tasks.exists ? (spec.phases.tasks.approved ? i18n.t('tools.specStatus.phaseApproved') : i18n.t('tools.specStatus.phaseCreated')) : i18n.t('tools.specStatus.phaseMissing'),
        lastModified: spec.phases.tasks.lastModified
      },
      {
        name: i18n.t('tools.specStatus.phaseImplementation'),
        status: spec.phases.implementation.exists ? i18n.t('tools.specStatus.phaseInProgress') : i18n.t('tools.specStatus.statusNotStarted'),
        progress: spec.taskProgress
      }
    ];

    // Next steps based on current phase
    const nextSteps = [];
    switch (currentPhase) {
      case 'requirements':
        nextSteps.push(i18n.t('tools.specStatus.nextRequirements'));
        nextSteps.push(i18n.t('tools.specStatus.nextLoadContext'));
        nextSteps.push(i18n.t('tools.specStatus.nextRequestApproval'));
        break;
      case 'design':
        nextSteps.push(i18n.t('tools.specStatus.nextDesign'));
        nextSteps.push(i18n.t('tools.specStatus.nextReferenceRequirements'));
        nextSteps.push(i18n.t('tools.specStatus.nextRequestApproval'));
        break;
      case 'tasks':
        nextSteps.push(i18n.t('tools.specStatus.nextTasks'));
        nextSteps.push(i18n.t('tools.specStatus.nextBreakDownDesign'));
        nextSteps.push(i18n.t('tools.specStatus.nextRequestApproval'));
        break;
      case 'implementation':
        if (spec.taskProgress && spec.taskProgress.pending > 0) {
          nextSteps.push(i18n.t('tools.specStatus.nextUseManageTasks'));
          nextSteps.push(i18n.t('tools.specStatus.nextImplementTasks'));
          nextSteps.push(i18n.t('tools.specStatus.nextUpdateStatus'));
        } else {
          nextSteps.push(i18n.t('tools.specStatus.nextBeginImplementation'));
        }
        break;
      case 'completed':
        nextSteps.push(i18n.t('tools.specStatus.nextSpecComplete'));
        nextSteps.push(i18n.t('tools.specStatus.nextRunTests'));
        break;
    }

    return {
      success: true,
      message: i18n.t('tools.specStatus.successMessage', { specName, overallStatus }),
      data: {
        name: specName,
        description: spec.description,
        currentPhase,
        overallStatus,
        createdAt: spec.createdAt,
        lastModified: spec.lastModified,
        phases: phaseDetails,
        taskProgress: spec.taskProgress || {
          total: 0,
          completed: 0,
          pending: 0
        }
      },
      nextSteps,
      projectContext: {
        projectPath,
        workflowRoot: PathUtils.getWorkflowRoot(projectPath),
        currentPhase,
        dashboardUrl: context.dashboardUrl
      }
    };
    
  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.specStatus.failureMessage', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.specStatus.checkSpecExists'),
        i18n.t('tools.specStatus.checkPath'),
        i18n.t('tools.specStatus.useListForAvailable')
      ]
    };
  }
}