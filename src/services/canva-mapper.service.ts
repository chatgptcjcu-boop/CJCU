import { DesignTask, PageType, CanvaWorkspaceConfig } from '../types/design-task';
import { YamlStandardDocument } from '../types/yaml-standard';

export const mapYamlToDesignTasks = (yamlData: YamlStandardDocument, config: CanvaWorkspaceConfig): DesignTask[] => {
  if (!yamlData || !yamlData.slides) return [];

  return yamlData.slides.map((slide, index) => {
    const text_fields = {
      logo: slide.header.logo_url || yamlData.global.provider_logo_url || '',
      unit_name: slide.header.unit_name || yamlData.global.unit_name || '',
      date: slide.header.course_date || yamlData.global.course_date || '',
      page: slide.header.page_label || String(slide.page_number),
      title: slide.body.title || '',
      subtitle: slide.body.subtitle || '',
      bullet_1: slide.body.bullet_points?.[0] || '',
      bullet_2: slide.body.bullet_points?.[1] || '',
      bullet_3: slide.body.bullet_points?.[2] || '',
      bullet_4: slide.body.bullet_points?.[3] || '',
      bullet_5: slide.body.bullet_points?.[4] || '',
      footer_note: slide.footer.footer_note || ''
    };

    const style_fields = {
      primary_color: slide.style.primary_color || yamlData.global.primary_color,
      secondary_color: slide.style.secondary_color || yamlData.global.secondary_color,
      background_style: slide.style.background_style || yamlData.global.background_style,
      font_title: slide.style.font_title || yamlData.global.font_title,
      font_body: slide.style.font_body || yamlData.global.font_body
    };

    const layout_fields = {
      logo_position: config.logo_position,
      page_number_position: config.page_number_position,
      date_position: config.date_position,
      image_position: slide.style.image_position || config.image_position,
      content_alignment: slide.style.content_alignment || 'left'
    };

    return {
      id: `task_${Date.now()}_${index}`,
      source_slide_id: slide.slide_id,
      page_index: index,
      page_type: slide.page_type,
      canva_template_type: config.template_type,
      text_fields,
      image_prompt: slide.body.image_prompt || '', 
      style_fields,
      layout_fields,
      status: 'pending'
    };
  });
};
