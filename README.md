## Description
This project build for the create a better architecture and education purpose.
**The project is still under progres**

## Problem Statement
One to one chat using socket.io with included best coding pratice.

## Technology Stack
| #Name | #Reason | 
| :---:   | :--: |
| Node.js |  |
| Express.js |  |
| Typescript |  |
| socket.io | |
| Passport | for the oauth purpose |

## Dependency
| #Name | #Description | 
| :---:   | :--: |
| Node.js |  |
| npm |  |
| redis server |  |
| Mongo DB |  |

## Installation
**Please make a sure you have created .env file successfully. **
```bash
$ npm i
```

## Running the app

```bash
$ npm run start //Without developer ".env.production is required"
$ npm run start:dev //in the case of developer ".env.developer is required"
$ npm run build //Build the dist folder 
$ //Production is under progress

# watch mode
$ yarn start:dev

# production mode
$ yarn start:prod
```

## Test

```bash
$ npm run test //.env.test is required
$ npm run test:debug //Start testing along with debug mode ON ".env.test is required"
```
