import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // new feature
        'fix', // fixx bug
        'docs', // update documentation
        'style', //  style, format
        'refactor', // refractor code
        'perf', // estimate performance
        'test', // test
        'chore', // build, deps, config
      ],
    ],
    'subject-case': [0],
  },
};

export default config;
