import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse, TaskInfo } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';
import { parseTasksFromMarkdown, updateTaskStatus, findNextPendingTask, getTaskById } from '../core/task-parser.js';
import i18n from '../core/i18n.js';

export const manageTasksTool: Tool = {
  name: 'manage-tasks',
  description: i18n.t('tools.manageTasks.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.manageTasks.projectPathDescription')
      },
      specName: { 
        type: 'string',
        description: i18n.t('tools.manageTasks.specNameDescription')
      },
      action: {
        type: 'string',
        enum: ['list', 'get', 'set-status', 'next-pending', 'context'],
        description: i18n.t('tools.manageTasks.actionDescription'),
        default: 'list'
      },
      taskId: { 
        type: 'string',
        description: i18n.t('tools.manageTasks.taskIdDescription')
      },
      status: {
        type: 'string',
        enum: ['pending', 'in-progress', 'completed'],
        description: i18n.t('tools.manageTasks.statusDescription')
      }
    },
    required: ['projectPath', 'specName']
  }
};

export async function manageTasksHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, specName, action = 'list', taskId, status } = args;

  try {
    // Path to tasks.md
    const tasksPath = join(PathUtils.getSpecPath(projectPath, specName), 'tasks.md');
    
    // Read and parse tasks file
    const tasksContent = await readFile(tasksPath, 'utf-8');
    const parseResult = parseTasksFromMarkdown(tasksContent);
    const tasks = parseResult.tasks;
    
    if (tasks.length === 0) {
      return {
        success: true,
        message: i18n.t('tools.manageTasks.noTasksFound'),
        data: { tasks: [] },
        nextSteps: [i18n.t('tools.manageTasks.createTasksMd')]
      };
    }
    
    // Handle different actions
    switch (action) {
      case 'list':
        return {
          success: true,
          message: i18n.t('tools.manageTasks.listSummary', parseResult.summary),
          data: { 
            tasks,
            summary: parseResult.summary
          },
          nextSteps: [
            i18n.t('tools.manageTasks.listNextStep1'),
            i18n.t('tools.manageTasks.listNextStep2'),
            i18n.t('tools.manageTasks.listNextStep3')
          ]
        };
        
      case 'get': {
        if (!taskId) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskIdRequiredForGet'),
            nextSteps: [i18n.t('tools.manageTasks.provideTaskIdExample')]
          };
        }
        
        const task = getTaskById(tasks, taskId);
        if (!task) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskNotFound', { taskId }),
            nextSteps: [i18n.t('tools.manageTasks.useList')]
          };
        }
        
        return {
          success: true,
          message: i18n.t('tools.manageTasks.taskInfo', { taskId, description: task.description }),
          data: { task },
          nextSteps: [
            task.status === 'completed'
              ? i18n.t('tools.manageTasks.taskAlreadyCompleted')
              : task.status === 'in-progress'
              ? i18n.t('tools.manageTasks.taskInProgress')
              : i18n.t('tools.manageTasks.setStatusInProgress'),
            i18n.t('tools.manageTasks.useContext')
          ]
        };
      }
        
      case 'next-pending': {
        const nextTask = findNextPendingTask(tasks);
        if (!nextTask) {
          const inProgressTasks = tasks.filter(t => t.status === 'in-progress' && !t.isHeader);
          if (inProgressTasks.length > 0) {
            return {
              success: true,
              message: i18n.t('tools.manageTasks.noPendingTasks', { count: inProgressTasks.length }),
              data: { 
                nextTask: null,
                inProgressTasks 
              },
              nextSteps: [
                i18n.t('tools.manageTasks.continueTasks', { taskIds: inProgressTasks.map(t => t.id).join(', ') }),
                i18n.t('tools.manageTasks.markCompleted')
              ]
            };
          }
          return {
            success: true,
            message: i18n.t('tools.manageTasks.allTasksCompleted'),
            data: { nextTask: null },
            nextSteps: [
              i18n.t('tools.manageTasks.implementationComplete'),
              i18n.t('tools.manageTasks.runTests')
            ]
          };
        }
        
        return {
          success: true,
          message: i18n.t('tools.manageTasks.nextPendingTask', { id: nextTask.id, description: nextTask.description }),
          data: { nextTask },
          nextSteps: [
            i18n.t('tools.manageTasks.setNextTaskInProgress', { id: nextTask.id }),
            i18n.t('tools.manageTasks.useContext')
          ]
        };
      }

      case 'set-status': {
        if (!taskId) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskIdRequiredForSetStatus'),
            nextSteps: [i18n.t('tools.manageTasks.provideTaskId')]
          };
        }

        if (!status) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.statusRequired'),
            nextSteps: [i18n.t('tools.manageTasks.provideStatus')]
          };
        }

        const taskToUpdate = getTaskById(tasks, taskId);
        if (!taskToUpdate) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskNotFound', { taskId }),
            nextSteps: [i18n.t('tools.manageTasks.useList')]
          };
        }

        // Update the tasks.md file with new status using unified parser
        const updatedContent = updateTaskStatus(tasksContent, taskId, status);

        if (updatedContent === tasksContent) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.couldNotFindTaskToUpdate', { taskId }),
            nextSteps: [
              i18n.t('tools.manageTasks.checkTaskId'),
              i18n.t('tools.manageTasks.checkTaskFormat')
            ]
          };
        }

        await writeFile(tasksPath, updatedContent, 'utf-8');


        return {
          success: true,
          message: i18n.t('tools.manageTasks.taskUpdated', { taskId, status }),
          data: { 
            taskId,
            previousStatus: taskToUpdate.status,
            newStatus: status,
            updatedTask: { ...taskToUpdate, status }
          },
          nextSteps: [
            i18n.t('tools.manageTasks.statusSaved'),
            status === 'in-progress' ? i18n.t('tools.manageTasks.beginImplementation') :
            status === 'completed' ? i18n.t('tools.manageTasks.useNextPending') :
            i18n.t('tools.manageTasks.taskMarkedPending'),
            i18n.t('tools.manageTasks.checkProgress')
          ],
          projectContext: {
            projectPath,
            workflowRoot: PathUtils.getWorkflowRoot(projectPath),
            specName,
            currentPhase: 'implementation',
            dashboardUrl: context.dashboardUrl
          }
        };
      }

      case 'context': {
        if (!taskId) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskIdRequiredForContext'),
            nextSteps: [i18n.t('tools.manageTasks.provideTaskIdForContext')]
          };
        }
        
        const task = getTaskById(tasks, taskId);
        if (!task) {
          return {
            success: false,
            message: i18n.t('tools.manageTasks.taskNotFound', { taskId }),
            nextSteps: [i18n.t('tools.manageTasks.useList')]
          };
        }
        
        // Load full spec context
        const specDir = PathUtils.getSpecPath(projectPath, specName);
        let requirementsContext = '';
        let designContext = '';
        
        try {
          const requirementsContent = await readFile(join(specDir, 'requirements.md'), 'utf-8');
          requirementsContext = i18n.t('tools.manageTasks.requirementsContext', { content: requirementsContent });
        } catch {
          // Requirements file doesn't exist or can't be read
        }
        
        try {
          const designContent = await readFile(join(specDir, 'design.md'), 'utf-8');
          designContext = i18n.t('tools.manageTasks.designContext', { content: designContent });
        } catch {
          // Design file doesn't exist or can't be read
        }

        const statusStep = task.status === 'pending'
          ? `Mark task as in-progress: manage-tasks with action: "set-status", taskId: "${taskId}", status: "in-progress"`
          : task.status === 'in-progress'
          ? 'Continue implementation work'
          : 'Task is already completed';

        const leverageStep = task.leverage
          ? `Leverage the existing code mentioned: ${task.leverage}`
          : 'Build according to the design patterns';

        const completionStep = task.status !== 'completed'
          ? `Mark as completed when finished: manage-tasks with action: "set-status", taskId: "${taskId}", status: "completed"`
          : '';

        const fullContext = i18n.t('tools.manageTasks.implementationContext', {
          taskId: task.id,
          id: task.id,
          status: task.status,
          description: task.description,
          requirements: task.requirements && task.requirements.length > 0 ? `**Requirements Reference:** ${task.requirements.join(', ')}\n` : '',
          leverage: task.leverage ? `**Leverage Existing:** ${task.leverage}\n` : '',
          implementationDetails: task.implementationDetails && task.implementationDetails.length > 0 ? `**Implementation Notes:**\n${task.implementationDetails.map(d => `- ${d}`).join('\n')}\n` : '',
          requirementsContext,
          designContext,
          separator: requirementsContext && designContext ? '---\n' : '',
          statusStep,
          leverageStep,
          completionStep
        });
        
        return {
          success: true,
          message: i18n.t('tools.manageTasks.implementationContextLoaded', { taskId }),
          data: { 
            task,
            context: fullContext,
            hasRequirements: requirementsContext !== '',
            hasDesign: designContext !== ''
          },
          nextSteps: [
            i18n.t('tools.manageTasks.reviewContext'),
            task.status === 'pending' ? i18n.t('tools.manageTasks.setStatusInProgress') :
            task.status === 'in-progress' ? i18n.t('tools.manageTasks.continueImplementation') :
            i18n.t('tools.manageTasks.taskCompleted'),
            i18n.t('tools.manageTasks.useRequirementsAndDesign')
          ]
        };
      }
        
      default:
        return {
          success: false,
          message: i18n.t('tools.manageTasks.unknownAction', { action }),
          nextSteps: [i18n.t('tools.manageTasks.validActions')]
        };
    }
    
  } catch (error: any) {
    if (error.code === 'ENOENT') {
      return {
        success: false,
        message: i18n.t('tools.manageTasks.tasksMdNotFound', { specName }),
        nextSteps: [
          i18n.t('tools.manageTasks.createTasksDocFirst'),
          i18n.t('tools.manageTasks.ensureSpecExists')
        ]
      };
    }
    
    return {
      success: false,
      message: i18n.t('tools.manageTasks.failedToManageTasks', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.manageTasks.checkSpecExists'),
        i18n.t('tools.manageTasks.checkPermissions'),
        i18n.t('tools.manageTasks.ensureTasksFormatted')
      ]
    };
  }
}

