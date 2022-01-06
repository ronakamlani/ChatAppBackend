import { Types } from "mongoose";
import { 
    RefreshTokenDocument,
    RefreshTokenClass,
    RefreshTokenSchema,
    RefreshTokenModel,
 } from "../models/refreshToken.model";


class RefreshTokenDao{
    refreshTokenModel = RefreshTokenModel;
    refreshTokenSchema = RefreshTokenSchema;

    async findOneByRefreshToken(refreshToken:string):Promise<RefreshTokenDocument>{
        return this.refreshTokenModel.findOne({
            refreshToken
        }).exec();
    }
    
    async create(data:RefreshTokenClass):Promise<RefreshTokenDocument>{
        const refreshTokenObj = new this.refreshTokenModel(data);
        await refreshTokenObj.save();
        return refreshTokenObj;
    }

    async removeByUserIdAndClientId(clientId:Types.ObjectId,userId:Types.ObjectId){
        return this.refreshTokenModel.remove({
            clientId,
            userId
        });
    }

    async removeById(_id:Types.ObjectId) {
        return this.refreshTokenModel.deleteOne({
            _id:_id
        }).exec();
    }
}

export default RefreshTokenDao;