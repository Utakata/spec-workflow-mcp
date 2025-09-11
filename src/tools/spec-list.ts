import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { SpecParser } from '../core/parser.js';
import i18n from '../core/i18n.js';

export const specListTool: Tool = {
  name: 'spec-list',
  description: i18n.t('tools.specList.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.specList.projectPathDescription')
      }
    },
    required: ['projectPath']
  }
};

export async function specListHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath } = args;

  try {
    const parser = new SpecParser(projectPath);
    const specs = await parser.getAllSpecs();

    if (specs.length === 0) {
      const response = {
        success: true,
        message: i18n.t('tools.specList.noSpecsFound'),
        data: {
          specs: [],
          total: 0
        },
        nextSteps: [
          i18n.t('tools.specList.createNew'),
          i18n.t('tools.specList.example')
        ],
        projectContext: {
          projectPath,
          workflowRoot: PathUtils.getWorkflowRoot(projectPath),
          dashboardUrl: context.dashboardUrl
        }
      };

      return response;
    }

    // Format specs for display
    const formattedSpecs = specs.map(spec => {
      const phaseCount = Object.values(spec.phases).filter(p => p.exists).length;
      const completedPhases = Object.entries(spec.phases)
        .filter(([_, phase]) => phase.exists && phase.approved)
        .map(([name]) => name);
      
      let status = i18n.t('tools.specList.statusNotStarted');
      if (phaseCount === 0) {
        status = i18n.t('tools.specList.statusNotStarted');
      } else if (phaseCount < 3) {
        status = i18n.t('tools.specList.statusInProgress');
      } else if (completedPhases.length === 3) {
        status = i18n.t('tools.specList.statusReadyForImplementation');
      } else if (spec.taskProgress && spec.taskProgress.completed > 0) {
        status = i18n.t('tools.specList.statusImplementing');
      } else {
        status = i18n.t('tools.specList.statusReadyForImplementation');
      }

      if (spec.taskProgress && spec.taskProgress.completed === spec.taskProgress.total && spec.taskProgress.total > 0) {
        status = i18n.t('tools.specList.statusCompleted');
      }

      return {
        name: spec.name,
        description: spec.description,
        status,
        phases: {
          requirements: spec.phases.requirements.exists,
          design: spec.phases.design.exists,
          tasks: spec.phases.tasks.exists,
          implementation: spec.phases.implementation.exists
        },
        taskProgress: spec.taskProgress,
        lastModified: spec.lastModified,
        createdAt: spec.createdAt
      };
    });

    // Summary statistics
    const statusCounts = formattedSpecs.reduce((acc, spec) => {
      acc[spec.status] = (acc[spec.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const response = {
      success: true,
      message: i18n.t(specs.length === 1 ? 'tools.specList.specsFound' : 'tools.specList.specsFoundPlural', { count: specs.length }),
      data: {
        specs: formattedSpecs,
        total: specs.length,
        summary: {
          byStatus: statusCounts,
          totalTasks: formattedSpecs.reduce((sum, spec) => sum + (spec.taskProgress?.total || 0), 0),
          completedTasks: formattedSpecs.reduce((sum, spec) => sum + (spec.taskProgress?.completed || 0), 0)
        }
      },
      nextSteps: [
        i18n.t('tools.specList.viewDetailedStatus'),
        i18n.t('tools.specList.continueImplementation'),
        i18n.t('tools.specList.createNewSpecs')
      ],
      projectContext: {
        projectPath,
        workflowRoot: PathUtils.getWorkflowRoot(projectPath),
        dashboardUrl: context.dashboardUrl
      }
    };

    return response;

  } catch (error: any) {
    const errorResponse = {
      success: false,
      message: i18n.t('tools.specList.failureMessage', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.specList.checkPath'),
        i18n.t('tools.specList.checkSpecWorkflowDir'),
        i18n.t('tools.specList.createIfNoneExist')
      ]
    };

    return errorResponse;
  }
}