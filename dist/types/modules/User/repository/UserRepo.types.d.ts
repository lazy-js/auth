import { IUserModel, IUserSchema } from '../model/UserModel.types';
export interface CreateUserPayload {
    method: 'email' | 'phone' | 'username';
    username: string;
    email?: string;
    phone?: string;
    locale?: string;
    firstName?: string;
    lastName?: string;
    middleName?: string;
    confirmCode?: string;
    verified: boolean;
    keycloakUserId: string;
    app: string;
    client: string;
}
export declare class IUserRepository {
    model: IUserModel;
    createUser(user: CreateUserPayload): Promise<IUserSchema>;
    getUserById(id: string): Promise<IUserSchema | null>;
    getUserByEmail(email: string): Promise<IUserSchema | null>;
    getUserByPhone(phone: string): Promise<IUserSchema | null>;
    getUserByUsername(username: string): Promise<IUserSchema | null>;
    getUserByKeycloakId(uuid: string): Promise<IUserSchema | null>;
    verifyUserEmail(email: string): Promise<IUserSchema | null>;
}
//# sourceMappingURL=UserRepo.types.d.ts.map