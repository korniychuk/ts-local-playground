# TS Local Playground

This repository is a place for learning and my other experiments.

## How to

### How to use NodeJS version from the `.nvmrc`

1. Install NVM
2. Use `.nvmrc` file one of the next ways:

    * Execute `nvm use` in the project root directory
    * Install [NVM Loader](https://github.com/korniychuk/ankor-shell) and your .nvmrc will be loaded automatically when you open the terminal.
      ![NVM Loader demo](./resources/readme.nvm-loader.png)

### How to make a build

`npm run build`

### How to run lint

* Just show problems `npm run lint`
* Fix problems if it is possible `npm run lint:fix`

### How to run tests

* All tests

  `npm run test`  
  `npm run test:watch`
* Specific tests

  `npm run test -- src/my.spec.ts`  
  `npm run test:watch -- src/my.spec.ts`

## Author

| [<img src="https://www.korniychuk.pro/avatar.jpg" width="100px;"/><br /><sub>Anton Korniychuk</sub>](https://korniychuk.pro) |
| :---: |
