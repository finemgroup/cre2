/** Stable PageTransition key so deal workflow chrome does not remount on tab changes. */
export function getPageTransitionKey(pathname: string): string {
  const dealWorkflowMatch = pathname.match(/^(\/studio\/deals\/[^/]+)(?:\/.*)?$/);
  if (dealWorkflowMatch) {
    return dealWorkflowMatch[1];
  }

  return pathname;
}
