const leadManagementAutomation = {
  breadcrumbLabel: 'Lead Management Automation',
  eyebrow: 'Lead Management Automation',
  h1: 'Lead Management Automation for Faster, More Consistent Follow-Up',
  intro:
    'Lead management automation captures every enquiry as it arrives, evaluates how strong a fit it is, updates your CRM, assigns the right owner, and starts the appropriate follow-up — instead of leaving that work to whichever employee notices the enquiry first.',
  problems: [
    'Response quality and speed depend on who happens to see an enquiry first',
    'Leads arriving outside working hours sit untouched until someone gets to them',
    'CRM records fall out of date because updating them competes with other work',
    'There is no consistent standard for what counts as a qualified lead',
    'Good leads are lost simply because a follow-up was forgotten'
  ],
  manualTasks: [
    'Reading every enquiry as it comes in',
    'Copying contact and context details into the CRM',
    'Judging fit and urgency without a consistent standard',
    'Deciding who on the team should own each lead',
    'Writing a first follow-up message from scratch',
    'Remembering when the next follow-up is due'
  ],
  flow: [
    { label: 'Lead Capture', type: 'trigger' },
    { label: 'Qualification', type: 'ai' },
    { label: 'CRM Update', type: 'storage' },
    { label: 'Assignment', type: 'decision', branch: 'ROUTED' },
    { label: 'Follow-Up', type: 'action' }
  ],
  humanApproval: 'Sales owners confirm final priority on ambiguous or high-value leads, and every automated follow-up can be reviewed before it sends if that level of control is wanted.',
  integrations: ['HubSpot', 'Salesforce', 'Pipedrive', 'Website forms', 'Gmail & Outlook', 'WhatsApp Business', 'Slack', 'Calendly'],
  industries: ['SaaS', 'Professional Services', 'Agencies', 'Real Estate', 'Logistics', 'Healthcare'],
  process:
    'Implementation starts with mapping how leads currently arrive and get qualified today, then designing the CRM and notification logic around your actual sales process — not a generic template.',
  outcomes: [
    'Faster first response to new enquiries',
    'A consistent standard for what counts as a qualified lead',
    'Fewer leads left without a follow-up',
    'Clearer ownership across the sales team',
    'Less time spent on manual CRM data entry'
  ],
  faqs: [
    {
      question: 'Does this replace my sales team?',
      answer:
        "No. It removes the repetitive qualification and data-entry work so your team spends their time on conversations and closing, not on copying details between tools."
    },
    {
      question: 'What counts as a "qualified" lead?',
      answer:
        'We define qualification criteria together based on your actual sales process — company size, stated need, budget signals, or whatever genuinely predicts a good fit for your business.'
    },
    {
      question: 'Can it work alongside our existing CRM?',
      answer: 'Yes. NAMI is designed to work with the CRM you already use rather than asking you to migrate to a new one.'
    },
    {
      question: 'What happens to leads that are hard to classify?',
      answer: 'They are routed to a person for review rather than guessed at — the system is designed to flag uncertainty, not hide it.'
    }
  ],
  relatedCaseStudy: 'Lead Qualification & Follow-Up System',
  ctaHeading: "Let's map your lead process."
};

export default leadManagementAutomation;
