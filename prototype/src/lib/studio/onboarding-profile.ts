export type OnboardingProfile = {
  tier: 'Boutique' | 'Institutional';
  assetClasses: string[];
  companyName: string;
  completedAt: string;
};

const STORAGE_KEY = 'sophex-studio-onboarding-profile';

export function saveOnboardingProfile(profile: Omit<OnboardingProfile, 'completedAt'>): void {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      ...profile,
      completedAt: new Date().toISOString(),
    } satisfies OnboardingProfile)
  );
}

export function getOnboardingProfile(): OnboardingProfile | null {
  if (typeof sessionStorage === 'undefined') return null;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingProfile;
  } catch {
    return null;
  }
}

export function formatOnboardingSummary(profile: OnboardingProfile): string {
  return `${profile.tier} workspace · ${profile.assetClasses.join(', ')} · ${profile.companyName}`;
}
