import { IUserModel, IUserSchema } from '../model/UserModel.types';
import { createUserModel } from '../model/UserModel';
import { CreateUserPayload } from './UserRepo.types';
import { IUserRepository } from './UserRepo.types';

export class UserRepository implements IUserRepository {
    public model: IUserModel;
    constructor() {
        this.model = createUserModel().UserModel;
    }

    async createUser(user: CreateUserPayload) {
        return await this.model.create({
            keycloakUserId: user.keycloakUserId,
            username: user.username,
            email: user.email,
            phone: user.phone,
            locale: user.locale,
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,

            apps: [
                {
                    name: user.app,
                    clients: [user.client],
                },
            ],
            linkedEmails:
                user.method === 'email'
                    ? [
                          {
                              email: user.email,
                              confirmCode: user.confirmCode,
                              verified: user.verified,
                          },
                      ]
                    : [],
            linkedPhones:
                user.method === 'phone'
                    ? [
                          {
                              phone: user.phone,
                              confirmCode: user.confirmCode,
                              verified: user.verified,
                          },
                      ]
                    : [],
        });
    }

    async getUserById(id: string) {
        return await this.model.findById(id);
    }

    async getUserByEmail(email: string) {
        return await this.model.findOne({ email });
    }

    async getUserByPhone(phone: string) {
        return await this.model.findOne({ phone });
    }
    async getUserByUsername(username: string): Promise<IUserSchema | null> {
        return await this.model.findOne({ username });
    }

    async getUserByKeycloakId(uuid: string) {
        return await this.model.findOne({ keycloakUserId: uuid });
    }

    async verifyUserEmail(email: string) {
        // TODO : this is only working for the first email
        const user = await this.getUserByEmail(email);
        const newLinkedEmails = user?.linkedEmails.map((linkedEmail) => {
            if (linkedEmail.email === email) {
                linkedEmail.verified = true;
            }
            return linkedEmail;
        });

        return await this.model.findOneAndUpdate(
            { email },
            { $set: { linkedEmails: newLinkedEmails, updatedAt: new Date() } },
        );
    }
}
