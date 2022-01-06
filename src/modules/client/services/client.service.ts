import clientInfoDao from '../daos/client.dao';


class ClientService extends clientInfoDao{
    constructor(){
        super();
    }
}

export default new ClientService;