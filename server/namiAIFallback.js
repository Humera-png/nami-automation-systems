// Deterministic, keyword-based fallback for NamiAI when Gemini is
// unavailable (unconfigured, timed out, rate-limited, or erroring). Never
// a dead-end "try again later" — every reply identifies a likely process
// category, gives one concrete automation direction, and asks one
// relevant follow-up question, same as a human consultant would open a
// discovery conversation.

const INTENT_CATEGORIES = [
  {
    label: 'Lead follow-ups',
    keywords: ['follow up', 'follow-up', 'followup', 'reminder', 'nurture'],
    reply:
      "Lead follow-ups are often a strong automation opportunity. A NAMI system could capture each enquiry, qualify it, update your CRM, assign the correct owner, and schedule personalised follow-ups so no lead is forgotten. How are leads currently arriving — through your website, email, advertisements, or multiple channels?"
  },
  {
    label: 'Lead qualification',
    keywords: ['qualify', 'qualification', 'lead scoring', 'sales lead', 'triage lead'],
    reply:
      "Lead qualification is a common place to remove manual work. A NAMI system could evaluate each enquiry's fit and urgency automatically, route the good-fit leads to the right person, and keep the rest logged for later. What information do you currently use to decide whether a lead is worth pursuing?"
  },
  {
    label: 'Invoices',
    keywords: ['invoice', 'billing', 'accounts payable', 'accounts receivable'],
    reply:
      "Invoice handling is a strong automation candidate. A NAMI system could read incoming invoices, extract the key details, validate them against your records, and only route exceptions to a person. Roughly how many invoices does your team process in a typical week?"
  },
  {
    label: 'Document processing',
    keywords: ['document', 'pdf', 'contract', 'paperwork', 'scanning'],
    reply:
      "Document-heavy processes are one of the clearest automation wins. A NAMI system could read incoming documents, extract the relevant fields, and only involve a person for the cases that genuinely need judgement. What kind of documents are you currently handling manually?"
  },
  {
    label: 'Customer support',
    keywords: ['customer support', 'support ticket', 'helpdesk', 'customer service', 'support inbox'],
    reply:
      "Support workloads often have a lot of repeatable structure underneath them. A NAMI system could triage incoming requests, draft first responses, and escalate anything that needs a real person's judgement. What's the most common type of request your support team handles?"
  },
  {
    label: 'Approvals',
    keywords: ['approval', 'approve', 'sign-off', 'sign off', 'authoris', 'authoriz'],
    reply:
      "Approval workflows are a natural fit for automation. A NAMI system could route requests automatically, apply your business rules, and only pause for a person on higher-risk or exception cases. What typically causes an approval to get delayed today?"
  },
  {
    label: 'Inventory',
    keywords: ['inventory', 'stock level', 'warehouse', 'restock'],
    reply:
      "Inventory monitoring is a good automation opportunity. A NAMI system could track stock levels against thresholds you set and alert the right person before a shortage actually affects operations. How are stock levels checked today — manually, through a spreadsheet, or another system?"
  },
  {
    label: 'Reporting',
    keywords: ['report', 'reporting', 'dashboard', 'weekly summary', 'monthly summary'],
    reply:
      "Recurring reporting is one of the easiest processes to automate. A NAMI system could pull the data automatically, assemble the report on a schedule, and deliver it wherever your team already looks. What does putting one of these reports together currently involve?"
  },
  {
    label: 'Data entry',
    keywords: ['data entry', 'manually enter', 'manual entry', 'typing in', 'inputting data'],
    reply:
      "Manual data entry is exactly the kind of repetitive work automation removes well. A NAMI system could pull the data directly from its source and enter it wherever it needs to live, with a person only reviewing exceptions. Where is this data coming from, and where does it need to end up?"
  },
  {
    label: 'CRM updates',
    keywords: ['crm', 'salesforce', 'hubspot', 'updating records'],
    reply:
      "Keeping a CRM up to date manually is a common source of lost time. A NAMI system could update records automatically as activity happens elsewhere, so the CRM stays accurate without someone re-entering it. Which CRM are you using, and what usually falls out of date first?"
  },
  {
    label: 'Email operations',
    keywords: ['email', 'inbox', 'mailbox'],
    reply:
      "High email volume is a strong automation candidate. A NAMI system could read incoming messages, classify what they need, draft or send routine responses, and flag anything that genuinely needs a person. What kind of emails take up the most time for your team?"
  },
  {
    label: 'Onboarding',
    keywords: ['onboarding', 'onboard', 'new client', 'new customer', 'new hire'],
    reply:
      "Onboarding is a process that usually has clear, repeatable steps underneath it. A NAMI system could trigger every step automatically — accounts, documents, welcome messages — while keeping a person involved wherever personal judgement matters. What does onboarding currently involve, step by step?"
  },
  {
    label: 'Scheduling',
    keywords: ['schedule', 'scheduling', 'calendar', 'booking', 'appointment'],
    reply:
      "Scheduling and booking coordination is a well-suited automation target. A NAMI system could handle availability, confirmations, and reminders automatically, so back-and-forth emails stop being necessary. How is scheduling handled for your team today?"
  },
  {
    label: 'Internal status updates',
    keywords: ['status update', 'checking status', 'status check', 'progress update'],
    reply:
      "Chasing internal status updates by hand is a very automatable pattern. A NAMI system could pull current status directly from wherever the work actually happens and share it automatically, without anyone needing to ask. Who usually needs these updates, and how do they get them today?"
  }
];

/**
 * Returns `{ reply, identifiedProcess, showStrategyCall }` — never null,
 * never a dead-end "try again" message. `history` is the prior
 * conversation turns (not including `message`), used only to decide
 * whether this is an early or later exchange (a category match on a
 * later turn is treated as more "earned" and surfaces the strategy-call
 * CTA; a first-turn match just asks the follow-up question).
 */
export function getDeterministicFallback(message, history = []) {
  const lower = message.toLowerCase();
  const matched = INTENT_CATEGORIES.find((cat) => cat.keywords.some((kw) => lower.includes(kw)));
  const priorUserTurns = history.filter((turn) => turn.role === 'user').length;

  if (matched) {
    return {
      reply: matched.reply,
      identifiedProcess: matched.label,
      showStrategyCall: priorUserTurns >= 1
    };
  }

  if (message.trim().length > 12) {
    return {
      reply:
        "That sounds like it could have real automation potential. To point you in the right direction — is this mostly about moving data between systems, making a decision or approval, communicating with customers, or something else?",
      identifiedProcess: null,
      showStrategyCall: false
    };
  }

  return {
    reply:
      "Tell me a bit more about the process — what happens first, who's involved, and what usually slows it down? That'll help me point you toward where automation would help most.",
    identifiedProcess: null,
    showStrategyCall: false
  };
}
