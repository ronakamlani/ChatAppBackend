import express from 'express';
import { AuthorizationCodeClass } from "../../authrizationCode/models/authorizationCode.model";
import authorizationCodeService from "../../authrizationCode/services/authorizationCode.service";
import accessTokenService from "../../accessToken/services/accessToken.service";
import clientService from "../../client/services/client.service";
import { ResponseInterface } from '../../common/interfaces/ResponseInterface';
import utils from '../../common/utilities/utils';
import moment from 'moment';
import { CommonController } from '../../common/controllers/common.Controller';

import debug from 'debug';
import refreshTokenService from '../../refreshToken/services/refreshToken.service';
import { UserDocument } from '../../user/models/UserModel';

const log =  debug("AuthController");

class AuthController extends CommonController{

    constructor(){
        super();
    }

    async authorizationCodegenerator(req:express.Request,res:express.Response, next : express.NextFunction ){
        const clientId = String(req.query['clientId']||"");
        const redirectUri = String(req.query['redirect_uri']||'');
        
        
        log("clientId",clientId,redirectUri);
        try{
            
            const clientDbObj = await clientService.findOneByClientId( clientId );
            
            if(!clientDbObj){
                const clientRes:ResponseInterface<null,string> = {
                    data: null,
                    ok: false,
                    error: "Client id not found",
                };
                return res.status(401).json(clientRes);
            }
            log("clientDbObj",clientDbObj);
            const today = moment();
            today.add( process.env.token_expire_in_days ,"days");
            const user:UserDocument = req.user;
            const authroziationCodeObj = new AuthorizationCodeClass({
                authorizationCode : utils.getUid(256),
                clientId : clientDbObj.id,
                userId : user.id,
                redirectUri : redirectUri,
                expireIn : today.toDate(),
            });
            const authorizationCodeDbObj = await authorizationCodeService.create(authroziationCodeObj);
            log("authorizationCodeDbObj",authorizationCodeDbObj);
            const response:ResponseInterface<{code:string},null> = {
                ok:true,
                error: null,
                data: {
                    code : authorizationCodeDbObj.authorizationCode
                }
            };

            return res.status(200).json(response);

        }catch(err){
            console.log("ERROR",err);
            return next(err);
        }
    }

    // async authorizationStep2(client:ClientDocument,user:UserDocument,done:(err:null|unknown,isOk:boolean)=>void){
    //     try{
    //         const accessTokenObj =  accessTokenService.findByUserIdAndClientId(user.id,client.clientId);
    //         done(null, accessTokenObj?true:false);
    //     }catch(err){
    //         done(err,false);
    //     }
    // }

    async doLogout(req:express.Request,res:express.Response){

        const user:UserDocument = req.user;
        authorizationCodeService.removeByUserId(user.id);
        accessTokenService.removeByUserId(user.id);
        refreshTokenService.removeByUserId(user.id);
        
        const response:ResponseInterface<null,null> ={
            ok : true,
            data : null,
            error : null,
        };

        res.status(200).json(response);
        
    }
}

export default new AuthController;