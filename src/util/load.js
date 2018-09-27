export default function load (name) {
  const srcDir = path.resolve('../../../../build/src');

  // Don't cache local files
  if (require.cache) {
    const regex = new RegExp(`^${srcDir}/`);

    Object.keys(require.cache).forEach(key => {
      if (regex.test(key)) {
        delete require.cache[key];
      }
    });
  }

  return require(path.join(srcDir, name));
}
