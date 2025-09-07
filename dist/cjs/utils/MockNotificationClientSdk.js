"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockNotificationClientSdk = void 0;
class MockNotificationClientSdk {
    constructor() { }
    async available() {
        return true;
    }
    async sendEmail(body) {
        console.log(body);
    }
}
exports.MockNotificationClientSdk = MockNotificationClientSdk;
//# sourceMappingURL=MockNotificationClientSdk.js.map