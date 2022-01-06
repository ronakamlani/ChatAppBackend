import mongoose from 'mongoose';
import debug from 'debug';

import * as dotenv from 'dotenv';

import { MongoMemoryServer } from 'mongodb-memory-server';

dotenv.config({
    path : `.env.${process.env.NODE_ENV}`,
});

const log: debug.IDebugger = debug('app:mongoose-service');

//console.log("***ENV***",process.env.MONGO_URI||"NOTHING",process.env.NODE_ENV,mongoose.connect);

class MongooseService {
    private count = 0;
    private mongooseOptions = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,
        //useFindAndModify: false,
    };

    private mongoMemoryServer:MongoMemoryServer;

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    _connetMongoUri(uri:string){
        return mongoose
            .connect(uri,this.mongooseOptions);
    }

    connectWithRetry = async() => {
        log('Attempting MongoDB connection (will retry if needed)',process.env.MONGO_URI);

        this.mongoMemoryServer =  await MongoMemoryServer.create();
        const uri = process.env.NODE_ENV !== 'test' ? process.env.MONGO_URI || '': this.mongoMemoryServer.getUri();
            
        this._connetMongoUri(uri)
        .then(() => {
            log('MongoDB is connected');
        })
        .catch((err) => {
            const retrySeconds = 5;
            log(
                `MongoDB connection unsuccessful (will retry #${++this
                    .count} after ${retrySeconds} seconds):`,
                err
            );
            setTimeout(this.connectWithRetry, retrySeconds * 1000);
        });

    };
    
    async dbDisconnect(){
        if(this.mongoMemoryServer){
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
            await this.mongoMemoryServer.stop();
        }
    }
}
export default new MongooseService();
