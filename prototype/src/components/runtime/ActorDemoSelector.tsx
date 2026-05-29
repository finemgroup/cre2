import { useState, type ReactElement } from 'react';

import {
  actorDemoOptions,
  readStoredActorDemoKey,
  storeActorDemoKey,
  type ActorDemoKey,
} from '@/lib/runtime/actor-demo-context';

export function ActorDemoSelector(): ReactElement {
  const [actorKey, setActorKey] = useState<ActorDemoKey>(() => readStoredActorDemoKey());

  return (
    <label className="actor-demo-selector">
      <span>Viewer</span>
      <select
        value={actorKey}
        aria-label="Prototype actor context"
        onChange={(event) => {
          const nextKey = event.target.value as ActorDemoKey;
          setActorKey(nextKey);
          storeActorDemoKey(nextKey);
        }}
      >
        {actorDemoOptions.map((option) => (
          <option key={option.key} value={option.key}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
