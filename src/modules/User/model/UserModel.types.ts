import { Model, Schema } from 'mongoose';

type AttributeValueType = string | boolean | number | string[];
interface LinkedPhone {
    phone: string;
    confirmCode: string;
    verified: boolean;
}

interface LinkedEmail {
    email: string;
    confirmCode: string;
    verified: boolean;
}

export interface User {
    keycloakUserId: string;
    username: string;
    email: string;
    phone: string;
    linkedPhones: LinkedPhone[];
    linkedEmails: LinkedEmail[];

    firstName: string;
    lastName: string;
    middleName: string;
    locale: string;
    // example:
    // apps: {
    //         "app1": ["client1", "client2"],
    //         "app2": ["client3", "client4"],
    // }
    apps: { name: string; clients: string[] }[];

    // example:

    /* the first key index represents the client is schema belong to */
    /* the second key index represents the actual attribute and then the value 

        customAttributes: {
                integration-map-client: {
                        centerId: ObjectId        
                }
        }
        
        
        */
    customAttributes: { [key: string]: { [key: string]: AttributeValueType } };

    /* 
                this represents the shared attributes between the all clients 
        */
    sharedAttributes: { [key: string]: AttributeValueType };
}

export interface IUserSchema extends Schema, User {
    _id: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserModel extends Model<IUserSchema> {}
