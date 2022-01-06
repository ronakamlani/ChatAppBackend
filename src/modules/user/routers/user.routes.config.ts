/**
 * Auther : Ronak Amlani
 */
import express from 'express';
import {CommonRoutesConfig} from '../../common/common.routes.config';

import bodyValidationMiddleware from '../../common/middlewares/body.validation.middleware';
import userController from '../controllers/user.controller';
import registrationValidationRule from '../validation/registration.validation';

/**
 * % Access at :/api/user
 * ? Class Responsibility : 
 *  1. Validate the user input 
 *  2. Pass the input to the controller.
 */
export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'userRoutes');
    }
    
    // (we'll add the actual route configuration here next)
    configureRoutes() {
        

        const userRouter: express.IRouter = express.Router();

        //Registration
        userRouter.route("/registration").post( registrationValidationRule, bodyValidationMiddleware.verifyBodyFieldsErrors, userController.registration);

        //Map with the main app.

        return userRouter;
    }
}