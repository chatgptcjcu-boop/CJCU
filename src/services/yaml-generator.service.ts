export interface YamlGeneratorParams {
  course_name: string;
  unit_name: string;
  provider: string;
  logo_url: string;
  date: string;
  topic: string;
  audience: string;
  level: string;
  tone: string;
  slide_count: number;
  primary_color: string;
  secondary_color: string;
  background_style: string;
  font_title: string;
  font_body: string;
  add_pinyin?: boolean;
  add_scenario?: boolean;
  add_cta?: boolean;
}

export const buildYamlPrompt = (params: YamlGeneratorParams): string => {
  return `
請依據以下設定生成完整簡報 YAML：

【輸入設定】
課程名稱：${params.course_name}
單元名稱：${params.unit_name}
開課單位：${params.provider}
LOGO URL：${params.logo_url}
開課日期：${params.date}
主題：${params.topic}
受眾：${params.audience}
程度：${params.level}
語氣：${params.tone}
投影片頁數：${params.slide_count}

【YAML 結構】
version: "1.0"
document_type: "presentation"
deck_id: "deck_001"
global:
  course_name: "${params.course_name}"
  unit_name: "${params.unit_name}"
  provider_name: "${params.provider}"
  provider_logo_url: "${params.logo_url}"
  course_date: "${params.date}"
  language: "zh-TW"
  audience: "${params.audience}"
  level: "${params.level}"
  theme_name: "default"
  primary_color: "${params.primary_color}"
  secondary_color: "${params.secondary_color}"
  background_style: "${params.background_style}"
  font_title: "${params.font_title}"
  font_body: "${params.font_body}"
  slide_count: ${params.slide_count}

slides:
  - slide_id: "slide_01"
    page_number: 1
    page_label: "01"
    page_type: "cover"
    header:
      logo_url: "${params.logo_url}"
      unit_name: "${params.unit_name}"
      course_date: "${params.date}"
      page_label: "1/${params.slide_count}"
    body:
      title: "本頁標題"
      subtitle: "副標（可選）"
      bullet_points:
        - "重點1"
        - "重點2"
      speaker_note: "講者備註"
      visual_hint: "圖片或插圖建議"
      image_prompt: "Create an image for..."
    footer:
      footer_note: "補充或來源"
      source_text: ""
    style:
      theme_name: "default"
      primary_color: "${params.primary_color}"
      secondary_color: "${params.secondary_color}"
      background_style: "${params.background_style}"
      font_title: "${params.font_title}"
      font_body: "${params.font_body}"
      content_alignment: "left"
      image_position: "right"

【生成規則】
1. slide_count 決定頁數，請生成剛好 ${params.slide_count} 頁
2. 第1頁的 page_type 為 cover
3. 第2頁的 page_type 為 objectives
4. 中間頁的 page_type 為 content
5. 最後一頁的 page_type 為 summary
6. 每頁的 bullet_points 最多 5 項，若無則為空陣列 []
7. image_prompt 必須獨立欄位，請依據內容產生英文的圖片生成提示詞

【重要限制】
- 不可改變 YAML 結構，必須嚴格遵守上述欄位名稱 (snake_case)
- 所有 slides 必須完整
- 絕對不可輸出任何 Markdown 標記（如 \`\`\`yaml）或說明文字，只能輸出純 YAML。
`;
};

export const generateYaml = async (params: YamlGeneratorParams): Promise<string> => {
  const prompt = buildYamlPrompt(params);

  const response = await fetch('/api/generate-yaml-direct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'YAML 生成失敗');
  }

  const data = await response.json();
  return data.yaml;
};
