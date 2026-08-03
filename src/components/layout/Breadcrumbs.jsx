import { Link } from 'react-router-dom';
import useStructuredData from '../../hooks/useStructuredData';
import './Breadcrumbs.css';

const SITE_URL = 'https://www.namiautomationsolutions.com';

/**
 * Compact breadcrumb trail — renders the visible nav (small, muted, sits
 * above a page's h1) and injects matching BreadcrumbList JSON-LD. `items`
 * is `[{ label, to }]` for every step except the current page, plus a
 * final `{ label }` (no `to`) for the current page itself.
 */
export default function Breadcrumbs({ items }) {
  const trail = [{ label: 'Home', to: '/' }, ...items];

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(item.to ? { item: `${SITE_URL}${item.to === '/' ? '' : item.to}` } : {})
    }))
  });

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol>
        {trail.map((item, i) => (
          <li key={item.label}>
            {item.to && i < trail.length - 1 ? <Link to={item.to}>{item.label}</Link> : <span aria-current="page">{item.label}</span>}
            {i < trail.length - 1 && (
              <span className="breadcrumbs__sep" aria-hidden="true">
                /
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
