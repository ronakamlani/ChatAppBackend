import { ClientModel,ClientDocument } from "../models/ClientModel";
import utils from '../../common/utilities/utils';
import { Types } from "mongoose";

class ClientInfoDao {
    

    async findOneByClientId(clientId:string){
        return ClientModel.findOne({clientId:clientId}).exec();
    }

    async findOneById(_id:Types.ObjectId){
        return ClientModel.findOne({_id}).exec();
    }

    async create(name:string): Promise<ClientDocument>{
        const client = new ClientModel({
            name: name,
            clientId: utils.getUid(16),
            clientSecret: utils.getUid(16),
            isTrusted: true,
        });
        await client.save();

        return client;
    }

}

export default ClientInfoDao;