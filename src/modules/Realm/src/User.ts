import { IGroup, IUser } from '../types';

class User implements IUser {
  public username: string;
  public phone?: string;
  public email?: string;
  public password: string;
  public firstName?: string;
  public lastName?: string;
  public group: IGroup;
  public method: 'email' | 'phone' | 'username';
  constructor(user: {
    username: string;
    phone?: string;
    email?: string;
    password: string;
    firstName?: string;
    lastName?: string;
    group: IGroup;
    method: 'email' | 'phone' | 'username';
  }) {
    this.phone = user.phone;
    this.email = user.email;
    this.password = user.password;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.username = user.username;
    this.group = user.group;
    this.method = user.method;
  }

  toDto() {
    return {
      username: this.username,
      email: this.email,
      phone: this.phone,
      password: this.password,
      firstName: this.firstName,
      lastName: this.lastName,
      method: this.method,
      group: this.group.toDto(),
    };
  }
}

export { User };
