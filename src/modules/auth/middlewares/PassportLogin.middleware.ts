import passport from 'passport';
import {Strategy as LocalStrategy} from 'passport-local';

import { CommonError, ResponseInterface } from "../../common/interfaces/ResponseInterface";

import UserService from '../../user/services/user.service';
//import {UserDto} from '../../user/dtos/user.dto';
import debug from 'debug';
import { UserDocument } from '../../user/models/UserModel';

const log: debug.IDebugger = debug('app:passport-login-middleware');

/**
 * ? The passport strategy to define the rule for the login.
 * * This middlware usage with passport
 * 
 */
passport.use(new LocalStrategy(
    async function(username:string, password:string, done:passport.type.function){
    
    try{
      const user:UserDocument = await UserService.findOneByUsername(username);
      
      if (!user) {
        
        const response: ResponseInterface<UserDocument,CommonError> = {
          ok : false,
          data : null,
          error : {
            message: 'Incorrect username or password.',
            e : null,
          }
        }
        return done(null, false, response );
      }

      user.comparePassword(password,(err: unknown, isMatch: boolean)=>{
        if(isMatch){
          return done(null, user);
        }
        else{
          const response: ResponseInterface<UserDocument,CommonError> = {
            ok : false,
            data : null,
            error : {
              message: 'Incorrect username or password.',
              e : null,
            }
          }
          return done(null, false, response);
        }
      });
    }
    catch(e:unknown){
      log("e",e);
      return done(e);
    }
      
  }
));