import { NetworkError } from '@keycloak/keycloak-admin-client';
import errors from '../config/errors';

function msgIncludes(err: NetworkError, ...str: string[]) {
  const message = err.message.toLowerCase();
  return str.every((s) => message.includes(s.toLowerCase()));
}
export function kcErrorHandler(err: any): never {
  if (err instanceof TypeError) {
    throw new Error('NETWORK ERROR');
  }

  if (err instanceof NetworkError) {
    if (msgIncludes(err, 'sibling group', 'already exists'))
      throw new Error(errors.SUB_GROUP_ALREADY_EXISTS.code);

    if (msgIncludes(err, 'Top level group named', 'already exists'))
      throw new Error(errors.TOP_LEVEL_GROUP_ALREADY_EXISTS.code);
    else throw new Error(errors.UNKNOWN_ERROR_IN_KC_API.code);
  }
  throw new Error(errors.SUB_GROUP_ALREADY_EXISTS.code);
}
