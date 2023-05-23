# techint

## Setup

### 1 .Node.js

Install [Node Version Manager (NVM)](https://github.com/creationix/nvm) which will will allow you to quickly install and use different versions of the [Node.js](https://nodejs.org) via the command line.

The project is uing [.nvmrc](https://github.com/nvm-sh/nvm#nvmrc) file which contains an exact Node.js version number to be used accross the project.

To install Node.js run:

```shell
$ nvm install
$ nvm use
$ node -v
v18.15.0
```

### 2. Turborepo

This project is organized as a monorepo repository with the help of [Turborepo](https://turbo.build/repo/docs/core-concepts/monorepos) build system.

You can [install Turborepo](https://turbo.build/repo/docs/installing) globally to enable automatic workspace selection based on the directory where you run `turbo`.

```shell
$ npm install turbo@1.9.3 --global
```

### 3. Install project dependencies

```shell
$ npm install
```

## Monorepo overview

```
siili-techint
├── apps
│  ├── web
│  ├── web-e2e
│  └── ...
├── packages
│  ├── eslint-config-techint
│  ├── tsconfig-techint
│  ├── ui
│  ├── utils
│  └── ...
└── lambdas
   ├── utils
   ├── api
   ├── authorizer
   ├── provision-resource
   └── ...
```

[`apps/`](apps)

- [`web/`](apps/web) - main React web application
- [`web-e2e/`](apps/web-e2e) - Web application end-to-end tests

[`packages/`](packages)

- [`eslint-config-techint/`](packages/eslint-config-techint) - shared ESLint config files (see [ESLint in a monorepo](https://turbo.build/repo/docs/handbook/linting/eslint))
- [`tsconfig-techint/`](packages/tsconfig-techint) - shared TypeScript config files (see [TypeScript in a monorepo](https://turbo.build/repo/docs/handbook/linting/typescript))
- [`ui/`](packages/ui) - shared UI React components
- [`utils/`](packages/utils) - general purpose utilities

[`lambdas/`](lambdas)

- [`utils/`](lambdas/utils)
- [`api/`](lambdas/api)
- [`authorizer/`](lambdas/authorizer)
- [`provision-resource/`](lambdas/provision-resource)

## Useful commands

- `npm run lint` or `turbo lint` - lint the code
- `npm run test` or `turbo test` - perform the unit tests
- `npm run build` or `turbo build` - compile typescript to js
- `npm run dev` or `turbo dev` - serve the development environment
- `npm run clean` or `turbo clean` - clean the project (removes `node_modules`, `dist`, `.turbo`)
- `npm run storybook:dev` or `turbo run storybook:dev` - serve the storybook environment (it will start all the Storybooks (each on a specific port)). To start only one instance, launch `turbo run storybook:dev --filter=@siili/techint-web` (`web` being the name of your workspace)
- `npm i my-package -w apps/web` - add a dependency named `my-package` from the registry as a dependency of your workspace `apps/web` (you can also use package name like `@siili/techint-web`)
- `npm test -w apps/web` - run all tests in `apps/web` workspace

## Generators

To help increase productivity when coding we use Plop generators (see [`plopfile.js`](plopfile.js)) that helps us automate the creation of repetitive code files and templates. It is used for generating boilerplate code such as templates, components, controllers, models, and more. Plop offers a simple and efficient way to maintain code consistency and speed up development time by allowing developers to quickly generate repeatable code. It also includes a handy CLI to automatically run Plop generators with ease, making development workflows more efficient.

- `npm run plop my-infra` - creates a code for the CDK stack in `apps/cloud` workspace

## Resources

### Project setup and tooling

- [monorepo.tools](https://monorepo.tools/)
- [npm - workspaces](https://docs.npmjs.com/cli/v8/using-npm/workspaces)
- [Turborepo](https://turbo.build/repo)
- [Turborepo - Monorepo Handbook](https://turbo.build/repo/docs/handbook)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Husky](https://typicode.github.io/husky/)
- [Commitlint](https://commitlint.js.org/)
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Semantic-release](https://github.com/semantic-release/semantic-release)
- [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
- [validate-branch-name](https://github.com/JsonMa/validate-branch-name)
- [Using Jest with monorepo](https://kulshekhar.github.io/ts-jest/docs/guides/using-with-monorepo)
- [Plop](https://plopjs.com/)
- [Awesome Plop](https://github.com/plopjs/awesome-plop)
