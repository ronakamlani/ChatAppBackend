
import utils from '../../common/utilities/utils';
import mongoose, { Types } from 'mongoose';

import mongooseService from '../../common/services/mongoose.service';

export const collectionName = 'AccessToken';
const mongooseObj: typeof mongoose = mongooseService.getMongoose();

export class AccessTokenClass{
    id: Types.ObjectId;
    accessToken: string;
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    expireIn : Date;

    constructor(data:{
        accessToken: string,
        userId: mongoose.Types.ObjectId,
        clientId: mongoose.Types.ObjectId,
        expireIn: Date,
    }){
        this.accessToken =  data.accessToken;
        this.userId = data.userId;
        this.clientId = data.clientId;
        this.expireIn = data.expireIn;
    }

    isExpired(){
        return utils.isExpired(new Date(),this.expireIn);
    }

}

export const AccessTokenSchema = new mongooseObj.Schema({
    accessToken: {
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

AccessTokenSchema.method('isExpired',AccessTokenClass.prototype.isExpired);
export interface AccessTokenDocument extends AccessTokenClass, Document { }


export const AccessTokenModel = mongooseService.getMongoose().model<AccessTokenDocument>(collectionName, AccessTokenSchema);