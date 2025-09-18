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
}

export interface ServiceConfig {
    // app config
    allowedOrigins: string[];
    port: number;
    routerPrefix: string;

    serviceName?: string;

    // database config
    mongoDbUrl: string;
    disableSecurityHeaders?: boolean;

    // realm config
    enableRealmSummary?: boolean;
    enableServiceLogging?: boolean;
    enableRequestLogging?: boolean;
    enableRoutesLogging?: boolean;
}
