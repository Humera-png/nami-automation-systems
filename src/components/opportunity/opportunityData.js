// `manual` is the literal sequence of human actions being replaced.
// `automated` carries a `type` per step so it renders through the shared
// WorkflowNode system (trigger / ai / decision / system / action).

const opportunities = [
  {
    id: 'leads-to-spreadsheets',
    label: 'Copying leads into spreadsheets',
    manual: ['New Lead', 'Open Email', 'Copy Name', 'Open Sheet', 'Paste Data', 'Update CRM', 'Send Follow-Up'],
    automated: [
      { label: 'Lead', type: 'trigger' },
      { label: 'AI Qualification', type: 'ai' },
      { label: 'CRM', type: 'system' },
      { label: 'Personalised Email', type: 'action' },
      { label: 'Team Notification', type: 'action' }
    ]
  },
  {
    id: 'followup-emails',
    label: 'Sending the same follow-up emails',
    manual: ['New Enquiry', 'Remember to Follow Up', 'Open Inbox', 'Write Email', 'Send Reply'],
    automated: [
      { label: 'New Enquiry', type: 'trigger' },
      { label: 'AI Draft', type: 'ai' },
      { label: 'Human Approval', type: 'system' },
      { label: 'Send & Log', type: 'action' }
    ]
  },
  {
    id: 'crm-updates',
    label: 'Updating CRM records',
    manual: ['System Change', 'Notice the Change', 'Open CRM', 'Find Record', 'Edit Fields'],
    automated: [
      { label: 'System Change', type: 'trigger' },
      { label: 'Transform Data', type: 'ai' },
      { label: 'CRM Synced', type: 'system' }
    ]
  },
  {
    id: 'weekly-reports',
    label: 'Generating weekly reports',
    manual: ['Week Ends', 'Gather Data', 'Open Spreadsheet', 'Build Report', 'Email Report'],
    automated: [
      { label: 'Schedule Trigger', type: 'trigger' },
      { label: 'AI Summary', type: 'ai' },
      { label: 'Report Generated', type: 'system' },
      { label: 'Auto-Delivered', type: 'action' }
    ]
  },
  {
    id: 'data-between-tools',
    label: 'Moving data between tools',
    manual: ['Tool A Update', 'Open Tool A', 'Export File', 'Format File', 'Import to Tool B'],
    automated: [
      { label: 'Tool A Event', type: 'trigger' },
      { label: 'Data Mapping', type: 'ai' },
      { label: 'Tool B Updated', type: 'system' }
    ]
  },
  {
    id: 'checking-forms',
    label: 'Checking forms manually',
    manual: ['Form Submitted', 'Check Inbox Later', 'Open Submission', 'Review Entry', 'Action It'],
    automated: [
      { label: 'Form Submitted', type: 'trigger' },
      { label: 'AI Review', type: 'ai' },
      { label: 'Routed Automatically', type: 'action' }
    ]
  },
  {
    id: 'internal-tasks',
    label: 'Creating internal tasks',
    manual: ['Request Received', 'Remember the Task', 'Open Task Tool', 'Create Ticket', 'Assign Owner'],
    automated: [
      { label: 'Request Received', type: 'trigger' },
      { label: 'AI Classification', type: 'ai' },
      { label: 'Task Created', type: 'system' },
      { label: 'Owner Assigned', type: 'action' }
    ]
  },
  {
    id: 'chasing-updates',
    label: 'Chasing operational updates',
    manual: ['Status Needed', 'Message Team', 'Wait for Reply', 'Follow Up Again', 'Compile Manually'],
    automated: [
      { label: 'Status Needed', type: 'trigger' },
      { label: 'Automated Check-In', type: 'ai' },
      { label: 'Status Synced', type: 'system' }
    ]
  }
];

export default opportunities;
