export interface SendEmailBody {
    method: "email";
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
}
export interface ServiceConfig {
    allowedOrigins: string[];
    port: number;
    routerPrefix: string;
    disableRequestLogging?: boolean;
    disableSecurityHeaders?: boolean;
    enableRoutesLogging?: boolean;
    serviceName?: string;
    mongoDbUrl: string;
    logRealmSummary?: boolean;
    disableServiceLogging?: boolean;
}
//# sourceMappingURL=index.d.ts.map