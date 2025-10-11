import { IUserModel, IUserSchema } from '../model/UserModel.types';
import { CreateUserPayload } from './UserRepo.types';
import { IUserRepository } from './UserRepo.types';
export declare class UserRepository implements IUserRepository {
    model: IUserModel;
    constructor();
    createUser(user: CreateUserPayload): Promise<import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getUserById(id: string): Promise<(import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getUserByEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getUserByPhone(phone: string): Promise<(import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    getUserByUsername(username: string): Promise<IUserSchema | null>;
    getUserByKeycloakId(uuid: string): Promise<(import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    verifyUserEmail(email: string): Promise<(import("mongoose").Document<unknown, {}, IUserSchema, {}, {}> & IUserSchema & Required<{
        _id: import("mongoose").Schema.Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateEmailConfirmCode(email: string, confirmCode: string): Promise<IUserSchema | null>;
}
//# sourceMappingURL=UserRepo.d.ts.map