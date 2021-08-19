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
      const userFilter5854 = { 'addedBy': { '$in': user } };
      const user0435 = await deleteUser(userFilter5854);
      const userFilter5694 = { 'updatedBy': { '$in': user } };
      const user8137 = await deleteUser(userFilter5694);
      const userRoleFilter0820 = { 'userId': { '$in': user } };
      const userRole9334 = await deleteUserRole(userRoleFilter0820);
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
      const routeRoleFilter9414 = { 'roleId': { '$in': role } };
      const routeRole8061 = await deleteRouteRole(routeRoleFilter9414);
      const userRoleFilter2079 = { 'roleId': { '$in': role } };
      const userRole2455 = await deleteUserRole(userRoleFilter2079);
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
      const routeRoleFilter5624 = { 'routeId': { '$in': projectRoute } };
      const routeRole0319 = await deleteRouteRole(routeRoleFilter5624);
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
      const userFilter4640 = { 'addedBy': { '$in': user } };
      const user0696Cnt = await countUser(userFilter4640);
      const userFilter7993 = { 'updatedBy': { '$in': user } };
      const user7554Cnt = await countUser(userFilter7993);
      const userRoleFilter5442 = { 'userId': { '$in': user } };
      const userRole2428Cnt = await countUserRole(userRoleFilter5442);
      const userCnt =  await User.countDocuments(filter);
      let response = { user : userCnt  };
      response = {
        ...response,
        ...user0696Cnt,
        ...user7554Cnt,
        ...userRole2428Cnt,
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
      const routeRoleFilter9587 = { 'roleId': { '$in': role } };
      const routeRole4993Cnt = await countRouteRole(routeRoleFilter9587);
      const userRoleFilter8609 = { 'roleId': { '$in': role } };
      const userRole7572Cnt = await countUserRole(userRoleFilter8609);
      const roleCnt =  await Role.countDocuments(filter);
      let response = { role : roleCnt  };
      response = {
        ...response,
        ...routeRole4993Cnt,
        ...userRole7572Cnt,
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
      const routeRoleFilter4261 = { 'routeId': { '$in': projectRoute } };
      const routeRole6896Cnt = await countRouteRole(routeRoleFilter4261);
      const projectRouteCnt =  await ProjectRoute.countDocuments(filter);
      let response = { projectRoute : projectRouteCnt  };
      response = {
        ...response,
        ...routeRole6896Cnt,
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
      const userFilter6230 = { 'addedBy': { '$in': user } };
      const user2305 = await softDeleteUser(userFilter6230);
      const userFilter3122 = { 'updatedBy': { '$in': user } };
      const user6487 = await softDeleteUser(userFilter3122);
      const userRoleFilter9756 = { 'userId': { '$in': user } };
      const userRole5037 = await softDeleteUserRole(userRoleFilter9756);
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
      const routeRoleFilter8825 = { 'roleId': { '$in': role } };
      const routeRole6438 = await softDeleteRouteRole(routeRoleFilter8825);
      const userRoleFilter0843 = { 'roleId': { '$in': role } };
      const userRole6533 = await softDeleteUserRole(userRoleFilter0843);
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
      const routeRoleFilter5334 = { 'routeId': { '$in': projectRoute } };
      const routeRole4693 = await softDeleteRouteRole(routeRoleFilter5334);
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
