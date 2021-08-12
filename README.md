<h1 align="center"> Rin Minase's Anime Database </h1>

<p align="center">
    <a href="https://circleci.com/gh/RinMinase/anidb">
        <img alt="Circle-CI" src="https://img.shields.io/circleci/build/github/RinMinase/anidb/master.svg?logo=circleci&style=for-the-badge&label=Circle%20CI%20(Build)">
    </a>
    <a href="https://app.netlify.com/sites/anidb/deploys">
        <img alt="Netlify-Status" src="https://img.shields.io/netlify/635b50f7-7b22-4c87-9b6b-7da2c0fb2180?logo=netlify&style=for-the-badge&label=Netlify%20(Domain)">
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
        <img alt="Angular" src="https://img.shields.io/badge/angular-%5E12.1-red.svg?logo=angular&style=for-the-badge">
    </a>
    <a href="https://nodejs.org">
        <img alt="Node" src="https://img.shields.io/badge/node-%5E14.0%20%7C%7C%5E12.0-brightgreen.svg?logo=node.js&logoColor=white&style=for-the-badge">
    </a>
</p>

## Introduction
_Add info here_

## Getting Started

### Running the project
Installations Required:
- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/latest.msi)

1. Clone the project and copy the ENV template file to a new ENV file.

    ```
    git clone https://github.com/RinMinase/anidb.git
    cd anidb
    cp .env.example .env
    ```

2. Modify the created ENV file based on your Firebase configuration

3. Install the dependencies then run the project

    ```
    yarn install
    yarn start
    ```

4. Fire up your browser and go to `localhost:3000`

### Building the project
Installations Required:
- [Node](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/latest.msi)

1. Fire up your terminal inside the project folder.

2. Build the project by running:

    ```
    yarn build
    ```

3. This should generate a `dist/` folder inside the project folder.

### Code Scaffolding
This is using `yarn ng generate <schematic> <name>` command. This can be shortened to `yarn ng g <schematic> <name>`.

Schematics
- `component` or `c` - Creates a new [component](https://angular.io/guide/architecture-components)
- `module` or `m` - Creates a new [NgModule](https://angular.io/guide/ngmodules)
- `service` or `s` - Creates a new [service](https://angular.io/guide/architecture-services)

### Project Structure
    .
    ├── .circleci/                          # Circle CI configuration folder
    ├── assets/                             # Project assets
    │   ├── config/                         # Project configurations
    │   │   ├── manifest.json               # Web manifest file
    │   │   ├── ngsw-config.json            # PWA Service Worker configuration file
    │   │   ├── webpack.ts                  # Extended webpack configuration file
    │   │   └── ...                         # Other configuration files
    │   ├── res/                            # Platform-specific resources folder
    │   └── ...                             # Other assets
    ├── dist/                               # Compiled production code
    ├── src/                                # Project source code
    │   ├──<module-name>/                   # Project module
    │   │   ├── <name>.component.html       # Component template
    │   │   ├── <name>.component.scss       # Component stylesheet
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
    ├── .env                                # Environment file
    ├── angular.json                        # Angular CLI configuration
    ├── tsconfig.json                       # Main TypeScript configuration file
    └── ...                                 # Other project files

### Project tasks

Task automation is based on [Yarn scripts](https://yarnpkg.com/lang/en/docs/cli/run/) or [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Task                | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `yarn start`        | Run **development server** on `http://localhost:3000/` with file watching on changes                 |
| `yarn start --prod` | Run **production server** on `http://localhost:3000/` with file watching on changes                  |
| `yarn build`        | Build production code and add service worker to built code                                           |

Other tasks included in `package.json` that should not be executed manually:

| Task                | Description                                                                                          |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| `yarn deploy`       | Build production code without displaying progress and add service worker to built code               |

### Testing the project
_Add info here_

## Built with
* <img width=20 height=20 src="https://angular.io/assets/images/favicons/favicon.ico"> [Angular](https://angular.io/) - Web Framework
* <img width=20 height=20 src="https://www.typescriptlang.org/favicon-32x32.png"> [TypeScript](https://www.typescriptlang.org/) - Language syntax
* <img width=20 height=20 src="https://sass-lang.com/favicon.ico"> [Sassy CSS (SCSS)](https://sass-lang.com/) - CSS pre-processor
* <img width=20 height=20 src="https://getbootstrap.com/favicon.ico"> [Bootstrap 5](https://getbootstrap.com/) - HTML Framework (layout)
* <img width=20 height=20 src="https://firebase.google.com/favicon.ico"> [Firebase](https://firebase.google.com/) - Database
* <img width=20 height=20 src="https://webpack.js.org/icon_192x192.png"> [Webpack 5](https://webpack.js.org/) - Project bundler
* <img width=20 height=20 src="https://dmmj3mmt94rvw.cloudfront.net/favicon-undefined.ico"> [Circle CI](https://circleci.com/) - Continuous Integration (CI) service
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://netlify.com) - Hosting Platform
* <img width=20 height=20 src="https://about.codecov.io/wp-content/themes/codecov/assets/brand/icons/favicons/favicon-32x32.png"> [Codecov](https://codecov.io/) - Code Coverage
* <img width=20 height=20 src="https://yarnpkg.com/icons/icon-48x48.png"> [Yarn](https://yarnpkg.com/) - Package Manager

## Deployed to
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://anidb.netlify.com)
