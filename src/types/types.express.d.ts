import { UserDocument } from "../modules/user/models/UserModel";

declare module 'express' {
    export interface Request {
          user?: UserDocument;
      }
  }