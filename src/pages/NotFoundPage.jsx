import { Link } from 'react-router-dom';
import PageTransition from '../components/motion/PageTransition';
import usePageMeta from '../hooks/usePageMeta';

export default function NotFoundPage() {
  usePageMeta('Page Not Found', undefined);

  return (
    <PageTransition>
      <section className="not-found">
        <div className="container">
          <p className="eyebrow">404</p>
          <h1>This page doesn&apos;t exist.</h1>
          <p>The route you followed isn&apos;t part of the NAMI site.</p>
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
        </div>
      </section>
    </PageTransition>
  );
}
