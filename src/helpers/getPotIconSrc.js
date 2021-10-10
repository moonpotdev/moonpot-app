const potIconRequire = require.context('../images/vault', true, /\.svg$/);
const potIcons = Object.fromEntries(
  potIconRequire.keys().map(path => [path.substring(2, path.lastIndexOf('.')), path])
);
const potIconCache = {};

export const getPotIconSrc = (key, throwOnError = true) => {
  if (key in potIconCache) {
    return potIconCache[key];
  }

  if (key in potIcons) {
    const asset = potIconRequire(potIcons[key]).default;
    return (potIconCache[key] = asset);
  }

  if (throwOnError) {
    throw new Error(`Image required for '${key}' pot icon in 'images/vault'`);
  }

  return null;
};
