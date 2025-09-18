"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(user) {
        this.user = user;
    }
    toJson() {
        if ('username' in this.user) {
            return {
                username: this.user.username,
                password: this.user.password,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                method: this.user.method,
                group: this.user.group.toJson(),
            };
        }
        else if ('email' in this.user) {
            return {
                email: this.user.email,
                password: this.user.password,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                method: this.user.method,
                group: this.user.group.toJson(),
            };
        }
        else if ('phone' in this.user) {
            return {
                phone: this.user.phone,
                password: this.user.password,
                firstName: this.user.firstName,
                lastName: this.user.lastName,
                method: this.user.method,
                group: this.user.group.toJson(),
            };
        }
        throw new Error('Invalid user');
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map