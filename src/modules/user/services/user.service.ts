import { ResponseInterface } from "../../common/interfaces/ResponseInterface";
import { UserDocument } from "../models/UserModel";
import userDao from "../daos/user.dao";
import { CreateUserDto } from "../dtos/createUser.dto";
import { Types } from "mongoose";
//import { UserDto } from "../dtos/user.dto";
// import { PatchUserDto } from "../dtos/patchUser.dto";
// import { PutUserDto } from "../dtos/putUser.dto";

class UserService  {
    async addUser(resource: CreateUserDto): Promise<ResponseInterface<UserDocument|UserDocument[],null>> {

        const user:UserDocument = await  userDao.create(resource);

        return {
            ok : true,
            data : user,
            error: null,
        }
    }

    async findOneByUsername(email:string): Promise<UserDocument>{
        return userDao.findOneByUsername(email);
    }

    async findOneById(id: Types.ObjectId ): Promise<UserDocument>{
        return userDao.findOneById(id);
    }

    // async deleteById(id: string) {
    //     return UserDao.removeUserById(id);
    // }

    // async list(limit: number, page: number) {
    //     return UserDao.getUsers(limit, page);
    // }

    // async patchById(id: string, resource: PatchUserDto): Promise<any> {
    //     return UserDao.updateUserById(id, resource);
    // }

    // async putById(id: string, resource: PutUserDto): Promise<any> {
    //     return UserDao.updateUserById(id, resource);
    // }

    // async readById(id: string) {
    //     return UserDao.getUserById(id);
    // }

    // async getUserByEmail(email: string) {
    //     return UserDao.getUserByEmail(email);
    // }
    // async getUserByEmailWithPassword(email: string) {
    //     return UserDao.getUserByEmailWithPassword(email);
    // }
}

export default new UserService();