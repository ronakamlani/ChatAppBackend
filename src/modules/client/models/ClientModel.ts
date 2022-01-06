import mongoose, { Types } from 'mongoose';

import mongooseService from '../../common/services/mongoose.service';

export const collectionName = 'Client';
const mongooseObj: typeof mongoose = mongooseService.getMongoose();

export class ClientClass{
    id:Types.ObjectId;
    name: string;
    clientId: string;
    clientSecret: string;
    isTrusted: boolean;

    constructor(data:{
        name: string,
        clientId: string,
        clientSecret: string,
        isTrusted: boolean,
    }){
        this.name = data.name;
        this.clientId = data.clientId;
        this.clientSecret = data.clientSecret;
        this.isTrusted = data.isTrusted;
    }

}

export const ClientSchema = new mongooseObj.Schema({
    name: {
        type : String,
        required : true,
    },
    clientId: {
        type : String,
        required : true,
        minlength : 6,
        maxlength : 20,
    },
    clientSecret: {
        type : String,
        requied : true,
        minlength : 1,
        maxlength : 256,
    },
    isTrusted: {
        type : Boolean,
        requied : true,
        minlength : 1,
        maxlength : 256,
    },
}, { 
    id: true,
    timestamps: true
});

export interface ClientDocument extends ClientClass, Document { }


export const ClientModel = mongooseService.getMongoose().model<ClientDocument>(collectionName, ClientSchema);