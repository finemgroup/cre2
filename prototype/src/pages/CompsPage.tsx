import { useState, type ReactElement } from 'react';
import { Link, useParams } from 'react-router-dom';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { mockComps } from '@/data/mock';
import { getPropertyRecord } from '@/lib/workflow-identity';

export function CompsPage(): ReactElement {
  const { id } = useParams();
  const property = getPropertyRecord(id);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockComps.find((comp) => comp.id === selectedId);

  if (!property) {
    return (
      <section className="page">
        <header className="page-header">
          <p className="eyebrow">Route guard</p>
          <h1>Comp comparison unavailable</h1>
          <p className="lede">
            Select a sample property first. Global comp views require an active subject property id.
          </p>
        </header>
        <Link to="/" className="btn btn-primary">
          Return to search
        </Link>
      </section>
    );
  }

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Comp comparison</p>
        <h1>Side-by-side comp dashboard</h1>
        <p className="lede">
          Permission-filtered comps for {property.address} with authority labels and blocked rows
          omitted from export.
        </p>
      </header>

      <div className="table-wrap">
        <table>
          <caption>Sample comp set for {property.address}</caption>
          <thead>
            <tr>
              <th scope="col">Comp</th>
              <th scope="col">Distance</th>
              <th scope="col">Cap rate</th>
              <th scope="col">Authority</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockComps.map((comp) => (
              <tr key={comp.id} className={selectedId === comp.id ? 'row-selected' : undefined}>
                <td>{comp.name}</td>
                <td>{comp.distanceMi} mi</td>
                <td>{comp.capRate}</td>
                <td>
                  <AuthorityBadge
                    label={comp.authority === 'blocked' ? 'blocked' : comp.authority}
                  />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedId(comp.id)}
                    disabled={comp.authority === 'blocked'}
                    aria-describedby={
                      comp.authority === 'blocked' ? `${comp.id}-blocked-reason` : undefined
                    }
                  >
                    Inspect
                  </button>
                  {comp.authority === 'blocked' ? (
                    <span id={`${comp.id}-blocked-reason`} className="sr-only">
                      Omitted from public comparison because source rights block inspection.
                    </span>
                  ) : null}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SophexSheet
        isOpen={Boolean(selected)}
        label={selected ? `Comp detail — ${selected.name}` : 'Comp detail'}
        onClose={() => setSelectedId(null)}
      >
        {selected ? (
          <>
            <p>{selected.note ?? 'Permitted comp detail for prototype viewer.'}</p>
            <AuthorityBadge
              label={selected.authority === 'blocked' ? 'blocked' : selected.authority}
            />
          </>
        ) : null}
      </SophexSheet>
      <div className="action-row">
        <Link to={`/report/${property.id}`} className="btn btn-primary">
          Preview report for {property.address}
        </Link>
      </div>
    </section>
  );
}
