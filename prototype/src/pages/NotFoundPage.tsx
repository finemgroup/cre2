import { Link } from 'react-router-dom';
import type { ReactElement } from 'react';

export function NotFoundPage(): ReactElement {
  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Route guard</p>
        <h1>Page not found</h1>
        <p className="lede">This prototype route does not exist.</p>
      </header>
      <div className="action-row">
        <Link to="/" className="btn btn-primary">
          Return to search
        </Link>
        <Link to="/upload" className="btn btn-secondary">
          Upload documents
        </Link>
      </div>
    </section>
  );
}
