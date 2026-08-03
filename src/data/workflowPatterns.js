// Each pattern describes one automation topology used by the Automation
// System Explorer. `type` drives node styling and the default status
// label shown while that step is current; `branch` is only read for
// type: 'decision' steps.

export const STATUS_BY_TYPE = {
  trigger: 'Trigger received',
  ai: 'Analysing context',
  decision: 'Route selected',
  system: 'Data synced',
  action: 'Action executed'
};

const workflowPatterns = [
  {
    id: 'lead-management',
    label: 'Lead Management',
    steps: [
      { label: 'Website Form', type: 'trigger' },
      { label: 'AI Lead Analysis', type: 'ai' },
      { label: 'Qualified?', type: 'decision', branch: 'YES' },
      { label: 'CRM', type: 'system' },
      { label: 'Follow-Up', type: 'action' },
      { label: 'Sales Alert', type: 'action' }
    ]
  },
  {
    id: 'client-onboarding',
    label: 'Client Onboarding',
    steps: [
      { label: 'Signed Client', type: 'trigger' },
      { label: 'Collect Details', type: 'ai' },
      { label: 'Create Workspace', type: 'system' },
      { label: 'Create Tasks', type: 'action' },
      { label: 'Welcome Email', type: 'action' },
      { label: 'Team Notification', type: 'action' }
    ]
  },
  {
    id: 'email-followups',
    label: 'Email Follow-Ups',
    steps: [
      { label: 'Incoming Email', type: 'trigger' },
      { label: 'AI Classification', type: 'ai' },
      { label: 'Action Required?', type: 'decision', branch: 'YES' },
      { label: 'Draft Response', type: 'ai' },
      { label: 'Approval', type: 'system' },
      { label: 'Send', type: 'action' }
    ]
  },
  {
    id: 'reporting',
    label: 'Reporting',
    steps: [
      { label: 'Business Data', type: 'trigger' },
      { label: 'Aggregate', type: 'system' },
      { label: 'Analyse', type: 'ai' },
      { label: 'Generate Report', type: 'action' },
      { label: 'Deliver', type: 'action' }
    ]
  },
  {
    id: 'data-entry',
    label: 'Data Entry',
    steps: [
      { label: 'Source Data', type: 'trigger' },
      { label: 'Extract', type: 'ai' },
      { label: 'Validate', type: 'ai' },
      { label: 'Transform', type: 'system' },
      { label: 'Destination System', type: 'action' }
    ]
  },
  {
    id: 'crm-updates',
    label: 'CRM Updates',
    steps: [
      { label: 'Business Event', type: 'trigger' },
      { label: 'Match Contact', type: 'ai' },
      { label: 'Update Record', type: 'system' },
      { label: 'Create Activity', type: 'action' },
      { label: 'Notify Owner', type: 'action' }
    ]
  },
  {
    id: 'documents',
    label: 'Documents',
    steps: [
      { label: 'Document', type: 'trigger' },
      { label: 'AI Extraction', type: 'ai' },
      { label: 'Validate', type: 'ai' },
      { label: 'Classify', type: 'ai' },
      { label: 'Route', type: 'system' },
      { label: 'Archive', type: 'action' }
    ]
  },
  {
    id: 'internal-operations',
    label: 'Internal Operations',
    steps: [
      { label: 'Operational Trigger', type: 'trigger' },
      { label: 'Decision Logic', type: 'decision', branch: 'ROUTED' },
      { label: 'Create Task', type: 'system' },
      { label: 'Assign Owner', type: 'action' },
      { label: 'Notify', type: 'action' },
      { label: 'Track', type: 'action' }
    ]
  }
];

export default workflowPatterns;
