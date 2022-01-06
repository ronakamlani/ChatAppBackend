import mongoose, { Types } from 'mongoose';
import bcrypt from 'bcrypt';

import mongooseService from '../../common/services/mongoose.service';
import {rolesArr} from '../constants/roles.array';

export const collectionName = 'User';
const mongooseObj: typeof mongoose = mongooseService.getMongoose();

export type comparePasswordCallback = (err: unknown, isMatch: boolean)=>void;

export class UserClass{
    id: Types.ObjectId;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles: string[];

    constructor(data:{
        email: string;
        password: string;
        firstName: string;
        lastName: string;
        roles: string[];
    }){
        this.email = data.email;
        this.password = data.password;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.roles = data.roles;
    }

    comparePassword(candidatePassword: string, cb:comparePasswordCallback):void{
        bcrypt.compare(candidatePassword, this.password, (err: mongoose.Error, isMatch: boolean) => {
            cb(err, isMatch);
        });
    }

}

//export type UserDocument = mongoose.Document & {
// export interface UserDocument extends mongoose.Document{
//     email: string;
//     password: string;
//     firstName: string;
//     lastName: string;
//     roles: string[];

//     comparePassword:comparePasswordFunction;
// }

export const userSchema = new mongooseObj.Schema({
    email: {
        type : String,
        required : true,
        unique : true,
    },
    password: {
        type : String,
        required : true,
    },
    firstName: {
        type : String,
        requied : true,
        minlength : 1,
        maxlength : 256,
    },
    lastName: {
        type : String,
        requied : true,
        minlength : 1,
        maxlength : 256,
    },
    roles: {
        type : [String],
        //enum : rolesArr,
        default : [rolesArr[0]],
    },
}, { 
    id: true,
    timestamps: true
});

userSchema.method('comparePassword',UserClass.prototype.comparePassword);

export interface UserDocument extends UserClass, Document { }


export const userModel = mongooseService.getMongoose().model<UserDocument>(collectionName, userSchema);