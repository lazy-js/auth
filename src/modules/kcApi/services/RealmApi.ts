import { IRealmApi } from '../types';
import { KcAdmin } from './KcAdminApi';

export class RealmApi implements IRealmApi {
  constructor(public kcAdmin: KcAdmin) {
    this.kcAdmin = kcAdmin;
  }

  async createRealm(): Promise<{ realmName: string }> {
    const realm = await this.kcAdmin.realms.create({
      realm: this.kcAdmin.workingRealmName,
      verifyEmail: false,
      enabled: true,
      defaultRoles: [],
      requiredActions: [
        {
          alias: 'update_user_locale',
          name: 'Update User Locale',
          providerId: 'update_user_locale',
          enabled: false,
          defaultAction: false,
          priority: 10,
          config: {},
        },
        {
          alias: 'CONFIGURE_TOTP',
          name: 'Configure OTP',
          providerId: 'CONFIGURE_TOTP',
          enabled: false,
          defaultAction: false,
          priority: 20,
          config: {},
        },
        {
          alias: 'TERMS_AND_CONDITIONS',
          name: 'Terms and Conditions',
          providerId: 'TERMS_AND_CONDITIONS',
          enabled: false,
          defaultAction: false,
          priority: 30,
          config: {},
        },
        {
          alias: 'UPDATE_PASSWORD',
          name: 'Update Password',
          providerId: 'UPDATE_PASSWORD',
          enabled: false,
          defaultAction: false,
          priority: 40,
          config: {},
        },
        {
          alias: 'UPDATE_PROFILE',
          name: 'Update Profile',
          providerId: 'UPDATE_PROFILE',
          enabled: false,
          defaultAction: false,
          priority: 50,
          config: {},
        },
        {
          alias: 'VERIFY_EMAIL',
          name: 'Verify Email',
          providerId: 'VERIFY_EMAIL',
          enabled: false,
          defaultAction: false,
          priority: 60,
          config: {},
        },
        {
          alias: 'delete_account',
          name: 'Delete Account',
          providerId: 'delete_account',
          enabled: false,
          defaultAction: false,
          priority: 70,
          config: {},
        },
        {
          alias: 'webauthn-register',
          name: 'Webauthn Register',
          providerId: 'webauthn-register',
          enabled: false,
          defaultAction: false,
          priority: 80,
          config: {},
        },
        {
          alias: 'webauthn-register-passwordless',
          name: 'Webauthn Register Passwordless',
          providerId: 'webauthn-register-passwordless',
          enabled: false,
          defaultAction: false,
          priority: 90,
          config: {},
        },
        {
          alias: 'VERIFY_PROFILE',
          name: 'Verify Profile',
          providerId: 'VERIFY_PROFILE',
          enabled: false,
          defaultAction: false,
          priority: 100,
          config: {},
        },
        {
          alias: 'delete_credential',
          name: 'Delete Credential',
          providerId: 'delete_credential',
          enabled: false,
          defaultAction: false,
          priority: 1000,
          config: {},
        },
      ],
    });

    return realm;
  }

  async realmExists(): Promise<boolean> {
    // if the realm not exists the KcAdmin returns null

    const realm = await this.kcAdmin.realms.findOne({
      realm: this.kcAdmin.workingRealmName,
    });
    return !!realm;
  }

  async deleteRealm(): Promise<boolean> {
    if (await this.realmExists())
      await this.kcAdmin.realms.del({
        realm: this.kcAdmin.workingRealmName,
      });
    return true;
  }
}
