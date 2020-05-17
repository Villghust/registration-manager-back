import mongoose from 'mongoose';

const connection = {
    production: {
        url: `mongodb://${process.env.MONGO_DB_USERNAME}:${process.env.MONGO_DB_PASSWORD}@${process.env.MONGO_DB_IP}/registration-manager`,
        options: { useNewUrlParser: true, useFindAndModify: true },
    },
    development: {
        url: 'mongodb://localhost:27017/registration-manager',
        options: { useNewUrlParser: true, useFindAndModify: true },
    },
};

class Database {
    constructor() {
        this.mongo();
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            connection[process.env.ENVIRONMENT].url,
            connection[process.env.ENVIRONMENT].options
        );
    }
}

export default new Database();
