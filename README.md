[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com) [![Npm package version](https://badgen.net/npm/v/express)](https://npmjs.com/package/express) [![Minimum node.js version](https://badgen.net/npm/node/express)](https://npmjs.com/package/express) [![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/Naereen/StrapDown.js/blob/master/LICENSE) ![Issues](https://img.shields.io/github/issues/ronakamlani/ChatAppBackend) ![oauth2](https://img.shields.io/static/v1?label=oauth2&message=integrated&color=blue)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E) ![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white) ![SonalLint](https://img.shields.io/badge/SonarLint-CB2029?style=for-the-badge&logo=sonarlint&logoColor=white)





## Description
This project is an express.js boilerplate with the best folder structure practice and oauth2 login, registration flow along with the basic security standard and sonarqube(sonarLint).

## Documentations
1. Part1 : https://blog.erronak.com/nodejs/node-js-modular-folder-structure-and-best-coding-practice-overview-part-1/
2. Part 2 : https://blog.erronak.com/nodejs/node-js-modular-folder-structure-and-best-coding-practice-part-2-reusable-components/

## Next TODO
I am open to your suggestion, as I can see the following TODO should be next to complete the full project. 
| #Name | #Description | 
| :---:   | :--: |
| Scope  | oAuth2 contain a scope property, to restrict some resources, just like user roles |
| Client cors | I think we should add a field called "access_domains", we will compare the received request domain source. |
| Cache user | We can save DB time by cache user query |
| Socket.io | Active User list, Chat, Reply |

## Technology Stack
| #Name | #Reason | 
| :---:   | :--: |
| Node.js |  |
| Express.js |  |
| Typescript |  |
| Passport | for the OAuth purpose |
| Oauth 2 |  |

## Dependency
| #Name | #Description | 
| :---:   | :--: |
| Node.js |  |
| npm |  |
| Mongo DB |  |

## Installation
**Please make a sure you have created .env, .env.developer .env.production file successfully.You can copy keys from .env.example **
```bash
$ npm i
```

## Running the app

```bash
$ npm run start:dev //in the case of developer ".env.developer is required"
$ npm run clean #Will remove js compiled folder ./dist
$ npm run build //Build project
$ npm run start:prod //Without developer ".env.production is required"

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
$ npm run test:unit
$ npm run test:unit:debug #Use to insight and debug clearly.
$ npm run test:integration 
$ npm run test:integration:debug #Use to insight and debug clearly.
```

## Reach to me at 
https://www.techacorn.com
https://www.erronak.com

