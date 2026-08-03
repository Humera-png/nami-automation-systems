const caseStudies = [
  {
    id: 'purchase-request-automation',
    title: 'Purchase Request & Approval Automation',
    category: 'Operations Automation',
    challenge:
      'Purchase requests arrived through inconsistent channels and moved between employees without a dependable approval record or clear view of what was still pending.',
    manualBefore: [
      'Employees collected request details through email or messages',
      'Information was copied into spreadsheets',
      'Approvers were contacted manually',
      'Pending requests had to be checked repeatedly',
      'Approval records were difficult to trace',
      'Requesters had to ask for status updates'
    ],
    namiSolution:
      'NAMI designed a structured request orchestration system that captures every request, validates required information, records it centrally, applies approval rules, and routes notifications and escalations automatically.',
    automated: [
      'Request capture',
      'Required-field validation',
      'Central record creation',
      'Approval routing',
      'Reminder notifications',
      'Status updates',
      'Activity history'
    ],
    humanControl: 'Managers continue to approve, reject, or request clarification for decisions that require judgement.',
    outcome: [
      'Faster approval turnaround',
      'Reduced manual follow-up',
      'Consistent approval history',
      'Clear visibility into pending requests',
      'Less repetitive data entry',
      'Better accountability across teams'
    ],
    components: ['Request Intake', 'Validation Engine', 'Approval Rules', 'Operations Record', 'Notification Layer'],
    flow: [
      { label: 'Request Intake', type: 'trigger' },
      { label: 'Validation', type: 'system' },
      { label: 'Approval Rules', type: 'decision', branch: 'APPROVED' },
      { label: 'Operations Record', type: 'storage' },
      { label: 'Notification', type: 'action' }
    ]
  },
  {
    id: 'ai-operations-intelligence',
    title: 'AI Operations Intelligence System',
    category: 'AI Operations',
    challenge:
      'Operational information was spread across multiple tools, making it difficult for teams to understand current status, dependencies, and required actions.',
    manualBefore: [
      'Employees collected updates from different systems',
      'Status information was rewritten into reports',
      'Dependencies were identified manually',
      'Teams repeatedly asked each other for progress updates',
      'Managers prepared summaries before meetings'
    ],
    namiSolution:
      'NAMI designed an AI-assisted operations layer that consolidates updates, identifies dependencies, generates structured summaries, and routes relevant actions to the correct team members.',
    automated: ['Data collection', 'Update consolidation', 'Dependency detection', 'Operational summarisation', 'Action routing', 'Repetitive status reporting'],
    humanControl: 'Managers review high-impact recommendations, confirm priorities, and make decisions that affect people, budgets, or delivery commitments.',
    outcome: [
      'Less time spent gathering updates',
      'Earlier identification of blockers',
      'Faster preparation for operational meetings',
      'Shared visibility across teams',
      'Fewer repetitive status handoffs'
    ],
    components: ['Data aggregation', 'AI reasoning layer', 'Dependency detection', 'Structured summaries', 'Action routing'],
    flow: [
      { label: 'Business Data', type: 'trigger' },
      { label: 'AI Analysis', type: 'ai' },
      { label: 'Dependency Detection', type: 'ai' },
      { label: 'Human Review', type: 'human' },
      { label: 'Action', type: 'action' }
    ]
  },
  {
    id: 'b2b-billing-operations',
    title: 'B2B Billing & Operations System',
    category: 'Custom Business Systems',
    challenge:
      'Billing, customer balances, inventory records, and reporting were difficult to manage consistently across devices and business users.',
    manualBefore: [
      'Bills were prepared through scattered records',
      'Customer balances were checked manually',
      'Payment status required repeated calculation',
      'Reports were assembled from operational data',
      'Business information was not reliably available across devices'
    ],
    namiSolution:
      'NAMI engineered a responsive business application with persistent records, billing workflows, customer ledgers, payment tracking, item management, and automated reporting.',
    automated: ['Bill calculations', 'Payment balance updates', 'Customer ledger maintenance', 'Report generation', 'Record synchronisation', 'Operational data retrieval'],
    humanControl: 'Staff remain responsible for confirming transactions, correcting exceptional records, and approving final business decisions.',
    outcome: [
      'Faster bill creation',
      'More accurate payment tracking',
      'Operational data available across devices',
      'Reports generated without manual assembly',
      'Reduced spreadsheet dependence',
      'More reliable customer records'
    ],
    components: ['Responsive operational interface', 'Secure API layer', 'Persistent database', 'Billing workflow', 'Customer ledger', 'Reporting engine'],
    flow: [
      { label: 'Business Operations', type: 'trigger' },
      { label: 'Application Interface', type: 'system' },
      { label: 'API', type: 'system' },
      { label: 'Persistent Database', type: 'storage' },
      { label: 'Reporting', type: 'action' }
    ]
  },
  {
    id: 'lead-qualification-followup',
    title: 'Lead Qualification & Follow-Up System',
    category: 'Revenue Operations',
    blueprint: true,
    challenge:
      'New enquiries arrived through website forms and inboxes, but slow manual qualification caused inconsistent responses and lost follow-up opportunities.',
    manualBefore: [
      'Employees read each enquiry manually',
      'Details were copied into the CRM by hand',
      'Fit and urgency were judged inconsistently',
      'Ownership was assigned informally',
      'Follow-ups were easy to forget'
    ],
    namiSolution:
      'NAMI designed a lead operations system that captures every enquiry, evaluates fit and urgency, updates the CRM, assigns ownership, and creates personalised follow-up actions.',
    automated: ['Enquiry capture', 'Qualification scoring', 'CRM record creation', 'Ownership assignment', 'Follow-up sequencing'],
    humanControl: 'Sales owners confirm final priority and handle any enquiry flagged as unclear or high-value.',
    outcome: ['Faster initial response', 'Consistent qualification', 'Fewer forgotten leads', 'Clear sales ownership'],
    components: ['Multi-channel lead intake', 'Qualification logic', 'CRM synchronisation', 'Ownership routing', 'Follow-up orchestration'],
    learnMore: { label: 'More on lead management automation', to: '/lead-management-automation' },
    flow: [
      { label: 'Lead Capture', type: 'trigger' },
      { label: 'Qualification', type: 'ai' },
      { label: 'CRM Update', type: 'storage' },
      { label: 'Assignment', type: 'decision', branch: 'ROUTED' },
      { label: 'Follow-Up', type: 'action' }
    ]
  },
  {
    id: 'invoice-processing-review',
    title: 'Invoice Processing & Review Automation',
    category: 'Document Operations',
    blueprint: true,
    challenge: 'Teams manually extracted invoice details, matched them against internal records, and chased approvals before payment processing.',
    manualBefore: [
      'Employees opened each invoice manually',
      'Key details were retyped into records',
      'Figures were checked against internal data by hand',
      'Mismatches were found only after manual comparison',
      'Approvers were chased individually'
    ],
    namiSolution:
      'NAMI designed a document-processing system that reads incoming invoices, extracts structured information, validates key fields, detects mismatches, and routes exceptions for human review.',
    automated: ['Invoice intake', 'Data extraction', 'Field validation', 'Record matching', 'Exception flagging'],
    humanControl: 'A person reviews every flagged mismatch and gives final approval before payment.',
    outcome: ['Reduced manual data entry', 'Faster exception detection', 'Consistent review process', 'Stronger approval visibility'],
    components: ['Document intake', 'Data extraction', 'Validation rules', 'Record matching', 'Exception handling', 'Approval workflow'],
    learnMore: { label: 'More on document processing automation', to: '/document-processing-automation' },
    flow: [
      { label: 'Invoice Received', type: 'trigger' },
      { label: 'Data Extraction', type: 'ai' },
      { label: 'Validation', type: 'system' },
      { label: 'Match Check', type: 'decision', branch: 'FLAGGED' },
      { label: 'Human Review', type: 'human' },
      { label: 'Approval', type: 'action' }
    ]
  },
  {
    id: 'inventory-monitoring-replenishment',
    title: 'Inventory Monitoring & Replenishment Alerts',
    category: 'Supply Operations',
    blueprint: true,
    challenge: 'Stock levels were checked manually, and low-stock situations were often discovered only after operations or sales were affected.',
    manualBefore: [
      'Staff physically or manually checked stock levels',
      'Low-stock items were often noticed too late',
      'Replenishment decisions relied on memory or spreadsheets',
      'Different people tracked different product lines inconsistently'
    ],
    namiSolution:
      'NAMI designed an inventory monitoring system that evaluates stock levels against configurable thresholds, identifies at-risk items, and sends actionable replenishment alerts to the responsible manager.',
    automated: ['Inventory data sync', 'Threshold evaluation', 'Risk detection', 'Manager alerting'],
    humanControl: 'The responsible manager reviews each alert and makes the final replenishment decision.',
    outcome: ['Earlier low-stock awareness', 'Reduced manual checking', 'Clear responsibility for action', 'More dependable inventory planning'],
    components: ['Inventory synchronisation', 'Threshold rules', 'Stock-risk detection', 'Manager notification', 'Replenishment tracking'],
    flow: [
      { label: 'Inventory Data', type: 'trigger' },
      { label: 'Threshold Check', type: 'decision', branch: 'AT RISK' },
      { label: 'Risk Detection', type: 'ai' },
      { label: 'Manager Alert', type: 'action' },
      { label: 'Replenishment Action', type: 'action' }
    ]
  }
];

export default caseStudies;
