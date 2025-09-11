import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PathUtils } from '../core/path-utils.js';
import i18n from '../core/i18n.js';

export const createSteeringDocTool: Tool = {
  name: 'create-steering-doc',
  description: i18n.t('tools.createSteeringDoc.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: i18n.t('tools.createSteeringDoc.projectPathDescription')
      },
      document: {
        type: 'string',
        enum: ['product', 'tech', 'structure'],
        description: i18n.t('tools.createSteeringDoc.documentDescription')
      },
      content: {
        type: 'string',
        description: i18n.t('tools.createSteeringDoc.contentDescription')
      }
    },
    required: ['projectPath', 'document', 'content']
  }
};

export async function createSteeringDocHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, document, content } = args;

  try {
    // Ensure steering directory exists
    const steeringDir = join(PathUtils.getWorkflowRoot(projectPath), 'steering');
    await fs.mkdir(steeringDir, { recursive: true });

    // Create the specific document
    const filename = `${document}.md`;
    const filePath = join(steeringDir, filename);
    
    await fs.writeFile(filePath, content, 'utf-8');

    const documentNames: { [key: string]: string } = {
      product: i18n.t('tools.createSteeringDoc.productSteering'),
      tech: i18n.t('tools.createSteeringDoc.technicalSteering'),
      structure: i18n.t('tools.createSteeringDoc.structureSteering')
    };

    return {
      success: true,
      message: i18n.t('tools.createSteeringDoc.successMessage', { documentName: documentNames[document] }),
      data: {
        document,
        filename,
        filePath,
        contentLength: content.length,
        dashboardUrl: context.dashboardUrl
      },
      nextSteps: [
        i18n.t('tools.createSteeringDoc.fileSaved', { filename }),
        document === 'product' ? i18n.t('tools.createSteeringDoc.nextTech') :
        document === 'tech' ? i18n.t('tools.createSteeringDoc.nextStructure') :
        i18n.t('tools.createSteeringDoc.steeringComplete'),
        context.dashboardUrl
          ? i18n.t('tools.createSteeringDoc.dashboardAvailable', { dashboardUrl: context.dashboardUrl })
          : i18n.t('tools.createSteeringDoc.dashboardUnavailable')
      ],
      projectContext: {
        projectPath,
        workflowRoot: PathUtils.getWorkflowRoot(projectPath),
        dashboardUrl: context.dashboardUrl
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.createSteeringDoc.failureMessage', { document, errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.createSteeringDoc.checkPath'),
        i18n.t('tools.createSteeringDoc.verifyContent'),
        i18n.t('tools.createSteeringDoc.retry')
      ]
    };
  }
}