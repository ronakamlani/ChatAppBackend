import express from 'express';
import { UserRoutes } from './user/routers/user.routes.config';
import { AuthRoutes } from './auth/routers/auths.routers.config';
import { ClientRoutes } from './client/routers/clients.routes.config';
import { error500 } from './common/errorHandler/errorHandler';

export const apiRouter = (app:express.Application)=>{
    
    const routers:express.Router = express.Router();

    routers.use('/user',(new UserRoutes(app)).configureRoutes() );

    routers.use('/auth',(new AuthRoutes(app)).configureRoutes() );

    routers.use('/client',(new ClientRoutes(app)).configureRoutes() );

    routers.use(error500);

    return routers;
}
