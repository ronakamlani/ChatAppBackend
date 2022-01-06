import express from 'express';

import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import cors from 'cors';
import debug from 'debug';

//import { CommonRoutesConfig } from './modules/common/common.routes.config';
import { initRoutes } from './modules/index';

import * as dotenv from 'dotenv';

const app: express.Application = express();

const setupApp = ()=>{
    //const server: http.Server = http.createServer(app);
    const port:number = parseInt(process.env.app_port) || 3000;
    //const routes: Array<CommonRoutesConfig> = [];
    const debugLog: debug.IDebugger = debug('app');

    dotenv.config({
        path : `.env.${process.env.NODE_ENV}`,
    });

    debugLog("process.env.app_port**",port);
    
    // here we are adding middleware to allow cross-origin requests
    app.use(cors());

    app.use(express.json());
    app.use(express.urlencoded({ extended: false}));

    // here we are preparing the expressWinston logging middleware configuration,
    // which will automatically log all HTTP requests handled by Express.js
    const loggerOptions: expressWinston.LoggerOptions = {
        transports: [new winston.transports.Console()],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.prettyPrint(),
            winston.format.colorize({ all: true })
        ),
    };

    if (!process.env.DEBUG) {
        loggerOptions.meta = false; // when not debugging, log requests as one-liners
    }

    // initialize the logger with the above configuration
    app.use(expressWinston.logger(loggerOptions));

    // here we are adding the UserRoutes to our array,
    // after sending the Express.js application object to have the routes added to our app!
    //initRoutes(app,routes);
    initRoutes(app);

    // this is a simple route to make sure everything is working properly
    const runningMessage = `Server running at http://localhost:${port}`;
    app.get('/', (_req: express.Request, res: express.Response) => {
        res.status(200).send(runningMessage)
    });

    
    app.listen(port,()=>{
        app.emit("app_started");
    });
    // server.listen(port, () => {
    //     routes.forEach((route: CommonRoutesConfig) => {
    //         debugLog(`Routes configured for ${route.getName()}`);
    //     });

    //     // our only exception to avoiding console.log(), because we
    //     // always want to know when the server is done starting up
    //     console.log(runningMessage);
    // });
}

const initApp = ()=>{
    setupApp();
    
}

initApp();


export default app;