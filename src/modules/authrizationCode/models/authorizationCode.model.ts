
import utils from '../../common/utilities/utils';
import mongoose, { Types } from 'mongoose';

import mongooseService from '../../common/services/mongoose.service';

export const collectionName = 'AuthorizationCode';
const mongooseObj: typeof mongoose = mongooseService.getMongoose();

export class AuthorizationCodeClass{
    id: Types.ObjectId;
    authorizationCode: string;
    userId: mongoose.Types.ObjectId;
    clientId: mongoose.Types.ObjectId;
    redirectUri: string;
    expireIn: Date;

    constructor(data:{
        authorizationCode: string,
        userId: mongoose.Types.ObjectId,
        clientId: mongoose.Types.ObjectId,
        redirectUri: string,
        expireIn: Date,
    }){
        this.authorizationCode =  data.authorizationCode;
        this.userId = data.userId;
        this.clientId = data.clientId;
        this.redirectUri = data.redirectUri;
        this.expireIn = data.expireIn;
    }

    isExpired(){
        return utils.isExpired(new Date(),this.expireIn);
    }

}

export const AuthorizationCodeSchema = new mongooseObj.Schema({
    authorizationCode: {
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
    redirectUri:{
        type: String,
        required: true,
    },
    
}, { 
    id: true,
    timestamps: true
});

AuthorizationCodeSchema.method('isExpired',AuthorizationCodeClass.prototype.isExpired);

export interface AuthorizationCodeDocument extends AuthorizationCodeClass, Document { }


export const AuthorizationCodeModel = mongooseService.getMongoose().model<AuthorizationCodeDocument>(collectionName, AuthorizationCodeSchema);