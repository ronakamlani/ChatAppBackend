import { AccessTokenClass } from "../../../../accessToken/models/accessToken.model";
import utils from "../../utils";
import {Types} from "mongoose";
import moment from "moment";

export const fakeAccessToken = ()=>{
    return utils.getUid(256);
}

export const accessToken1 = (
    clientId : Types.ObjectId,
    userId: Types.ObjectId,
    days?: number
    )=>{
    
    const today = moment();
    today.add(days||1,'days');
    return new AccessTokenClass({
        userId : userId,
        accessToken : utils.getUid(256),
        clientId : clientId,
        expireIn : today.toDate(),
    })
};