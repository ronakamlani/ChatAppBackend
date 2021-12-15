import express from 'express';
import userService from "../services/user.service";

/**
 * ? We will perform user create, password change, profile edit kind of operations over here.
 */
class UsersController {
    //Create a new user
    async registration(req: express.Request, res: express.Response){
        res.status(200).json(userService.addUser(req.body));
    }
}

export default new UsersController();