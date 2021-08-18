
const User = require('../model/user');
const Role = require('../model/role');
const ProjectRoute = require('../model/projectRoute');
const RouteRole = require('../model/routeRole');
const UserRole = require('../model/userRole');
const { replaceAll } = require('../utils/common');
async function seedRole () {
  const roles = [ 'User', 'Admin', 'SYSTEM_USER' ];
  for (let i = 0; i < roles.length; i++) {
    let result = await Role.findOne({
      name: roles[i],
      isActive: true,
      isDeleted: false 
    });
    if (!result) {
      await Role.create({
        name: roles[i],
        code: roles[i].toUpperCase(),
        weight: 1
      });
    }
  };
  console.info('Role model seeded 🍺');
}
async function seedProjectRoutes (routes) {
  if (routes && routes.length) {
    for (let i = 0; i < routes.length; i++) {
      const routeMethods = routes[i].methods;
      for (let j = 0; j < routeMethods.length; j++) {
        const routeObj = {
          uri: routes[i].path.toLowerCase(),
          method: routeMethods[j],
          route_name: `${replaceAll((routes[i].path).toLowerCase().substring(1), '/', '_')}`,
          isActive: true, 
          isDeleted: false
        };
        let result = await ProjectRoute.findOne(routeObj);
        if (!result) {
          await ProjectRoute.create(routeObj);
        }
      }
    }
    console.info('ProjectRoute model seeded 🍺');
  }
}
async function seedRouteRole () {
  const routeRoles = [ 
    {
      route: '/device/api/v1/user/create',
      role: 'User',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/create',
      role: 'Admin',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/create',
      role: 'SYSTEM_USER',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/list',
      role: 'User',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/list',
      role: 'Admin',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/list',
      role: 'SYSTEM_USER',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/aggregate',
      role: 'User',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/aggregate',
      role: 'Admin',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/aggregate',
      role: 'SYSTEM_USER',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/:id',
      role: 'User',
      method: 'GET' 
    },
    {
      route: '/device/api/v1/user/:id',
      role: 'Admin',
      method: 'GET' 
    },
    {
      route: '/device/api/v1/user/:id',
      role: 'SYSTEM_USER',
      method: 'GET'
    },
    {
      route: '/device/api/v1/user/count',
      role: 'User',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/count',
      role: 'Admin',
      method: 'POST' 
    },
    {
      route: '/device/api/v1/user/count',
      role: 'SYSTEM_USER',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/update/:id',
      role: 'User',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/update/:id',
      role: 'Admin',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/update/:id',
      role: 'SYSTEM_USER',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/partial-update/:id',
      role: 'User',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/partial-update/:id',
      role: 'Admin',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/partial-update/:id',
      role: 'SYSTEM_USER',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/softdelete/:id',
      role: 'User',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/softdelete/:id',
      role: 'Admin',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/softdelete/:id',
      role: 'SYSTEM_USER',
      method: 'PUT'
    },
    {
      route: '/device/api/v1/user/delete/:id',
      role: 'SYSTEM_USER',
      method: 'DELETE'
    },
    {
      route: '/device/api/v1/user/addbulk',
      role: 'SYSTEM_USER',
      method: 'POST'
    },
    {
      route: '/device/api/v1/user/updatebulk',
      role: 'SYSTEM_USER',
      method: 'PUT'
    },

  ];
  if (routeRoles && routeRoles.length) {
    for (let i = 0; i < routeRoles.length; i++) {
      let route = await ProjectRoute.findOne({
        uri: routeRoles[i].route.toLowerCase(),
        method: routeRoles[i].method,
        isActive: true,
        isDeleted: false 
      }, { id: 1 });
      let role = await Role.findOne({
        code: (routeRoles[i].role).toUpperCase(),
        isActive: true,
        isDeleted: false 
      }, { id: 1 });
      if (route && route.id && role && role.id) {
        let routeRoleObj = await RouteRole.findOne({
          roleId: role.id,
          routeId: route.id,
          isActive: true, 
          isDeleted: false
        });
        if (!routeRoleObj) {
          await RouteRole.create({
            roleId: role.id,
            routeId: route.id
          });
        }
      }
    };
    console.info('RouteRole model seeded 🍺');
  }
}

async function seedUserRole (){
  let user = await User.findOne({
    'username':'Darryl Goodwin',
    'isActive':true,
    'isDeleted':false
  });
  let role = await Role.findOne({ code: 'SYSTEM_USER' }, { id: 1 });
  if (user && user.isPasswordMatch('KzUgYyf78GHjA1s') && role){
    let count = await UserRole.countDocuments({
      userId: user.id,
      roleId: role.id,
      isActive: true, 
      isDeleted: false
    });
    if (count == 0) {
      await UserRole.create({
        userId: user.id,
        roleId: role.id 
      });
      console.info('UserRole model seeded 🍺');
    }   
  }
}

async function seedUser () {
  let user = await User.findOne({
    'username':'Darryl Goodwin',
    'isActive':true,
    'isDeleted':false
  });
  if (!user || !user.isPasswordMatch('KzUgYyf78GHjA1s') ) {
    let user = new User({
      'password':'KzUgYyf78GHjA1s',
      'username':'Darryl Goodwin',
      'role':1
    });
    await User.create(user);
    console.info('User model seeded 🍺');
  }
}

async function seedData (allRegisterRoutes){
  await seedUser();
  await seedRole();
  await seedProjectRoutes(allRegisterRoutes);
  await seedRouteRole();
  await seedUserRole();
}     

module.exports = seedData;