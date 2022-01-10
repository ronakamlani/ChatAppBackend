import express from 'express';
import { ResponseInterface } from '../interfaces/ResponseInterface';

export const error500 = (err:unknown,_req:express.Request,res:express.Response)=>{
    console.log("error500",err);
    
    const response:ResponseInterface<null,typeof err> = {
        ok:false,
        error: err,
        data: null,
    };

    return res.status(500).json(response);
}