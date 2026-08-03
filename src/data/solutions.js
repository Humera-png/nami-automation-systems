// `flow` is a compact node topology (type drives WorkflowNode styling)
// rendered as a small automation architecture on each solution card.

const solutions = [
  {
    id: 'lead-sales-automation',
    name: 'Lead & Sales Automation',
    problem: 'Capture, research, qualify, route, and follow up with leads automatically.',
    outcome: 'Every lead is captured, researched, and routed the moment it arrives.',
    flow: [
      { label: 'Lead', type: 'trigger' },
      { label: 'Research', type: 'ai' },
      { label: 'Qualify?', type: 'decision', branch: 'YES' },
      { label: 'Route', type: 'action' }
    ]
  },
  {
    id: 'client-onboarding',
    name: 'Client Onboarding',
    problem: 'Automate forms, document collection, internal tasks, welcome emails, and handoffs.',
    outcome: 'New clients move from signed to set up without a manual checklist.',
    flow: [
      { label: 'Signed', type: 'trigger' },
      { label: 'Collect Docs', type: 'system' },
      { label: 'Create Tasks', type: 'action' },
      { label: 'Welcome Email', type: 'action' }
    ]
  },
  {
    id: 'ai-powered-workflows',
    name: 'AI-Powered Workflows',
    problem: 'Use AI where reasoning, classification, summarisation, or personalisation provides real value.',
    outcome: 'AI handles the judgment step, then hands off to the rest of the workflow.',
    flow: [
      { label: 'Input', type: 'trigger' },
      { label: 'Classify', type: 'ai' },
      { label: 'Summarise', type: 'ai' },
      { label: 'Handoff', type: 'action' }
    ]
  },
  {
    id: 'operations-automation',
    name: 'Operations Automation',
    problem: 'Connect internal tools, approvals, notifications, data movement, and repetitive processes.',
    outcome: 'Tools stay connected and the right person is notified automatically.',
    flow: [
      { label: 'Event', type: 'trigger' },
      { label: 'Approval', type: 'system' },
      { label: 'Notify', type: 'action' }
    ]
  },
  {
    id: 'reporting-data-workflows',
    name: 'Reporting & Data Workflows',
    problem: 'Automatically collect, organise, transform, and deliver business information.',
    outcome: 'Reports assemble and deliver themselves on schedule.',
    flow: [
      { label: 'Schedule', type: 'trigger' },
      { label: 'Collect', type: 'ai' },
      { label: 'Transform', type: 'system' },
      { label: 'Deliver', type: 'action' }
    ]
  }
];

export default solutions;
