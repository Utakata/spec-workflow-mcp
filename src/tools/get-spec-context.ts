import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { readFile, access, readdir } from 'fs/promises';
import { join } from 'path';
import { constants } from 'fs';
import i18n from '../core/i18n.js';

export const getSpecContextTool: Tool = {
  name: 'get-spec-context',
  description: i18n.t('tools.getSpecContext.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.getSpecContext.projectPathDescription')
      },
      specName: {
        type: 'string',
        description: i18n.t('tools.getSpecContext.specNameDescription')
      }
    },
    required: ['projectPath', 'specName']
  }
};

export async function getSpecContextHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, specName } = args;

  try {
    const specPath = PathUtils.getSpecPath(projectPath, specName);
    
    // Check if spec directory exists
    try {
      await access(specPath, constants.F_OK);
    } catch {
      // Check if there are any specs at all to suggest alternatives
      const specsRoot = PathUtils.getSpecPath(projectPath, '');
      try {
        await access(specsRoot, constants.F_OK);
        const availableSpecs = await readdir(specsRoot, { withFileTypes: true });
        const specNames = availableSpecs
          .filter(dirent => dirent.isDirectory())
          .map(dirent => dirent.name);

        if (specNames.length > 0) {
          return {
            success: false,
            message: i18n.t('tools.getSpecContext.notFound', { specName }),
            data: {
              availableSpecs: specNames,
              suggestedSpecs: specNames.slice(0, 3) // Show first 3 as suggestions
            },
            nextSteps: [
              i18n.t('tools.getSpecContext.availableSpecs', { specs: specNames.join(', ') }),
              i18n.t('tools.getSpecContext.useExisting'),
              i18n.t('tools.getSpecContext.orCreate')
            ]
          };
        }
      } catch {
        // Specs directory doesn't exist
      }

      return {
        success: false,
        message: i18n.t('tools.getSpecContext.notFound', { specName }),
        nextSteps: [
          i18n.t('tools.getSpecContext.createSpec'),
          i18n.t('tools.getSpecContext.checkSpelling'),
          i18n.t('tools.getSpecContext.verifySetup')
        ]
      };
    }

    const specFiles = [
      { name: 'requirements.md', title: i18n.t('tools.getSpecContext.requirements') },
      { name: 'design.md', title: i18n.t('tools.getSpecContext.design') },
      { name: 'tasks.md', title: i18n.t('tools.getSpecContext.tasks') }
    ];

    const sections: string[] = [];
    const documentStatus = { requirements: false, design: false, tasks: false };
    let hasContent = false;

    for (const file of specFiles) {
      const filePath = join(specPath, file.name);
      
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
        message: i18n.t('tools.getSpecContext.emptyDocs', { specName }),
        data: {
          context: `## ${i18n.t('tools.getSpecContext.requirements')}\n\n${i18n.t('tools.getSpecContext.noDocsFound', { specName })}`,
          specName,
          documents: documentStatus
        },
        nextSteps: [
          i18n.t('tools.getSpecContext.addContent', { specName }),
          i18n.t('tools.getSpecContext.createMissing'),
          i18n.t('tools.getSpecContext.ensureContent')
        ]
      };
    }

    // Format the complete specification context
    const formattedContext = i18n.t('tools.getSpecContext.loadedContext', {
      specName,
      sections: sections.join('\n\n---\n\n')
    });

    return {
      success: true,
      message: i18n.t('tools.getSpecContext.successMessage', { specName }),
      data: {
        context: formattedContext,
        specName,
        documents: documentStatus,
        sections: sections.length,
        specPath
      },
      nextSteps: [
        i18n.t('tools.getSpecContext.proceed'),
        i18n.t('tools.getSpecContext.referenceDocs'),
        i18n.t('tools.getSpecContext.updateStatus')
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
      message: i18n.t('tools.getSpecContext.failureMessage', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.getSpecContext.checkPath'),
        i18n.t('tools.getSpecContext.verifySpecName'),
        i18n.t('tools.getSpecContext.checkPermissions'),
        i18n.t('tools.getSpecContext.createIfMissing')
      ]
    };
  }
}