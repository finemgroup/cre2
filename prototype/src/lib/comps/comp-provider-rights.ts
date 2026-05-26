export type CompRightsRow = {
  visible: boolean;
  authority: string;
};

export function summarizeCompProviderRights(comps: CompRightsRow[]): {
  visible: number;
  restricted: number;
  total: number;
} {
  const visible = comps.filter((comp) => comp.visible).length;
  return {
    visible,
    restricted: comps.length - visible,
    total: comps.length,
  };
}
