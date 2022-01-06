import express from 'express';

import {ResponseInterface} from '../../common/interfaces/ResponseInterface';

//import {AuthExpressRequest} from '../../common/interfaces/AuthExpressRequest';
//import { ClientInfo } from '../dtos/ClientInfo.dto';

import clientService from '../services/client.service';
import { ClientDocument } from '../models/ClientModel';

class ClientController{
    
    // async getInfo(req:express.Request,res: AuthExpressRequest ){
    //     // const clientInfo =  new ClientInfo();
    //     // clientInfo.client_id = req.user._id;
    //     // clientInfo.name = req.user.
    //     // const responseInterface:ResponseInterface<null,[]> = {
    //     //     error : [],
    //     //     ok : false,
    //     //     data : null,
    //     // };
    //     // return res.status(200).json( responseInterface  );

    //     //return res.status(200).json(clientService.addUser(req.body));
    // }

    async create(req:express.Request,res:express.Response){
        const name = req.body['name'];

        const client = await clientService.create(name);

        const responseInterface : ResponseInterface<ClientDocument,[]> = {
            error : [],
            ok : true,
            data : client
        };
        return res.status(200).json( responseInterface );
    }
}

export default new ClientController;