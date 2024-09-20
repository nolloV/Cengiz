module.exports = {
  moduleNameMapper: {
    '@core/(.*)': '<rootDir>/src/app/core/$1',
  },
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  bail: false,
  verbose: false,
  collectCoverage: true, // Activer la collecte de couverture
  coverageDirectory: './coverage/jest',
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  collectCoverageFrom: [
    'src/**/*.ts', // Inclure tous les fichiers TypeScript dans src
    '!src/**/*.module.ts', // Exclure les fichiers de module
    '!src/main.ts', // Exclure le fichier principal
    '!src/polyfills.ts', // Exclure les polyfills
    '!src/environments/*.ts', // Exclure les fichiers d'environnement
  ],
  coverageReporters: ['html', 'text-summary', 'lcov'], // Ajouter des reporters de couverture
  roots: [
    "<rootDir>"
  ],
  modulePaths: [
    "<rootDir>"
  ],
  moduleDirectories: [
    "node_modules"
  ],
};