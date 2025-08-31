require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  officialBase: process.env.DIYANET_BASE || 'https://namazvakti.diyanet.gov.tr',
  batchCron: process.env.BATCH_CRON || '5 1 * * *', // 01:05
  nodeEnv: process.env.NODE_ENV || 'development'
};
