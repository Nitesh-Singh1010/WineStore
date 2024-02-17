# xwines-dashboard - React, TypeScript, Webpack 5

This boilerplate is all you need for frontend project development with ReactJs and other required dependencies

### Prerequisite

- [node](https://nodejs.org/en/) - v18.18.2
- [yarn](https://classic.yarnpkg.com/en/docs/install) - v1.22.21
- [Webpack](https://webpack.js.org/blog/2020-10-10-webpack-5-release/)\*\* (5.x)

### Stack

- [React](https://reactjs.org/)\*\* (18.x)
- [Typescript](https://www.typescriptlang.org/)\*\* (5.x)

### Tools

- [Eslint](https://eslint.org/)
- [Prettier](https://prettier.io/)

### Web components

- This project uses [Material UI](https://mui.com/material-ui/getting-started/) for custom components

## Local set up

##### Clone the repo

`git clone git@github.com:xwines-in/xwines-dashboard.git`

##### Get into the taa-ai-rl directory

`cd xwines-dashboard`

##### Install dependencies

1. Run `yarn install`

##### Run the project locally - Dev

Using yarn - `yarn dev`

- App served @ `http://localhost`

##### Build and Run the project - Prod

Using yarn - `yarn build && yarn start`  
Using docker - `docker build -t xwines-dashboard-prod -f Dockerfile.prod . && docker run -it -p 80:80 xwines-dashboard-prod`

- App served @ `http://localhost`


**Note**: This project uses `yarn` instead of `npm`

## App folder structure

```
XWINES-DASHBOARD
├── build
├── node_modules
├── public
│   ├── assets
│   │   ├── favicon
│   │   └── images
│   └── index.html
├── src
│   ├── components
│   ├── services
│   ├── App.scss
│   ├── App.tsx
│   ├── constants.ts
│   ├── Contexts.tsx
│   ├── index.scss
│   ├── index.tsx
│   ├── lang-en.json
│   ├── utils.ts
│   └── vars.json
├── webpack
│   ├── webpack.common.js
│   ├── webpack.config.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── .babelrc
├── .dockerignore
├── .eslintignore
├── .eslintrc
├── .gitignore
├── .npmignore
├── .prettierrc.js
├── package.json
├── README.md
├── tsconfig.json
└── yarn.lock
```
