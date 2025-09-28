export interface SendEmailBody {
    method: 'email';
    receiver: string;
    subject: string;
    content: string;
}
export interface INotificationClientSdk {
    available(): Promise<boolean>;
    sendEmail(body: SendEmailBody): Promise<void>;
}
export interface KeycloakConfig {
    keycloakServiceUrl: string;
    keycloakAdminPassword: string;
    keycloakAdminReAuthenticateIntervalMs?: number;
    localMongoDbURL: string;
    logKeycloakInfo?: boolean;
}
//# sourceMappingURL=index.d.ts.map