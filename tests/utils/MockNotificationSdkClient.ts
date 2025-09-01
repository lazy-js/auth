import { INotificationClientSdk } from '../../src';
import { SendEmailBody } from '../../src/types';

export class MockNotificationClientSdk implements INotificationClientSdk {
  constructor() {}
  async available(): Promise<boolean> {
    return true;
  }

  async sendEmail(body: SendEmailBody): Promise<void> {
    console.log(body);
  }
}
