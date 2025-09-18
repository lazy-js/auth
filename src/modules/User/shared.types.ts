export type PrimaryField = 'email' | 'phone' | 'username';

export interface UserCreationDto {
    method: PrimaryField;
    username?: string;
    email?: string;
    phone?: string;
    locale?: string;
    firstName?: string;
    lastName?: string;
    password: string;
}

export interface LoginDto {
    method: PrimaryField;
    username?: string;
    email?: string;
    phone?: string;
    password: string;
}
