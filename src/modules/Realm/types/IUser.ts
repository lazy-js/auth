import { IGroup, GroupJson } from './IGroup';

interface CreateUserBaseDto {
    method: 'email' | 'phone' | 'username';
    password: string;
    firstName?: string;
    lastName?: string;
}
interface CreateUserWithUsernameDto extends CreateUserBaseDto {
    method: 'username';
    username: string;
}
interface CreateUserWithEmailDto extends CreateUserBaseDto {
    method: 'email';
    email: string;
}
interface CreateUserWithPhoneDto extends CreateUserBaseDto {
    method: 'phone';
    phone: string;
}

export type CreateUserDto = (
    | CreateUserWithEmailDto
    | CreateUserWithPhoneDto
    | CreateUserWithUsernameDto
) & {
    group: IGroup;
};

export type UserJson = (
    | CreateUserWithEmailDto
    | CreateUserWithPhoneDto
    | CreateUserWithUsernameDto
) & {
    group: GroupJson;
};

interface IUser {
    toJson(): UserJson;
}

export type { IUser };
