import express from 'express';
import { CommonRoutesConfig } from "../../common/common.routes.config";

import {
  tokenProcess,
} from '../../common/utilities/oauth2.strategy';

import authController from '../controllers/auth.controller';
import authorizationValidationRule from '../validations/authorization.validation';

//import passport from '../../common/utilities/passport.strategy';

 /**
  * % Access at :/api/auth
  * ? Class Responsibility : 
  *  1. Login
  *  3. Refresh Token
  *  2. Logout
  */
  export class AuthRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'clientRoutes');
    }

    configureRoutes() {

        const authRouter = express.Router();

        /**
        * @api {post} /api/oauth2/token Use Authorization Code to Request an Access Token
        * @apiVersion 1.0.0
        * @apiName GetAccessToken
        * @apiGroup Auth
        *
        * @apiParam {Number} client_id [Required] The client ID of the native client application.
        * @apiParam {String} client_secret [Required] The client secret code of the native client application.
        * @apiParam {String} grant_type [Required] Indicated the type of grant you are using. For an authorization code grant, the value is <b>authorization_code</b>.
        *
        * @apiHeader {String} Authorization [Required] Authorization value.
        *
        * @apiSuccess {String} access_token AccessToken
        * @apiSuccess {String} token_type Token type. Value is <b>Bearer</b>
        * @apiSuccess {Number} expires_in Total seconds when Access Token will be expired.
        * @apiSuccess {String} resource Resource where the Access Token is valid.
        * @apiSuccess {String} refresh_token Refresh Token for generating a new Access Token.
        *
        * @apiSuccessExample {json} Success-Response:
        *   HTTP/1.1 200 OK
        *    {
        *    	"access_token": "b5a4f56a8fd082802159d9a55fb614fcdacfea1eb72ed8ffb772f46c4c7f2e65",
        *    	"token_type": "Bearer",
        *    	"expires_in": "3600",
        *    	"resource": "node-api-oauth2-boilerplate",
        *    	"refresh_token": "b5a4f56a8fd082802159d9a55fb614fcdacfea1eb72ed8ffb772f46c4c7f2e65"
        *    }
        *
        * @apiUse InternalAPIServerError
        * @apiUse UnauthorizedError
        **/
         authRouter.post('/token', 
         authorizationValidationRule,
         this.passport.authenticate('basic', { session: false }),
         this.passport.authenticate('oauth2-client-password', { session: false }),
         tokenProcess
       );

        /**
        * @api {post} /api/auth/refresh-token Use Refresh Token to Request a New Access Token
        * @apiVersion 1.0.0
        * @apiName ExchangeRefreshTokenOnAccessToken
        * @apiGroup Auth
        *
        * @apiParam {Number} client_id [Required] The client ID of the native client application.
        * @apiParam {String} client_secret [Required] The client secret code of the native client application.
        * @apiParam {String} grant_type [Required] Indicates the type of grant being used. In this case, the value must be <b>refresh_token</b>.
        * @apiParam {String} refresh_token [Required] The refresh token that was included in the response that provided the access token.
        *
        * @apiHeader {String} Authorization [Required] Authorization value.
        *
        * @apiSuccess {String} access_token AccessToken
        * @apiSuccess {String} token_type Token type. Value is <b>Bearer</b>
        * @apiSuccess {Number} expires_in Total seconds when Access Token will be expired.
        * @apiSuccess {String} resource Resource where the Access Token is valid.
        * @apiSuccess {String} refresh_token Refresh Token for generating a new Access Token.
        *
        * @apiSuccessExample {json} Success-Response:
        *   HTTP/1.1 200 OK
        *    {
        *    	"access_token": "b5a4f56a8fd082802159d9a55fb614fcdacfea1eb72ed8ffb772f46c4c7f2e65",
        *    	"token_type": "Bearer",
        *    	"expires_in": "3600",
        *    	"resource": "node-api-oauth2-boilerplate",
        *    	"refresh_token": "b5a4f56a8fd082802159d9a55fb614fcdacfea1eb72ed8ffb772f46c4c7f2e65"
        *    }
        *
        * @apiUse InternalAPIServerError
        * @apiUse UnauthorizedError
        **/
        authRouter.post('/refresh-token', 
          authorizationValidationRule,
          this.passport.authenticate('oauth2-client-password', { session: false }),
          tokenProcess
        );

        /**
        * @api {post} /api/auth/authorize Request an Authorization Code
        * @apiVersion 1.0.0
        * @apiName GetAuthorizationCode
        * @apiGroup Auth
        *
        * @apiParam {Number} clientId [Required] The client ID of the native client application.
        * @apiParam {String} response_type [Required] Specifies the requested response type. In an authorization code grant request, the value must be <b>code</b>.
        * @apiParam {String} [redirect_uri] [Not implemented] Specifies the reply URL of the application.
        *
        * @apiHeader {String} Authorization [Required] Authorization value.
        *
        * @apiSuccess {String} code AuthorizationCode.
        *
        * @apiSuccessExample {json} Success-Response:
        *   HTTP/1.1 200 OK
        *    {
        *    	"code": "b5a4f56a8fd082802159d9a55fb614fcdacfea1eb72ed8ffb772f46c4c7f2e65"
        *    }
        *
        * @apiUse InternalAPIServerError
        * @apiUse UnauthorizedError
        **/
        authRouter.get('/authorize', authorizationValidationRule,  this.passport.authenticate(['basic'], { session: false }), authController.authorizationCodegenerator);
        // authRouter.get('/authorize', authorizationValidationRule,  this.passport.authenticate(['basic'], { session: false }), (_req:unknown,res:unknown|any)=>{
        //   res.send("okok");
        // });

        // authRouter.get('/authorize', (req:passport.Request,res:express.Response)=>{
        //   res.send(req.login?"TRUE":"FALSE");
        // });
        
        
        authRouter.post('/logout',this.passport.authenticate('bearer', { session: false }),authController.doLogout);

        return authRouter;
    }
  }