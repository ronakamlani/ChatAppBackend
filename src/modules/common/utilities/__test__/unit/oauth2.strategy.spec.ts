import {
    describe,
    it,
    afterEach
} from 'mocha';

import {
    expect
} from 'chai';

//import { ObjectId } from 'bson';

import { 
    generateAccessAndRefreshTokens ,
    authorizationCodeExchange,
    refreshTokenExchange,
} from '../../oauth2.strategy';
import { clientRand } from '../__fixture__/client.fixture';
import clientService from '../../../../client/services/client.service';
import { userModel } from '../../../../user/models/UserModel';
import { userRand } from '../__fixture__/user.fixture';
import { authorizationCode1, fakeAuthorizationCodeToken } from '../__fixture__/authroizationCode.fixture';
import authorizationCodeService from '../../../../authrizationCode/services/authorizationCode.service';
import { ClientModel } from '../../../../client/models/ClientModel';
import { AuthorizationCodeModel } from '../../../../authrizationCode/models/authorizationCode.model';
import { RefreshTokenModel } from '../../../../refreshToken/models/refreshToken.model';
import { AccessTokenModel } from '../../../../accessToken/models/accessToken.model';

/**
 * We will test individual oauth2 strategy over here.
 */

const commonFixtureCreator = async(days?:number)=>{
    const userRand1 = userRand();
    const userObj = new userModel(userRand1);
    userObj.save();

    const clientRand1 = clientRand();
    const client = await clientService.create(clientRand1.name);
    
    const authorizationCodeObj = authorizationCode1(userObj.id,client.id,days||1);
    const authorizationCodeDbObj = await authorizationCodeService.create(authorizationCodeObj);

    return {
        userRand1,
        userObj,
        clientRand1,
        client,
        
        authorizationCodeObj,
        authorizationCodeDbObj,
    };
}

afterEach((done)=>{

    ClientModel.deleteMany({},()=>{
        userModel.deleteMany({},()=>{
            AuthorizationCodeModel.deleteMany({},()=>{
                RefreshTokenModel.deleteMany({},()=>{
                    AccessTokenModel.deleteMany({},()=>{
                        done();
                    });
                });
            });
        });
    });
});

describe("generateAccessAndRefreshTokens Test" ,()=>{
    it("Happy scenario",(done)=>{
        (async ()=>{
            const {
                userObj,
                client,
            } = await commonFixtureCreator();
            generateAccessAndRefreshTokens(userObj.id,client.id,async(
                err:null|unknown,
                accessToken:string,
                refreshToken:string,
                )=>{
                    expect(err).to.equal(null);
                    expect(accessToken).to.not.equal(null);
                    expect(accessToken).to.not.equal("");
                    expect(refreshToken).to.not.equal(null);
                    expect(refreshToken).to.not.equal("");
                    
                    done();
                }
            );
        })();
    });
});
describe("AuthorizationCodeExchange test",()=>{
    it("Postive",(done)=>{
        (async()=>{
            const {
                
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();
            
            authorizationCodeExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    err:null|unknown,
                    accessToken:string,
                    refreshToken:string,
                    
                )=>{
                    expect(err).to.equal(null);
                    expect(accessToken).to.not.equal(null);
                    expect(accessToken).to.not.equal("");
                    expect(refreshToken).to.not.equal(null);
                    expect(refreshToken).to.not.equal("");
                    
                    done();
                }
            );
        })();
        
    });

    it("Authorization Code Not exists ",(done)=>{
        (async()=>{
            const {
                
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();
            
            authorizationCodeExchange(
                client,
                fakeAuthorizationCodeToken(),
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean|null,
                )=>{
                    expect(isSuccess).to.equal(false);
                    done();
                }
            );
        })();
        
    });

    it("Client Id expired",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator(-1);
            
            authorizationCodeExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:null|boolean,
                    // accessToken:string,
                    // refreshToken:string,
                    // addtionalInfo:{
                    //     expireIn : Date
                    // },
                )=>{
                    expect(isSuccess).to.equal(false);
                    
                    done();
                }
            );
        })();
        
    });

    it("Invalid Client Id",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                //client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();

            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);
            
            authorizationCodeExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean|null,
                )=>{
                    expect(isSuccess).to.equal(false);
                    done();
                }
            );
        })();
        
    });

    it("Invalid authorization Code",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                //client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();

            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);
            
            authorizationCodeExchange(
                client,
                fakeAuthorizationCodeToken(),
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean,
                )=>{

                    expect(isSuccess).to.equal(false);
                    
                    done();
                }
            );
        })();
        
    });
});


describe("RefreshToken test",()=>{
    it("Postive",(done)=>{
        (async()=>{
            const {
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();
            
            refreshTokenExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    err:null|unknown,
                    accessToken:string,
                    refreshToken:string,
                )=>{
                    expect(err).to.equal(null);
                    expect(accessToken).to.not.equal(null);
                    expect(accessToken).to.not.equal("");
                    expect(refreshToken).to.not.equal(null);
                    expect(refreshToken).to.not.equal("");

                    done();
                }
            );
        })();
        
    });

    it("Authorization Code Not exists ",(done)=>{
        (async()=>{
            const {
                
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();
            
            refreshTokenExchange(
                client,
                fakeAuthorizationCodeToken(),
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean,
                )=>{
                    expect(isSuccess).to.equal(false);
                    done();
                }
            );
        })();
        
    });

    it("Client Id expired",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator(-1);
            
            refreshTokenExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean,
                    // accessToken:string,
                    // refreshToken:string,
                    // addtionalInfo:{
                    //     expireIn : Date
                    // },
                )=>{
                    expect(isSuccess).to.equal(false);
                    
                    done();
                }
            );
        })();
        
    });

    it("Invalid Client Id",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                //client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();

            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);
            
            refreshTokenExchange(
                client,
                authorizationCodeDbObj.authorizationCode,
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean,
                )=>{
                    expect(isSuccess).to.equal(false);

                    done();
                }
            );
        })();
        
    });

    it("Invalid authorization Code",(done)=>{
        (async()=>{
            const {
                // accessTokenObj,
                // refreshTokenObj,
                
                //client,
                authorizationCodeDbObj,

            } = await commonFixtureCreator();

            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);
            
            refreshTokenExchange(
                client,
                fakeAuthorizationCodeToken(),
                authorizationCodeDbObj.redirectUri,
                async (
                    _err:null|unknown,
                    isSuccess:boolean,
                )=>{
                    
                    expect(isSuccess).to.equal(false);
                    
                    done();
                }
            );
        })();
        
    });
});