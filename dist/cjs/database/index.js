"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const events_1 = require("events");
class Database extends events_1.EventEmitter {
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
            await mongoose_1.default.connect(this.url);
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
        await mongoose_1.default.connection.close();
        await mongoose_1.default.disconnect();
        this.emit('disconnected');
        return this;
    }
    getConnection() {
        return mongoose_1.default.connection;
    }
    async dropDatabase() {
        await mongoose_1.default.connection.dropDatabase();
        return this;
    }
}
exports.Database = Database;
//# sourceMappingURL=index.js.map