import * as lz from 'lz-string';
import * as lzutf8 from 'lzutf8';
import * as BSON from 'bson';
// @ts-ignore
import * as lzma from 'lzma';

const cfg = {
  'name': 'wallaby-ts-webpack',
  'description': '',
  'license': 'MIT',
  'private': true,
  'version': '1.0.0',
  'bugs': {
    'url': 'https://github.com/korniychuk/wallaby-ts-webpack-starter/issues',
  },
  'homepage': 'https://github.com/korniychuk/wallaby-ts-webpack-starter#readme',
  'repository': {
    'type': 'git',
    'url': 'git+https://github.com/korniychuk/wallaby-ts-webpack-starter.git',
  },
  'engines': {
    'node': '^14.4.0',
    'npm': '^6.14.0',
    'yarn': '^1.22.0',
  },
  'scripts': {
    'build': 'rimraf dist && tsc -p tsconfig.build.json',
    'build:prod': 'npm run build',
    'lint': 'eslint --ext .js,.ts src/**',
    'lint:fix': 'npm run lint -- --fix',
    'pre-push': 'npm run lint && npm run test && npm run build:prod && npm run tpl-repo:check',
    'preinstall': 'node ./tools/check-yarn.js',
    'test': 'jest -c jest.config.js',
    'test:watch': 'npm run test -- --watch',
    'tpl-repo': 'tools/merge-with-repository-template.sh',
    'tpl-repo:check': 'npm run tpl-repo -- check',
    'tpl-repo:merge': 'npm run tpl-repo -- merge',
    'ts': 'ts-node',
  },
  'devDependencies': {
    '@babel/core': '~7.10.2',
    '@babel/preset-env': '~7.10.2',
    '@babel/preset-typescript': '~7.10.1',
    '@types/jest': '~26.0.0',
    '@types/node': '^14.0.14',
    '@typescript-eslint/eslint-plugin': '~3.3.0',
    '@typescript-eslint/parser': '~3.3.0',
    'eslint': '~7.2.0',
    'eslint-config-airbnb-base': '~14.2.0',
    'eslint-import-resolver-typescript': '~2.0.0',
    'eslint-plugin-filenames': '~1.3.2',
    'eslint-plugin-import': '~2.21.2',
    'eslint-plugin-promise': '~4.2.1',
    'eslint-plugin-unicorn': '~20.1.0',
    'husky': '~4.2.5',
    'jest': '~26.0.1',
    'jest-extended': '~0.11.5',
    'rimraf': '~3.0.2',
    'ts-node': '^8.10.2',
    'typescript': '~3.9.5',
  },
  'husky': {
    'hooks': {
      'pre-push': 'npm run pre-push',
      'post-merge': 'IS_YARN=true yarn install',
    },
  },
};

const cfgStr = JSON.stringify(cfg);
const compressed = lz.compressToEncodedURIComponent(cfgStr);
console.log('compressed', cfgStr.length, compressed.length, compressed);

const compressed2 = lzutf8.compress(cfgStr, { outputEncoding: 'Base64' });
console.log('compressed2', compressed2.length, compressed2);

const compressed3 = lzutf8.compress(BSON.serialize(cfg), { outputEncoding: 'Base64' });
console.log('compressed3', compressed3.length, compressed3);

const compress4 = lzma.compress(cfgStr).toString();
console.log('compress4', compress4.length, compress4);
