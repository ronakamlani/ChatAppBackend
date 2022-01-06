/**
 * Auther : Ronak Amlani
 */
import express from 'express';
import bodyValidationMiddleware from '../../common/middlewares/body.validation.middleware';
import {CommonRoutesConfig} from '../../common/common.routes.config';
import clientController from '../controllers/client.controller';

import {clientCreateValidation} from '../validations/client.create.validation';
 
 /**
  * % Access at :/api/client
  * ? Class Responsibility : 
  *  1. Validate the client input 
  *  2. Pass the input to the controller.
  */
 export class ClientRoutes extends CommonRoutesConfig {
     constructor(app: express.Application) {
         super(app, 'clientRoutes');

     }
     
     // (we'll add the actual route configuration here next)
     configureRoutes() {
    
 
         const clientRouter: express.IRouter = express.Router();

        clientRouter.post('/create', 
        clientCreateValidation, 
        bodyValidationMiddleware.verifyBodyFieldsErrors,
        clientController.create);
 
         //Registration
         //clientRouter.route("/info").get(passport.authentication('bearer',{seassion:false}),clientController.info);
 
         //Map with the main app.
         //this.app.use('/api/client',clientRouter)
 
         return clientRouter;
     }
 }