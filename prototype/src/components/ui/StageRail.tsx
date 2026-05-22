import type { ReactElement } from 'react';

type StageRailProps = {
  stages: string[];
  activeIndex: number;
};

export function StageRail({ stages, activeIndex }: StageRailProps): ReactElement {
  return (
    <nav className="stage-rail" aria-label="Workflow stages">
      <ol>
        {stages.map((stage, index) => (
          <li
            key={stage}
            className={index === activeIndex ? 'stage active' : index < activeIndex ? 'stage done' : 'stage'}
            aria-current={index === activeIndex ? 'step' : undefined}
          >
            <span className="stage-index">{index + 1}</span>
            <span className="stage-label">{stage}</span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
