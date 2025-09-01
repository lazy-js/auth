import mongoose from 'mongoose';
import { IUserSchema } from './UserModel.types';
export declare function createUserModel(): {
    UserModel: mongoose.Model<any, {}, {}, {}, any, any>;
    userSchema: mongoose.Schema<IUserSchema, mongoose.Model<IUserSchema, any, any, any, mongoose.Document<unknown, any, IUserSchema, any, {}> & IUserSchema & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }, any>, {}, {}, {}, {}, mongoose.DefaultSchemaOptions, IUserSchema, mongoose.Document<unknown, {}, mongoose.FlatRecord<IUserSchema>, {}, mongoose.ResolveSchemaOptions<mongoose.DefaultSchemaOptions>> & mongoose.FlatRecord<IUserSchema> & {
        _id: mongoose.Types.ObjectId;
    } & {
        __v: number;
    }>;
};
//# sourceMappingURL=UserModel.d.ts.map