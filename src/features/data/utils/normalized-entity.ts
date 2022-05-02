export type NormalizedEntity<T extends { id: string }> = {
  byId: {
    [id: string]: T;
  };
  allIds: string[];
};
