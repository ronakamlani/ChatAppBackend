import { body, check } from 'express-validator';
import { UserDocument } from '../models/UserModel';
import userService from '../services/user.service';


const registrationValidationRule = [
    check('firstName')
    .notEmpty()
    .isAlpha()
    .withMessage("The First Name should be required and contain only letters.")
    .isLength({ min: 1, max:256 }),
    
    check('lastName')
    .notEmpty()
    .isAlpha()
    .withMessage("The Last Name should be required and contain only letters.")
    .isLength({ min: 1, max:256 }),
    
    check('password')
    .notEmpty()
    .withMessage("Password is required expected minimum 6 and maximum 256 character allows")
    .isLength({min:6,max:256}),

    body('confirmPassword')
    .custom((value, { req })=>{
        console.log("req.body.password !== req.body.confirmPassword",req.body.password , value,req.body.password !== value);
        
        if(req.body.password !== value){
            
            throw new Error("Confirm password is not equal to password");
        }

        return true;
        
    }),

    check('email','Email is required or entered invalidly.')
    .notEmpty()
    .isEmail()
    .isLength({ min: 1, max:256 }),

    body('email')
    .custom(async(value)=>{
        const user:UserDocument = await userService.findOneByUsername(value);
        if(user){
            throw new Error('Email address already exists, please choose another one');
        }        
    })
];

export default registrationValidationRule;