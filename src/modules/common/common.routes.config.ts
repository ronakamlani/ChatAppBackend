import express from 'express';
import debug from 'debug';

import  {passport}  from './utilities/passport.strategy';

export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    log: debug.IDebugger;
    passport:typeof passport;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.log = debug(name);

        this.app.use(passport.initialize());
        this.passport = passport;

        this.configureRoutes();
    }
    getName() {
        return this.name;
    }
    abstract configureRoutes(): express.Router;
}