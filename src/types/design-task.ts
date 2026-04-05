export type PageType = 'cover' | 'objectives' | 'content' | 'summary';

export interface TextFields {
  logo: string;
  unit_name: string;
  date: string;
  page: string;
  title: string;
  subtitle: string;
  bullet_1: string;
  bullet_2: string;
  bullet_3: string;
  bullet_4: string;
  bullet_5: string;
  footer_note: string;
}

export interface StyleFields {
  primary_color?: string;
  secondary_color?: string;
  background_style?: string;
  font_title?: string;
  font_body?: string;
}

export interface LayoutFields {
  logo_position?: string;
  page_number_position?: string;
  date_position?: string;
  image_position?: string;
  content_alignment?: string;
}

export interface DesignTask {
  id: string;
  source_slide_id: string;
  page_index: number;
  page_type: PageType;
  canva_template_type: string;
  text_fields: TextFields;
  image_prompt: string;
  style_fields: StyleFields;
  layout_fields: LayoutFields;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface CanvaWorkspaceConfig {
  template_name: string;
  template_type: string;
  canvas_size: string;
  page_count: number;
  brand_style: string;
  logo_position: string;
  page_number_position: string;
  date_position: string;
  enable_auto_illustration: boolean;
  illustration_style: string;
  image_position: string;
  image_ratio: string;
  image_on_every_page: boolean;
  image_only_on_content: boolean;
  cover_independent_visual: boolean;
}
