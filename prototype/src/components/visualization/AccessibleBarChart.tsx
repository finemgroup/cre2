import type { CSSProperties, ReactElement } from 'react';

import { DataTable } from '@/components/studio/StudioPrimitives';

export type BarChartItem = {
  id: string;
  label: string;
  value: string;
  ratio: number;
};

type AccessibleBarChartProps = {
  title: string;
  caption: string;
  items: BarChartItem[];
  tableHeaders?: [string, string];
};

export function AccessibleBarChart({
  title,
  caption,
  items,
  tableHeaders = ['Scenario', 'Value'],
}: AccessibleBarChartProps): ReactElement {
  const captionId = `${title.toLowerCase().replace(/[^a-z]+/g, '-')}-caption`;
  const summary = items.map((item) => `${item.label} ${item.value}`).join(', ');

  return (
    <figure aria-labelledby={captionId}>
      <figcaption id={captionId}>{caption}</figcaption>
      <div
        className="bar-chart vertical-bars"
        role="img"
        aria-label={`${title}: ${summary}`}
      >
        {items.map((item) => (
          <div key={item.id}>
            <span>{item.label}</span>
            <div aria-hidden="true">
              <span
                className="chart-bar-fill"
                style={{ height: `${Math.round(item.ratio * 100)}%` } as CSSProperties}
              />
            </div>
            <strong>{item.value}</strong>
          </div>
        ))}
      </div>
      <DataTable
        caption={`${title} values`}
        headers={tableHeaders}
        rows={items.map((item) => [item.label, item.value])}
        getRowKey={(_row, index) => items[index].id}
      />
    </figure>
  );
}
