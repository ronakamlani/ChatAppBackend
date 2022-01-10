import {
    describe,
    it,
    afterEach
} from 'mocha';

import {
    expect
} from 'chai';

import request from 'supertest';

import app from '../../../../app';
import { AuthorizationCodeDocument, AuthorizationCodeModel } from '../../../authrizationCode/models/authorizationCode.model';
import { UserDocument, userModel } from '../../../user/models/UserModel';
import { AccessTokenClass, AccessTokenModel } from '../../../accessToken/models/accessToken.model';
import { RefreshTokenClass, RefreshTokenModel } from '../../../refreshToken/models/refreshToken.model';
import { clientRand } from '../../../common/utilities/__test__/__fixture__/client.fixture';
import { 
    userRand,
    userPassword,
    userFakePassword,
} from '../../../common/utilities/__test__/__fixture__/user.fixture';
import clientService from '../../../client/services/client.service';
import { authorizationCode1 } from '../../../common/utilities/__test__/__fixture__/authroizationCode.fixture';
import { Types } from 'mongoose';
import authorizationCodeService from '../../../authrizationCode/services/authorizationCode.service';
import { ClientDocument } from '../../../client/models/ClientModel';

import debug from 'debug';
import utils from '../../../common/utilities/utils';
import moment from 'moment';
import refreshTokenService from '../../../refreshToken/services/refreshToken.service';

const log = debug("auth.integrations.spec");

// const anauthroizedTests = [
//     //User
//     [
//         {email:"ssdfd@gmail.com"},
//         {password:userFakePassword}
//     ],
//     //Client
//     [
//         {clientId: "243dfsd" },
//         {clientSecret: "wrewr" }
//     ]
// ];


const clientUserCreator = async()=>{
    const userRand1 = userRand();
    const userObj = new userModel(userRand1);
    await userObj.save();

    const clientRand1 = clientRand();
    const client:ClientDocument = await clientService.create(clientRand1.name);
    
    return {
        userRand1,
        userObj,
        clientRand1,
        client,
    }
}

const authorizationCodeCreator = async(userId:Types.ObjectId,clientId:Types.ObjectId,days?:number)=>{

    const authorizationCodeObj = authorizationCode1(clientId,userId,days||1);
    const authorizationCodeDbObj = await authorizationCodeService.create(authorizationCodeObj);

    return {
        
        authorizationCodeObj,
        authorizationCodeDbObj,
    };
}

const testAuthTokenStatus = async(
    authorizationCodeDbObj:AuthorizationCodeDocument,
    client:ClientDocument,
    userObj:UserDocument,
    errorCode?:number)=>{

    expect(authorizationCodeDbObj.userId.toString()).equal(userObj.id);
    expect(client.id).equal(authorizationCodeDbObj.clientId.toString());
    
    const res = await request(app)
    .post('/api/auth/token')
    .set('Content-Type','application/json')
    .set('Accept', 'application/json')
    .set("Authorization", "basic " + Buffer.from(`${userObj.email}:${userObj.password}`).toString("base64") )
    .send({
        redirect_uri : "https://www.google.com", //Non blank param
        client_id : client.clientId,
        client_secret : client.clientSecret,
        "grant_type":"authorization_code",
        "code": authorizationCodeDbObj.authorizationCode
    });

    expect(res.status).equal(errorCode||401);
}


afterEach((done)=>{
    AuthorizationCodeModel.deleteMany({},()=>{
        userModel.deleteMany({},()=>{
            AccessTokenModel.deleteMany({},()=>{
                RefreshTokenModel.deleteMany({},()=>{
                    done();    
                });
            });
        });
    });
})

describe("Authorization Code Test",()=>{
    /**
     * Authroized
     */
    it("authorize Happy Scenario",async ()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        

        const res = await request(app)
        .get('/api/auth/authorize')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("Authorization", "basic " + Buffer.from(`${userObj.email}:${userPassword}`).toString("base64") )
        .query({
            redirect_uri : "https://www.google.com", //Non blank param
            "response_type":"code",
            clientId : client.clientId,
            "grand_type":"authorization_code",
        });

        log("res HAPPY**",res);
        expect(res.status).equal(200);
        expect(res.body.ok).equal(true);
        const data = res.body.data;
        const authorizationCode = await AuthorizationCodeModel.findOne({
            userId : userObj.id
        }).exec();
        log("data",authorizationCode,userObj.id,data);
        expect(data.code).equal(authorizationCode.authorizationCode);
        expect(data.code).not.equal(null);
    });

    /**
     * User invalid input test 
     */
     it("Invalid Email Test",async ()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        

        const res = await request(app)
        .get('/api/auth/authorize')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("Authorization", "basic " + Buffer.from(`${"rand"+userObj.email}:${userPassword}`).toString("base64") )
        .query({
            redirect_uri : "https://www.google.com", //Non blank param
            "response_type":"code",
            clientId : client.clientId,
            "grand_type":"authorization_code",
        });

        expect(res.status).equal(500);

    });

    it("Invalid Password Test",async ()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        const res = await request(app)
        .get('/api/auth/authorize')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("Authorization", "basic " + Buffer.from(`${userObj.email}:${userPassword+"1"}`).toString("base64") )
        .query({
            redirect_uri : "https://www.google.com", //Non blank param
            "response_type":"code",
            clientId : client.clientId,
            "grand_type":"authorization_code",
        });

        expect(res.status).equal(401);
    });

    it("Invalid Client Id Test",async ()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        const res = await request(app)
        .get('/api/auth/authorize')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("Authorization", "basic " + Buffer.from(`${userObj.email}:${userPassword+"1"}`).toString("base64") )
        .query({
            redirect_uri : "https://www.google.com", //Non blank param
            "response_type":"code",
            clientId : client.clientId+"4",
            "grand_type":"authorization_code",
        });

        expect(res.status).equal(401);
    });

    

});

describe("api/auth/token verify",()=>{
    it("Valid Credential", async ()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,1);

        expect(authorizationCodeDbObj.userId.toString()).equal(userObj.id);
        expect(client.id).equal(authorizationCodeDbObj.clientId.toString());
        
        const res = await request(app)
        .post('/api/auth/token')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("Authorization", "basic " + Buffer.from(`${userObj.email}:${userPassword}`).toString("base64") )
        .send({
            redirect_uri : "https://www.google.com", //Non blank param
            client_id : client.clientId,
            client_secret : client.clientSecret,
            "grant_type":"authorization_code",
            "code": authorizationCodeDbObj.authorizationCode
        });

        const data = res.body;

        const accessTokenDb = await AccessTokenModel.findOne({
            userId : userObj.id
        }).exec();

        const refreshTokenDb = await RefreshTokenModel.findOne({
            userId : userObj.id
        }).exec();

        expect(res.status).equal(200);
        expect(data.access_token).equal(accessTokenDb.accessToken);
        expect(data.refresh_token).equal(refreshTokenDb.refreshToken);
        
    });

    it(`Email not found test `, async()=>{
        const {
            userObj,
            client
        } = await clientUserCreator();

        userObj.email = 'rand@example.com';
        userObj.password = userPassword;

        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,1);
            
        await testAuthTokenStatus(authorizationCodeDbObj,client,userObj,500);
        
    });

    it(`Invalid Password test `, async()=>{
        const {
            userObj,
            client
        } = await clientUserCreator();

        userObj.password = userFakePassword;
        
        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,1);
            
        await testAuthTokenStatus(authorizationCodeDbObj,client,userObj,401);
        
    });

    it(`Invalid ClientId Test `, async()=>{
        const {
            userObj,
            client
        } = await clientUserCreator();

        client.clientId ="randomeId";
        userObj.password = userPassword;
        
        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,1);
            
        await testAuthTokenStatus(authorizationCodeDbObj,client,userObj,401);
        
    });

    it(`Invalid ClientSecret Test `, async()=>{
        const {
            userObj,
            client
        } = await clientUserCreator();

        client.clientSecret ="RandomeClientSecret";
        userObj.password = userPassword;
        
        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,1);
            
        await testAuthTokenStatus(authorizationCodeDbObj,client,userObj,401);
        
    });

    it("AccessToken Expired Test", async()=>{
        const {
            userObj,
            client
        } = await clientUserCreator();

        client.clientSecret ="RandomeClientSecret";
        userObj.password = userPassword;
        
        const {
            authorizationCodeDbObj
        } = await authorizationCodeCreator(userObj.id,client.id,0);
            
        await testAuthTokenStatus(authorizationCodeDbObj,client,userObj,401);
    });
});

describe("Logout Test",()=>{
    it("Should remove accessToken,refreshToken", async()=>{

        const {
            userObj,
            client
        } = await clientUserCreator();

        await authorizationCodeCreator(userObj.id,client.id,1);

        const valueForAccessToken = utils.getUid(256);
        const valueForRefreshToken = utils.getUid(256);
        const expireIn = moment();
        expireIn.add(process.env.token_expire_in_days,'days')

        const accessTokenClass = new AccessTokenClass({
            accessToken : valueForAccessToken,
            userId : userObj.id,
            clientId : client.id,
            expireIn : expireIn.toDate(),
        });
        const accessTokenObj = await AccessTokenModel.create(accessTokenClass);

        const refreshTokenClass = new RefreshTokenClass({
            refreshToken: valueForRefreshToken,
            userId: userObj.id,
            clientId: client.id,
            expireIn : expireIn.toDate(),
        });
        const refreshTokenObj = await refreshTokenService.create(refreshTokenClass);
        


        const res = await request(app)
        .post('/api/auth/logout')
        .set('Content-Type','application/json')
        .set('Accept', 'application/json')
        .set("authorization", "bearer " + accessTokenObj.accessToken  )
        .send({
        });

        const accessTokenObjAfter = await AccessTokenModel.findOne({
            _id : accessTokenObj.id
        }).exec();

        const refreshTokenObjAfter = await AccessTokenModel.findOne({
            _id : refreshTokenObj.id
        }).exec();

        expect(res.status).equal(200);
        expect(accessTokenObjAfter).equal(null);
        expect(refreshTokenObjAfter).equal(null);
        
    });
});