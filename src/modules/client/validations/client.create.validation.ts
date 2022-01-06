import { check } from "express-validator";

export const clientCreateValidation = [
    check('name')
    .notEmpty()
    .isLength({ min: 1, max:256 })
    .withMessage('Name is required, and maximum 256 characters allows only.')
    ,
];