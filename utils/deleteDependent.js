let User = require('../model/user');
let Role = require('../model/role');
let ProjectRoute = require('../model/projectRoute');
let RouteRole = require('../model/routeRole');
let UserRole = require('../model/userRole');
let dbService = require('../utils/dbService');

const deleteUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter2674 = { 'addedBy': { '$in': user } };
      const user8977 = await deleteUser(userFilter2674);
      const userFilter9903 = { 'updatedBy': { '$in': user } };
      const user2034 = await deleteUser(userFilter9903);
      const userRoleFilter5458 = { 'userId': { '$in': user } };
      const userRole9122 = await deleteUserRole(userRoleFilter5458);
      return await User.deleteMany(filter);
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter2079 = { 'roleId': { '$in': role } };
      const routeRole5429 = await deleteRouteRole(routeRoleFilter2079);
      const userRoleFilter0367 = { 'roleId': { '$in': role } };
      const userRole9458 = await deleteUserRole(userRoleFilter0367);
      return await Role.deleteMany(filter);
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.find(filter, { _id:1 });
    if (projectRoute.length){
      projectRoute = projectRoute.map((obj) => obj._id);
      const routeRoleFilter7545 = { 'routeId': { '$in': projectRoute } };
      const routeRole9208 = await deleteRouteRole(routeRoleFilter7545);
      return await ProjectRoute.deleteMany(filter);
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.deleteMany(filter);
  } catch (error){
    throw new Error(error.message);
  }
};

const deleteUserRole = async (filter) =>{
  try {
    return await UserRole.deleteMany(filter);
  } catch (error){
    throw new Error(error.message);
  }
};

const countUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter8334 = { 'addedBy': { '$in': user } };
      const user7820Cnt = await countUser(userFilter8334);
      const userFilter6956 = { 'updatedBy': { '$in': user } };
      const user7090Cnt = await countUser(userFilter6956);
      const userRoleFilter5217 = { 'userId': { '$in': user } };
      const userRole4785Cnt = await countUserRole(userRoleFilter5217);
      const userCnt =  await User.countDocuments(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user7820Cnt,
        ...user7090Cnt,
        ...userRole4785Cnt,
      };
      return response;
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter3771 = { 'roleId': { '$in': role } };
      const routeRole1147Cnt = await countRouteRole(routeRoleFilter3771);
      const userRoleFilter3889 = { 'roleId': { '$in': role } };
      const userRole6991Cnt = await countUserRole(userRoleFilter3889);
      const roleCnt =  await Role.countDocuments(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole1147Cnt,
        ...userRole6991Cnt,
      };
      return response;
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.find(filter, { _id:1 });
    if (projectRoute.length){
      projectRoute = projectRoute.map((obj) => obj._id);
      const routeRoleFilter3585 = { 'routeId': { '$in': projectRoute } };
      const routeRole2442Cnt = await countRouteRole(routeRoleFilter3585);
      const projectRouteCnt =  await ProjectRoute.countDocuments(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole2442Cnt,
      };
      return response;
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const countRouteRole = async (filter) =>{
  try {
    const routeRoleCnt =  await RouteRole.countDocuments(filter);
    return { routeRole : routeRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const countUserRole = async (filter) =>{
  try {
    const userRoleCnt =  await UserRole.countDocuments(filter);
    return { userRole : userRoleCnt };
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUser = async (filter) =>{
  try {
    let user = await User.find(filter, { _id:1 });
    if (user.length){
      user = user.map((obj) => obj._id);
      const userFilter3077 = { 'addedBy': { '$in': user } };
      const user0848 = await softDeleteUser(userFilter3077);
      const userFilter5449 = { 'updatedBy': { '$in': user } };
      const user5853 = await softDeleteUser(userFilter5449);
      const userRoleFilter4127 = { 'userId': { '$in': user } };
      const userRole0690 = await softDeleteUserRole(userRoleFilter4127);
      return await User.updateMany(filter, { isDeleted:true });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRole = async (filter) =>{
  try {
    let role = await Role.find(filter, { _id:1 });
    if (role.length){
      role = role.map((obj) => obj._id);
      const routeRoleFilter9157 = { 'roleId': { '$in': role } };
      const routeRole4951 = await softDeleteRouteRole(routeRoleFilter9157);
      const userRoleFilter9961 = { 'roleId': { '$in': role } };
      const userRole8711 = await softDeleteUserRole(userRoleFilter9961);
      return await Role.updateMany(filter, { isDeleted:true });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteProjectRoute = async (filter) =>{
  try {
    let projectRoute = await ProjectRoute.find(filter, { _id:1 });
    if (projectRoute.length){
      projectRoute = projectRoute.map((obj) => obj._id);
      const routeRoleFilter6848 = { 'routeId': { '$in': projectRoute } };
      const routeRole1159 = await softDeleteRouteRole(routeRoleFilter6848);
      return await ProjectRoute.updateMany(filter, { isDeleted:true });
    }
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteRouteRole = async (filter) =>{
  try {
    return await RouteRole.updateMany(filter, { isDeleted:true });
  } catch (error){
    throw new Error(error.message);
  }
};

const softDeleteUserRole = async (filter) =>{
  try {
    return await UserRole.updateMany(filter, { isDeleted:true });
  } catch (error){
    throw new Error(error.message);
  }
};

module.exports = {
  deleteUser,
  deleteRole,
  deleteProjectRoute,
  deleteRouteRole,
  deleteUserRole,
  countUser,
  countRole,
  countProjectRoute,
  countRouteRole,
  countUserRole,
  softDeleteUser,
  softDeleteRole,
  softDeleteProjectRoute,
  softDeleteRouteRole,
  softDeleteUserRole,
};
