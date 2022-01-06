import express from 'express';
import { ResponseInterface } from '../interfaces/ResponseInterface';

export const error500 = (err:unknown,_req:express.Request,res:express.Response,next:express.NextFunction)=>{
    const response:ResponseInterface<null,typeof err> = {
        ok:false,
        error: err,
        data: null,
    };

    return res.status(500).json(response);
}