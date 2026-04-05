import { DesignTask } from '../types/design-task';

// ============================================================================
// Canva Integration Adapter (Mock Layer)
// 
// This layer is designed to be easily swapped with real Canva API calls in the future.
// It handles the translation between our internal DesignTask format and Canva's expected payload.
// ============================================================================

export interface CanvaExternalPayload {
  template_id: string;
  design_title: string;
  components: {
    [key: string]: {
      type: 'text' | 'image';
      value: string;
    }
  }
}

/**
 * Maps internal DesignTask fields to external Canva template field names.
 */
export const mapToExternalTemplateFields = (task: DesignTask): CanvaExternalPayload => {
  // In a real scenario, this mapping would depend on the specific Canva template ID
  // and the names of the elements defined within that template.
  return {
    template_id: `mock_template_${task.canva_template_type}_${task.page_type}`,
    design_title: `${task.text_fields.unit_name} - Page ${task.page_index + 1}`,
    components: {
      "header_logo": { type: 'image', value: task.text_fields.logo || '' },
      "header_title": { type: 'text', value: task.text_fields.unit_name || '' },
      "header_date": { type: 'text', value: task.text_fields.date || '' },
      "header_page": { type: 'text', value: task.text_fields.page || '' },
      "main_title": { type: 'text', value: task.text_fields.title || '' },
      "sub_title": { type: 'text', value: task.text_fields.subtitle || '' },
      "bullet_1": { type: 'text', value: task.text_fields.bullet_1 || '' },
      "bullet_2": { type: 'text', value: task.text_fields.bullet_2 || '' },
      "bullet_3": { type: 'text', value: task.text_fields.bullet_3 || '' },
      "bullet_4": { type: 'text', value: task.text_fields.bullet_4 || '' },
      "bullet_5": { type: 'text', value: task.text_fields.bullet_5 || '' },
      "footer_note": { type: 'text', value: task.text_fields.footer_note || '' },
      "main_visual": { type: 'image', value: `[Generated Image for: ${task.image_prompt}]` }
    }
  };
};

/**
 * Mocks uploading text fields to Canva.
 */
export const uploadTextFields = async (payload: CanvaExternalPayload): Promise<boolean> => {
  console.log('Uploading text fields to Canva...', payload.components);
  return new Promise(resolve => setTimeout(() => resolve(true), 300));
};

/**
 * Mocks uploading image fields to Canva.
 */
export const uploadImageFields = async (payload: CanvaExternalPayload): Promise<boolean> => {
  console.log('Uploading image fields to Canva...', payload.components);
  return new Promise(resolve => setTimeout(() => resolve(true), 400));
};

/**
 * Mocks creating a single design task in Canva.
 */
export const createCanvaDesignTask = async (task: DesignTask): Promise<{ success: boolean; taskId: string }> => {
  const payload = mapToExternalTemplateFields(task);
  
  await uploadTextFields(payload);
  await uploadImageFields(payload);

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, taskId: `canva_task_${Date.now()}_${task.id}` });
    }, 500);
  });
};

/**
 * Mocks creating a batch of design tasks (e.g., a full presentation).
 */
export const createBatchDesignTask = async (tasks: DesignTask[]): Promise<{ success: boolean; batchId: string }> => {
  console.log(`Starting batch export for ${tasks.length} tasks...`);
  
  for (const task of tasks) {
    await createCanvaDesignTask(task);
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true, batchId: `canva_batch_${Date.now()}` });
    }, 1000);
  });
};

/**
 * Legacy export function for backward compatibility in UI.
 */
export const exportToCanva = async (tasks: DesignTask[]): Promise<{ success: boolean; message: string }> => {
  try {
    const result = await createBatchDesignTask(tasks);
    return { success: true, message: `Successfully exported to Canva (Mock Batch ID: ${result.batchId})` };
  } catch (error) {
    return { success: false, message: 'Failed to export to Canva' };
  }
};
