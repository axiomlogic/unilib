module.exports = {
  arrowParens: 'avoid',
  bracketSpacing: true,
  endOfLine: 'auto',
  printWidth: 80,
  proseWrap: 'preserve',
  quoteProps: 'as-needed',
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  useTabs: false,
  overrides: [
    {
      files: '*.test.ts',
      options: {
        printWidth: 240
      }
    }
  ]
};
