export type PageType = 'cover' | 'objectives' | 'content' | 'summary';

export interface YamlGlobal {
  course_name: string;
  unit_name: string;
  provider_name: string;
  provider_logo_url: string;
  course_date: string;
  language: string;
  audience: string;
  level: string;
  theme_name: string;
  primary_color: string;
  secondary_color: string;
  background_style: string;
  font_title: string;
  font_body: string;
  slide_count: number;
}

export interface YamlHeader {
  logo_url: string;
  unit_name: string;
  course_date: string;
  page_label: string;
}

export interface YamlBody {
  title: string;
  subtitle: string;
  bullet_points: string[];
  speaker_note: string;
  visual_hint: string;
  image_prompt: string;
}

export interface YamlFooter {
  footer_note: string;
  source_text: string;
}

export interface YamlStyle {
  theme_name: string;
  primary_color: string;
  secondary_color: string;
  background_style: string;
  font_title: string;
  font_body: string;
  content_alignment: string;
  image_position: string;
}

export interface YamlSlide {
  slide_id: string;
  page_number: number;
  page_label: string;
  page_type: PageType;
  header: YamlHeader;
  body: YamlBody;
  footer: YamlFooter;
  style: YamlStyle;
}

export interface YamlStandardDocument {
  version: string;
  document_type: string;
  deck_id: string;
  global: YamlGlobal;
  slides: YamlSlide[];
}
