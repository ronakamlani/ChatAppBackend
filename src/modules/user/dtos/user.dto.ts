import { ObjectId } from 'mongoose';

export class UserDto {
    _id: ObjectId;
    name?: string;
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    roles?: string[];

}