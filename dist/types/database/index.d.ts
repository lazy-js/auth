import mongoose from 'mongoose';
import { EventEmitter } from 'events';
interface DatabaseConnectionEvents {
    connected: () => void;
    disconnected: () => void;
    error: (err: any) => void;
}
export declare class Database extends EventEmitter {
    emit<Event extends keyof DatabaseConnectionEvents>(event: Event, ...args: Parameters<DatabaseConnectionEvents[Event]>): boolean;
    on<Event extends keyof DatabaseConnectionEvents>(event: Event, listener: DatabaseConnectionEvents[Event]): this;
    once<Event extends keyof DatabaseConnectionEvents>(event: Event, listener: DatabaseConnectionEvents[Event]): this;
    private url;
    constructor(url: string);
    connect(): Promise<this>;
    disconnect(): Promise<this>;
    getConnection(): mongoose.Connection;
    dropDatabase(): Promise<this>;
}
export {};
//# sourceMappingURL=index.d.ts.map