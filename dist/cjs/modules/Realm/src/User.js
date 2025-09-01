"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(user) {
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
exports.User = User;
//# sourceMappingURL=User.js.map