export class MockNotificationClientSdk {
    constructor() { }
    async available() {
        return true;
    }
    async sendEmail(body) {
        console.log(body);
    }
}
//# sourceMappingURL=MockNotificationClientSdk.js.map