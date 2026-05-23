import type { Preview } from '@storybook/react';
import { MemoryRouter } from 'react-router-dom';

import '../src/index.css';

const preview: Preview = {
  parameters: {
    layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
  },
  decorators: [
    (Story, context) => {
      const surface = context.parameters.surface ?? 'public';
      const initialEntries = context.parameters.initialEntries ?? ['/'];

      if (surface === 'studio') {
        return (
          <MemoryRouter initialEntries={initialEntries}>
            <div className="studio-shell">
              <main className="studio-main" style={{ padding: '1.5rem', minHeight: '100vh' }}>
                <Story />
              </main>
            </div>
          </MemoryRouter>
        );
      }

      return (
        <MemoryRouter initialEntries={initialEntries}>
          <div className="shell">
            <main className="shell-main" style={{ padding: '1.5rem', minHeight: '100vh' }}>
              <Story />
            </main>
          </div>
        </MemoryRouter>
      );
    },
  ],
};

export default preview;
