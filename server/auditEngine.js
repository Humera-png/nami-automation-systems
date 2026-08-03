// Deterministic, code-based Automation Audit engine. Runs entirely inside
// this app's own backend — no external workflow service required. Given
// the same input, this always produces the same output — no network
// calls, no AI required.

const SIGNALS = [
  { key: 'manualDataEntry', keywords: ['data entry', 'manually enter', 'manual entry', 'inputting data', 'type in', 're-type', 'retype', 'keying in'] },
  { key: 'copyingData', keywords: ['copy and paste', 'copy-paste', 'copy paste', 'copying data', 'transfer data', 'move data between', 'moving data between'] },
  { key: 'spreadsheets', keywords: ['spreadsheet', 'excel', 'google sheet', 'csv file', '.csv'] },
  { key: 'emailFollowups', keywords: ['email', 'follow up', 'follow-up', 'followup', 'reminder emails', 'sending reminders'] },
  { key: 'leadManagement', keywords: ['lead', 'leads', 'prospect', 'inquiries', 'inquiry'] },
  { key: 'approvals', keywords: ['approval', 'approve', 'sign-off', 'sign off', 'signoff', 'authorize', 'authorization'] },
  { key: 'repeatedDecisions', keywords: ['decide', 'decision', 'qualify', 'qualification', 'triage', 'routing', 'route the'] },
  { key: 'reporting', keywords: ['report', 'reporting', 'dashboard', 'weekly summary', 'monthly summary'] },
  { key: 'documentProcessing', keywords: ['document', 'pdf', 'contract', 'paperwork', 'scanning documents', 'forms'] },
  { key: 'invoiceProcessing', keywords: ['invoice', 'billing', 'accounts payable', 'accounts receivable', 'payment processing'] },
  { key: 'customerOnboarding', keywords: ['onboarding', 'onboard', 'new client', 'new customer', 'welcome email'] },
  { key: 'crmUpdates', keywords: ['crm', 'salesforce', 'hubspot', 'update the crm', 'updating records'] },
  { key: 'statusChecking', keywords: ['checking status', 'status update', 'track status', 'tracking down', 'chasing'] },
  { key: 'inventory', keywords: ['inventory', 'stock level', 'warehouse', 'restock', 'restocking', 'supply levels'] },
  { key: 'scheduling', keywords: ['schedule', 'scheduling', 'calendar', 'booking', 'appointment'] },
  { key: 'notifications', keywords: ['notify', 'notification', 'alert', 'slack message', 'text message', 'sms'] },
  { key: 'humanJudgement', keywords: ['judgement', 'judgment', 'review each', 'assess', 'evaluate', 'discretion'] },
  {
    key: 'multipleTools',
    keywords: [
      'multiple systems',
      'different tools',
      'several tools',
      'various platforms',
      'disconnected',
      'switching between',
      'juggling',
      'business tools',
      'multiple tools',
      'connect our tools',
      'connecting tools'
    ]
  }
];

const REPETITIVE_PATTERN = /\b(manually|by hand|repetitive|repeated|over and over|same steps|tedious|every single time)\b/;
const FREQUENCY_PATTERN = /\b(every day|daily|each day|every week|weekly|hourly|constantly|all day|dozens|hundreds|multiple times a day|several times a day)\b/;

const SYSTEM_LIKE_SIGNALS = ['spreadsheets', 'crmUpdates', 'emailFollowups', 'invoiceProcessing', 'inventory', 'documentProcessing'];

const KNOWN_TOOLS = [
  'Salesforce',
  'HubSpot',
  'Slack',
  'Gmail',
  'Outlook',
  'QuickBooks',
  'Xero',
  'Shopify',
  'Notion',
  'Airtable',
  'Zendesk',
  'Google Sheets',
  'Excel',
  'Stripe',
  'Microsoft 365',
  'Google Workspace',
  'Trello',
  'Asana',
  'Monday.com',
  'Zoom',
  'Calendly'
];

const PRIMARY_PRIORITY = [
  'leadManagement',
  'customerOnboarding',
  'invoiceProcessing',
  'documentProcessing',
  'inventory',
  'scheduling',
  'reporting',
  'crmUpdates',
  'approvals',
  'emailFollowups',
  'statusChecking',
  'manualDataEntry'
];

const PRIMARY_META = {
  leadManagement: { title: 'Lead Management Automation Architecture', trigger: 'A new lead is captured through a web form, ad, or inbound channel.' },
  customerOnboarding: { title: 'Customer Onboarding Automation Architecture', trigger: 'A new customer signs a contract or is marked as won.' },
  invoiceProcessing: { title: 'Invoice & Billing Automation Architecture', trigger: 'A new invoice or bill is received.' },
  documentProcessing: { title: 'Document Processing Automation Architecture', trigger: 'A new document is uploaded or received by email.' },
  inventory: { title: 'Inventory & Stock Automation Architecture', trigger: 'Stock levels change or a scheduled inventory check runs.' },
  scheduling: { title: 'Scheduling & Booking Automation Architecture', trigger: 'A new booking or scheduling request is submitted.' },
  reporting: { title: 'Reporting & Insights Automation Architecture', trigger: 'A scheduled reporting interval is reached.' },
  crmUpdates: { title: 'CRM Data Automation Architecture', trigger: 'A record changes state and needs to be reflected across systems.' },
  approvals: { title: 'Approval Workflow Automation Architecture', trigger: 'A request requiring approval is submitted.' },
  emailFollowups: { title: 'Follow-Up & Communication Automation Architecture', trigger: 'A follow-up becomes due based on time elapsed or an unanswered message.' },
  statusChecking: { title: 'Status Monitoring Automation Architecture', trigger: 'A tracked item needs a status check.' },
  manualDataEntry: { title: 'Data Entry Automation Architecture', trigger: 'New data arrives that needs to be entered into a system of record.' },
  general: { title: 'Business Process Automation Architecture', trigger: 'A new request enters the process.' }
};

function detectSignals(lowerText) {
  const signals = new Set();
  for (const sig of SIGNALS) {
    if (sig.keywords.some((kw) => lowerText.includes(kw))) signals.add(sig.key);
  }
  return signals;
}

function parseTeamSize(teamSize) {
  if (!teamSize) return null;
  const matches = String(teamSize).match(/\d+/g);
  if (!matches) return null;
  return Math.max(...matches.map(Number));
}

function countSystemSignals(signals) {
  return SYSTEM_LIKE_SIGNALS.filter((key) => signals.has(key)).length;
}

function scoreAudit(signals, lowerText, teamSizeNum) {
  let score = 25;

  if (signals.has('manualDataEntry') || signals.has('copyingData') || signals.has('statusChecking') || REPETITIVE_PATTERN.test(lowerText)) {
    score += 12;
  }
  if (signals.has('manualDataEntry') || signals.has('copyingData') || signals.has('spreadsheets')) {
    score += 10;
  }
  if (signals.has('multipleTools') || countSystemSignals(signals) >= 3) {
    score += 10;
  }
  if (signals.has('emailFollowups')) {
    score += 8;
  }
  if (signals.has('approvals') || signals.has('repeatedDecisions')) {
    score += 8;
  }
  if (signals.has('reporting') || signals.has('documentProcessing')) {
    score += 8;
  }
  if (signals.has('invoiceProcessing') || signals.has('inventory') || signals.has('crmUpdates')) {
    score += 7;
  }
  if (FREQUENCY_PATTERN.test(lowerText) || (teamSizeNum && teamSizeNum >= 20)) {
    score += 7;
  }
  if (teamSizeNum && teamSizeNum >= 10) {
    score += 5;
  }

  return Math.min(100, score);
}

function scoreToLevel(score) {
  if (score >= 85) return 'Transformational';
  if (score >= 70) return 'High';
  if (score >= 50) return 'Strong';
  if (score >= 30) return 'Moderate';
  return 'Limited';
}

function pickPrimary(signals) {
  for (const key of PRIMARY_PRIORITY) {
    if (signals.has(key)) return key;
  }
  return 'general';
}

function isAiSuited(signals) {
  return (
    signals.has('documentProcessing') ||
    signals.has('reporting') ||
    signals.has('humanJudgement') ||
    signals.has('customerOnboarding') ||
    signals.has('leadManagement') ||
    signals.has('repeatedDecisions') ||
    signals.has('invoiceProcessing')
  );
}

function buildWorkflowSteps(signals, meta, aiSuited) {
  const middle = [];

  if (aiSuited) {
    middle.push({
      label: 'AI Reasoning Layer',
      type: 'AI',
      description: 'Classify the request, extract key details, and draft the next step — the work that needs judgement rather than fixed rules.'
    });
  }

  if (signals.has('approvals') || signals.has('repeatedDecisions') || signals.has('statusChecking')) {
    middle.push({
      label: 'Evaluate Against Business Rules',
      type: 'Decision',
      description: 'Check the request against your business rules to determine whether it can proceed automatically or needs a person.'
    });
  }

  if (signals.has('crmUpdates') || signals.has('invoiceProcessing') || signals.has('inventory') || signals.has('spreadsheets') || signals.has('documentProcessing')) {
    middle.push({
      label: 'Update System of Record',
      type: 'Storage',
      description: 'Write the outcome back to the system of record so every connected tool stays in sync.'
    });
  }

  if (signals.has('approvals')) {
    middle.push({
      label: 'Route for Human Approval',
      type: 'Human Approval',
      description: 'Higher-risk or exception cases are routed to a person before anything is finalised.'
    });
  }

  if (signals.has('notifications') || signals.has('emailFollowups')) {
    middle.push({
      label: 'Notify the Right People',
      type: 'Action',
      description: 'Send the relevant update, reminder, or alert to the person or channel that needs it.'
    });
  }

  if (middle.length < 2) {
    middle.push({
      label: 'Validate the Incoming Data',
      type: 'Decision',
      description: 'Confirm the data is complete and consistent with your business rules before it moves further through the system.'
    });
  }
  if (middle.length < 2) {
    middle.push({
      label: 'Log the Outcome',
      type: 'Storage',
      description: 'Record what happened for reporting and audit visibility.'
    });
  }

  const dataMovementStep =
    signals.has('manualDataEntry') || signals.has('copyingData') || signals.has('crmUpdates') || signals.has('spreadsheets')
      ? {
          label: 'Pull Context From Connected Systems',
          type: 'Data Movement',
          description: 'Gather the relevant record and its current data from every system involved, instead of a person copying it by hand.'
        }
      : {
          label: 'Gather Process Context',
          type: 'Data Movement',
          description: 'Collect the information needed to act, pulled directly from the source system.'
        };

  const steps = [
    { label: 'Process Triggered', type: 'Trigger', description: meta.trigger },
    dataMovementStep,
    ...middle.slice(0, 5),
    {
      label: 'Complete the Action',
      type: 'Action',
      description: 'Close the loop — update the record, send the result, or hand off the finished output.'
    }
  ];

  return steps.slice(0, 8).map((step, i) => ({ step: i + 1, ...step }));
}

function detectMentionedTools(rawText) {
  const lower = rawText.toLowerCase();
  return KNOWN_TOOLS.filter((tool) => lower.includes(tool.toLowerCase()));
}

function buildRecommendedSystems(signals, mentionedTools, aiSuited) {
  const systems = new Set(mentionedTools);
  if (signals.has('crmUpdates') || signals.has('leadManagement')) systems.add('CRM platform');
  if (signals.has('emailFollowups') || signals.has('notifications')) systems.add('Email / notification layer');
  if (signals.has('invoiceProcessing')) systems.add('Accounting / billing platform');
  if (signals.has('inventory')) systems.add('Inventory management system');
  if (signals.has('scheduling')) systems.add('Calendar / booking system');
  systems.add('Workflow orchestration engine');
  if (aiSuited) systems.add('AI reasoning layer');
  return Array.from(systems);
}

function buildAiRole(aiSuited, signals) {
  if (!aiSuited) {
    return 'This workflow is fully rule-based — no AI reasoning is required, which keeps it fast, predictable, and cheap to run.';
  }
  const parts = [];
  if (signals.has('documentProcessing') || signals.has('invoiceProcessing')) parts.push('reading and extracting details from unstructured documents');
  if (signals.has('leadManagement') || signals.has('customerOnboarding')) parts.push('classifying and prioritising incoming requests');
  if (signals.has('repeatedDecisions')) parts.push('making the routine judgement calls a person currently makes by hand');
  if (signals.has('reporting')) parts.push('summarising activity into a readable report');
  if (parts.length === 0) parts.push('handling the parts of this process that need context and judgement rather than fixed rules');
  return `AI is used for ${parts.join(', ')} — with a person retaining final say on anything ambiguous or high-value.`;
}

function buildHumanControlPoints(signals, humanApprovalRequired) {
  const points = [];
  if (humanApprovalRequired) points.push('Final approval on higher-risk or higher-value cases before anything is finalised.');
  if (signals.has('humanJudgement') || signals.has('repeatedDecisions')) points.push("Review of any case the automation flags as ambiguous or low-confidence.");
  if (signals.has('documentProcessing') || signals.has('invoiceProcessing')) points.push('Spot-checking a sample of AI-extracted data for accuracy.');
  if (points.length === 0) points.push("A person can review the automation's output at any time — nothing runs as an unreviewable black box.");
  return points;
}

function buildIntegrationRequirements(mentionedTools, signals) {
  const reqs = [];
  if (mentionedTools.length > 0) {
    reqs.push(`API or webhook connections to ${mentionedTools.join(', ')}.`);
  } else {
    reqs.push('API or webhook connections to whichever systems currently hold this data.');
  }
  reqs.push('Secure credential storage and authentication for every connected system.');
  if (signals.has('crmUpdates') || signals.has('invoiceProcessing') || signals.has('inventory')) {
    reqs.push('Field-level data mapping between systems so records stay consistent.');
  }
  return reqs;
}

function buildErrorHandlingRequirements(aiSuited, signals) {
  const reqs = ['Retry logic for transient failures when calling connected systems.'];
  if (aiSuited) reqs.push('Fallback to human review when AI confidence is low or the input is ambiguous.');
  if (signals.has('approvals')) reqs.push("Escalation path if an approval isn't actioned within a set time window.");
  reqs.push("Alerting if a step fails repeatedly so it doesn't fail silently.");
  return reqs;
}

const IMPACT_BY_LEVEL = {
  Limited: 'A small but real amount of manual time back each week, with low implementation complexity.',
  Moderate: 'Several hours of manual work removed each week, freeing your team to focus on higher-value tasks.',
  Strong: 'A meaningful reduction in manual work and turnaround time, with fewer errors from manual handling.',
  High: 'A significant reduction in manual work, faster turnaround, and fewer errors — this is a strong candidate for near-term automation.',
  Transformational: 'A structural change in how this process runs — most manual steps removed, faster turnaround, and a system that scales without adding headcount.'
};

function buildExpectedBusinessImpact(opportunityLevel, teamSizeNum) {
  const base = IMPACT_BY_LEVEL[opportunityLevel] || 'A reduction in manual work and fewer opportunities for human error.';
  if (teamSizeNum && teamSizeNum >= 10) {
    return `${base} At your team size, that time savings compounds across everyone touching this process.`;
  }
  return base;
}

function buildArchitectureConfidence(manualProcess, automationGoal, businessType) {
  const detailScore =
    (manualProcess.trim().length >= 80 ? 2 : manualProcess.trim().length >= 30 ? 1 : 0) +
    (automationGoal.trim().length > 0 ? 1 : 0) +
    (businessType.trim().length > 0 ? 1 : 0);
  if (detailScore >= 4) return 'high';
  if (detailScore >= 2) return 'medium';
  return 'low';
}

function buildAutomationSummary(manualProcess, automationGoal, opportunityLevel) {
  const trimmedProcess = manualProcess.trim().length > 160 ? `${manualProcess.trim().slice(0, 157)}...` : manualProcess.trim();
  const goalClause = automationGoal ? ` with the goal of ${automationGoal.toLowerCase()}` : '';
  return `Based on the process you described — "${trimmedProcess}"${goalClause} — NAMI identified a ${opportunityLevel.toLowerCase()} automation opportunity. The steps below outline where automation can remove manual work while keeping a person in control of anything that needs judgement.`;
}

function generateAuditId() {
  return `AUD-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

/**
 * Pure, deterministic audit generator — same input always produces the
 * same output. `payload` fields are expected to already be trimmed/capped
 * strings (see validateAuditPayload in validate.js). Never throws for
 * missing optional fields; only required-field enforcement happens
 * upstream in validation.
 */
export function runAuditEngine(payload) {
  const fullName = payload.fullName || '';
  const email = payload.email || '';
  const company = payload.company || '';
  const website = payload.website || '';
  const businessType = payload.businessType || '';
  const teamSize = payload.teamSize || '';
  const manualProcess = payload.manualProcess || '';
  const automationGoal = payload.automationGoal || '';

  const rawText = `${manualProcess} ${automationGoal} ${businessType}`;
  const lowerText = rawText.toLowerCase();

  const signals = detectSignals(lowerText);
  const teamSizeNum = parseTeamSize(teamSize);
  const score = scoreAudit(signals, lowerText, teamSizeNum);
  const opportunityLevel = scoreToLevel(score);

  const primaryKey = pickPrimary(signals);
  const meta = PRIMARY_META[primaryKey];

  const aiSuited = isAiSuited(signals);
  const humanApprovalRequired = signals.has('approvals') || (signals.has('repeatedDecisions') && score >= 50);

  const workflowSteps = buildWorkflowSteps(signals, meta, aiSuited);
  const workflowText = workflowSteps.map((s) => `${s.step}. ${s.label} [${s.type}] - ${s.description}`).join('\n');

  const mentionedTools = detectMentionedTools(rawText);
  const recommendedSystems = buildRecommendedSystems(signals, mentionedTools, aiSuited);
  const aiRoleText = buildAiRole(aiSuited, signals);
  const humanControlPoints = buildHumanControlPoints(signals, humanApprovalRequired);
  const integrationRequirements = buildIntegrationRequirements(mentionedTools, signals);
  const errorHandlingRequirements = buildErrorHandlingRequirements(aiSuited, signals);
  const expectedBusinessImpact = buildExpectedBusinessImpact(opportunityLevel, teamSizeNum);
  const architectureConfidence = buildArchitectureConfidence(manualProcess, automationGoal, businessType);
  const automationSummary = buildAutomationSummary(manualProcess, automationGoal, opportunityLevel);

  return {
    auditId: generateAuditId(),
    fullName,
    email,
    company,
    website,
    businessType,
    teamSize,

    architectureTitle: meta.title,
    automationSummary,
    trigger: meta.trigger,

    workflowSteps,
    workflowText,

    aiRole: aiRoleText,
    aiRequired: aiSuited,
    aiPurpose: aiRoleText,

    humanControlPoints,
    humanApprovalRequired,

    recommendedSystems,
    integrationRequirements,
    errorHandlingRequirements,
    expectedBusinessImpact,
    architectureConfidence,

    automationOpportunityScore: score,
    score,
    opportunityLevel,

    auditStatus: 'Analysed',
    status: 'Analysed',
    scoredAt: new Date().toISOString()
  };
}
