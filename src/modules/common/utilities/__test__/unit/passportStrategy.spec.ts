/**
 * Integration test apart from passport.strategy.ts.
 */
import { 
    verifyUser,
    verifyClient,
    localStrategy,
    bearerStrategy,
} from '../../passport.strategy';
import { UserDocument, userModel } from '../../../../user/models/UserModel';
//import { MongoMemoryServer } from 'mongodb-memory-server';
import { 
    user1,
    userRand,
    userPassword, 
    userFakePassword} from '../__fixture__/user.fixture';
//import { verifyUser } from "../../passport.strategy";

import {
    describe,
    it,
    before,
    afterEach,

} from 'mocha';

import {
    expect,
} from 'chai';
//import { ClientModel } from '../../../client/models/ClientModel';
import { clientData, clientRand } from '../__fixture__/client.fixture';
import clientService from '../../../../client/services/client.service';
import { ClientDocument, ClientModel } from '../../../../client/models/ClientModel';
import { AccessTokenModel } from '../../../../accessToken/models/accessToken.model';
import accessTokenService from '../../../../accessToken/services/accessToken.service';
import { accessToken1, fakeAccessToken } from '../__fixture__/accessToken.fixture';
import { ObjectId } from 'bson';

const resetUser = async ()=>{
    return userModel.remove({});
}
const resetToken = async ()=>{
    return AccessTokenModel.remove({});
}

const resetClient = ()=>{
    return ClientModel.remove({});
}

const createBearerStrategyObjs = async (isFakeUser:boolean)=>{
    const userRand1 = userRand();
    const userObj = new userModel(userRand1);
    userObj.save();

    const clientRand1 = clientRand();
    const client = await clientService.create(clientRand1.name);
    
    const accessTokenObj = accessToken1(client.id,isFakeUser ? new ObjectId(): userObj.id);
    const accessTokenDbObj = await accessTokenService.create(accessTokenObj);

    return {
        userRand1,
        userObj,
        clientRand1,
        client,
        accessTokenObj,
        accessTokenDbObj,
    };
}

before((done)=>{
    setTimeout(()=>{
        done();
    },100);
});

describe("VerifyUser test ",()=>{

    
    afterEach(async ()=>{
        console.log("afterEach");
        await resetUser();
    });

    it("Positive",(done)=> {
        (async()=>{
            //console.log("user1",user1);
            const userObj = new userModel(user1);
            await userObj.save();

            verifyUser(userObj.email,userPassword,(err:null|unknown,user:UserDocument)=>{
                
                //console.log("USER",user);
                expect(err).equal(null);
                expect(user).to.not.equal(null);
                expect(user.email).equal(user1.email);
                done();
            });
        })();

    });

    it("Non password match",(done)=> {
        (async()=>{
            //console.log("user1",user1);
            const userRand1 = userRand();
            const userObj = new userModel(userRand1);
            await userObj.save();

            verifyUser(userObj.email,userFakePassword,(err:null|unknown,user:UserDocument)=>{
                
                //console.log("USER",user);
                expect(err).to.not.equal(null);
                expect(user).to.equal(false);

                done();
            });
        })();

    });

    it("Non Existing user --> return user null",(done1) =>{
        const userRand2 = userRand();
        verifyUser(userRand2.email,userPassword,(err:null|unknown,user:UserDocument|boolean)=>{
            
            expect(err).to.not.equal(null);
            expect(user).equal(null);
            done1();
        });
    });
});

describe("Verify Client",()=>{

    afterEach( async ()=>{
        resetClient();
    });

    it("Positive", (done)=>{
        (async()=>{
            const client = await clientService.create(clientData.name);

            verifyClient(client.clientId,client.clientSecret,(err:null|unknown, clientReceived:ClientDocument|null )=>{
                //console.log("clientReceived ",err,clientReceived);
                expect(err).equal(null);
                expect(clientReceived).is.not.equal(null);
                expect(clientReceived.id).is.not.equal(null);
                expect(clientReceived.name).equal(client.name);
                done();
            });
        })();

    });

    it("Wrong Client Id", (done)=>{
        (async()=>{
            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);

            verifyClient(client.clientId+"Rand",client.clientSecret,(err:null|unknown, clientReceived )=>{
                expect(err).to.not.equal(null);
                expect(clientReceived).to.equal(null);
                done();
            });
        })();

    });

    it("Wrong Client Secret", (done)=>{
        (async()=>{
            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);

            verifyClient(client.clientId,client.clientSecret+"Rand",(err:null|any, clientReceived )=>{
                expect(err).to.not.equal(null);
                expect(clientReceived).to.equal(null);
                done();
            });
        })();

    });

    it("Blank Client Id", (done)=>{
        (async()=>{
            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);

            verifyClient("",client.clientSecret+"Rand",(err:null|unknown, clientReceived )=>{
                expect(err).to.not.equal(null);
                expect(clientReceived).to.equal(null);
                done();
            });
        })();

    });

    it("Blank Client Secret", (done)=>{
        (async()=>{
            const clientRand1 = clientRand();
            const client = await clientService.create(clientRand1.name);

            verifyClient(client.clientId,"",(err:null|unknown, clientReceived )=>{
                expect(err).to.not.equal(null);
                expect(clientReceived).to.equal(null);
                done();
            });
        })();

    });
});

describe("Local Strategy Test",()=>{
    afterEach( async ()=>{
        await resetUser();
    });

    it("Available User", (done)=>{
        (async()=>{
            const userObj = new userModel(user1);
            await userObj.save();

            localStrategy(userObj.email,userPassword,(err:null|unknown,user:UserDocument|null)=>{
                console.log("err user",err,user,user1);
                expect(err).to.equal(null);
                expect(user).to.not.equal(null);
                expect(user.email).to.equal(user1.email);
                done();
            });
        })();

    });

    it("Invalid Passworld", (done)=>{
        (async()=>{
            const userRand1 = userRand();
            const userObj = new userModel(userRand1);
            await userObj.save();

            localStrategy(userObj.email,userFakePassword,(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.not.equal(null);
                expect(user).to.equal(null);
                done();
            });
        })();

    });

    it("Non exist User", (done)=>{
        (async()=>{
            const userRand1 = userRand();
            const userObj = new userModel(userRand1);
            await userObj.save();

            localStrategy(user1.email,userFakePassword,(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.not.equal(null);
                expect(user).to.equal(null);
                done();
            });
        })();

    });

    it("Blank Email", (done)=>{
        (async()=>{
            const userRand1 = userRand();
            const userObj = new userModel(userRand1);
            await userObj.save();

            localStrategy("",userPassword,(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.not.equal(null);
                expect(user).to.equal(null);
                done();
            });
        })();

    });

    it("Blank Passworld", (done)=>{
        (async()=>{
            const userRand1 = userRand();
            const userObj = new userModel(userRand1);
            await userObj.save();

            localStrategy(userRand1.email,"",(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.not.equal(null);
                expect(user).to.equal(null);
                done();
            });
        })();

    });

});

describe("Brear Strategy (Access Token)",()=>{
    afterEach( async()=>{
        await resetUser();
        resetClient();
        await resetToken();
    });

    it("positive",(done)=>{
        ( async ()=>{
            const {
                //userRand1,
                userObj,
                //clientRand1,
                //client,
                //accessTokenObj,
                accessTokenDbObj,
            } = await createBearerStrategyObjs(false);

            bearerStrategy(accessTokenDbObj.accessToken,(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.equal(null);
                expect(user).to.not.equal(null);
                expect(user.email).to.equal(userObj.email);
                done();
            });

        })();
    });

    it("Non exists access token",(done)=>{
        ( async ()=>{
            await createBearerStrategyObjs(false);

            const fakeAccessToken1 = fakeAccessToken();

            bearerStrategy(fakeAccessToken1,(err:null|unknown,user:UserDocument|null)=>{
                expect(err).to.not.equal(null);
                expect(user).to.equal(null);
                done();
            });

        })();
    });

    it("Token Exists, user is not",(done)=>{
        ( async ()=>{
            const {
                //userRand1,
                //userObj,
                //clientRand1,
                //client,
                //accessTokenObj,
                accessTokenDbObj,
            } = await createBearerStrategyObjs(true);

            bearerStrategy(accessTokenDbObj.accessToken,(err:null|unknown,user:UserDocument|boolean)=>{
                expect(err).to.equal(null);
                expect(user).to.equal(false);
                done();
            });

        })();
    });

    ["",null,undefined].forEach(async(accessToken)=>{
        it(`Validate Token Value by ${accessToken}`,(done)=>{
            (async()=>{
               await createBearerStrategyObjs(true);

                bearerStrategy(accessToken,(err:null|unknown,user:UserDocument|boolean)=>{
                    expect(err).to.not.equal(null||false);
                    expect(user).to.equal(null);
                    done();
                });
            })();
        });
    });


});