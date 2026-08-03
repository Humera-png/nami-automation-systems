// Maps the backend's conceptual step categories onto the site's existing
// WorkflowNode `type` accent system (see WorkflowNode.css).
const CATEGORY_TYPE_MAP = {
  trigger: 'trigger',
  'data movement': 'system',
  ai: 'ai',
  decision: 'decision',
  storage: 'storage',
  action: 'action',
  'human approval': 'human'
};

const LINE_PATTERN = /^\s*\d+[.)]\s*(.+?)\s*\[([^\]]+)\]\s*[-–—]\s*(.+?)\s*$/;

function toType(category) {
  return CATEGORY_TYPE_MAP[category.trim().toLowerCase()] || 'process';
}

/**
 * Safely parses the backend's `workflowText` (a numbered, bracketed-category
 * list) into a flat array of { label, category, type, description }.
 * Lines that don't match the expected shape are skipped rather than
 * throwing, since this is AI-generated text and formatting can vary.
 */
export function parseWorkflowText(workflowText) {
  if (!workflowText || typeof workflowText !== 'string') return [];

  return workflowText
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const match = line.match(LINE_PATTERN);
      if (!match) return null;
      const [, label, category, description] = match;
      return {
        label: label.trim(),
        category: category.trim(),
        type: toType(category),
        description: description.trim()
      };
    })
    .filter(Boolean);
}
