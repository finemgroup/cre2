import type { ReactElement } from 'react';

import { formatMultiple, formatPercent, type SensitivityGrid } from '@/lib/underwriting';

type SensitivityHeatmapProps = {
  grid: SensitivityGrid;
  locked?: boolean;
  onUnlock?: () => void;
};

function heatClass(irr: number, min: number, max: number): string {
  if (max === min) return 'heat-mid';
  const ratio = (irr - min) / (max - min);
  if (ratio >= 0.66) return 'heat-high';
  if (ratio >= 0.33) return 'heat-mid';
  return 'heat-low';
}

export function SensitivityHeatmap({
  grid,
  locked = false,
  onUnlock,
}: SensitivityHeatmapProps): ReactElement {
  const irrValues = grid.cells.flat().map((cell) => cell.irr);
  const minIrr = Math.min(...irrValues);
  const maxIrr = Math.max(...irrValues);

  return (
    <div className={locked ? 'heatmap-wrap heatmap-locked' : 'heatmap-wrap'}>
      <figure aria-labelledby="heatmap-caption">
        <figcaption id="heatmap-caption" className="sr-only">
          IRR sensitivity by purchase price row and exit cap column. Each cell lists IRR and DSCR.
        </figcaption>
        <div className="sensitivity-heatmap">
          <div className="heatmap-corner" aria-hidden="true" />
          {grid.columns.map((cap) => (
            <div key={cap} className="heatmap-col-label">
              {formatPercent(cap)} exit
            </div>
          ))}
          {grid.rows.map((price, rowIndex) => (
            <div key={price} className="heatmap-row">
              <div className="heatmap-row-label">{Math.round(price / 1_000_000)}M</div>
              {grid.cells[rowIndex].map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`heatmap-cell ${heatClass(cell.irr, minIrr, maxIrr)}`}
                  title={`IRR ${formatPercent(cell.irr)} · DSCR ${formatMultiple(cell.dscr)}`}
                >
                  <strong>{formatPercent(cell.irr)}</strong>
                  <span>{formatMultiple(cell.dscr)} DSCR</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </figure>
      {locked ? (
        <div className="heatmap-lock-overlay">
          <p>Premium sensitivity heatmap locked</p>
          <button type="button" className="btn btn-primary" onClick={onUnlock}>
            Unlock preview
          </button>
        </div>
      ) : null}
    </div>
  );
}
