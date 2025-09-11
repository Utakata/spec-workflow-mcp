import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';
import i18n from '../core/i18n.js';

export const getSteeringContextTool: Tool = {
  name: 'get-steering-context',
  description: i18n.t('tools.getSteeringContext.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.getSteeringContext.projectPathDescription')
      }
    },
    required: ['projectPath']
  }
};

export async function getSteeringContextHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath } = args;

  try {
    const steeringPath = PathUtils.getSteeringPath(projectPath);
    
    // Check if steering directory exists
    try {
      await access(steeringPath, constants.F_OK);
    } catch {
      return {
        success: true,
        message: i18n.t('tools.getSteeringContext.notFound'),
        data: {
          context: i18n.t('tools.getSteeringContext.notFoundContext'),
          documents: {
            product: false,
            tech: false,
            structure: false
          }
        },
        nextSteps: [
          i18n.t('tools.getSteeringContext.useBestPractices'),
          i18n.t('tools.getSteeringContext.askToCreate'),
          i18n.t('tools.getSteeringContext.notNeeded')
        ]
      };
    }

    const steeringFiles = [
      { name: 'product.md', title: i18n.t('tools.getSteeringContext.productContext') },
      { name: 'tech.md', title: i18n.t('tools.getSteeringContext.technologyContext') },
      { name: 'structure.md', title: i18n.t('tools.getSteeringContext.structureContext') }
    ];

    const sections: string[] = [];
    const documentStatus = { product: false, tech: false, structure: false };
    let hasContent = false;

    for (const file of steeringFiles) {
      const filePath = join(steeringPath, file.name);
      
      try {
        await access(filePath, constants.F_OK);
        const content = await readFile(filePath, 'utf-8');
        
        if (content && content.trim()) {
          sections.push(`### ${file.title}\n${content.trim()}`);
          hasContent = true;
          
          // Update status
          const docName = file.name.replace('.md', '') as keyof typeof documentStatus;
          documentStatus[docName] = true;
        }
      } catch {
        // File doesn't exist, skip
      }
    }

    if (!hasContent) {
      return {
        success: true,
        message: i18n.t('tools.getSteeringContext.emptyDocs'),
        data: {
          context: i18n.t('tools.getSteeringContext.emptyDocsContext'),
          documents: documentStatus
        },
        nextSteps: [
          i18n.t('tools.getSteeringContext.useBestPractices'),
          i18n.t('tools.getSteeringContext.askToPopulate'),
          i18n.t('tools.getSteeringContext.emptyIsFine')
        ]
      };
    }

    // Format the complete steering context
    const formattedContext = i18n.t('tools.getSteeringContext.loadedContext', {
      sections: sections.join('\n\n---\n\n')
    });

    return {
      success: true,
      message: i18n.t('tools.getSteeringContext.successMessage'),
      data: {
        context: formattedContext,
        documents: documentStatus,
        sections: sections.length
      },
      nextSteps: [
        i18n.t('tools.getSteeringContext.dontCallAgain'),
        i18n.t('tools.getSteeringContext.referenceStandards'),
        i18n.t('tools.getSteeringContext.alignDecisions')
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
      message: i18n.t('tools.getSteeringContext.failureMessage', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.getSteeringContext.checkPath'),
        i18n.t('tools.getSteeringContext.checkPermissions'),
        i18n.t('tools.getSteeringContext.runSetup')
      ]
    };
  }
}