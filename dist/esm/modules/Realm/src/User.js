import { BadConfigError } from '@lazy-js/error-guard';
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
        throw new BadConfigError('Invalid user');
    }
}
export { User };
//# sourceMappingURL=User.js.map