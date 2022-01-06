import { AccessTokenClass, AccessTokenModel } from '../../accessToken/models/accessToken.model';
import { Types } from 'mongoose';
import oauth2orize from 'oauth2orize/lib';
import moment from 'moment';
import utils from './utils';
import refreshTokenService from '../../refreshToken/services/refreshToken.service';
import { 
  RefreshTokenClass,
  RefreshTokenDocument
} from '../../refreshToken/models/refreshToken.model';
import { ClientDocument } from '../../client/models/ClientModel';
import authorizationCodeService from '../../authrizationCode/services/authorizationCode.service';
import  debug from 'debug';
import accessTokenService from '../../accessToken/services/accessToken.service';

const log = debug("oauth2.strategy");
const server = oauth2orize.createServer();

// Generic error handler
/**
 * 
 * @param userId _id from User Collection
 * @param clientId _id from client collection
 * @param done Callback of the response
 *  * done(err)
 *  * done(err,accessToken,refreshToken,addtionalInfo)
 * @returns Nothing
 */
const generateAccessAndRefreshTokens = async (
    userId:Types.ObjectId,
    clientId:Types.ObjectId,
    done:(...unknown)=>void
    )=> {

    const valueForAccessToken = utils.getUid(256);
    const valueForRefreshToken = utils.getUid(256);
    const expireIn = moment();
    expireIn.add(process.env.token_expire_in_days,'days')

    try{
        const accessTokenClass = new AccessTokenClass({
            accessToken : valueForAccessToken,
            userId : userId,
            clientId : clientId,
            expireIn : expireIn.toDate(),
        });
        const accessTokenObj = await AccessTokenModel.create(accessTokenClass);
        

        const refreshTokenClass = new RefreshTokenClass({
            refreshToken: valueForRefreshToken,
            userId: userId,
            clientId: clientId,
            expireIn : expireIn.toDate(),
        });
        const refreshTokenObj = await refreshTokenService.create(refreshTokenClass);
        
        return done(null,
            accessTokenObj.accessToken ,
            refreshTokenObj.refreshToken,
            {
                expireIn: accessTokenObj.expireIn,
            }
        );
    }catch(e){
      log("ERROR",e);
        done(e);
    }
};

//TODO redirectUri
/**
 * 
 * @param client Client Document of Client Collection
 * @param code Authorized code from authorizationCode collection
 * @param _redirectURI : User input redirecturi during sign in
 * @param done :
 * * done(e)
 * * Or callback of generateAccessAndRefreshTokens()
 * @returns callback only.
 */
 const authorizationCodeExchange = async (client:ClientDocument, code:string, _redirectURI:string, done:(...unknown)=>void )=> {
  
  try{
      const authorizationCode = await authorizationCodeService.findOneByAuthorizationCode(code)

      if (!authorizationCode) return done(null, false);
      
      if (authorizationCode.isExpired()) return done(null, false);  
      
      if (client.id != authorizationCode.clientId) return done(null, false);

      log("authorizationCodeService",authorizationCode.id);
      authorizationCodeService.removeById(authorizationCode.id);
      
      generateAccessAndRefreshTokens(authorizationCode.userId, client.id, done);
      

  }
  catch(e){
      return done(e);
  }
}


// Use Refresh Token to Request a New Access Token
//TODO scope
/**
 * 
 * @param client Client Document of Client Collection
 * @param token : RefreshToken Code
 * @param _scope : Default value * for now.
 * @param done :
 * * done(error)
 * * or done of generateAccessAndRefreshTokens(...)
 * @returns 
 */
const refreshTokenExchange = async (client:ClientDocument, token:string, _scope, done:(...unknown)=>void)=> {
  
  try{
    const refreshTokenObj:RefreshTokenDocument =  await refreshTokenService.findOneByRefreshToken(token);

    if (!refreshTokenObj) return done(null, false);
    log("refreshTokenObj.isExpired",RefreshTokenClass,refreshTokenObj.isExpired,refreshTokenObj.isExpired());
    if (refreshTokenObj.isExpired()) return done(null, false);

    accessTokenService.removeByUserId(refreshTokenObj.userId);
    refreshTokenService.removeById(refreshTokenObj.id);

    generateAccessAndRefreshTokens(refreshTokenObj.userId, client.id, done);

  }
  catch(e){
    return done(e,null);
  }

};

// Exchanges authorization codes for access tokens.
server.exchange(oauth2orize.exchange.authorizationCode(authorizationCodeExchange));


server.exchange(oauth2orize.exchange.refreshToken(
  refreshTokenExchange
));

const tokenProcess = [
  server.token(),
  server.errorHandler(),
];

export {
  server,
  tokenProcess,
  generateAccessAndRefreshTokens,
  authorizationCodeExchange,
  refreshTokenExchange,
};