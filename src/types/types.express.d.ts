import { UserDocument } from "../modules/user/models/UserModel";

declare global {
    namespace Express{
        export interface Request {
            user?: UserDocument;
        }

        export interface Request {
            user?: UserDocument;
        }
    }
  }