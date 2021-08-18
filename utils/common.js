const dbService = require('./dbService');
/*
 * convertObjectToEnum : convert object to enum
 * @param obj          : {}
 */
const convertObjectToEnum = (obj) => {
  const enumArr = [];
  Object.values(obj).map((val) => enumArr.push(val));
  return enumArr;
};

/*
 * randomNumber : generate random numbers.
 * @param length          : number *default 4
 */
const randomNumber = (length = 4) => {
  const numbers = '12345678901234567890';
  let result = '';
  for (let i = length; i > 0; i -= 1) {
    result += numbers[Math.round(Math.random() * (numbers.length - 1))];
  }
  return result;
};

/*
 * replaceAll: find and replace al; occurrence of a string in a searched string
 * @param string : string to be replace
 * @param search : string which you want to replace
 * @param replace: string with which you want to replace a string
 */
const replaceAll = (string, search, replace) => string.split(search).join(replace);

/*
 * uniqueValidation: validate Login With Fields while Registration
 * @param Model : Mongoose Model, on which query runs
 * @param data : data , coming from request
 */
const uniqueValidation = async (Model,data) =>{
  let filter = { $or:[] };
  if (data && data['username']){
    filter['$or'].push(
      { 'username':data['username'] },
      { 'password':data['username'] },
      { 'email':data['username'] },
      { 'name':data['username'] },
      { 'isActive':data['username'] },
      { 'createdAt':data['username'] },
      { 'updatedAt':data['username'] },
    );
  }
  if (data && data['password']){
    filter['$or'].push(
      { 'username':data['password'] },
      { 'password':data['password'] },
      { 'email':data['password'] },
      { 'name':data['password'] },
      { 'isActive':data['password'] },
      { 'createdAt':data['password'] },
      { 'updatedAt':data['password'] },
    );
  }
  if (data && data['email']){
    filter['$or'].push(
      { 'username':data['email'] },
      { 'password':data['email'] },
      { 'email':data['email'] },
      { 'name':data['email'] },
      { 'isActive':data['email'] },
      { 'createdAt':data['email'] },
      { 'updatedAt':data['email'] },
    );
  }
  if (data && data['name']){
    filter['$or'].push(
      { 'username':data['name'] },
      { 'password':data['name'] },
      { 'email':data['name'] },
      { 'name':data['name'] },
      { 'isActive':data['name'] },
      { 'createdAt':data['name'] },
      { 'updatedAt':data['name'] },
    );
  }
  if (data && data['isActive']){
    filter['$or'].push(
      { 'username':data['isActive'] },
      { 'password':data['isActive'] },
      { 'email':data['isActive'] },
      { 'name':data['isActive'] },
      { 'isActive':data['isActive'] },
      { 'createdAt':data['isActive'] },
      { 'updatedAt':data['isActive'] },
    );
  }
  if (data && data['createdAt']){
    filter['$or'].push(
      { 'username':data['createdAt'] },
      { 'password':data['createdAt'] },
      { 'email':data['createdAt'] },
      { 'name':data['createdAt'] },
      { 'isActive':data['createdAt'] },
      { 'createdAt':data['createdAt'] },
      { 'updatedAt':data['createdAt'] },
    );
  }
  if (data && data['updatedAt']){
    filter['$or'].push(
      { 'username':data['updatedAt'] },
      { 'password':data['updatedAt'] },
      { 'email':data['updatedAt'] },
      { 'name':data['updatedAt'] },
      { 'isActive':data['updatedAt'] },
      { 'createdAt':data['updatedAt'] },
      { 'updatedAt':data['updatedAt'] },
    );
  }
  let found = await dbService.getDocumentByQuery(Model,filter);
  if (found){
    return false;
  }
  return true;
};

module.exports = {
  convertObjectToEnum,
  randomNumber,
  replaceAll,
  uniqueValidation,
};
