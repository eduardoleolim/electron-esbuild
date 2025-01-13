const config = {
  preset: 'ts-jest',
  resolver: './jest-resolver.cjs',
  testEnvironment: 'node',
  testRegex: '/tests/.*\\.(test|spec)?\\.(ts|tsx)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '^.+\\.m?tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }] // m? for .mts and x? for .tsx
  }
};

export default config;
