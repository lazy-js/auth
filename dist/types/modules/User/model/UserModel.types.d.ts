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
    apps: {
        name: string;
        clients: string[];
    }[];
    customAttributes: {
        [key: string]: {
            [key: string]: AttributeValueType;
        };
    };
    sharedAttributes: {
        [key: string]: AttributeValueType;
    };
}
export interface IUserSchema extends Schema, User {
    createdAt: Date;
    updatedAt: Date;
}
export interface IUserModel extends Model<IUserSchema> {
}
export {};
//# sourceMappingURL=UserModel.types.d.ts.map