import { check } from 'express-validator';

const authorizationValidationRule = [
    check('response_type')
    .notEmpty()
    .withMessage("Response Type Required."),
    
    check('clientId')
    .notEmpty()
    .withMessage("Client id required."),
];

export default authorizationValidationRule;