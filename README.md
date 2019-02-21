<h1 align="center"> Rin Minase's Anime Database </h1>

<p align="center">
    <a href="https://circleci.com/gh/RinMinase/anidb/tree/ngx">
        <img alt="Circle-CI" src="https://img.shields.io/circleci/project/github/RinMinase/anidb/ngx.svg?logo=circleci">
    </a>
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
        <img alt="Node" src="https://img.shields.io/badge/node-%5E6.14.0%20%7C%7C%20%5E8.10.0%20%7C%7C%20%3E%3D9.10.0-green.svg?logo=node.js&logoColor=white">
    </a>
    <a href="https://yarnpkg.com/">
        <img alt="Yarn" src="https://img.shields.io/badge/yarn-%5E1.10.0-blue.svg">
    </a>
</p>

## Introduction
_Add info here_

## Getting Started

### Creating and cloning the project
_Add info here_

### Project Structure

#### Directory Structure
    .
    ├── .tmp                          # Local development server 
    ├── dist                          # Local production server
    ├── src                           # Project source code
    │   ├── app                       # Project components
    │   │   ├── core                  # System-wide components
    │   │   │   ├── constants         # Project constants
    │   │   │   ├── directives        # Project directives
    │   │   │   └── services          # Project services
    │   │   │       └── builders      # Project builders
    │   │   ├── modules               # Project modules
    │   │   │   └── <module-name>     # Module folder (refer to structure below)
    │   │   ├── index.config.js       # Configuration file for main module
    │   │   └── index.module.js       # Main module
    │   ├── assets                    # Project assets
    │   │   ├── firebase              # Firebase configurations
    │   │   ├── gulp                  # Gulp files
    │   │   ├── styles                # Stylesheet folder 
    │   │   │   └── chunks            # Stylesheet modules
    │   │   ├── testing               # Testing asets
    │   │   │   └── tests             # Unit tests
    │   │   ├── .env                  # Environment variables
    │   │   ├── .env.example          # Environment variables template
    │   │   ├── favicon.ico           # Wepage icon
    │   │   └── robots.txt            # Robots file
    │   ├── res                       # Cordova resources folder
    │   │   └── android               # Android resources
    │   │       ├── hooks             # Android build hooks
    │   │       ├── icon              # Android icons
    │   │       └── screen            # Android splash screens
    │   └── index.html                # Main HTML file
    ├── .editorconfig                 # IDE / Editor configuration
    ├── .eslintrc                     # JS linting configuration
    ├── .firebaserc                   # Firebase project configuration
    ├── .sasslintrc                   # SCSS linting configuration
    ├── .travis.yml                   # Travis deployment configuration
    ├── config.xml                    # Cordova build configuration
    ├── firebase.json                 # Firebase hosting configuation
    ├── gulpfile.js                   # Main gulp file
    └── ...                           # Other project files

#### Module Structure
    .
    ├── <sub-module name>      # Sub-module
    │    └── ...               # Sub-module files
    ├── <name>.controller.js   # Module controller
    ├── <name>.html            # Module template
    ├── <name>.module.js       # Module
    └── <name>.scss            # Module stylesheet

### Building the project
_Add info here_

### Bundling the project for Android
_Add info here_

### Deploying the project to Firebase
_Add info here_

### Project tasks

Task automation is based on [Gulp tasks](https://gulpjs.com/), [Yarn scripts](https://yarnpkg.com/lang/en/docs/cli/run/) and [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Task                                  | Description                                                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| `gulp serve` or `yarn start`          | Run **development server** on `http://localhost:3000/` with file watching on changes                  |
| `gulp serve:dist` or `yarn run build` | Run **test server** on `http://localhost:3000/`                                                       |
| `gulp build` or `gulp`                |                                                                                                    
| `yarn test <args>`                    |                                                                                                       |   |
| `yarn run bundle`                     |                                                                                                       |
| `yarn run deploy`                     |                                                                                                       |
| `yarn run setup`                      |                                                                                                       |
| `yarn run setup-android`              |                                                                                                       |
| `yarn run setup-testing`              |                                                                                                       |

### Testing the project
_Add info here_

## Built with
* <img width=20 height=20 src="https://angular.io/assets/images/favicons/favicon.ico"> [Angular 7](https://angular.io/) - Web Framework
* <img width=20 height=20 src="https://www.typescriptlang.org/assets/images/icons/favicon-32x32.png"> [TypeScript](https://www.typescriptlang.org/) - Language syntax
* <img width=20 height=20 src="https://sass-lang.com/favicon.ico"> [Sassy CSS (SCSS)](https://sass-lang.com/) - CSS pre-processor
* <img width=20 height=20 src="https://getbootstrap.com/favicon.ico"> [Bootstrap 4](https://getbootstrap.com/) - HTML Framework (layout)
* <img width=20 height=20 src="https://firebase.google.com/favicon.ico"> [Firebase](https://firebase.google.com/) - Database
* <img width=20 height=20 src="https://webpack.js.org/assets/favicon.ico"> [Webpack 4](https://webpack.js.org/) - Project bundler
* <img width=20 height=20 src="https://cordova.apache.org/favicon.ico"> [Cordova](https://cordova.apache.org/) - Android APK bundler
* <img width=20 height=20 src="https://jasmine.github.io/favicon.ico"> [Jasmine](https://jasmine.github.io/) - Testing Framework
* <img width=20 height=20 src="https://karma-runner.github.io/assets/img/favicon/favicon.ico"> [Karma](https://karma-runner.github.io) - Test Runner Framework
* <img width=20 height=20 src="https://d3r49iyjzglexf.cloudfront.net/favicon-066b37ff00f0f968b903c13ae88b5573b62665aea8fbe91bb61c55dfa9446523.ico"> [Circle CI](https://circleci.com/) - Continuous Integration (CI) service
* <img width=20 height=20 src="https://yarnpkg.com/favicon.ico"> [Yarn](https://yarnpkg.com/) - Package Manager
