import { DesignTask, CanvaWorkspaceConfig } from '../types/design-task';

export const buildImagePrompts = (tasks: DesignTask[], config: CanvaWorkspaceConfig, globalData: any): DesignTask[] => {
  return tasks.map(task => {
    let shouldGenerateImage = false;

    if (config.enable_auto_illustration) {
      if (config.image_on_every_page) {
        shouldGenerateImage = true;
      } else if (config.image_only_on_content && task.page_type === 'content') {
        shouldGenerateImage = true;
      } else if (config.cover_independent_visual && task.page_type === 'cover') {
        shouldGenerateImage = true;
      } else if (task.page_type === 'objectives' || task.page_type === 'summary') {
        shouldGenerateImage = true; // Default to true for these if auto is enabled but specific rules don't exclude them
      }
    }

    if (!shouldGenerateImage) {
      return { ...task, image_prompt: '' };
    }

    const audience = globalData?.audience || '一般大眾';
    const topic = globalData?.course_name || task.text_fields.title || '';
    const style = config.illustration_style;
    const ratio = config.image_ratio;

    let basePrompt = `Create an image for a presentation slide. Audience: ${audience}. Style: ${style}. Aspect Ratio: ${ratio}. `;
    basePrompt += `Color tone should match primary color ${task.style_fields.primary_color}. `;
    basePrompt += `Do NOT include any text or words in the image. `;

    let specificPrompt = '';

    switch (task.page_type) {
      case 'cover':
        specificPrompt = `This is the cover slide. Topic: "${topic}". Create a striking, high-quality main visual that represents the core concept of the topic.`;
        break;
      case 'objectives':
        specificPrompt = `This is the learning objectives slide. Create a conceptual illustration representing goals, targets, growth, or learning path related to "${topic}".`;
        break;
      case 'content':
        specificPrompt = `This is a content slide titled "${task.text_fields.title}". Create an educational or informational illustration that visually supports this specific concept.`;
        break;
      case 'summary':
        specificPrompt = `This is the summary/conclusion slide. Create an encouraging, achievement-oriented, or wrap-up illustration related to "${topic}".`;
        break;
    }

    return {
      ...task,
      image_prompt: basePrompt + specificPrompt
    };
  });
};
