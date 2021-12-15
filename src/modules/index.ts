
import express from 'express';
import { CommonRoutesConfig } from './common/common.routes.config';
import { UserRoutes } from './user/user.routes.config';

export const initRoutes = (app:express.Application,routes:Array<CommonRoutesConfig>)=>{
    
    routes.push(new UserRoutes(app));

    return routes;
}
