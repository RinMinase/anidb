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
    <a href="https://preactjs.com/">
        <img alt="Preact" src="https://img.shields.io/badge/Preact-%5E10.9-673AB8.svg?logo=preact&style=for-the-badge">
    </a>
    <a href="https://angular.io/">
        <img alt="Preact" src="https://img.shields.io/badge/Vite-%5E3.0-646CFF.svg?logo=vite&style=for-the-badge">
    </a>
    <a href="https://nodejs.org">
        <img alt="Node" src="https://img.shields.io/badge/node-%5E16.0%20%7C%7C%20%5E17.0-brightgreen.svg?logo=node.js&logoColor=white&style=for-the-badge">
    </a>
</p>


## Introduction
This project uses Preact (Faster & Leaner React) with Vite and deployed to Netlify using Circle CI


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


### Project Structure
    .
    ├── .circleci/              # Circle CI configuration folder
    ├── public/                 # Public assets folder
    ├── dist/                   # Compiled production code
    ├── src/                    # Project source code
    │   ├──<module-name>/
    │   │   ├──components/      # Module sub-components
    │   │   └── index.tsx       # Module entry point
    │   ├── common/             # Project-wide reusable code
    │   │   ├── components/
    │   │   └── services/
    │   ├── main.tsx            # Main module
    │   ├── routes.tx           # Routes file
    │   └── ...                 # Other source code files
    ├── .editorconfig           # IDE / Editor configuration
    ├── .env                    # Environment file
    ├── index.html              # Main HTML file (Vite bundler entry point)
    ├── tsconfig.json           # Source code TypeScript configuration file
    ├── tsconfig.node.json      # Vite TypeScript configuration file
    └── ...                     # Other project files


### Project tasks

Task automation is based on [Yarn scripts](https://yarnpkg.com/lang/en/docs/cli/run/) or [NPM scripts](https://docs.npmjs.com/misc/scripts).

| Task                       | Description                                     |
| -------------------------- | ----------------------------------------------- |
| `yarn dev` or `yarn start` | Run **dev server** on `http://localhost:3000/`  |
| `yarn preview`             | Run **prod server** on `http://localhost:3000/` |
| `yarn build`               | Build production code to `dist` folder          |


## Built with
* <img width=20 height=20 src="https://preactjs.com/favicon.ico"> [Preact](https://preactjs.com/) - Web Framework
* <img width=20 height=20 src="https://www.typescriptlang.org/favicon-32x32.png"> [TypeScript](https://www.typescriptlang.org/) - Language syntax
* <img width=20 height=20 src="https://vitejs.dev/logo.svg"> [Vite](https://vitejs.dev/) - Source Code Bundler
* <img width=20 height=20 src="https://emotion.sh/logo-32x32.png"> [Emotion CSS](https://emotion.sh/) - CSS pre-processor
* <img width=20 height=20 src="https://mui.com/static/favicon.ico"> [Material UI](https://mui.com/) - Layouting Framework
* <img width=20 height=20 src="https://dmmj3mmt94rvw.cloudfront.net/favicon-undefined.ico"> [Circle CI](https://circleci.com/) - Continuous Integration (CI) service
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://netlify.com) - Hosting Platform


## Deployed to
* <img width=20 height=20 src="https://www.netlify.com/img/global/favicon/favicon-32x32.png"> [Netlify](https://anidb.netlify.com)
