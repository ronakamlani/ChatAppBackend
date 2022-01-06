import { Types } from "mongoose";
import { AccessTokenClass, AccessTokenDocument, AccessTokenModel, AccessTokenSchema } from "../models/accessToken.model";

class AccessTokenDao{
    accessTokenModel = AccessTokenModel;
    accessTokenSchema = AccessTokenSchema;

    async findOneByAccessToken(accessToken:string):Promise<AccessTokenDocument>{
        return this.accessTokenModel.findOne({
            accessToken
        }).exec();
    }
    
    async create(data:AccessTokenClass):Promise<AccessTokenDocument>{
        const accessTokenObj = new this.accessTokenModel(data);
        await accessTokenObj.save();
        return accessTokenObj;
    }

    async removeByUserIdAndClientId(clientId:Types.ObjectId,userId:Types.ObjectId){
        return this.accessTokenModel.remove({
            clientId,
            userId
        });
    }

    removeByUserId(userId:Types.ObjectId){
        return this.accessTokenModel.remove({
            userId
        }).exec();
    }

    async findByUserIdAndClientId(userId:Types.ObjectId,accessToken:string):Promise<AccessTokenDocument>{
        return this.accessTokenModel.findOne(userId,accessToken);
    }
}

export default AccessTokenDao;