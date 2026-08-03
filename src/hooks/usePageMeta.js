import { useEffect } from 'react';

const SITE_TITLE = 'NAMI';

/** Sets document.title and the meta-description tag per route — needed
 * now that the site is multi-page rather than a single static page. */
export default function usePageMeta(title, description) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_TITLE}` : `AI Automation & Workflow Systems | ${SITE_TITLE}`;

    if (description) {
      let tag = document.querySelector('meta[name="description"]');
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('name', 'description');
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', description);
    }
  }, [title, description]);
}
