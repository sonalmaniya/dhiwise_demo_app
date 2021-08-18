/*
 * constants
 */

const JWT = {
  DEVICE_SECRET:'myjwtdevicesecret',
  EXPIRES_IN: 10000
};

const USER_ROLE = { User:1, };

const PLATFORM = { DEVICE:1, };

let LOGIN_ACCESS = { [USER_ROLE.User]:[PLATFORM.DEVICE], };

const DEFAULT_ROLE = 1;

const ROLE_RIGHTS = {
    
  [USER_ROLE.User] : [
    'getAllByUserInDevicePlatform',
    'getByUserInDevicePlatform',
    'aggregateByUserInDevicePlatform',
    'getCountByUserInDevicePlatform',
    'createByUserInDevicePlatform',
    'addBulkByUserInDevicePlatform',
    'updateByUserInDevicePlatform',
    'updateBulkByUserInDevicePlatform',
    'partialUpdateByUserInDevicePlatform',
    'deleteByUserInDevicePlatform',
    'softDeleteByUserInDevicePlatform',
    'upsertByUserInDevicePlatform',
    'fileUploadByUserInDevicePlatform',
    'logoutByUserInDevicePlatform',
    'softDeleteManyByUserInDevicePlatform',
    'deleteManyByUserInDevicePlatform',
    'changePasswordByUserInDevicePlatform',
    'updateProfileByUserInDevicePlatform'
  ],
    
};
const MAX_LOGIN_RETRY_LIMIT = 3;
const LOGIN_REACTIVE_TIME = 20;   

const FORGOT_PASSWORD_WITH = {
  LINK: {
    email: true,
    sms: false
  },
  EXPIRETIME: 20
};
const NO_OF_DEVICE_ALLOWED = 1;

module.exports = {
  JWT,
  USER_ROLE,
  DEFAULT_ROLE,
  ROLE_RIGHTS,
  PLATFORM,
  MAX_LOGIN_RETRY_LIMIT,
  LOGIN_REACTIVE_TIME,
  FORGOT_PASSWORD_WITH,
  NO_OF_DEVICE_ALLOWED,
  LOGIN_ACCESS,
        
};