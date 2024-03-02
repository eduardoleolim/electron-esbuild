const resolutions = [
  {
    matcher: /\.cjs$/i,
    extensions: ['.cts'],
  },
  {
    matcher: /\.mjs$/i,
    extensions: ['.mts'],
  },
];

function resolver(path, options) {
  const resolver = options.defaultResolver;

  const resolution = resolutions.find(({ matcher }) => matcher.test(path));

  if (resolution) {
    for (const extension of resolution.extensions) {
      try {
        return resolver(path.replace(resolution.matcher, extension), options);
      } catch {
        continue;
      }
    }
  }

  return resolver(path, options);
}

module.exports = resolver