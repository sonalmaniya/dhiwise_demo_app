const AWS = require('aws-sdk');
const User = require('../../model/user');
const utils = require('../../utils/messages');
const userSchemaKey = require('../../utils/validation/userValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const auth = require('../../services/auth');
const deleteDependentService = require('../../utils/deleteDependent');
const addUser = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      userSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    let data = new User({ ...req.body, });
    let result = await dbService.createDocument(User,data);
    return  utils.successResponse(result, res);
  } catch (error) {
    if (error.name === 'ValidationError'){
      return utils.validationError(error.message, res);
    }
    if (error.code && error.code == 11000){
      return utils.isDuplicate(error.message, res);
    }
    return utils.failureResponse(error.message,res); 
  }
};

const findAllUser = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      if (req.user){
        query = {
          ...query,
          ...{ '_id': { $ne: req.user.id } } 
        };
      } else {
        return util.badRequest({},res);
      }
      result = await dbService.countDocument(User, query);
      if (result) {
        result = { totalRecords: result };
        return utils.successResponse(result, res);
      } 
      return utils.recordNotFound([], res);
    }
    else {
      if (req.body.options !== undefined) {
        /*
         * if(req.body.options.populate){
         *   delete req.body.options.populate;
         * }
         */
        options = { ...req.body.options };
      }
            
      if (req.body.query !== undefined){
        query = { ...req.body.query };
      }
      if (req.user){
        query = {
          ...query,
          ...{ '_id': { $ne: req.user.id } } 
        };
      }
      result = await dbService.getAllDocuments( User,query,options);
      if (result && result.data && result.data.length){
        return utils.successResponse(result, res);   
      }
      return utils.recordNotFound({},res);
    }
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUser = async (req, res) => {
  try {
    let query = {};
    query._id = req.params.id;

    let result = await dbService.getDocumentByQuery(User,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUserCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.countDocument(User,where);
    if (result){
      result = { totalRecords:result };
      return utils.successResponse(result, res);
    }
    return utils.recordNotFound({},res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUserByAggregate = async (req,res)=>{
  try {
    let result = await dbService.getDocumentByAggregation(User,req.body);
    if (result){
      return utils.successResponse(result, res);
    }
    return utils.recordNotFound([],res);
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const updateUser = async (req, res) => {
  try {
    let data = {
      ...req.body,
      id:req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }
        
    let query = {};
    if (req.user){
      query = {
        '_id': {
          '$eq': req.params.id,
          '$ne': req.user.id
        }
      };
    } else {
      return util.badRequest({},res);
    }
    let result = await dbService.findOneAndUpdateDocument(User,query,data,{ new:true });
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }
        
    return  utils.successResponse(result, res);
  }
  catch (error){
    if (error.name === 'ValidationError'){
      return utils.isDuplicate(error.message, res);
    }
    if (error.code && error.code == 11000){
      return utils.isDuplicate(error.message, res);
    }
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateUser = async (req, res) => {
  try {
    let data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    let query = {};
    if (req.user){
      query = {
        '_id': {
          '$eq': req.params.id,
          '$ne': req.user.id
        }
      };
    } else {
      return util.badRequest({},res);
    } 
    let result = await dbService.findOneAndUpdateDocument(User, query, data,{ new:true });
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const softDeleteUser = async (req, res) => {
  try {
    let query = {};
    if (req.user){
      query = {
        '_id': {
          '$eq': req.params.id,
          '$ne': req.user.id
        }
      };
    } 
    let result = await deleteDependentService.softDeleteUser(query);
    if (!result){
      return utils.failureResponse('something went wrong',res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const softDeleteManyUser = async (req, res) => {
  try {
    let ids = req.body.ids;
    if (ids){
      let query = {};
      if (req.user){
        query = {
          '_id': {
            '$in': ids,
            '$ne': req.user.id
          }
        };
      } 
      let result = await deleteDependentService.softDeleteUser(query);
      if (!result) {
        return utils.recordNotFound([],res);
      }
      return  utils.successResponse(result, res);
    }
    return utils.badRequest({},res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const bulkInsertUser = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.bulkInsert(User,data);
      return  utils.successResponse(result, res);
    } else {
      return utils.failureResponse('Invalid Data',res);
    }  
  } catch (error){
    if (error.name === 'ValidationError'){
      return utils.validationError(error.message, res);
    }
    if (error.code && error.code == 11000){
      return utils.isDuplicate(error.message, res);
    }
    return utils.failureResponse(error.message,res);
  }
};

const bulkUpdateUser = async (req,res)=>{
  try {
    let filter = {};
    let data;
    if (req.body.filter !== undefined){
      filter = req.body.filter;
    }
    if (req.body.data !== undefined){
      data = req.body.data;
      let result = await dbService.bulkUpdate(User,filter,data);
      if (!result){
        return utils.failureResponse('something is wrong.',res);
      }

      return  utils.successResponse(result, res);
    }
    else {
      return utils.failureResponse('Invalid Data', res);
    }
  }
  catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const changePassword = async (req, res) => {
  try {
    let params = req.body;
    if (!params.newPassword || !req.user.id || !params.oldPassword) {
      return utils.inValidParam('Please Provide userId and new Password and Old password', res);
    }
    let result = await auth.changePassword({
      ...params,
      userId:req.user.id
    });
    if (result.flag){
      return utils.changePasswordFailure(result.data,res);
    }
    return utils.changePasswordSuccess(result.data, res);
  } catch (error) {
    return utils.failureResponse(error, res);
  }
};

const updateProfile = async (req, res) => {
  try {
    let data = {
      ...req.body,
      id:req.user.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }
    if (data.password) delete data.password;
    if (data.createdAt) delete data.createdAt;
    if (data.updatedAt) delete data.updatedAt;
    if (data.id) delete data.id;
    let result = await dbService.findOneAndUpdateDocument(User,{ _id:req.user.id },data,{ new:true });
    if (!result){
      return utils.failureResponse('something is wrong',res);
    }            
    return  utils.successResponse(result, res);
  }
  catch (error){
    if (error.name === 'ValidationError'){
      return utils.isDuplicate(error.message, res);
    }
    if (error.code && error.code == 11000){
      return utils.isDuplicate(error.message, res);
    }
    return utils.failureResponse(error.message,res);
  }
};

/**
 * 
 * Function used to upload file in S3.
 * 
 * @param  {} input
 * @param  {} newPath
 */
async function uploadToS3 (input, newPath) {

  let S3Config = {
    AWS_S3_ACCESS_KEY_ID: process.env.AWS_S3_ACCESS_KEY_ID,
    AWS_S3_SECRET_ACCESS_KEY: process.env.AWS_S3_SECRET_ACCESS_KEY,
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_PUBLIC_BUCKET_NAME: process.env.AWS_S3_PUBLIC_BUCKET_NAME,
  };
   
  const s3 = new AWS.S3({
    region: S3Config.AWS_S3_REGION,
    accessKeyId: S3Config.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: S3Config.AWS_S3_SECRET_ACCESS_KEY
  });

  let bucket = S3Config.AWS_S3_PUBLIC_BUCKET_NAME;  // Set here public bucket name, temporary set 

  let unlink;
  const response = await new Promise(async (resolve, reject) => {

    fs.readFile(newPath, function (err, data) {
      if (err) {
        reject({
          status: false,
          message: err.message
        });
      }

      params = {
        Bucket: bucket,
        Key: newPath,
        Body: data 
      };
      s3.putObject(params, async function (err, data) {

        if (err) {

          reject({
            status: false,
            message: err.message
          });
        } else {

          unlink = await unlinkFile(newPath);
          if (unlink.status == false) {
            return unlink;
          }
          resolve({
            message: 'File uploaded successfully',
            status: true,
            data: 'https://' + bucket + '.s3.' + S3Config.AWS_S3_REGION + '.amazonaws.com/' + newPath
          });
        }
      });
    });
  });
  return response;
}

module.exports = {
  addUser,
  findAllUser,
  getUser,
  getUserCount,
  getUserByAggregate,
  updateUser,
  partialUpdateUser,
  softDeleteUser,
  softDeleteManyUser,
  bulkInsertUser,
  bulkUpdateUser,
  changePassword,
  updateProfile,
};
