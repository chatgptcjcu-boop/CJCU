export type ImportType = 'text' | 'image' | 'mixed';
export type SourcePlatform = 'facebook' | 'instagram' | 'web' | 'other';
export type ImportGoal = '文案模板' | '圖卡模板' | '簡報模板' | '風格分析';
export type ExtractionMode = '僅抽取結構' | '抽取風格' | '抽取結構+風格';

export interface SourceImport {
  id: string;
  import_name: string;
  import_type: ImportType;
  source_platform: SourcePlatform;
  source_text?: string;
  source_image_path?: string;
  import_goal: ImportGoal;
  extraction_mode: ExtractionMode;
  keep_original: boolean;
  create_reusable: boolean;
  imported_by: string;
  created_at: string;
}

export interface ExtractedPattern {
  id: string;
  source_import_id: string;
  extracted_json: {
    source_summary: string;
    content_theme: string;
    target_audience: string;
    tone_style: string;
    writing_structure: string;
    cta_pattern: string;
    visual_layout?: string;
    color_style?: string;
    component_blocks: string[];
    reusable_fields: string[];
    template_type_recommendation: string;
    risk_flags: string[];
    transformation_notes: string;
  };
  risk_flags: string[];
  approved_status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
}

export interface ReusableTemplate {
  id: string;
  source_pattern_id: string;
  template_type: 'social_post' | 'graphic_card' | 'slide' | 'educational';
  template_name: string;
  template_goal: string;
  required_fields: string[];
  optional_fields: string[];
  content_rules: string[];
  visual_rules: string[];
  output_example: string;
  safe_rewrite_note: string;
  yaml_content: string;
  json_content: any;
  created_at: string;
  created_by: string;
}

export interface SimilarityReviewLog {
  id: string;
  source_import_id: string;
  similarity_score: number;
  matched_reasons: string[];
  status: 'flagged' | 'ignored';
  checked_at: string;
}
