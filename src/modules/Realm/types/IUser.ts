import { IGroup } from './IGroup';

interface IUser {
  username: string;
  phone?: string;
  email?: string;
  password: string;
  firstName?: string;
  lastName?: string;
  group: IGroup;
  method: 'email' | 'phone' | 'username';
  toDto(): {
    username: string;
    email?: string;
    phone?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    method: 'email' | 'phone' | 'username';
    group: {
      name: string;
      isDefault: boolean;
      clientPath: string;
    };
  };
}

export type { IUser };
