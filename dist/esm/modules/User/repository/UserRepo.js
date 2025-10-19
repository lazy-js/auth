import { createUserModel } from '../model/UserModel';
export class UserRepository {
    constructor() {
        this.model = createUserModel().UserModel;
    }
    async createUser(user) {
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
            linkedEmails: user.method === 'email'
                ? [
                    {
                        email: user.email,
                        confirmCode: user.confirmCode,
                        verified: user.verified,
                    },
                ]
                : [],
            linkedPhones: user.method === 'phone'
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
    async getUserById(id) {
        return await this.model.findById(id);
    }
    async getUserByEmail(email) {
        return await this.model.findOne({ email });
    }
    async getUserByPhone(phone) {
        return await this.model.findOne({ phone });
    }
    async getUserByUsername(username) {
        return await this.model.findOne({ username });
    }
    async getUserByKeycloakId(uuid) {
        return await this.model.findOne({ keycloakUserId: uuid });
    }
    async verifyUserEmail(email) {
        // TODO : this is only working for the first email
        const user = await this.getUserByEmail(email);
        const newLinkedEmails = user === null || user === void 0 ? void 0 : user.linkedEmails.map((linkedEmail) => {
            if (linkedEmail.email === email) {
                linkedEmail.verified = true;
            }
            return linkedEmail;
        });
        return await this.model.findOneAndUpdate({ email }, { $set: { linkedEmails: newLinkedEmails, updatedAt: new Date() } });
    }
    async updateEmailConfirmCode(email, confirmCode) {
        const user = await this.getUserByEmail(email);
        if (!user)
            return null;
        const userAsObject = user.toObject();
        const linkedEmails = userAsObject.linkedEmails.map((el) => (el.email === email ? { ...el, confirmCode } : el));
        return await this.model.findOneAndUpdate({ email }, { linkedEmails: linkedEmails });
    }
}
//# sourceMappingURL=UserRepo.js.map