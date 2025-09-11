import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { ToolContext, ToolResponse } from '../types.js';
import { PathUtils } from '../core/path-utils.js';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import i18n from '../core/i18n.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const getTemplateContextTool: Tool = {
  name: 'get-template-context',
  description: i18n.t('tools.getTemplateContext.description'),
  inputSchema: {
    type: 'object',
    properties: {
      projectPath: { 
        type: 'string',
        description: i18n.t('tools.getTemplateContext.projectPathDescription')
      },
      templateType: { 
        type: 'string',
        enum: ['spec', 'steering'],
        description: i18n.t('tools.getTemplateContext.templateTypeDescription')
      },
      template: {
        type: 'string',
        enum: ['requirements', 'design', 'tasks', 'product', 'tech', 'structure'],
        description: i18n.t('tools.getTemplateContext.templateDescription')
      }
    },
    required: ['projectPath', 'templateType', 'template']
  }
};

export async function getTemplateContextHandler(args: any, context: ToolContext): Promise<ToolResponse> {
  const { projectPath, templateType, template } = args as {
    projectPath: string;
    templateType: 'spec' | 'steering';
    template: 'requirements' | 'design' | 'tasks' | 'product' | 'tech' | 'structure';
  };

  try {
    const templatesPath = join(__dirname, '..', 'markdown', 'templates');
    
    // Define template mappings
    const templateMap = {
      spec: {
        requirements: { file: 'requirements-template.md', title: i18n.t('tools.getTemplateContext.requirementsTemplate') },
        design: { file: 'design-template.md', title: i18n.t('tools.getTemplateContext.designTemplate') },
        tasks: { file: 'tasks-template.md', title: i18n.t('tools.getTemplateContext.tasksTemplate') }
      },
      steering: {
        product: { file: 'product-template.md', title: i18n.t('tools.getTemplateContext.productTemplate') },
        tech: { file: 'tech-template.md', title: i18n.t('tools.getTemplateContext.techTemplate') },
        structure: { file: 'structure-template.md', title: i18n.t('tools.getTemplateContext.structureTemplate') }
      }
    };

    // Validate template/type combination
    if (!templateMap[templateType]) {
      return {
        success: false,
        message: i18n.t('tools.getTemplateContext.invalidType', { templateType }),
        nextSteps: [i18n.t('tools.getTemplateContext.useSpecOrSteering')]
      };
    }

    const templateGroup = templateMap[templateType] as any;
    if (!templateGroup[template]) {
      const validTemplates = Object.keys(templateGroup).join(', ');
      return {
        success: false,
        message: i18n.t('tools.getTemplateContext.invalidTemplate', { template, templateType }),
        nextSteps: [
          i18n.t('tools.getTemplateContext.validTemplates', { templates: validTemplates }),
          templateType === 'spec'
            ? i18n.t('tools.getTemplateContext.useSpecTemplates')
            : i18n.t('tools.getTemplateContext.useSteeringTemplates')
        ]
      };
    }

    const templateInfo = templateGroup[template];

    // Load the specific template
    try {
      const templatePath = join(templatesPath, templateInfo.file);
      const content = await readFile(templatePath, 'utf-8');
      
      if (!content || !content.trim()) {
        return {
          success: false,
          message: i18n.t('tools.getTemplateContext.emptyFile', { file: templateInfo.file }),
          data: {
            templateType,
            template,
            loaded: false
          },
          nextSteps: [
            i18n.t('tools.getTemplateContext.checkContent'),
            i18n.t('tools.getTemplateContext.verifyIntegrity')
          ]
        };
      }

      const formattedContext = i18n.t('tools.getTemplateContext.loadedContext', {
        title: templateInfo.title,
        content: content.trim(),
        template
      });

      return {
        success: true,
        message: i18n.t('tools.getTemplateContext.successMessage', { template, templateType }),
        data: {
          context: formattedContext,
          templateType,
          template,
          loaded: templateInfo.file
        },
        nextSteps: [
          i18n.t('tools.getTemplateContext.useForDocument', { template }),
          i18n.t('tools.getTemplateContext.followStructure'),
          templateType === 'spec'
            ? i18n.t('tools.getTemplateContext.nextSpec', { template })
            : i18n.t('tools.getTemplateContext.nextSteering', { template })
        ],
        projectContext: {
          projectPath,
          workflowRoot: PathUtils.getWorkflowRoot(projectPath),
          dashboardUrl: context.dashboardUrl
        }
      };
    } catch (error) {
      return {
        success: false,
        message: i18n.t('tools.getTemplateContext.fileNotFound', { file: templateInfo.file }),
        data: {
          templateType,
          template,
          loaded: false
        },
        nextSteps: [
          i18n.t('tools.getTemplateContext.checkDirectory'),
          i18n.t('tools.getTemplateContext.verifyFileExists'),
          i18n.t('tools.getTemplateContext.location', { path: join(templatesPath, templateInfo.file) })
        ]
      };
    }
    
  } catch (error: any) {
    return {
      success: false,
      message: i18n.t('tools.getTemplateContext.failureMessage', { errorMessage: error.message }),
      nextSteps: [
        i18n.t('tools.getTemplateContext.checkDirectory'),
        i18n.t('tools.getTemplateContext.checkPermissions'),
        i18n.t('tools.getTemplateContext.checkFiles')
      ]
    };
  }
}