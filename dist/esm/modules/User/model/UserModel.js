import mongoose from 'mongoose';
const phoneSchema = new mongoose.Schema({
    phone: { type: String },
    confirmCode: { type: String },
    verified: { type: Boolean },
}, { _id: false });
const emailSchema = new mongoose.Schema({
    email: { type: String },
    confirmCode: { type: String },
    verified: { type: Boolean },
}, { _id: false });
const appSchema = new mongoose.Schema({
    name: { type: String },
    clients: { type: [String] },
}, { _id: false });
export function createUserModel() {
    const userSchema = new mongoose.Schema({
        keycloakUserId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        username: {
            type: String,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
        },
        email: {
            type: String,
            index: true,
            sparse: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            index: true,
            sparse: true,
            trim: true,
        },
        linkedPhones: [phoneSchema],
        linkedEmails: [emailSchema],
        firstName: { type: String },
        lastName: { type: String },
        middleName: { type: String },
        locale: { type: String },
        apps: [appSchema],
    }, {
        timestamps: true,
    });
    if (!mongoose.models.User) {
        const UserModel = mongoose.model('User', userSchema);
        mongoose.models.User = UserModel;
    }
    return { UserModel: mongoose.models.User, userSchema };
}
//# sourceMappingURL=UserModel.js.map