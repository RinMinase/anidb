<h1 align="center"> Rin Minase's Anime Database </h1>

<p align="center">
    <a href="https://circleci.com/gh/RinMinase/anidb">
        <img alt="Circle-CI" src="https://img.shields.io/circleci/build/github/RinMinase/anidb/master.svg?logo=circleci&style=for-the-badge&label=Circle%20CI%20(Build)">
    </a>
    <a href="https://app.netlify.com/sites/anidb/deploys">
        <img alt="Netlify-Status" src="https://img.shields.io/netlify/635b50f7-7b22-4c87-9b6b-7da2c0fb2180?logo=netlify&style=for-the-badge&label=Netlify%20(Domain)">
    </a>
    <a href="https://codecov.io/gh/RinMinase/anidb">
        <img alt="Codecov" src="https://img.shields.io/codecov/c/gh/RinMinase/anidb?logo=codecov&style=for-the-badge" />
    </a>
</p>
<p align="center">
    <a href="https://david-dm.org/RinMinase/anidb">
        <img alt="David-DM" src="https://img.shields.io/david/RinMinase/anidb?style=for-the-badge">
    </a>
    <a href="https://david-dm.org/RinMinase/anidb">
        <img alt="David-DM" src="https://img.shields.io/david/dev/RinMinase/anidb?label=dev%20dependencies&style=for-the-badge">
    </a>
</p>
<p align="center">
    <a href="https://angular.io/">
        <img alt="Angular" src="https://img.shields.io/badge/angular-%5E9.0.0--rc.11-red.svg?logo=angular&style=for-the-badge">
    </a>
    <a href="https://nodejs.org">
        <img alt="Node" src="https://img.shields.io/badge/node-%5E12.0%20%7C%7C%20%5E13.0-brightgreen.svg?logo=node.js&logoColor=white&style=for-the-badge">
    </a>
</p>

## Introduction
_Add info here_

## Getting Started

### Running the project
1. [Download](https://nodejs.org/en/) the latest Node version. This is marked as `<version number> Current`. Install it on your machine.

2. _(Optional)_ [Download](https://yarnpkg.com/latest.msi) Yarn. This is a faster package manager than the default `npm` one.

3. Clone the project

    ```
    git clone https://github.com/RinMinase/anidb.git
    cd anidb
    ```

4. Install the dependencies then run the project

    ```
    npm install
    npm start
    ```

    **Note:** If you have installed Yarn, run these instead:

    ```
    yarn install
    yarn start
    ```

5. Fire up your browser and go to `localhost:3000`

### Code Scaffolding
This is using `yarn ng generate <schematic> <name>` command. This can be shortened to `yarn ng g <schematic> <name>`.

Schematics
- `component` or `c` - Creates a new [component](https://angular.io/guide/architecture-components)
- `module` or `m` - Creates a new [NgModule](https://angular.io/guide/ngmodules)
- `service` or `s` - Creates a new [service](https://angular.io/guide/architecture-services)

### Project Structure

#### Directory Structure
    .
    ├── .circleci/                          # Circle CI configuration folder
    ├── assets/                             # Project assets
    │   ├── config/                         # Project configurations
    │   │   ├── testing/                    # Testing configuration files
    │   │   ├── manifest.json               # Web manifest file
    │   │   ├── ngsw-config.json            # PWA Service Worker configuration file
    │   │   ├── webpack.ts                  # Extended webpack configuration file
    │   │   └── ...                         # Other configuration files
    │   ├── res/                            # Platform-specific resources folder
    │   ├── styles/                         # Stylesheet folder
    │   └── ...                             # Other assets
    ├── dist/                               # Compiled production code
    ├── src/                                # Project source code
    │   ├──<module-name>/                   # Project module
    │   │   ├── <name>.component.html       # Component template
    │   │   ├── <name>.component.scss       # Component stylesheet
    │   │   ├── <name>.component.spec.ts    # Component test script
    │   │   ├── <name>.component.ts         # Module component
    │   │   └── <name>.module.ts            # Module
    │   ├── core/                           # Project-wide reusable classes
    │   │   ├── builders/                   # Project builders
    │   │   ├── components/                 # Project components
    │   │   └── services/                   # Project services
    │   ├── app.module.ts                   # Main module and project routes
    │   ├── index.html                      # Main HTML file
    │   ├── index.scss                      # Main Stylesheet (SCSS) file
    │   └── index.ts                        # Main TypeScript file
    ├── .editorconfig                       # IDE / Editor configuration
    ├── angular.json                        # Angular CLI configuration
    ├── env.ts                              # Angular Environment file
    ├── tsconfig.json                       # Main TypeScript configuration file
    ├── tslint.json                         # TypeScript linting file
    └── ...                                 # Other project files

### Building the project
Installations Required:
- Node
- _(Optional)_ Yarn

1. Fire up your terminal inside the project folder.

2. Build the project by running:

    ```
    npm run build
    ```

    **Note:** If you have installed Yarn, run these instead:

    ```
    yarn build
    ```

3. This should generate a `/dist` folder inside the project folder.

### Deploying the project to Firebase
_Add info here_

### Project tasks

Task automation is based on [Yarn scripts](https://yarnpkg.com/lang/en/docs/cli/run/) or [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Task                | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `yarn start`        | Run **development server** on `http://localhost:3000/` with file watching on changes                 |
| `yarn start --prod` | Run **production server** on `http://localhost:3000/` with file watching on changes                  |
| `yarn build`        | Build production code and add service worker to built code                                           |
| `yarn test <args>`  | Run test scripts on using a Headless Chrome Browser                                                  |
| `yarn lint`         | Lints all TypeScript and SCSS files, takes an optional `--fix` to automatically fix linting problems |

Other tasks included in `package.json` that should not be executed manually:

| Task                | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `yarn deploy`       | Build production code without displaying progress and add service worker to built code               |

### Testing the project
_Add info here_

## Built with
* <img width=20 height=20 src="https://angular.io/assets/images/favicons/favicon.ico"> [Angular 9 RC 11](https://angular.io/) - Web Framework
* <img width=20 height=20 src="https://www.typescriptlang.org/assets/images/icons/favicon-32x32.png"> [TypeScript](https://www.typescriptlang.org/) - Language syntax
* <img width=20 height=20 src="https://sass-lang.com/favicon.ico"> [Sassy CSS (SCSS)](https://sass-lang.com/) - CSS pre-processor
* <img width=20 height=20 src="https://getbootstrap.com/favicon.ico"> [Bootstrap 4](https://getbootstrap.com/) - HTML Framework (layout)
* <img width=20 height=20 src="https://firebase.google.com/favicon.ico"> [Firebase](https://firebase.google.com/) - Database
* <img width=20 height=20 src="https://webpack.js.org/bc3effb418df77da9e04825c48a58a49.ico"> [Webpack 4](https://webpack.js.org/) - Project bundler
* <img width=20 height=20 src="https://jasmine.github.io/favicon.ico"> [Jasmine](https://jasmine.github.io/) - Testing Framework
* <img width=20 height=20 src="https://karma-runner.github.io/assets/img/favicon/favicon.ico"> [Karma](https://karma-runner.github.io) - Test Runner Framework
* <img width=20 height=20 src="https://dmmj3mmt94rvw.cloudfront.net/favicon-undefined.ico"> [Circle CI](https://circleci.com/) - Continuous Integration (CI) service
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://netlify.com) - Hosting Platform
* <img width=20 height=20 src="https://codecov.io/static/favicons/favicon-32x32.png"> [Codecov](https://codecov.io/) - Code Coverage
* <img width=20 height=20 src="https://yarnpkg.com/icons/icon-48x48.png"> [Yarn](https://yarnpkg.com/) - Package Manager

## Deployed to
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://anidb.netlify.com)
