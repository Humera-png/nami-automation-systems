const documentProcessingAutomation = {
  breadcrumbLabel: 'Document Processing Automation',
  eyebrow: 'Document Processing Automation',
  h1: 'Document Processing Automation for Invoices, Contracts, and Forms',
  intro:
    'Document processing automation reads incoming documents — invoices, contracts, forms, receipts — extracts the information that matters, checks it against your records, and only brings a person in for the exceptions that genuinely need judgement.',
  problems: [
    'Employees spend hours a week retyping details from documents into other systems',
    'Mismatches between a document and internal records are found late, or not at all',
    'Approvals get delayed because someone has to manually chase the right person',
    'Document volume grows faster than the team available to process it',
    'There is no reliable record of what was received, when, or who actioned it'
  ],
  manualTasks: [
    'Opening and reading each document individually',
    'Retyping key figures and details into spreadsheets or software',
    'Manually comparing figures against internal records',
    'Chasing colleagues for approval one at a time',
    'Filing or organising documents after the fact'
  ],
  flow: [
    { label: 'Document Received', type: 'trigger' },
    { label: 'Data Extraction', type: 'ai' },
    { label: 'Validation', type: 'system' },
    { label: 'Match Check', type: 'decision', branch: 'FLAGGED' },
    { label: 'Human Review', type: 'human' },
    { label: 'Approval', type: 'action' }
  ],
  humanApproval:
    'A person reviews every mismatch, unusual figure, or low-confidence extraction the system flags, and gives final approval before anything is processed for payment or action.',
  integrations: ['QuickBooks', 'Xero', 'Google Drive', 'Microsoft 365', 'Gmail & Outlook', 'Slack', 'Custom internal databases'],
  industries: ['Professional Services', 'Logistics', 'Manufacturing', 'Real Estate', 'Finance', 'Agencies'],
  process:
    'We start by reviewing a sample of real documents your team handles today to understand their structure and variation, then build extraction and validation rules around what actually shows up — not an idealised example.',
  outcomes: [
    'Less time spent on manual data entry',
    'Mismatches and exceptions caught earlier',
    'A consistent review process instead of an ad hoc one',
    'Clearer visibility into what is pending approval and why'
  ],
  faqs: [
    {
      question: 'What document types can this handle?',
      answer:
        'Most structured and semi-structured business documents — invoices, purchase orders, contracts, receipts, and forms are the most common. We confirm feasibility against real examples before building anything.'
    },
    {
      question: 'What happens if the system misreads a document?',
      answer: 'Low-confidence extractions are flagged for human review rather than processed automatically — the system is designed to surface uncertainty, not guess past it.'
    },
    {
      question: 'Do you replace our accounting software?',
      answer: 'No. NAMI is designed to feed structured data into the accounting or record-keeping software you already use.'
    },
    {
      question: 'How long does a document processing system take to build?',
      answer: 'It depends on document variety and the systems it needs to connect to — most projects move from discovery to a working system within a few weeks.'
    }
  ],
  relatedCaseStudy: 'Invoice Processing & Review Automation',
  ctaHeading: "Let's look at your document workload."
};

export default documentProcessingAutomation;
