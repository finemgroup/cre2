import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import type { ComponentType } from 'react';
import { describe, expect, it } from 'vitest';

import '@/index.css';
import * as AuthorityBadgeStories from '@/stories/AuthorityBadge.stories';
import * as EmptyStateCardStories from '@/stories/EmptyStateCard.stories';
import * as GovernanceFlowsStories from '@/stories/GovernanceFlows.stories';
import * as ReportGovernanceStories from '@/stories/ReportGovernance.stories';
import * as StudioPrimitivesStories from '@/stories/StudioPrimitives.stories';

type StorySurface = 'public' | 'studio';

type ComposedStory = ComponentType;

function renderStory(Story: ComponentType, surface: StorySurface = 'public') {
  const shellClass = surface === 'studio' ? 'studio-shell' : 'shell';
  const mainClass = surface === 'studio' ? 'studio-main' : 'shell-main';

  return render(
    <MemoryRouter>
      <div className={shellClass}>
        <main className={mainClass}>
          <Story />
        </main>
      </div>
    </MemoryRouter>
  );
}

const storyGroups = [
  { name: 'AuthorityBadge', module: AuthorityBadgeStories, surface: 'public' as const },
  { name: 'EmptyStateCard', module: EmptyStateCardStories, surface: 'studio' as const },
  { name: 'GovernanceFlows', module: GovernanceFlowsStories, surface: 'studio' as const },
  { name: 'ReportGovernance', module: ReportGovernanceStories, surface: 'studio' as const },
  { name: 'StudioPrimitives', module: StudioPrimitivesStories, surface: 'studio' as const },
];

describe('Storybook compositions', () => {
  for (const group of storyGroups) {
    const stories = composeStories(group.module);

    for (const [storyName, Story] of Object.entries(stories)) {
      const ComposedStory = Story as ComposedStory;
      const storyMeta = group.module[storyName as keyof typeof group.module] as {
        play?: (context: { canvasElement: HTMLElement }) => Promise<void>;
      };
      const hasPlay = typeof storyMeta?.play === 'function';

      it(`${group.name}/${storyName} renders without basic accessibility violations`, async () => {
        const { container } = renderStory(ComposedStory, group.surface);
        expect(await axe(container)).toHaveNoViolations();
      });

      if (hasPlay) {
        it(`${group.name}/${storyName} passes Storybook play interactions`, async () => {
          const { container } = renderStory(ComposedStory, group.surface);
          await storyMeta.play!({ canvasElement: container });
        });
      }
    }
  }

  it('AuthorityBadge/AllLabels exposes readable authority labels', () => {
    const { AllLabels } = composeStories(AuthorityBadgeStories);
    renderStory(AllLabels, 'public');
    expect(screen.getByLabelText(/Authority state: Public baseline/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Authority state: Blocked/i)).toBeInTheDocument();
  });
});
