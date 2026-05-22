import { useState, type ReactElement } from 'react';

import { SophexSheet } from '@/components/motion/SophexSheet';
import { AuthorityBadge } from '@/components/ui/AuthorityBadge';
import { mockComps } from '@/data/mock';

export function CompsPage(): ReactElement {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = mockComps.find((c) => c.id === selectedId);

  return (
    <section className="page">
      <header className="page-header">
        <p className="eyebrow">Comp comparison</p>
        <h1>Side-by-side comp dashboard</h1>
        <p className="lede">Permission-filtered comps with authority labels and blocked rows omitted from export.</p>
      </header>

      <div className="table-wrap">
        <table>
          <caption>Sample comp set for 1200 Commerce St</caption>
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
                  <AuthorityBadge label={comp.authority === 'blocked' ? 'blocked' : comp.authority} />
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setSelectedId(comp.id)}
                    disabled={comp.authority === 'blocked'}
                  >
                    Inspect
                  </button>
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
            <AuthorityBadge label={selected.authority === 'blocked' ? 'blocked' : selected.authority} />
          </>
        ) : null}
      </SophexSheet>
    </section>
  );
}
