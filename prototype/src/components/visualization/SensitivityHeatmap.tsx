import type { ReactElement } from 'react';

import { DataTable } from '@/components/studio/StudioPrimitives';
import { PrototypeActionButton } from '@/components/overlays/PrototypeActionButton';
import {
  formatMultiple,
  formatPercent,
  type SensitivityGrid,
  type UnderwritingMetrics,
} from '@/lib/underwriting';

type SensitivityHeatmapProps = {
  grid: SensitivityGrid;
  locked?: boolean;
  onUnlock?: () => void;
  onSelectCell?: (cell: {
    rowIndex: number;
    columnIndex: number;
    purchasePrice: number;
    exitCapRate: number;
    metrics: UnderwritingMetrics;
  }) => void;
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
  onSelectCell,
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
              {grid.cells[rowIndex].map((cell, colIndex) => {
                const label = `Purchase ${Math.round(price / 1_000_000)}M at ${formatPercent(grid.columns[colIndex])} exit: IRR ${formatPercent(cell.irr)}, DSCR ${formatMultiple(cell.dscr)}`;
                const className = `heatmap-cell ${heatClass(cell.irr, minIrr, maxIrr)}`;
                return onSelectCell && !locked ? (
                  <button
                    type="button"
                    key={`${rowIndex}-${colIndex}`}
                    className={className}
                    aria-label={`${label}. Open sensitivity drilldown.`}
                    onClick={() =>
                      onSelectCell({
                        rowIndex,
                        columnIndex: colIndex,
                        purchasePrice: price,
                        exitCapRate: grid.columns[colIndex],
                        metrics: cell,
                      })
                    }
                  >
                    <strong>{formatPercent(cell.irr)}</strong>
                    <span>{formatMultiple(cell.dscr)} DSCR</span>
                  </button>
                ) : (
                  <div key={`${rowIndex}-${colIndex}`} className={className} aria-label={label}>
                    <strong>{formatPercent(cell.irr)}</strong>
                    <span>{formatMultiple(cell.dscr)} DSCR</span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </figure>
      <DataTable
        caption="Sensitivity grid values (IRR and DSCR by purchase price and exit cap)"
        headers={[
          'Purchase price',
          ...grid.columns.map((cap) => `${formatPercent(cap)} exit IRR / DSCR`),
        ]}
        rows={grid.rows.map((price, rowIndex) => [
          `${Math.round(price / 1_000_000)}M`,
          ...grid.cells[rowIndex].map(
            (cell) => `${formatPercent(cell.irr)} / ${formatMultiple(cell.dscr)}`
          ),
        ])}
        getRowKey={(_row, index) => String(grid.rows[index])}
      />
      {locked ? (
        <div className="heatmap-lock-overlay">
          <p>Premium sensitivity heatmap locked</p>
          <PrototypeActionButton
            feature="Premium heatmap unlock"
            className="btn btn-primary"
            onClick={onUnlock}
          >
            Unlock preview
          </PrototypeActionButton>
        </div>
      ) : null}
    </div>
  );
}
