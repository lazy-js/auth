import mongoose from 'mongoose';
import { EventEmitter } from 'events';
export class Database extends EventEmitter {
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    once(event, listener) {
        return super.once(event, listener);
    }
    constructor(url) {
        super();
        this.url = url;
    }
    async connect() {
        try {
            await mongoose.connect(this.url);
            this.emit('connected');
            return this;
        }
        catch (err) {
            try {
                this.emit('error', err);
            }
            catch (err) {
                // do nothing
            }
            throw err;
        }
    }
    async disconnect() {
        await mongoose.connection.close();
        await mongoose.disconnect();
        this.emit('disconnected');
        return this;
    }
    getConnection() {
        return mongoose.connection;
    }
    async dropDatabase() {
        await mongoose.connection.dropDatabase();
        return this;
    }
}
//# sourceMappingURL=index.js.map