import { Link } from 'react-router-dom';
import { openStrategyCall } from '../../services/calendly';
import './Footer.css';

const SOLUTIONS_LINKS = [
  { to: '/solutions', label: 'Solutions' },
  { to: '/systems', label: 'Systems' },
  { to: '/automation-audit', label: 'Automation Audit' }
];

const COMPANY_LINKS = [
  { to: '/case-studies', label: 'Case Studies' },
  { to: '/how-nami-works', label: 'How NAMI Works' },
  { to: '/about', label: 'About' }
];

const CONTACT_EMAIL = 'humerashaikh889@gmail.com';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" data-navbar-theme="dark">
      <div className="container footer__cta">
        <div>
          <p className="footer__cta-heading">Ready to automate your operations?</p>
          <p className="footer__cta-copy">Book a free 30-minute Automation Strategy Call.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => openStrategyCall('footer')}>
          Book Now
        </button>
      </div>

      <div className="container footer__grid">
        <div className="footer__col footer__col--brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark" aria-hidden="true" />
            NAMI
          </Link>
          <p className="footer__tagline-lead">AI Automation Systems</p>
          <p className="footer__description">Engineering intelligent workflows for modern businesses.</p>
        </div>

        <nav className="footer__col" aria-label="Solutions">
          <p className="footer__col-label">Solutions</p>
          <ul>
            {SOLUTIONS_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Company">
          <p className="footer__col-label">Company</p>
          <ul>
            {COMPANY_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="footer__col" aria-label="Contact">
          <p className="footer__col-label">Contact</p>
          <ul>
            <li>
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </li>
            <li>
              <Link to="/contact">Email Us</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="container footer__bottom">
        <p>© {year} NAMI Automation Systems.</p>
        <p className="footer__tagline">Built around how work actually moves.</p>
      </div>
    </footer>
  );
}
