## Description
This project is an express.js boilerplate with the best folder structure practice and oauth2 login, registration flow along with the basic security standard and sonarqube(sonarLint).

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
