const cron = require('node-cron');
let jobService = require('../services/jobs/jobConfiguration');

/* 
 * take backup every day
 */
let backup = cron.schedule('* * * * *',() => {
  try {
    jobService.backup();
    console.log('job called');
  } catch (error) {
    throw error;        
  }
});   

module.exports = { backup, };