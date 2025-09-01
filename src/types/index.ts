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
