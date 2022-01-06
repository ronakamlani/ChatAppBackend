import { ObjectId } from "mongoose";

export class ClientInfoDto{
    _id:ObjectId;
    name?:string;
    clientId?:string;
    clientSecret:string;
    isTruested:boolean;
}