
const dotenv = require('dotenv');
dotenv.config();
const listEndpoints = require('express-list-endpoints');
const app = require('./app_config');
//jobs configuration
require('./jobs/index');
const seeder = require('./seeders');
const allRegisterRoutes = listEndpoints(app);
seeder(allRegisterRoutes);

app.listen(process.env.PORT,()=>{
  console.log(`your application is running on ${process.env.PORT}`);
});
