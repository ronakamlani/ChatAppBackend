import { Types } from "mongoose";
import authorizationCodeDaos from "../daos/authorizationCode.dao";
import { AuthorizationCodeClass, AuthorizationCodeDocument } from "../models/authorizationCode.model";

class AuthorizationCodeService{
    async findOneByAuthorizationCode(authorizationCode:string):Promise<AuthorizationCodeDocument>{
        return authorizationCodeDaos.findOneByAuthorizationCode(authorizationCode);
    }

    async create(data:AuthorizationCodeClass):Promise<AuthorizationCodeDocument>{
        return authorizationCodeDaos.create(data);
    }

    async removeById(_id:Types.ObjectId){
        authorizationCodeDaos.removeById(_id);
    }
}

export default new AuthorizationCodeService;