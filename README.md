<h1 align="center"> Rin Minase's Anime Database </h1>

<p align="center">
    <a href="https://circleci.com/gh/RinMinase/anidb">
        <img alt="Circle-CI" src="https://img.shields.io/circleci/project/github/RinMinase/anidb/master.svg?logo=circleci">
    </a>
    <a href="https://codecov.io/gh/RinMinase/anidb">
        <img alt="Codecov" src="https://codecov.io/gh/RinMinase/anidb/branch/master/graph/badge.svg" />
    </a>
</p>
<p align="center">
    <a href="https://david-dm.org/RinMinase/anidb">
        <img alt="David-DM" src="https://david-dm.org/RinMinase/anidb.svg">
    </a>
    <a href="https://david-dm.org/RinMinase/anidb">
        <img alt="David-DM" src="https://david-dm.org/RinMinase/anidb/dev-status.svg">
    </a>
</p>
<p align="center">
    <a href="http://isitmaintained.com/project/RinMinase/anidb">
        <img alt="Issue Resolution" src="http://isitmaintained.com/badge/resolution/RinMinase/anidb.svg">
    </a>
    <a href="http://isitmaintained.com/project/RinMinase/anidb">
        <img alt="Open Issues" src="http://isitmaintained.com/badge/open/RinMinase/anidb.svg">
    </a>
    <a href="https://nodejs.org">
        <img alt="Node" src="https://img.shields.io/badge/node-%5E10.12.0%20%7C%7C%20%3E%3D12.0.0-green.svg?logo=node.js&logoColor=white">
    </a>
    <a href="https://yarnpkg.com/">
        <img alt="Yarn" src="https://img.shields.io/badge/yarn-%5E1.10.0-blue.svg">
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
| Name                | Description                                                                  |
| ------------------- | ---------------------------------------------------------------------------- |
| `component` or `c`  | Creates a new [component](https://angular.io/guide/architecture-components)  |
| `directive` or `d`  | Creates a new [directive](https://angular.io/guide/attribute-directives)     |
| `module` or `m`     | Creates a new [NgModule](https://angular.io/guide/ngmodules)                 |
| `service` or `s`    | Creates a new [service](https://angular.io/guide/architecture-services)      |

### Project Structure

#### Directory Structure
    .
    ├── .circleci/                     # Circle CI configuration folder
    ├── dist/                          # Compiled production code
    ├── src/                           # Project source code
    │   ├── app/                       # Project modules and components
    │   ├── assets/                    # Project assets
    │   │   ├── config/                # Project configurations
    │   │   │   ├── testing/           # Testing configuration files
    │   │   │   ├── manifest.json      # Web manifest file
    │   │   │   ├── ngsw-config.json   # PWA Service Worker configuration file
    │   │   │   ├── webpack.ts         # Extended webpack configuration file
    │   │   │   └── ...                # Other configuration files
    │   │   ├── res/                   # Platform-specific resources folder
    │   │   ├── styles/                # Stylesheet folder
    │   │   ├── favicon.ico            # Web Application icon
    │   │   └── robots.txt             # Robots file
    │   ├── core/                      # Environments folder
    │   │   ├── builders/              # Project builders
    │   │   ├── components/            # Project components
    │   │   └── services/              # Project services
    │   ├── environments/              # Environments folder
    │   ├── index.html                 # Main HTML file
    │   ├── index.scss                 # Main Stylesheet (SCSS) file
    │   └── index.ts                   # Main TypeScript file
    ├── .editorconfig                  # IDE / Editor configuration
    ├── .stylelintrc                   # SCSS linting configuration
    ├── angular.json                   # Angular CLI configuration
    ├── config.xml                     # Cordova build configuration
    ├── firebase.json                  # Firebase hosting configuation
    ├── tsconfig.json                  # Main TypeScript configuration file
    ├── tslint.json                    # TypeScript linting file
    └── ...                            # Other project files

#### Module Structure
    <module-name>/
     ├── <sub-module name>             # Sub-module
     │    └── ...                      # Sub-module files
     ├── <name>.component.html         # Component template
     ├── <name>.component.scss         # Component stylesheet
     ├── <name>.component.spec.ts      # Component test script
     ├── <name>.component.ts           # Module component
     └── <name>.module.ts              # Module

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

### Bundling the project for Android

#### Installation
Installations Required:
- Java JDK
- Android SDK Command-line Tools
- Gradle

**Java JDK**
1. Download the latest Java Development Kit. The version should be 1.8.x (where _x_ could be any number depending on the latest patch).
2. Install it in your machine
3. Head over to the commandline then type: `java -version`.
    1. If it prints out `java is not recognized as an internal or external command, operable program or batch file`
    2. Go to the location on where your java is installed (Usually it's in `C:\Program Files\Java\jdk1.8.xxx`)
    3. Press `win + pause` to open your system information and click `Advanced system settings` on the sidebar.
    4. When the `System Properties` window opens click on `Environmental Variables`
    5. Go to `System Variables` and look for `Path`.
    6. Double click path, or click `Edit`, then add the location of the `\bin` folder. (`C:\Program Files\Java\jdk1.8.xxx\bin`)
4. If it prints out the version of the java you are using, open or re-open the environmental paths window.
5. In `System Variables` add `JAVA_HOME` by pressing `New` where:
    1. The variable name should be: `JAVA_HOME`
    2. The variable value should be: (the installation folder of your JDK, usually it's in `C:\Program Files\Java\jdk1.8.0_xxx`)
        - So the value should be `C:\Program Files\Java\jdk1.8.0_xxx`

**Android SDK Command-line Tools**

**Gradle**
1. Download the latest [Gradle build tool](https://gradle.org/install/#manually), select `Binary-only`
2. Extract it in your machine
3. Move the extracted files in a suitable location, preferably in `C:\Program Files\Gradle`
4. Press `win + pause` to open your system information and click `Advanced system settings` on the sidebar.
5. When the `System Properties` window opens click on `Environmental Variables`
6. Go to `System Variables` and look for `Path`.
7. Double click path, or click `Edit`, then add the location of the `\bin` folder. (`C:\Program Files\Gradle\bin`)


### Deploying the project to Firebase
_Add info here_

### Project tasks

Task automation is based on [Yarn scripts](https://yarnpkg.com/lang/en/docs/cli/run/) or [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Task                | Description                                                                                          |
| ------------------- | -------------------------------------------------------------------------------------                |
| `yarn start`        | Run **development server** on `http://localhost:3000/` with file watching on changes                 |
| `yarn start --prod` | Run **production server** on `http://localhost:3000/` with file watching on changes                  |
| `yarn build`        | Build production code and add service worker to built code                                           |
| `yarn test <args>`  | Run test scripts on using a Headless Chrome Browser                                                  |
| `yarn bundle`       | Builds production code with service worker then compiles it for Android using Cordova                |
| `yarn lint`         | Lints all TypeScript and SCSS files, takes an optional `--fix` to automatically fix linting problems |
| `yarn setup`        | Runs Cordova pre-requisites and installs dependencies                                                |

Other tasks included in `package.json` that should not be executed manually:

| Task           | Description                                                                              |
| -------------- | ---------------------------------------------------------------------------------------- |
| `bundle-build` | Executes `build` with a change in `base-href` to `./` instead of `/`                     |
| `bundle-app`   | Compiles TypeScript hook to JavaScript, then compiles the built code to APK with cordova |
| `bundle-post`  | Removes `www` folder created with `build`, removes the compiled JavaScript hook          |
| `codecov`      | Code coverarage uploader                                                                 |

### Testing the project
_Add info here_

## Built with
* <img width=20 height=20 src="https://angular.io/assets/images/favicons/favicon.ico"> [Angular 8](https://angular.io/) - Web Framework
* <img width=20 height=20 src="https://www.typescriptlang.org/assets/images/icons/favicon-32x32.png"> [TypeScript](https://www.typescriptlang.org/) - Language syntax
* <img width=20 height=20 src="https://sass-lang.com/favicon.ico"> [Sassy CSS (SCSS)](https://sass-lang.com/) - CSS pre-processor
* <img width=20 height=20 src="https://getbootstrap.com/favicon.ico"> [Bootstrap 4](https://getbootstrap.com/) - HTML Framework (layout)
* <img width=20 height=20 src="https://firebase.google.com/favicon.ico"> [Firebase](https://firebase.google.com/) - Database
* <img width=20 height=20 src="https://webpack.js.org/bc3effb418df77da9e04825c48a58a49.ico"> [Webpack 4](https://webpack.js.org/) - Project bundler
* <img width=20 height=20 src="https://cordova.apache.org/favicon.ico"> [Cordova](https://cordova.apache.org/) - Android APK bundler
* <img width=20 height=20 src="https://jasmine.github.io/favicon.ico"> [Jasmine](https://jasmine.github.io/) - Testing Framework
* <img width=20 height=20 src="https://karma-runner.github.io/assets/img/favicon/favicon.ico"> [Karma](https://karma-runner.github.io) - Test Runner Framework
* <img width=20 height=20 src="https://dmmj3mmt94rvw.cloudfront.net/favicon-undefined.ico"> [Circle CI](https://circleci.com/) - Continuous Integration (CI) service
* <img width=20 height=20 src="https://codecov.io/static/favicons/favicon-32x32.png"> [Codecov](https://codecov.io/) - Code Coverage
* <img width=20 height=20 src="https://yarnpkg.com/favicon.ico"> [Yarn](https://yarnpkg.com/) - Package Manager

## Deployed to
* <img width=20 height=20 src="https://firebase.google.com/favicon.ico"> [Firebase](https://rin-anidb.firebaseapp.com)
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://anidb.netlify.com)
