
import utils from '../../common/utilities/utils';
import mongoose, { Types } from 'mongoose';

import mongooseService from '../../common/services/mongoose.service';

export const collectionName = 'RefreshToken';
const mongooseObj: typeof mongoose = mongooseService.getMongoose();

export class RefreshTokenClass{
    id: Types.ObjectId;
    refreshToken: string;
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    expireIn : Date;

    constructor(data:{
        refreshToken: string,
        userId: mongoose.Types.ObjectId,
        clientId: mongoose.Types.ObjectId,
        expireIn : Date,
    }){
        this.refreshToken =  data.refreshToken;
        this.userId = data.userId;
        this.clientId = data.clientId;
        this.expireIn = data.expireIn;
    }

    isExpired(){
        return utils.isExpired(new Date(),this.expireIn);
    }

}

export const RefreshTokenSchema = new mongooseObj.Schema({
    refreshToken: {
        type : String,
        required : true,
        unique : true,
    },
    userId: {
        type : mongoose.Types.ObjectId,
        required : true,
        ref : 'User',
    },
    clientId: {
        type : mongoose.Types.ObjectId,
        requied : true,
        ref:'Client',
    },
    expireIn : {
        type : Date,
        required:true,
    },

}, { 
    id: true,
    timestamps: true
});

RefreshTokenSchema.method('isExpired',RefreshTokenClass.prototype.isExpired);

export interface RefreshTokenDocument extends Document,RefreshTokenClass { }


export const RefreshTokenModel = mongooseService.getMongoose().model<RefreshTokenDocument>(collectionName, RefreshTokenSchema);