module.exports = {
  root: true,
  // https://github.com/eslint/eslint/blob/45aa6a3ba3486f1b116c5daab6432d144e5ea574/docs/user-guide/configuring.md#extending-configuration-files
  extends: [
    'airbnb',
    // https://github.com/typescript-eslint/typescript-eslint/tree/c5835f332c4c63af778b4064a6c524840deb690b/packages/eslint-plugin#usage
    // @typescript-eslint/eslint-plugin を有効にし、@typescript-eslint/parser も設定してくれる。
    'plugin:@typescript-eslint/recommended',
    // https://github.com/prettier/prettier/blob/1a419c0ddff61a70321c168f47e91ce0ca582340/docs/integrating-with-linters.md#recommended-configuration
    // eslint-plugin-prettier を有効にし、eslint-config-prettier を extends してくれる。
    'plugin:prettier/recommended',
  ],

  parserOptions: {
    project: ['./tsconfig.json'],
  },
  
  // https://github.com/eslint/eslint/blob/45aa6a3ba3486f1b116c5daab6432d144e5ea574/docs/user-guide/configuring.md#specifying-environments
  env: {
    browser: true,
    es6: true,
  },

  // https://github.com/eslint/eslint/blob/45aa6a3ba3486f1b116c5daab6432d144e5ea574/docs/user-guide/configuring.md#configuring-plugins
  plugins: ['react', 'react-hooks', 'sort-imports-es6-autofix', 'deprecate'],

  rules: {
    // Enable
    'deprecate/function': ['error', { name: 'useApiWrapper', use: 'useApi' }],
    'deprecate/import': ['error', { name: 'moment', use: 'date-fns' }],
    'no-dupe-else-if': 'error',
    'no-import-assign': 'error',
    'require-atomic-updates': 'error',
    'default-case': [
      'error',
      {
        commentPattern: '^no default$',
      },
    ],
    'array-callback-return': [
      'error',
      {
        allowImplicit: true,
        checkForEach: true,
      },
    ],
    'no-eq-null': ['error'],
    'no-unmodified-loop-condition': ['warn'],
    'no-shadow': ['warn'],
    'no-duplicate-imports': ['warn'],
    '@typescript-eslint/await-thenable': ['error'],
    '@typescript-eslint/consistent-type-definitions': ['warn', 'type'],
    '@typescript-eslint/no-base-to-string': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-extra-non-null-assertion': ['error'],
    '@typescript-eslint/no-floating-promises': ['error'],
    '@typescript-eslint/no-invalid-void-type': ['error'],
    '@typescript-eslint/no-misused-promises': ['error'],
    '@typescript-eslint/no-non-null-asserted-optional-chain': ['error'],
    '@typescript-eslint/no-unnecessary-condition': ['error'],
    // '@typescript-eslint/no-unsafe-assignment': ['error'], // TODO 欲しいけどうまくいかず。。別タイミングで再調査
    '@typescript-eslint/prefer-nullish-coalescing': ['error'],
    '@typescript-eslint/restrict-plus-operands': ['error'],
    '@typescript-eslint/restrict-template-expressions': ['error'],
    '@typescript-eslint/strict-boolean-expressions': [
      'error',
      { allowString: false, allowNumber: false, allowNullableObject: false },
    ],
    '@typescript-eslint/switch-exhaustiveness-check': ['error'],
    '@typescript-eslint/dot-notation': ['error'],
    'react/no-array-index-key': ['error'],
    'react/jsx-key': ['error', { checkFragmentShorthand: true }],
    'react/jsx-no-script-url': ['error'],
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true,
      },
    ],
    '@typescript-eslint/no-useless-constructor': ['error'],
    'arrow-body-style': ['error', 'as-needed'],
    'func-names': ['error'],
    'lines-between-class-members': [
      'error',
      'always',
      {
        exceptAfterSingleLine: true,
      },
    ],
    'no-case-declarations': ['error'],
    'no-console': [
      'error',
      {
        allow: ['info', 'warn', 'error'],
      },
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['draft'],
      },
    ],
    'no-restricted-syntax': [
      'error',
      {
        selector: 'TSEnumDeclaration',
        message: 'Do not declare enums',
      },
    ],
    'prettier/prettier': ['warn', {}, { usePrettierrc: true }],
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    ],
    'react/jsx-no-target-blank': ['error'],
    'react/sort-comp': ['error'],
    'react-hooks/exhaustive-deps': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'sort-imports-es6-autofix/sort-imports-es6': [
      'error',
      {
        ignoreCase: false,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],

    // Disable
    '@typescript-eslint/ban-types': ['off'],
    'no-alert': ['off'],
    'react/button-has-type': ['off'],
    '@typescript-eslint/explicit-module-boundary-types': ['off'],
    'dot-notation': 'off', // error on @typescript-eslint/dot-notation
    camelcase: ['off'],
    '@typescript-eslint/camelcase': ['off'], // https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/camelcase.md
    '@typescript-eslint/explicit-function-return-type': ['off'],
    'no-use-before-define': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
    'import/extensions': ['off'],
    'import/no-extraneous-dependencies': ['off'], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-extraneous-dependencies.md
    'import/no-unresolved': ['off'], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/no-unresolved.md
    'import/order': ['off'],
    'import/prefer-default-export': ['off'], // https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/prefer-default-export.md
    'jsx-a11y/accessible-emoji': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/accessible-emoji.md
    'jsx-a11y/control-has-associated-label': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/control-has-associated-label.md
    'jsx-a11y/click-events-have-key-events': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/click-events-have-key-events.md
    'jsx-a11y/interactive-supports-focus': ['off'],
    'jsx-a11y/label-has-associated-control': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/label-has-associated-control.md
    'jsx-a11y/media-has-caption': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/media-has-caption.md
    'jsx-a11y/mouse-events-have-key-events': ['off'],
    'jsx-a11y/no-noninteractive-element-interactions': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-noninteractive-element-interactions.md
    'jsx-a11y/no-static-element-interactions': ['off'], // https://github.com/evcohen/eslint-plugin-jsx-a11y/blob/master/docs/rules/no-static-element-interactions.md
    'max-classes-per-file': ['off'], // https://eslint.org/docs/rules/max-classes-per-file
    'no-bitwise': ['off'], // https://eslint.org/docs/rules/no-bitwise
    'no-undef': ['off'], // https://eslint.org/docs/rules/no-undef
    'no-useless-constructor': ['off'], // @typescript-eslint/no-useless-constructor で担保
    'no-nested-ternary': ['off'], // https://eslint.org/docs/rules/no-nested-ternary
    'no-plusplus': ['off'], // https://eslint.org/docs/rules/no-plusplus
    'no-return-assign': ['off'], // https://eslint.org/docs/rules/no-return-assign
    'no-throw-literal': ['off'], // https://eslint.org/docs/rules/no-throw-literal
    'no-unused-expressions': ['off'], // error on @typescript-eslint/no-unused-expressions
    'sort-imports': ['off'],
    'react/jsx-indent': ['off'], // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-indent.md
    'react/jsx-props-no-spreading': ['off'], // https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-props-no-spreading.md
    'react/require-default-props': ['off'],

    // TODO
    '@typescript-eslint/no-explicit-any': ['off'],
    'no-underscore-dangle': ['off'],
    'no-param-reassign': ['off'],
    '@typescript-eslint/no-floating-promises': ['off'],
    'no-console': ['off'],
    'react/jsx-no-bind': ['off'],
    '@typescript-eslint/no-unused-vars': ["warn", { "args": "none" }],
  }
};
