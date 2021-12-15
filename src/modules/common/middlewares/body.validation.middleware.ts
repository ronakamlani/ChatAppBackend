import express from 'express';
import { ValidationError, validationResult } from 'express-validator';
import {ResponseInterface} from '../interfaces/ResponseInterface';

/**
 * Reusable validation response handler middleware
 * @param req : express
 * @param res : express
 * @param next : express
 * * Usage : app.use(YOUR-<EXPRESS-VALIDATOR-RULES>-,BodyValidationMiddlware,(req,res)=>{  })
 */
class BodyValidationMiddleware {
    verifyBodyFieldsErrors(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const response:ResponseInterface<null,ValidationError[] > = {
                error : errors.array(),
                ok : false,
                data : null,
            }
            return res.status(400).json(response);
        }
        return next();
    }
}

export default new BodyValidationMiddleware();
