import { INotificationClientSdk, SendEmailBody } from "../types";

export class MockNotificationClientSdk implements INotificationClientSdk {
        constructor() {}
        async available(): Promise<boolean> {
                return true;
        }

        async sendEmail(body: SendEmailBody): Promise<void> {
                console.log(body);
        }
}
