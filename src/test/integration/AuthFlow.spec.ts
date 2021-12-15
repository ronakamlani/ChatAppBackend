import {
    describe,
    it,
    after,
    before,
} from 'mocha';
import { expect } from 'chai';
import app from '../../app';
import supertest from 'supertest';
import mongoose from 'mongoose';

import * as dotenv from 'dotenv';
import * as path from 'path';
import { getUserRandomObj, userRegistrationData1 } from '../data/Auth';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });

before((done:()=>void)=>{
    setTimeout(function(){
        done();    
    }, 500);
});
after((done:()=>void)=>{
    mongoose.connection.dropDatabase(()=>{
        mongoose.connection.close(()=>{
            //nothing
            done()
        });
    });
    
});

describe('env', function () {
    it('Check NODE_ENV',async ()=>{
        expect(process.env.NODE_ENV).to.equal("test");
    });
});

describe('61781150', () => {
    it('should pass', async () => {
        expect(process.env.MONGO_URI).to.equal('mongodb://localhost:27017/chatAppBackendTest');
        
    });
});

process.on('unhandledRejection', (err:unknown, p) => {
    console.error('unhandledRejection', err, p)
});



describe('users and auth endpoints', function () {

    it('Email Blank Validation', async function () {
        
        const userTestBodyCopy = Object.assign({},getUserRandomObj() );
        userTestBodyCopy.email = '';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        console.log("userTestBodyCopy",userTestBodyCopy,res.body.error);
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('email');
        

        
    });

    it('Invalid Email  Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.email = 'abc.xyz';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('email');
        
    });

    it('FirstName Blank Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.firstName = '';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('firstName');
        
    });

    it('FirstName Is Alphabet Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.firstName = 'dsf545';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);
        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('firstName');
        
    });

    it('LastName Blank Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.lastName = '';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('lastName');
        
    });

    it('LastName Is alpha Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.lastName = 'Sfds545';
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);
 
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('lastName');
        
    });

    it('Email Length Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.email = "OurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetools.abc@gmail.com";
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('email');
        
    });

    it('First name Length Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.firstName = "OurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsabcgmailcom";
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('firstName');
        
    });

    it('Last name Length Validation', async function () {
        const userTestBodyCopy = Object.assign({},getUserRandomObj());
        userTestBodyCopy.lastName = "OurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsOurmissionistoempoweranyonetobuildwebsitesusingopensourcetoolsabcgmailcom";
        const res = await supertest(app).post('/api/user/registration').send(userTestBodyCopy);

        
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('lastName');
        
    });

    it('should create the user auth/registration', async function () {
        const res = await supertest(app).post('/api/user/registration').send(userRegistrationData1);

        //console.log("res",res);
        expect(res.status).to.equal(200);
        
        
    });

    it('Email Unique Validation auth/registration', async function () {
        const res = await supertest(app).post('/api/user/registration').send(userRegistrationData1);

        //console.log("res",res);
        expect(res.status).to.equal(400);
        expect(res.body.error[0].param).to.equal('email');        
        
    });
});
