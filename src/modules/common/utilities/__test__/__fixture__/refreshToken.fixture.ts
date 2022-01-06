import { RefreshTokenClass } from "../../../../refreshToken/models/refreshToken.model";
import utils from "../../utils";
import {Types} from "mongoose";
import moment from "moment";

export const fakeRefreshToken = ()=>{
    return utils.getUid(256);
}

export const refreshToken1 = (
    clientId : Types.ObjectId,
    userId: Types.ObjectId,
    days?: number
    )=>{
    
    const today = moment();
    today.add(days||1,'days');
    return new RefreshTokenClass({
        userId : userId,
        refreshToken : utils.getUid(256),
        clientId : clientId,
        expireIn : today.toDate(),
    })
};