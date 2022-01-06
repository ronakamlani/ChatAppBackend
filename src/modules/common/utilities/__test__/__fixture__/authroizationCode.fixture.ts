import utils from "../../utils";
import {Types} from "mongoose";
import moment from "moment";
import { AuthorizationCodeClass } from "../../../../authrizationCode/models/authorizationCode.model";

export const fakeAuthorizationCodeToken = ():string=>{
    return utils.getUid(256);
}

export const authorizationCode1 = (
    clientId : Types.ObjectId,
    userId: Types.ObjectId,
    days?: number
    )=>{
    
    const today = moment();
    today.add(days||1,'days');

    return new AuthorizationCodeClass({
        authorizationCode: utils.getUid(256),
        userId: userId,
        clientId: clientId,
        redirectUri: "http://www.google.com",
        expireIn: today.toDate(),
    });
};