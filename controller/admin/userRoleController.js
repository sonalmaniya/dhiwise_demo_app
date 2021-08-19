const AWS = require('aws-sdk');
const UserRole = require('../../model/userRole');
const utils = require('../../utils/messages');
const userRoleSchemaKey = require('../../utils/validation/userRoleValidation');
const validation = require('../../utils/validateRequest');
const dbService = require('../../utils/dbService');
const addUserRole = async (req, res) => {
  try {

    let isValid = validation.validateParamsWithJoi(
      req.body,
      userRoleSchemaKey.schemaKeys);
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    } 
    let data = new UserRole({ ...req.body, });
    let result = await dbService.createDocument(UserRole,data);
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

const bulkInsertUserRole = async (req,res)=>{
  try {
    let data;   
    if (req.body.data !== undefined && req.body.data.length){
      data = req.body.data;

      let result = await dbService.bulkInsert(UserRole,data);
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

const findAllUserRole = async (req, res) => {
  try {
    let options = {};
    let query = {};
    let result;
    if (req.body.isCountOnly){
      if (req.body.query !== undefined) {
        query = { ...req.body.query };
      }
      result = await dbService.countDocument(UserRole, query);
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
      result = await dbService.getAllDocuments( UserRole,query,options);
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

const getUserRole = async (req, res) => {
  try {
    let query = {};
    query._id = req.params.id;

    let result = await dbService.getDocumentByQuery(UserRole,query);
    if (result){
      return  utils.successResponse(result, res);
            
    }
    return utils.recordNotFound([],res);
  }
  catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const partialUpdateUserRole = async (req, res) => {
  try {
    let data = {
      ...req.body,
      id: req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userRoleSchemaKey.updateSchemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    const query = { _id:req.params.id };
    let result = await dbService.findOneAndUpdateDocument(UserRole, query, data,{ new:true });
    if (!result) {
      return utils.failureResponse('something is wrong', res);
    }
        
    return utils.successResponse(result, res);
        
  }
  catch (error){
    return utils.failureResponse(error.message, res);
  }
};

const updateUserRole = async (req, res) => {
  try {
    let data = {
      ...req.body,
      id:req.params.id
    };
    let isValid = validation.validateParamsWithJoi(
      data,
      userRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return  utils.inValidParam(isValid.error, res);
    }
        
    let query = { _id:req.params.id };
    let result = await dbService.findOneAndUpdateDocument(UserRole,query,data,{ new:true });
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

const softDeleteUserRole = async (req, res) => {
  try {
    let query = { _id: req.params.id };
    let result = await dbService.findOneAndUpdateDocument(UserRole, query, { isDeleted: true },{ new:true });
    if (!result){
      return utils.recordNotFound([],res);
    }
    return  utils.successResponse(result, res);
  } catch (error){
    return utils.failureResponse(error.message,res); 
  }
};

const getUserRoleByAggregate = async (req,res)=>{
  try {
    let result = await dbService.getDocumentByAggregation(UserRole,req.body);
    if (result){
      return utils.successResponse(result, res);
    }
    return utils.recordNotFound([],res);
  } catch (error){
    return utils.failureResponse(error.message,res);
  }
};

const getUserRoleCount = async (req, res) => {
  try {
    let where = {};
    if (req.body.where){
      where = req.body.where;
    }
    let result = await dbService.countDocument(UserRole,where);
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

const upsert = async (req, res) => {
  try {
    let params = req.body;
    let isValid = validation.validateParamsWithJoi(
      params,
      userRoleSchemaKey.schemaKeys
    );
    if (isValid.error) {
      return utils.inValidParam(isValid.error, res);
    }

    if (params.id) {
      let where = params.id;
      ['id','createdAt','updatedAt'].forEach(e => delete params[e]);
      let result = await dbService.updateDocument(UserRole, where, params);
      if (!result){
        utils.failureResponse('something is wrong',res);
      }

      return utils.successResponse(result, res);
    }
    else {
      let data = new UserRole({ ...params });
      let result = await dbService.createDocument(UserRole, data);
      if (!result){
        return utils.failureResponse('something is wrong',res);
      }
      return  utils.successResponse(result, res);    
    }
  }
  catch (error){
    if (error.name === 'ValidationError'){
      return utils.validationError(error.message, res);
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
  addUserRole,
  bulkInsertUserRole,
  findAllUserRole,
  getUserRole,
  partialUpdateUserRole,
  updateUserRole,
  softDeleteUserRole,
  getUserRoleByAggregate,
  getUserRoleCount,
  upsert,
};
