import { YamlStandardDocument } from '../types/yaml-standard';

export const validateYamlStandard = (data: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!data) {
    return { isValid: false, errors: ['Data is null or undefined'] };
  }

  // Check top level
  const topLevelKeys = ['version', 'document_type', 'deck_id', 'global', 'slides'];
  topLevelKeys.forEach(key => {
    if (!(key in data)) errors.push(`Missing top-level key: ${key}`);
  });

  if (data.global) {
    const globalKeys = [
      'course_name', 'unit_name', 'provider_name', 'provider_logo_url', 'course_date',
      'language', 'audience', 'level', 'theme_name', 'primary_color', 'secondary_color',
      'background_style', 'font_title', 'font_body', 'slide_count'
    ];
    globalKeys.forEach(key => {
      if (!(key in data.global)) errors.push(`Missing global key: ${key}`);
    });
  }

  if (Array.isArray(data.slides)) {
    data.slides.forEach((slide: any, index: number) => {
      const slideKeys = ['slide_id', 'page_number', 'page_label', 'page_type', 'header', 'body', 'footer', 'style'];
      slideKeys.forEach(key => {
        if (!(key in slide)) errors.push(`Slide ${index + 1} missing key: ${key}`);
      });

      if (slide.page_type && !['cover', 'objectives', 'content', 'summary'].includes(slide.page_type)) {
        errors.push(`Slide ${index + 1} has invalid page_type: ${slide.page_type}`);
      }

      if (slide.header) {
        const headerKeys = ['logo_url', 'unit_name', 'course_date', 'page_label'];
        headerKeys.forEach(key => {
          if (!(key in slide.header)) errors.push(`Slide ${index + 1} header missing key: ${key}`);
        });
      }

      if (slide.body) {
        const bodyKeys = ['title', 'subtitle', 'bullet_points', 'speaker_note', 'visual_hint', 'image_prompt'];
        bodyKeys.forEach(key => {
          if (!(key in slide.body)) errors.push(`Slide ${index + 1} body missing key: ${key}`);
        });

        if (Array.isArray(slide.body.bullet_points) && slide.body.bullet_points.length > 5) {
          errors.push(`Slide ${index + 1} bullet_points exceeds maximum of 5 items`);
        }
      }

      if (slide.footer) {
        const footerKeys = ['footer_note', 'source_text'];
        footerKeys.forEach(key => {
          if (!(key in slide.footer)) errors.push(`Slide ${index + 1} footer missing key: ${key}`);
        });
      }

      if (slide.style) {
        const styleKeys = ['theme_name', 'primary_color', 'secondary_color', 'background_style', 'font_title', 'font_body', 'content_alignment', 'image_position'];
        styleKeys.forEach(key => {
          if (!(key in slide.style)) errors.push(`Slide ${index + 1} style missing key: ${key}`);
        });
      }
    });
  } else {
    errors.push('slides must be an array');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};
