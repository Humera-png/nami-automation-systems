const REQUEST_TIMEOUT_MS = 20000;

function devError(...args) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[NamiAutomationSolutions/contactService]', ...args);
  }
}

/**
 * Submits the Contact form to the site's own /api/contact endpoint, which
 * sends the inquiry via Resend server-side (the API key never reaches the
 * browser). Throws an Error with a `.code` on any failure (TIMEOUT |
 * NETWORK_ERROR | PARSE_ERROR | VALIDATION_ERROR | BACKEND_ERROR).
 */
export async function submitContactForm(formValues) {
  const payload = {
    fullName: formValues.fullName ?? '',
    email: formValues.email ?? '',
    company: formValues.company ?? '',
    phone: formValues.phone ?? '',
    website: formValues.website ?? '',
    industry: formValues.industry ?? '',
    companySize: formValues.companySize ?? '',
    currentTools: formValues.currentTools ?? '',
    service: formValues.service ?? '',
    budget: formValues.budget ?? '',
    timeline: formValues.timeline ?? '',
    message: formValues.message ?? '',
    sourcePage: typeof window !== 'undefined' ? window.location.pathname : ''
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      devError('Request timed out after', REQUEST_TIMEOUT_MS, 'ms.');
      const error = new Error('The request timed out.');
      error.code = 'TIMEOUT';
      throw error;
    }
    devError('Network error contacting /api/contact.', err);
    const error = new Error('Network error sending your message.');
    error.code = 'NETWORK_ERROR';
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    devError('Contact endpoint returned a non-JSON response.', response.status, err);
    const error = new Error('The server returned an unexpected response.');
    error.code = 'PARSE_ERROR';
    throw error;
  }

  if (!response.ok || data?.success === false) {
    devError('Contact endpoint responded with an error.', response.status, data);
    const error = new Error(data?.message || 'Something went wrong sending your message.');
    error.code = data?.code || 'BACKEND_ERROR';
    throw error;
  }

  return data;
}
