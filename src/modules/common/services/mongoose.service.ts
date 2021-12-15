import mongoose from 'mongoose';
import debug from 'debug';

import * as dotenv from 'dotenv';

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

    constructor() {
        this.connectWithRetry();
    }

    getMongoose() {
        return mongoose;
    }

    connectWithRetry = () => {
        log('Attempting MongoDB connection (will retry if needed)',process.env.MONGO_URI);
        mongoose
            .connect(process.env.MONGO_URI || '', this.mongooseOptions)
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
}
export default new MongooseService();
