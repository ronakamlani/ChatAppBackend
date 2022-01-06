import express from 'express';
import { ClientDocument } from 'src/modules/client/models/ClientModel';
import { UserDocument } from 'src/modules/user/models/UserModel';

export interface AuthExpressRequest extends express.Request {
    user : UserDocument;
    client :ClientDocument;
}