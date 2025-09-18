import { INotificationClientSdk, SendEmailBody } from '../types';
export declare class MockNotificationClientSdk implements INotificationClientSdk {
    constructor();
    available(): Promise<boolean>;
    sendEmail(body: SendEmailBody): Promise<void>;
}
//# sourceMappingURL=MockNotificationClientSdk.d.ts.map