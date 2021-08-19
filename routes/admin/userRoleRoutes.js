const express = require('express');
const router = express.Router();
const userRoleController = require('../../controller/admin/userRoleController');
const auth = require('../../middleware/auth');
router.route('/admin/userRole/create').post(auth(...[ 'createByAdminInAdminPlatform' ]),userRoleController.addUserRole);
router.route('/admin/userRole/addBulk').post(auth(...[ 'addBulkByAdminInAdminPlatform' ]),userRoleController.bulkInsertUserRole);
router.route('/admin/userRole/list').post(auth(...[ 'getAllByAdminInAdminPlatform' ]),userRoleController.findAllUserRole);
router.route('/admin/userRole/:id').get(auth(...[ 'getByAdminInAdminPlatform' ]),userRoleController.getUserRole);
router.route('/admin/userRole/partial-update/:id').put(auth(...[ 'partialUpdateByAdminInAdminPlatform' ]),userRoleController.partialUpdateUserRole);
router.route('/admin/userRole/update/:id').put(auth(...[ 'updateByAdminInAdminPlatform' ]),userRoleController.updateUserRole);    
router.route('/admin/userRole/softDelete/:id').put(auth(...[ 'softDeleteByAdminInAdminPlatform' ]),userRoleController.softDeleteUserRole);
router.route('/admin/userRole/aggregate').post(auth(...[ 'aggregateByAdminInAdminPlatform' ]),userRoleController.getUserRoleByAggregate);
router.route('/admin/userRole/count').post(auth(...[ 'getCountByAdminInAdminPlatform' ]),userRoleController.getUserRoleCount);
router.route('/admin/userRole/upsert').post(auth(...[ 'upsertByAdminInAdminPlatform' ]),userRoleController.upsert);

module.exports = router;
