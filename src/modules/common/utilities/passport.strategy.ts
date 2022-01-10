import { UserDocument } from '../../user/models/UserModel';
import passport from 'passport';
import {Types} from 'mongoose';
import debug from 'debug';
import {BasicStrategy} from 'passport-http';
import BearerStrategy from 'passport-http-bearer';
import LocalStrategy from 'passport-local';
import ClientPasswordStrategy from 'passport-oauth2-client-password';
import { AccessTokenDocument } from '../../accessToken/models/accessToken.model';

import clientService from '../../client/services/client.service';
import userService from '../../user/services/user.service';
import accessTokenService from '../../accessToken/services/accessToken.service';

const debugLog: debug.IDebugger = debug('Passport.strategy');


const localStrategy = async (email:string, password:string, done) => {
	debugLog("localStrategy");
	let user:UserDocument;
	try{
		user = await userService.findOneByUsername(email);
	}
	catch(err){
		done(err,null);
		return;
	}
	
	if(user){
		user.comparePassword(password,(err,isPass)=>{
			console.log("isPass",err,isPass);
			if(err){
				return done(err,null);
			}
			if(isPass){
				return done(null,user);
			}
			else{
				return done("Invalid Username or Password",null);
			}
		});
	}
	else{
		return done("Invalid Username or Password",null);
	}

};

const verifyClient = async(clientId:string, clientSecret:string, done)=> {
	debugLog("verifyClient");
	
	try{
		const clientInfo = await clientService.findOneByClientId(clientId);
		debugLog("verifyClient",clientInfo,clientSecret);
		if(!clientInfo || clientInfo.clientSecret !== clientSecret){
			return done(null, null);
		}
		return done(null, clientInfo);
	}
	catch(err){
		done(err,null);
}

}

const verifyUser = async (username:string,password:string,done)=>{
	debugLog("verifyUser",username);
	try{
		const user = await userService.findOneByUsername(username);
		
		if(!user){
			return done({
				message:"User Does not exists"
			},null);
		}

		user.comparePassword(password,(err,isMatch)=>{
			
			if(err) return done(err,null);

			if(!isMatch) return done(err,false);

			return done(null,user);

		})

	}catch(err){
		return done(err,null);
	}
};
  
 

const bearerStrategy = async (accessToken, done) => {
	debugLog("bearerStrategy");
	let accessTokenObj:AccessTokenDocument;

	try{
		accessTokenObj = await accessTokenService.findOneByAccessToken(accessToken);

		if(accessTokenObj && accessTokenObj.userId){
			const user = await userService.findOneById(accessTokenObj.userId);
			
			if(!user){
				done(null,false);
			}
			else{

				//TODO token expire check

				done(null,user,{
					//TODO
					scope :"*",
				});
			}
		}
		else{
			return done("No Such Token found.",null);
		}
	}
	catch(err){
		done(err,null);
	}

};

  
/**
 * BasicStrategy & ClientPasswordStrategy
 *
 * These strategies are used to authenticate registered OAuth clients. They are
 * employed to protect the `token` endpoint, which consumers use to obtain
 * access tokens. The OAuth 2.0 specification suggests that clients use the
 * HTTP Basic scheme to authenticate. Use of the client password strategy
 * allows clients to send the same credentials in the request body (as opposed
 * to the `Authorization` header). While this approach is not recommended by
 * the specification, in practice it is quite common.
 */

passport.use("basic",new BasicStrategy(verifyUser));

passport.use(new ClientPasswordStrategy(verifyClient));

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token). If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */

passport.use(new BearerStrategy(bearerStrategy));

/**
 * 
 * LocalStrategy
 *
 * This strategy is used to authenticate users based on a username and password.
 * Anytime a request is made to authorize an application, we must ensure that
 * a user is logged in before asking them to approve the request.
*/
passport.use(new LocalStrategy(localStrategy));
  
passport.serializeUser((user:UserDocument, done:(...unknown)=>void) =>{
	debugLog("serializeUser");
	done(null, user.id);
});
 
passport.deserializeUser(async (id:Types.ObjectId, done:(err:unknown,user:UserDocument|null)=>void) => {
	debugLog("deserializeUser");
	try{
		const user = await userService.findOneById(id);
		done(null,user);
	}
	catch(err){
		done(err,null);
	}
 });

export {
	passport,
	verifyUser,
	verifyClient,
	localStrategy,
	bearerStrategy,
};





