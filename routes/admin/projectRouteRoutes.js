const express = require('express');
const router = express.Router();
const projectRouteController = require('../../controller/admin/projectRouteController');
const auth = require('../../middleware/auth');
router.route('/admin/projectRoute/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),projectRouteController.addProjectRoute);
router.route('/admin/projectRoute/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),projectRouteController.bulkInsertProjectRoute);
router.route('/admin/projectRoute/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),projectRouteController.findAllProjectRoute);
router.route('/admin/projectRoute/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),projectRouteController.getProjectRoute);
router.route('/admin/projectRoute/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),projectRouteController.partialUpdateProjectRoute);
router.route('/admin/projectRoute/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),projectRouteController.softDeleteProjectRoute);
router.route('/admin/projectRoute/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),projectRouteController.updateProjectRoute);    
router.route('/admin/projectRoute/aggregate').post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),projectRouteController.getProjectRouteByAggregate);
router.route('/admin/projectRoute/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),projectRouteController.getProjectRouteCount);
router.route('/admin/projectRoute/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),projectRouteController.upsert);

module.exports = router;
