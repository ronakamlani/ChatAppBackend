import { Types } from "mongoose";
import { AuthorizationCodeClass, AuthorizationCodeDocument, AuthorizationCodeModel, AuthorizationCodeSchema } from "../models/authorizationCode.model";

class AuthorizationCodeDao{
    authorizationCodeModel = AuthorizationCodeModel;
    authorizationCodeSchema = AuthorizationCodeSchema;

    async findOneByAuthorizationCode(authorizationCode:string):Promise<AuthorizationCodeDocument>{
        return this.authorizationCodeModel.findOne({
            authorizationCode
        }).exec();
    }
    
    async create(data:AuthorizationCodeClass):Promise<AuthorizationCodeDocument>{
        const authorizationCodeObj = new this.authorizationCodeModel(data);
        await authorizationCodeObj.save();
        return authorizationCodeObj;
    }

    async removeById(_id:Types.ObjectId){
        this.authorizationCodeModel.remove({_id:_id});
    }

    async removeByUserId(userId:Types.ObjectId){
        this.authorizationCodeModel.remove({userId:userId});
    }
}

export default AuthorizationCodeDao;