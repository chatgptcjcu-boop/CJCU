import { YamlStandardDocument } from '../types/yaml-standard';

export interface SheetsRow {
  deck_id: string;
  slide_id: string;
  page_number: number;
  page_type: string;
  course_name: string;
  unit_name: string;
  title: string;
  subtitle: string;
  bullet_1: string;
  bullet_2: string;
  bullet_3: string;
  bullet_4: string;
  bullet_5: string;
  speaker_note: string;
  image_prompt: string;
}

export const mapYamlToSheets = (yamlData: YamlStandardDocument): SheetsRow[] => {
  if (!yamlData || !yamlData.slides) return [];

  return yamlData.slides.map(slide => {
    return {
      deck_id: yamlData.deck_id,
      slide_id: slide.slide_id,
      page_number: slide.page_number,
      page_type: slide.page_type,
      course_name: yamlData.global.course_name,
      unit_name: slide.header.unit_name || yamlData.global.unit_name,
      title: slide.body.title,
      subtitle: slide.body.subtitle,
      bullet_1: slide.body.bullet_points?.[0] || '',
      bullet_2: slide.body.bullet_points?.[1] || '',
      bullet_3: slide.body.bullet_points?.[2] || '',
      bullet_4: slide.body.bullet_points?.[3] || '',
      bullet_5: slide.body.bullet_points?.[4] || '',
      speaker_note: slide.body.speaker_note,
      image_prompt: slide.body.image_prompt
    };
  });
};
