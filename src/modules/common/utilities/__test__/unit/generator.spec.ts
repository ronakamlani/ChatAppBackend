import {
    describe,
    it,
} from 'mocha';
import { 
    expect
} from 'chai';
import bcrypt from 'bcrypt';

import {
    generateHashSync,
    generateHash,
    generateSaltSync,
} from '../../generator';


const comparePassResult = (comparePass:string,hasStr:string)=>{
    return bcrypt.compareSync(comparePass, hasStr);

}

describe("Test generateHashSync",()=>{
    it("Without Error",async ()=>{
        const pass = "123456";
        const comparePass1 = "123456";
        const comparePass2 = "654321";
        const salt = await generateSaltSync();
        const hashStr = await generateHashSync(pass,salt);
        const hasStr1 =  await generateHash(pass);

        console.log("hashStr",hashStr);
        //console.log("hashStr",hashStr,hasStr1,comparePassResult(comparePass1,hashStr));
        expect(comparePassResult(comparePass1,hashStr)).equal(true);
        expect(comparePassResult(comparePass1,hasStr1)).equal(true);

        expect(comparePassResult(comparePass2,hashStr)).equal(false);
        expect(comparePassResult(comparePass2,hasStr1)).equal(false);
        

    });
});