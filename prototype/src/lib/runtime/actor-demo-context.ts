import { fixtureActors } from '@/lib/contracts/fixtures';
import type { ActorContext } from '@/lib/contracts/actor-context';

export type ActorDemoKey = keyof typeof fixtureActors;

export const actorDemoOptions = [
  { key: 'public', label: 'Public baseline viewer' },
  { key: 'sourceOwner', label: 'Source owner' },
  { key: 'orgMember', label: 'Org member' },
  { key: 'internalOperator', label: 'Internal operator' },
  { key: 'partnerApi', label: 'Partner API' },
] satisfies Array<{ key: ActorDemoKey; label: string }>;

export const ACTOR_DEMO_STORAGE_KEY = 'sophex.prototype.actor-demo';

export function getActorDemoContext(key: ActorDemoKey = 'public'): ActorContext {
  return fixtureActors[key] ?? fixtureActors.public;
}

export function readStoredActorDemoKey(): ActorDemoKey {
  if (typeof window === 'undefined') return 'public';
  const stored = window.localStorage.getItem(ACTOR_DEMO_STORAGE_KEY);
  return actorDemoOptions.some((option) => option.key === stored) ? (stored as ActorDemoKey) : 'public';
}

export function storeActorDemoKey(key: ActorDemoKey): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(ACTOR_DEMO_STORAGE_KEY, key);
  window.dispatchEvent(new CustomEvent('sophex:actor-demo-change', { detail: key }));
}
