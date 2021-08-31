import { useLocalStorage } from '../../../helpers/hooks';
import { useEffect } from 'react';

const SECTION_DEFAULT = {
  version: 1,
  selected: 'moonpots', // moonpots or myPots
};

const SECTION_STORAGE_KEY = 'homeSectionConfig';

function configNeedsReset(config) {
  return !config || !('version' in config) || config.version < SECTION_DEFAULT.version;
}

export function useSectionConfig() {
  const [sectionConfig, setSectionConfig] = useLocalStorage(SECTION_STORAGE_KEY, SECTION_DEFAULT);
  const needsReset = configNeedsReset(sectionConfig);

  useEffect(() => {
    if (needsReset) {
      setSectionConfig({ ...SECTION_DEFAULT });
    }
  }, [setSectionConfig, needsReset]);

  return [needsReset ? SECTION_DEFAULT : sectionConfig, setSectionConfig];
}
