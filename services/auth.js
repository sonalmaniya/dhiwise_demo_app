const User = require('../model/user');
const dbService = require('../utils/dbService');
const {
  JWT,LOGIN_ACCESS,
  PLATFORM,MAX_LOGIN_RETRY_LIMIT,LOGIN_REACTIVE_TIME,FORGOT_PASSWORD_WITH,NO_OF_DEVICE_ALLOWED
} = require('../constants/authConstant');
const jwt = require('jsonwebtoken');
const common = require('../utils/common');
const moment = require('moment');
const bcrypt = require('bcrypt');
const emailService = require('./email/emailService');
const sendSMS = require('./sms/smsService');
const uuid = require('uuid').v4;

async function generateToken (user,secret){
  return jwt.sign( {
    id:user.id,
    username:user.username
  }, secret, { expiresIn: JWT.EXPIRES_IN * 60 });
}
async function sendEmailForResetPasswordLink (user) {
  try {
    let token = uuid();
    let expires = moment();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minutes').toISOString();
    await dbService.updateDocument(User,user.id,
      {
        resetPasswordLink: {
          code: token,
          expireTime: expires 
        } 
      });
    let viewType = '/reset-password/';
    let msg = 'Click on the link below to reset your password.';
    let mailObj = {
      subject: 'Reset Password',
      to: user.email,
      template: '/views/resetPassword',
      data: {
        link: `http://localhost:${process.env.PORT}` + viewType + token,
        linkText: 'Reset Password',
        message:msg
      }
    };
    await emailService.sendEmail(mailObj);
    return true;
  } catch (e) {
    return false;
  }
}
async function sendSMSForResetPasswordLink (user) {
  try {
    let token = uuid();
    let expires = moment();
    expires = expires.add(FORGOT_PASSWORD_WITH.EXPIRETIME, 'minutes').toISOString();
    await dbService.updateDocument(User,user.id,
      {
        resetPasswordLink: {
          code: token,
          expireTime: expires 
        } 
      });
    let viewType = '/reset-password/';
    let msg = `Click on the link to reset your password.
        http://localhost:${process.env.PORT}${viewType + token}`;
    let smsObj = {
      to:user.mobileNo,
      message:msg
    };
    await sendSMS(smsObj);
    return true;
  } catch (error) {
    return false;
  }
}
let auth =  module.exports = {};
auth.loginUser = async (username,password,url) => {
  try {
    let where = { $or:[{ username:username },{ password:username },{ email:username },{ name:username },{ isActive:username },{ createdAt:username },{ updatedAt:username }] };
    const user = await dbService.getDocumentByQuery(User,where);
    if (user) {
      if (user.loginRetryLimit >= MAX_LOGIN_RETRY_LIMIT){
        if (user.loginReactiveTime){
          let now = moment();
          let limitTime = moment(user.loginReactiveTime);
          if (limitTime > now){
            let expireTime = moment().add(LOGIN_REACTIVE_TIME,'minutes').toISOString();
            await dbService.updateDocument(User,user.id,{
              loginReactiveTime:expireTime,
              loginRetryLimit:user.loginRetryLimit + 1  
            });
            return {
              flag:true,
              data:`you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
            }; 
          }
        } else {
          // send error
          let expireTime = moment().add(LOGIN_REACTIVE_TIME,'minutes').toISOString();
          await dbService.updateDocument(User,user.id,{
            loginReactiveTime:expireTime,
            loginRetryLimit:user.loginRetryLimit + 1 
          });
          return {
            flag:true,
            data:`you have exceed the number of limit.you can login after ${LOGIN_REACTIVE_TIME} minutes.`
          }; 
        } 
      }
      const isPasswordMatched = await user.isPasswordMatch(password);
      if (isPasswordMatched) {
        const {
          password,...userData
        } = user.toJSON();
        let token;
        if (!user.role){
          return {
            flag:true,
            data:'You have no assigned any role'
          };
        }
        if (url.includes('device')){
          if (!LOGIN_ACCESS[user.role].includes(PLATFORM.DEVICE)){
            return {
              flag:true,
              data:'you are unable to access this platform'
            };
          }
          token = await generateToken(userData,JWT.DEVICE_SECRET);
        }
        if (user.loginRetryLimit){
          await dbService.updateDocument(User,user.id,{
            loginRetryLimit:0,
            loginReactiveTime:''
          });
        }
        let tokens = user.tokens;
        if (user.tokens.length == NO_OF_DEVICE_ALLOWED){
          tokens.pop();
        }
        tokens.unshift(token);
        await dbService.updateDocument(User,user.id,{ tokens });
        delete userData.tokens;
        const userToReturn = {
          ...userData,
          ...{ token } 
        };
        return {
          flag:false,
          data:userToReturn
        };
      } else {
        await dbService.updateDocument(User,user.id,{ loginRetryLimit:user.loginRetryLimit + 1 });
        return {
          flag:true,
          data:'Incorrect Password'
        };
      }
    } else {
      return {
        flag:true,
        data:'User not exists'
      };
    }
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.changePassword = async (params)=>{
  try {
    let password = params.newPassword;
    let oldPassword = params.oldPassword;
    let where = { _id:params.userId };
    let user = await dbService.getDocumentByQuery(User,where);
    if (user && user.id) {
      let isPasswordMatch = await user.isPasswordMatch(oldPassword);
      if (!isPasswordMatch){
        return {
          flag:true,
          data:'Incorrect old password'
        };
      }
      password = await bcrypt.hash(password, 8);
      let updatedUser = dbService.updateDocument(User,user.id,{ password });
      if (updatedUser) {
        return {
          flag:false,
          data:'Password changed successfully'
        };                
      }
      return {
        flag:true,
        data:'password can not changed due to some error.please try again'
      };
    }
    return {
      flag:true,
      data:'User not found'
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.sendResetPasswordNotification = async (user) => {
  let resultOfEmail = false;
  let resultOfSMS = false;
  try {
    if (FORGOT_PASSWORD_WITH.LINK.email){
      resultOfEmail = await sendEmailForResetPasswordLink(user);
    }
    if (FORGOT_PASSWORD_WITH.LINK.sms){
      resultOfSMS = await sendSMSForResetPasswordLink(user);
    }
    return {
      resultOfEmail,
      resultOfSMS
    };
  } catch (error) {
    throw new Error(error.message);
  }
},
auth.resetPassword = async (user, newPassword) => {
  try {
    let where = { _id: user.id };
    const dbUser = await dbService.getDocumentByQuery(User,where);
    if (!dbUser) {
      return {
        flag: false,
        data: 'User not found',
      };
    }
    newPassword = await bcrypt.hash(newPassword, 8);
    await dbService.updateDocument(User, user.id, {
      password: newPassword,
      resetPasswordLink: null,
      loginRetryLimit:0
    });
    let mailObj = {
      subject: 'Reset Password',
      to: user.email,
      template: '/views/successfullyResetPassword',
      data: {
        isWidth: true,
        email: user.email || '-',
        message: 'Password Successfully Reset'
      }
    };
    await emailService.sendEmail(mailObj);
    return {
      flag: false,
      data: 'Password reset successfully',
    };
  } catch (error) {
    throw new Error(error.message);
  }
};