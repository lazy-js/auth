import { IGroup, IUser } from '../types';
declare class User implements IUser {
    username: string;
    phone?: string;
    email?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    group: IGroup;
    method: 'email' | 'phone' | 'username';
    constructor(user: {
        username: string;
        phone?: string;
        email?: string;
        password: string;
        firstName?: string;
        lastName?: string;
        group: IGroup;
        method: 'email' | 'phone' | 'username';
    });
    toDto(): {
        username: string;
        email: string | undefined;
        phone: string | undefined;
        password: string;
        firstName: string | undefined;
        lastName: string | undefined;
        method: "email" | "phone" | "username";
        group: {
            name: string;
            isDefault: boolean;
            clientPath: string;
        };
    };
}
export { User };
//# sourceMappingURL=User.d.ts.map