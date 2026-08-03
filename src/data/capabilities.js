// System Capabilities — grouped, asymmetric taxonomy replacing the old
// flat six-card solutions grid. Each capability is broken into the four
// layers a buyer actually needs to see (problem/manual work/system/
// outcome), plus a compact before-vs-with-NAMI step comparison. `flow`
// groups render as a miniature connected workflow; `connections` renders
// as a chip cloud instead, since integrations aren't a sequence.

const capabilities = [
  {
    id: 'lead-operations',
    name: 'Lead Capture & Qualification Automation',
    size: 'large',
    problem: 'New enquiries arrive through different channels and response quality depends on who notices them first.',
    manualWork: 'Employees repeatedly read enquiries, copy details into the CRM, judge lead quality, assign ownership, and remember when to follow up.',
    system:
      'NAMI captures every enquiry, structures the information, evaluates qualification criteria, updates the CRM, assigns the correct owner, and initiates the appropriate follow-up sequence.',
    outcomes: ['Faster responses', 'Fewer forgotten leads', 'Consistent qualification', 'Clear sales ownership', 'Reduced CRM data entry'],
    before: ['Form received', 'Employee reads it', 'Copies details', 'Checks criteria', 'Updates CRM', 'Assigns salesperson', 'Sets reminder'],
    after: ['Form received', 'Information structured', 'Lead evaluated', 'CRM updated', 'Owner assigned', 'Follow-up prepared', 'Exceptions reviewed'],
    learnMore: { label: 'More on lead management automation', to: '/lead-management-automation' },
    flow: [
      { label: 'Capture', type: 'trigger' },
      { label: 'Qualification', type: 'ai' },
      { label: 'CRM Updates', type: 'system' },
      { label: 'Follow-Up Orchestration', type: 'action' }
    ]
  },
  {
    id: 'ai-workflows',
    name: 'AI Workflow Engineering',
    size: 'large',
    problem: 'Teams spend time reading, classifying, summarising, and routing repetitive information before useful work can begin.',
    manualWork: 'Employees review emails or documents, identify the subject, extract context, prepare summaries, draft replies, and decide who should handle the next action.',
    system:
      'NAMI places AI reasoning inside a controlled workflow to classify information, extract context, generate structured summaries, prepare drafts, and route the result for human review or automated action.',
    outcomes: [
      'Faster information processing',
      'More consistent classification',
      'Reduced repetitive reading',
      'Human review focused on exceptions',
      'Quicker operational decisions'
    ],
    before: ['Message received', 'Employee reads it', 'Identifies subject', 'Extracts context', 'Drafts reply', 'Decides next action'],
    after: ['Message received', 'AI classifies & extracts context', 'Summary generated', 'Draft prepared', 'Routed for review or action'],
    learnMore: { label: 'More on document processing automation', to: '/document-processing-automation' },
    flow: [
      { label: 'Classification', type: 'ai' },
      { label: 'Context Analysis', type: 'ai' },
      { label: 'Summarisation', type: 'ai' },
      { label: 'Draft Generation', type: 'ai' }
    ]
  },
  {
    id: 'internal-operations',
    name: 'Internal Process Automation',
    size: 'small',
    problem: 'Approvals, status checks, document handling, and internal handoffs are spread across email, spreadsheets, messages, and memory.',
    manualWork: 'Employees repeatedly request updates, copy information between tools, remind approvers, rename or organise documents, and prepare status reports.',
    system:
      'NAMI creates structured workflows that capture requests, validate data, route approvals, update records, send reminders, and surface exceptions to the appropriate person.',
    outcomes: ['Faster approvals', 'Fewer missed handoffs', 'Less status chasing', 'Consistent process records', 'Better accountability'],
    before: ['Request submitted', 'Employee checks details', 'Contacts approver', 'Waits', 'Chases update', 'Updates record manually'],
    after: ['Request submitted', 'Validated automatically', 'Routed for approval', 'Record updated', 'Reminders sent', 'Exceptions flagged'],
    flow: [
      { label: 'Approvals', type: 'human' },
      { label: 'Data Synchronisation', type: 'system' },
      { label: 'Status Monitoring', type: 'system' },
      { label: 'Document Processing', type: 'ai' }
    ]
  },
  {
    id: 'system-connections',
    name: 'Business System Integration',
    size: 'small',
    problem: 'Business information exists across disconnected software, forcing teams to maintain the same data in multiple places.',
    manualWork: 'Employees copy customer details, update spreadsheets, enter information into CRMs, prepare reports, and check whether systems contain matching records.',
    system:
      'NAMI builds the connective layer between websites, email, spreadsheets, CRMs, databases, APIs, and internal software so information moves according to defined business rules.',
    outcomes: ['Reduced duplicate data entry', 'More accurate records', 'Faster information flow', 'Fewer system inconsistencies', 'One connected operating process'],
    before: ['Detail entered once', 'Copied into CRM manually', 'Re-entered into spreadsheet', 'Checked for mismatches'],
    after: ['Detail entered once', 'Synced across CRM & spreadsheet', 'Reporting updated automatically', 'Mismatches flagged automatically'],
    connections: ['Email', 'Spreadsheets', 'CRM', 'Databases', 'APIs', 'Internal Tools']
  }
];

export default capabilities;
