import express from 'express';
import debug from 'debug';

export abstract class CommonRoutesConfig {
    app: express.Application;
    name: string;
    log: debug.IDebugger;

    constructor(app: express.Application, name: string) {
        this.app = app;
        this.name = name;
        this.log = debug(name);
        this.configureRoutes();
    }
    getName() {
        return this.name;
    }
    abstract configureRoutes(): express.Application;
}