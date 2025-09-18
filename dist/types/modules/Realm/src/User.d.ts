import { CreateUserDto, IUser, UserJson } from "../types";
declare class User implements IUser {
    private readonly user;
    constructor(user: CreateUserDto);
    toJson(): UserJson;
}
export { User };
//# sourceMappingURL=User.d.ts.map