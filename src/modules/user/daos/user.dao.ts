import * as UserModel from '../models/UserModel';
import debug from 'debug';
//import { UserDto } from '../dtos/user.dto';
import { CreateUserDto } from '../dtos/createUser.dto';

const log: debug.IDebugger = debug('app:users-dao');

class UserDao {
    userSchema = UserModel.userSchema;
    userModel = UserModel.userModel;

    constructor() {
        log('Created new instance of UsersDao');
    }

    async create(resource: CreateUserDto):Promise<UserModel.UserDocument>{
        
        const user = new this.userModel(resource);
        await user.save();

        return user;
    }

    async findOneByUsername(username:string):Promise<UserModel.UserDocument>{
        return this.userModel.findOne({
            username:username,
        }).exec();
    }
}

export default new UserDao();