const express = require('express');
const router = express.Router();
const routeRoleController = require('../../controller/admin/routeRoleController');
const auth = require('../../middleware/auth');
router.route('/admin/routeRole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),routeRoleController.addRouteRole);
router.route('/admin/routeRole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),routeRoleController.bulkInsertRouteRole);
router.route('/admin/routeRole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),routeRoleController.findAllRouteRole);
router.route('/admin/routeRole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),routeRoleController.getRouteRole);
router.route('/admin/routeRole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),routeRoleController.partialUpdateRouteRole);
router.route('/admin/routeRole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),routeRoleController.updateRouteRole);    
router.route('/admin/routeRole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),routeRoleController.softDeleteRouteRole);
router.route('/admin/routeRole/aggregate').post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),routeRoleController.getRouteRoleByAggregate);
router.route('/admin/routeRole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),routeRoleController.getRouteRoleCount);
router.route('/admin/routeRole/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),routeRoleController.upsert);

module.exports = router;
