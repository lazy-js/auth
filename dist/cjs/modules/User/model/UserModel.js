"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUserModel = createUserModel;
const mongoose_1 = __importDefault(require("mongoose"));
const phoneSchema = new mongoose_1.default.Schema({
    phone: { type: String },
    confirmCode: { type: String },
    verified: { type: Boolean },
}, { _id: false });
const emailSchema = new mongoose_1.default.Schema({
    email: { type: String },
    confirmCode: { type: String },
    verified: { type: Boolean },
}, { _id: false });
const appSchema = new mongoose_1.default.Schema({
    name: { type: String },
    clients: { type: [String] },
}, { _id: false });
function createUserModel() {
    const userSchema = new mongoose_1.default.Schema({
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
    if (!mongoose_1.default.models.User) {
        const UserModel = mongoose_1.default.model('User', userSchema);
        mongoose_1.default.models.User = UserModel;
    }
    return { UserModel: mongoose_1.default.models.User, userSchema };
}
//# sourceMappingURL=UserModel.js.map