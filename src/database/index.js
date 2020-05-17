import mongoose from 'mongoose';

class Database {
    constructor() {
        this.mongo();
    }

    mongo() {
        this.mongoConnection = mongoose.connect(
            `mongodb://${process.env.MONGO_IP_ADDRESS}/registration-manager`,
            { useNewUrlParser: true, useFindAndModify: true }
        );
    }
}

export default new Database();
