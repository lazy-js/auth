import mongoose from 'mongoose';
import { EventEmitter } from 'events';

interface DatabaseConnectionEvents {
    connected: () => void;
    disconnected: () => void;
    error: (err: any) => void;
}

export class Database extends EventEmitter {
    emit<Event extends keyof DatabaseConnectionEvents>(
        event: Event,
        ...args: Parameters<DatabaseConnectionEvents[Event]>
    ): boolean {
        return super.emit(event, ...args);
    }

    on<Event extends keyof DatabaseConnectionEvents>(
        event: Event,
        listener: DatabaseConnectionEvents[Event],
    ): this {
        return super.on(event, listener);
    }

    once<Event extends keyof DatabaseConnectionEvents>(
        event: Event,
        listener: DatabaseConnectionEvents[Event],
    ): this {
        return super.once(event, listener);
    }
    private url: string;
    constructor(url: string) {
        super();
        this.url = url;
    }

    async connect() {
        try {
            await mongoose.connect(this.url);
            this.emit('connected');
            return this;
        } catch (err) {
            try {
                this.emit('error', err);
            } catch (err) {
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
