import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { openNamiAI } from '../nami-ai/namiAIEvents';
import { openStrategyCall } from '../../services/calendly';
import './Navbar.css';

const NAV_LINKS = [
  { to: '/solutions', label: 'Solutions' },
  { to: '/how-nami-works', label: 'How NAMI Works' },
  { to: '/automation-audit', label: 'Audit' },
  { to: '/systems', label: 'Systems' },
  { to: '/case-studies', label: 'Case Studies' }
];

// Node colours sampled directly from the official NAMI logo (the 3D
// violet-to-teal "N" glyph) so this small inline mark reads as the same
// brand, not just a similarly-coloured abstraction.
function BrandMark() {
  return (
    <svg className="navbar__mark" viewBox="0 0 28 28" aria-hidden="true">
      <defs>
        <linearGradient id="navbar-brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7a48f6" />
          <stop offset="100%" stopColor="#1cc0cd" />
        </linearGradient>
      </defs>
      <circle cx="14" cy="14" r="2.6" className="navbar__mark-hub" />
      <path d="M14 14L6 8M14 14L22 8M14 14L14 23" className="navbar__mark-path" />
      <circle cx="6" cy="8" r="1.7" className="navbar__mark-node navbar__mark-node--violet" />
      <circle cx="22" cy="8" r="1.7" className="navbar__mark-node navbar__mark-node--teal" />
      <circle cx="14" cy="23" r="1.7" className="navbar__mark-node navbar__mark-node--violet" />
    </svg>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [onDark, setOnDark] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sections marked data-navbar-theme="dark" (Audit preview, Final CTA,
  // Footer) flip the floating navbar to a dark-glass state while they sit
  // directly beneath it, instead of the pale surface floating disconnected
  // over dark page material.
  useEffect(() => {
    const targets = Array.from(document.querySelectorAll('[data-navbar-theme="dark"]'));
    if (targets.length === 0) {
      setOnDark(false);
      return undefined;
    }

    const states = new Map(targets.map((el) => [el, false]));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => states.set(entry.target, entry.isIntersecting));
        setOnDark(Array.from(states.values()).some(Boolean));
      },
      { rootMargin: '-72px 0px -55% 0px', threshold: 0 }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const closeMenu = () => setMenuOpen(false);
  const navLinkClass = ({ isActive }) => (isActive ? 'is-active' : '');

  return (
    <>
      {/* A fixed, always-identical texture sitting just behind the navbar
          on every route. backdrop-filter only reads as "glass" when there
          is visual variance behind it to blur — most inner pages sit on
          a flat single-tone background, so without this the blur had
          nothing to do and read as a plain tinted rectangle. This
          decouples the glass effect from whatever a given page's content
          happens to be, so it is genuinely identical everywhere. */}
      <div className="navbar__atmosphere" aria-hidden="true" />
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''} ${onDark ? 'navbar--on-dark' : ''}`}>
        <div className="container navbar__outer">
        <div className="navbar__surface">
          <div className="navbar__inner">
            <Link to="/" className="navbar__logo">
              <BrandMark />
              <span className="navbar__wordmark">
                NAMI
                <span className="navbar__descriptor">Automation Systems</span>
              </span>
            </Link>

            <nav className="navbar__nav" aria-label="Primary">
              <ul className="navbar__links">
                {NAV_LINKS.map((link) => (
                  <li key={link.to}>
                    <NavLink to={link.to} className={navLinkClass}>
                      {pathname === link.to && (
                        <motion.span
                          layoutId="navbar-active-marker"
                          className="navbar__active-marker"
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="navbar__link-label">{link.label}</span>
                    </NavLink>
                  </li>
                ))}
                <li>
                  <button type="button" onClick={openNamiAI}>
                    NamiAI
                  </button>
                </li>
              </ul>
            </nav>

            <div className="navbar__actions">
              <button
                type="button"
                className="btn btn-primary btn-sm navbar__cta"
                onClick={() => openStrategyCall('navbar')}
              >
                Book a Strategy Call
              </button>
              <button
                type="button"
                className="navbar__menu-toggle"
                aria-expanded={menuOpen}
                aria-controls="mobile-nav"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                onClick={() => setMenuOpen((open) => !open)}
              >
                <span />
                <span />
                <span />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div id="mobile-nav" className={`navbar__mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav aria-label="Mobile">
          <ul>
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <NavLink to={link.to} className={navLinkClass} onClick={closeMenu}>
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li>
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  openNamiAI();
                }}
              >
                NamiAI
              </button>
            </li>
          </ul>
        </nav>
        <div className="navbar__mobile-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              closeMenu();
              openStrategyCall('navbar-mobile');
            }}
          >
            Book a Strategy Call
          </button>
        </div>
      </div>
      </header>
    </>
  );
}
