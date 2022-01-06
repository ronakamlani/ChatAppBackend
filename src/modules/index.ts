
import express from 'express';
import { apiRouter } from './api.routers';

// export const initRoutes = (app:express.Application,routes:Array<CommonRoutesConfig>)=>{
    
//     routes.push(new UserRoutes(app));
    

//     return routes;
// }
export const initRoutes = (app:express.Application)=>{
    
    app.use('/api',apiRouter(app));
}
