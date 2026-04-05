import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import bodyParser from "body-parser";
import { GoogleGenAI, Type } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// --- Data Storage Helpers ---
const DATA_DIR = path.join(process.cwd(), "backend", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function readData<T>(filename: string): T[] {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

function writeData<T>(filename: string, data: T[]) {
  const filePath = path.join(DATA_DIR, `${filename}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

function saveItem<T extends { id: string }>(filename: string, item: T) {
  const data = readData<T>(filename);
  const index = data.findIndex((i) => i.id === item.id);
  if (index !== -1) {
    data[index] = item;
  } else {
    data.push(item);
  }
  writeData(filename, data);
}

function deleteItem(filename: string, id: string) {
  const data = readData<any>(filename);
  const newData = data.filter((i: any) => i.id !== id);
  writeData(filename, newData);
}

// --- Gemini Setup ---
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

// --- AI Analysis Schema ---
const extractionSchema = {
  type: Type.OBJECT,
  properties: {
    source_summary: { type: Type.STRING, description: "A brief summary of the source content" },
    content_theme: { type: Type.STRING, description: "The main theme or topic" },
    target_audience: { type: Type.STRING, description: "The intended audience" },
    tone_style: { type: Type.STRING, description: "The tone and writing style" },
    writing_structure: { type: Type.STRING, description: "The structural layout of the text" },
    cta_pattern: { type: Type.STRING, description: "The call to action pattern used" },
    visual_layout: { type: Type.STRING, description: "The visual arrangement (for images)" },
    color_style: { type: Type.STRING, description: "The color palette and visual mood" },
    component_blocks: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of reusable component blocks identified"
    },
    reusable_fields: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "List of dynamic fields that can be filled in a template"
    },
    template_type_recommendation: { type: Type.STRING, description: "Recommended template category" },
    risk_flags: { 
      type: Type.ARRAY, 
      items: { type: Type.STRING },
      description: "Any copyright or brand risks identified"
    },
    transformation_notes: { type: Type.STRING, description: "Notes on how to transform this into a generic template" }
  },
  required: ["source_summary", "content_theme", "target_audience", "tone_style", "writing_structure", "cta_pattern", "component_blocks", "reusable_fields", "template_type_recommendation", "risk_flags", "transformation_notes"]
};

const conversionSchema = {
  type: Type.OBJECT,
  properties: {
    template_name: { type: Type.STRING },
    template_goal: { type: Type.STRING },
    required_fields: { type: Type.ARRAY, items: { type: Type.STRING } },
    optional_fields: { type: Type.ARRAY, items: { type: Type.STRING } },
    content_rules: { type: Type.ARRAY, items: { type: Type.STRING } },
    visual_rules: { type: Type.ARRAY, items: { type: Type.STRING } },
    output_example: { type: Type.STRING },
    safe_rewrite_note: { type: Type.STRING },
    yaml_content: { type: Type.STRING, description: "The template structure in YAML format" },
    json_content: { type: Type.OBJECT, description: "The template structure in JSON format" }
  },
  required: ["template_name", "template_goal", "required_fields", "optional_fields", "content_rules", "visual_rules", "output_example", "safe_rewrite_note", "yaml_content", "json_content"]
};

// --- API Routes ---

// Imports & Analysis
app.post("/api/imports", async (req, res) => {
  const { 
    import_name, 
    import_type, 
    source_platform, 
    source_text, 
    source_image, 
    import_goal, 
    extraction_mode,
    keep_original,
    create_reusable,
    imported_by
  } = req.body;

  try {
    const imports = readData<any>("source_imports");
    const newImport = {
      id: `imp_${Date.now()}`,
      import_name,
      import_type,
      source_platform,
      source_text: keep_original ? source_text : undefined,
      source_image_path: source_image ? `uploads/${Date.now()}.png` : undefined,
      import_goal,
      extraction_mode,
      keep_original,
      create_reusable,
      imported_by,
      created_at: new Date().toISOString()
    };
    
    imports.push(newImport);
    writeData("source_imports", imports);

    // AI Analysis
    const prompt = `
      Analyze the following ${import_type} content from ${source_platform}.
      Goal: ${import_goal}
      Mode: ${extraction_mode}
      
      Instructions:
      1. Extract the underlying structure, style, and patterns.
      2. DO NOT copy the original content directly.
      3. Identify reusable components and fields.
      4. Flag any brand identifiers (logos, names) as risks.
      5. Provide notes for transforming this into a generic, reusable template.
      
      Content:
      ${source_text || "Image provided"}
    `;

    const parts: any[] = [{ text: prompt }];
    if (source_image) {
      parts.push({
        inlineData: {
          data: source_image.split(',')[1],
          mimeType: "image/png"
        }
      });
    }

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: extractionSchema
      }
    });

    const extractedData = JSON.parse(response.text || "{}");
    
    const patterns = readData<any>("extracted_patterns");
    const newPattern = {
      id: `pat_${Date.now()}`,
      source_import_id: newImport.id,
      extracted_json: extractedData,
      risk_flags: extractedData.risk_flags || [],
      approved_status: 'pending',
      created_at: new Date().toISOString()
    };
    
    patterns.push(newPattern);
    writeData("extracted_patterns", patterns);

    // Log the action
    const logs = readData<any>("logs");
    logs.push({
      id: `log_${Date.now()}`,
      user: imported_by,
      action: "IMPORT_CONTENT",
      details: `Imported ${import_name} for ${import_goal}`,
      timestamp: new Date().toISOString()
    });
    writeData("logs", logs);

    res.json({ success: true, import: newImport, pattern: newPattern });
  } catch (error) {
    console.error("Import error:", error);
    res.status(500).json({ success: false, message: "解析失敗" });
  }
});

// Admin Review Endpoints
app.get("/api/admin/imports", (req, res) => {
  const imports = readData<any>("source_imports");
  const patterns = readData<any>("extracted_patterns");
  
  const combined = imports.map((imp: any) => ({
    ...imp,
    pattern: patterns.find((p: any) => p.source_import_id === imp.id)
  }));
  
  res.json(combined);
});

app.post("/api/admin/imports/approve", (req, res) => {
  const { patternId, reviewerId } = req.body;
  const patterns = readData<any>("extracted_patterns");
  const patternIndex = patterns.findIndex((p: any) => p.id === patternId);
  
  if (patternIndex > -1) {
    patterns[patternIndex].approved_status = 'approved';
    patterns[patternIndex].reviewed_by = reviewerId;
    patterns[patternIndex].reviewed_at = new Date().toISOString();
    writeData("extracted_patterns", patterns);
    
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Pattern not found" });
  }
});

app.post("/api/admin/imports/convert-to-template", async (req, res) => {
  const { patternId, templateType, userId } = req.body;
  
  try {
    const patterns = readData<any>("extracted_patterns");
    const pattern = patterns.find((p: any) => p.id === patternId);
    
    if (!pattern) {
      return res.status(404).json({ success: false, message: "Pattern not found" });
    }

    const prompt = `
      Convert the following extracted content pattern into a reusable ${templateType} template.
      
      Extracted Pattern Data:
      ${JSON.stringify(pattern.extracted_json, null, 2)}
      
      Strict Rules for Conversion:
      1. DO NOT use full sentences from the original source.
      2. Abstract the content into generic fields (e.g., {{product_name}}, {{benefit_1}}).
      3. Ensure the template can be reused for entirely different topics.
      4. Provide both YAML and JSON representations of the template structure.
      5. Include clear descriptions for each field and usage instructions.
      
      Output the following fields:
      - template_name: A descriptive name for this template.
      - template_goal: What this template achieves.
      - required_fields: List of mandatory fields.
      - optional_fields: List of optional fields.
      - content_rules: Guidelines for writing content for this template.
      - visual_rules: Guidelines for visual arrangement or style.
      - output_example: A sample output using the template with placeholder data.
      - safe_rewrite_note: How this template avoids copying the original source.
      - yaml_content: The template structure in YAML.
      - json_content: The template structure in JSON.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        responseSchema: conversionSchema
      }
    });

    const convertedData = JSON.parse(response.text || "{}");
    
    const templates = readData<any>("reusable_templates");
    const newTemplate = {
      id: `tpl_${Date.now()}`,
      source_pattern_id: patternId,
      template_type: templateType,
      ...convertedData,
      created_at: new Date().toISOString(),
      created_by: userId
    };
    
    templates.push(newTemplate);
    writeData("reusable_templates", templates);

    res.json({ success: true, template: newTemplate });
  } catch (error) {
    console.error("Conversion error:", error);
    res.status(500).json({ success: false, message: "轉換失敗" });
  }
});

app.post("/api/convert/yaml", async (req, res) => {
  const { text, userId } = req.body;
  
  try {
    const prompt = `
      You are a "Social Post to YAML Template Converter". 
      Analyze the following social media post and convert it into a reusable YAML template.
      
      Original Post:
      """
      ${text}
      """
      
      Follow these steps:
      1. Understand content (theme, audience, tone).
      2. Disassemble structure (hook, content blocks, persuasion, CTA, extra).
      3. Analyze language features (question opening, storytelling, lists, etc.).
      4. Check for risks (brand names, proper nouns, long verbatim quotes).
      
      Strict Rules:
      - ONLY output YAML. No extra explanation.
      - DO NOT use full sentences from the original source.
      - Abstract the content into generic fields.
      - Ensure the template is reusable for other topics.
      - If content is short, reasonably fill in the structure but do not invent facts.
      
      YAML Format:
      template:
        name: "Auto-generated template name"
        category: "social_post"
        objective: "Purpose of this post"
      audience:
        target: "Inferred audience"
        tone: ["tone1", "tone2"]
      structure:
        hook_type: "Question / Narrative / Conclusion"
        sections:
          - type: "hook"
            description: "Opening hook description"
          - type: "content"
            description: "Main content block description"
          - type: "persuasion"
            description: "Persuasion or emotional block description"
          - type: "cta"
            description: "Call to action description"
      writing_rules:
        sentence_style: "Short / Medium / Mixed"
        paragraph_count: number
        keywords_pattern: ["keyword1", "keyword2"]
      cta_pattern:
        type: "Comment / DM / Link / Share"
        examples: ["Example 1", "Example 2"]
      content_template:
        hook: "{Fill in hook here}"
        body: ["{Paragraph 1}", "{Paragraph 2}"]
        cta: "{Fill in CTA here}"
      transformation_rules:
        rewrite_required: true
        remove_proper_nouns: true
        avoid_sentence_copy: true
        keep_structure_only: true
      risk_control:
        risk_flags: true/false
        notes: "Explanation if risk exists"
        
      After the YAML block, output a separate section titled "TEMPLATE_INSTRUCTIONS" with plain text instructions on how to use this template and what scenarios it fits best.
    `;

    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });

    const fullText = response.text || "";
    const yamlMatch = fullText.match(/```yaml\n([\s\S]*?)\n```/) || fullText.match(/```\n([\s\S]*?)\n```/);
    const yaml = yamlMatch ? yamlMatch[1] : fullText.split("TEMPLATE_INSTRUCTIONS")[0].trim();
    const instructions = fullText.split("TEMPLATE_INSTRUCTIONS")[1]?.trim() || "No instructions provided.";

    res.json({ success: true, yaml, instructions });
  } catch (error) {
    console.error("YAML Conversion error:", error);
    res.status(500).json({ success: false, message: "轉換失敗" });
  }
});

app.get("/api/admin/templates-review", (req, res) => {
  const templates = readData<any>("reusable_templates");
  res.json(templates);
});

app.get("/api/admin/similarity-logs", (req, res) => {
  const logs = readData<any>("similarity_review_logs");
  res.json(logs);
});

// Auth
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const users = readData<any>("users");
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    res.json({ success: true, user: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, message: "帳號或密碼錯誤" });
  }
});

// Templates
app.get("/api/templates", (req, res) => {
  res.json(readData("templates"));
});

app.post("/api/templates", (req, res) => {
  const template = req.body;
  if (!template.id) template.id = `template_${Date.now()}`;
  saveItem("templates", template);
  res.json({ success: true, template });
});

app.delete("/api/templates/:id", (req, res) => {
  deleteItem("templates", req.params.id);
  res.json({ success: true });
});

// Sources
app.get("/api/sources", (req, res) => {
  res.json(readData("sources"));
});

// Alias for CreateTaskPage
app.get("/api/datasources", (req, res) => {
  res.json(readData("sources"));
});

app.post("/api/sources", (req, res) => {
  const source = req.body;
  if (!source.id) source.id = `source_${Date.now()}`;
  saveItem("sources", source);
  res.json({ success: true, source });
});

app.delete("/api/sources/:id", (req, res) => {
  deleteItem("sources", req.params.id);
  res.json({ success: true });
});

// Tasks
app.get("/api/tasks", (req, res) => {
  const { userId } = req.query;
  const tasks = readData<any>("tasks");
  if (userId) {
    res.json(tasks.filter((t: any) => t.userId === userId));
  } else {
    res.json(tasks);
  }
});

app.get("/api/tasks/:id", (req, res) => {
  const tasks = readData<any>("tasks");
  const task = tasks.find((t: any) => t.id === req.params.id);
  if (task) res.json(task);
  else res.status(404).json({ error: "Task not found" });
});

app.post("/api/tasks/generate", async (req, res) => {
  const { 
    userId, 
    taskName, 
    taskType, 
    topic, 
    keywords, 
    audience, 
    tone, 
    format, 
    templateId, 
    sourceId, 
    constraints 
  } = req.body;

  const templates = readData<any>("templates");
  const sources = readData<any>("sources");
  const template = templates.find((t: any) => t.id === templateId);
  const source = sources.find((s: any) => s.id === sourceId);

  if (!template) return res.status(400).json({ error: "Template not found" });

  try {
    // Construct Prompt
    let prompt = template.prompt_template
      .replace("{{topic}}", topic || "")
      .replace("{{keywords}}", keywords || "")
      .replace("{{audience}}", audience || "")
      .replace("{{tone}}", tone || "")
      .replace("{{constraints}}", constraints || "");

    if (source) {
      prompt += `\n\n參考資料內容：\n${source.content}`;
    }

    prompt += `\n\n請以 ${format || "Markdown"} 格式輸出。`;

    // Call Gemini
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: template.system_instruction,
      },
    });

    const resultText = response.text;

    const newTask = {
      id: `task_${Date.now()}`,
      userId,
      taskName,
      taskType,
      topic,
      keywords,
      audience,
      tone,
      format,
      templateId,
      sourceId,
      constraints,
      result: resultText,
      modelOutput: resultText, // Add this for frontend compatibility
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    saveItem("tasks", newTask);

    // Log action
    const logs = readData<any>("logs");
    logs.push({
      id: `log_${Date.now()}`,
      userId,
      action: "TASK_GENERATE",
      details: `建立任務：${taskName}`,
      timestamp: new Date().toISOString(),
    });
    writeData("logs", logs);

    res.json({ success: true, task: newTask });
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Admin - Users
app.get("/api/admin/users", (req, res) => {
  const users = readData<any>("users");
  res.json(users.map(({ password, ...u }: any) => u));
});

// Admin - Logs
app.get("/api/admin/logs", (req, res) => {
  res.json(readData("logs"));
});

// Admin - Settings
app.get("/api/admin/settings", (req, res) => {
  const settings = readData<any>("settings")[0] || {
    defaultModel: "gemini-1.5-flash",
    safetySettings: {
      harassment: "BLOCK_MEDIUM_AND_ABOVE",
      hateSpeech: "BLOCK_MEDIUM_AND_ABOVE",
      sexuallyExplicit: "BLOCK_MEDIUM_AND_ABOVE",
      dangerousContent: "BLOCK_MEDIUM_AND_ABOVE"
    },
    defaultOutputFormat: "markdown",
    enabledTaskTypes: ["news", "presentation", "lesson", "official", "image_prompt"],
    defaultSystemPrompt: "你是一位專業的 AI 助手。"
  };
  res.json(settings);
});

app.post("/api/admin/settings", (req, res) => {
  const settings = { ...req.body, id: "system_settings" };
  saveItem("settings", settings);
  res.json(settings);
});

// User Favorites (Optional feature)
app.post("/api/user/favorites", (req, res) => {
  const { userId, templateId } = req.body;
  const users = readData<any>("users");
  const userIndex = users.findIndex((u: any) => u.id === userId);
  
  if (userIndex !== -1) {
    const user = users[userIndex];
    if (!user.favoriteTemplates) user.favoriteTemplates = [];
    if (!user.favoriteTemplates.includes(templateId)) {
      user.favoriteTemplates.push(templateId);
      // In a real app, we'd save the whole users array back
      // For this mock, we'll just update the item if storage supports it
      saveItem("users", user);
    }
    return res.json({ success: true, favoriteTemplates: user.favoriteTemplates });
  }
  res.status(404).json({ error: "User not found" });
});

app.post("/api/generate-yaml", async (req, res) => {
  const {
    course_name, unit_name, provider, logo_url, date,
    topic, audience, level, tone, slide_count,
    primary_color, secondary_color, background_style, font_title, font_body,
    add_pinyin, add_scenario, add_cta
  } = req.body;

  try {
    const prompt = `
請依據以下設定生成完整簡報 YAML：

【基本設定】
課程名稱：${course_name}
單元名稱：${unit_name}
開課單位：${provider}
LOGO URL：${logo_url}
開課日期：${date}

【內容設定】
主題：${topic}
受眾：${audience}
程度：${level}
語氣：${tone}
投影片頁數：${slide_count}
是否加入拼音：${add_pinyin ? '是' : '否'}
是否加入情境句：${add_scenario ? '是' : '否'}
是否加入 CTA：${add_cta ? '是' : '否'}

【風格設定】
主色：${primary_color}
輔色：${secondary_color}
背景風格：${background_style}
標題字體：${font_title}
內文字體：${font_body}

【核心要求】
1. 所有投影片使用統一 schema
2. 每一頁都必須包含 header / body / footer / style
3. AI 不可改變欄位結構，只能填內容
4. 每一頁需自動編頁碼
5. 每一頁需自動帶入統一設計元素

【全域設定（Global Config）】
global:
  course_name: "${course_name}"
  unit_name: "${unit_name}"
  provider: "${provider}"
  logo_url: "${logo_url}"
  date: "${date}"
  style:
    theme: "自訂風格"
    primary_color: "${primary_color}"
    secondary_color: "${secondary_color}"
    background_style: "${background_style}"
    font_title: "${font_title}"
    font_body: "${font_body}"

【單頁投影片固定結構】
slides:
  - slide_id: "slide_01"
    header:
      logo: "{global.logo_url}"
      unit_name: "{global.unit_name}"
      date: "{global.date}"
      page: "1/${slide_count}"
    body:
      title: "本頁標題"
      subtitle: "副標（可選）"
      content:
        - "重點1"
        - "重點2"
      visual_hint: "圖片或插圖建議"
    footer:
      note: "補充或來源"
    style:
      background: "{global.style.background_style}"
      primary_color: "{global.style.primary_color}"
      font_title: "{global.style.font_title}"

【生成規則】
1. 生成 ${slide_count} 頁
2. 第一頁必為封面
3. 第二頁為學習目標
4. 中間為教學內容
5. 最後一頁為總結${add_cta ? '或CTA' : ''}

每頁要求：
- 一頁一主題
- 每頁不超過 5 個重點
- 語句簡短、可投影閱讀
- 保持教學邏輯連貫

【嚴格遵守規則】
1. 不可刪除 header / body / footer / style
2. 不可新增未定義欄位
3. 不可輸出 JSON 或 Markdown（包含 \`\`\`yaml 標記），只能輸出純 YAML 文字
4. 不可輸出任何說明文字
5. 所有頁面必須套用 global 設定
6. page 欄位必須正確累加（如 1/${slide_count}, 2/${slide_count}...）
7. 若內容不足，請補齊合理教學內容，但不得省略頁數。
`;

    const response = await genAI.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "你是一個「連續投影片 YAML 生成系統」，用於教學簡報與教材內容輸出。你必須嚴格遵守固定的 YAML 版型結構，不可改變欄位結構，只能填寫內容。所有輸出必須是純 YAML 格式。絕對不可輸出任何 Markdown 標記（如 ```yaml）或說明文字。",
      },
    });

    let yamlOutput = response.text || "";
    // Clean up markdown code blocks if the model still outputs them
    yamlOutput = yamlOutput.replace(/^```yaml\n?/gm, '').replace(/^```\n?/gm, '').trim();

    res.json({ success: true, yaml: yamlOutput });
  } catch (error) {
    console.error("YAML generation error:", error);
    res.status(500).json({ success: false, message: "YAML 生成失敗" });
  }
});

app.post("/api/generate-yaml-direct", async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await genAI.models.generateContent({
      model: "gemini-3.1-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "你是一個「連續投影片 YAML 生成系統」，用於教學簡報與教材內容輸出。你必須嚴格遵守固定的 YAML 版型結構，不可改變欄位結構，只能填寫內容。所有輸出必須是純 YAML 格式。絕對不可輸出任何 Markdown 標記（如 ```yaml）或說明文字。",
      },
    });

    let yamlOutput = response.text || "";
    // Clean up markdown code blocks if the model still outputs them
    yamlOutput = yamlOutput.replace(/^```yaml\n?/gm, '').replace(/^```\n?/gm, '').trim();

    res.json({ success: true, yaml: yamlOutput });
  } catch (error) {
    console.error("YAML generation error:", error);
    res.status(500).json({ success: false, message: "YAML 生成失敗" });
  }
});

// --- Vite Middleware ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
