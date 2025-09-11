import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { promises as fs } from 'fs';
import { join } from 'path';
import { PathUtils } from '../core/path-utils.js';
import i18n from '../core/i18n.js';

export const createSpecDocTool: Tool = {
  name: 'create-spec-doc',
  description: i18n.t('tools.createSpecDoc.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: {
        type: 'string',
        description: i18n.t('tools.createSpecDoc.projectPathDescription')
      },
      specName: {
        type: 'string',
        pattern: '^[a-z][a-z0-9-]*$',
        description: i18n.t('tools.createSpecDoc.specNameDescription')
      },
      document: {
        type: 'string',
        enum: ['requirements', 'design', 'tasks'],
        description: i18n.t('tools.createSpecDoc.documentDescription')
      },
      content: {
        type: 'string',
        description: i18n.t('tools.createSpecDoc.contentDescription')
      }
    },
    required: ['projectPath', 'specName', 'document', 'content']
  }
};

export async function createSpecDocHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, specName, document, content } = args;

  try {
    const specDir = PathUtils.getSpecPath(projectPath, specName);
    await fs.mkdir(specDir, { recursive: true });

    // Check workflow order - prevent creating documents out of sequence
    const requirementsPath = join(specDir, 'requirements.md');
    const designPath = join(specDir, 'design.md');
    
    // Enforce workflow order
    if (document === 'design') {
      try {
        await fs.access(requirementsPath);
      } catch {
        return {
          success: false,
          message: i18n.t('tools.createSpecDoc.workflowViolationDesign')
        };
      }
    }
    
    if (document === 'tasks') {
      try {
        await fs.access(designPath);
      } catch {
        return {
          success: false,
          message: i18n.t('tools.createSpecDoc.workflowViolationTasks')
        };
      }
    }

    // Create/update the document
    const filename = `${document}.md`;
    const filePath = join(specDir, filename);
    await fs.writeFile(filePath, content, 'utf-8');

    // Return concise, directive message
    return {
      success: true,
      message: i18n.t('tools.createSpecDoc.successMessage', {
        filename,
        filePath: PathUtils.toUnixPath(filePath)
      }),
      data: {
        specName,
        document,
        filePath: PathUtils.toUnixPath(filePath)
      }
    };

  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.createSpecDoc.failureMessage', { errorMessage: error.message })
    };
  }
}