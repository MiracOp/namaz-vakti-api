const { saveFromUpstream } = require('../services/prayerTimesService');

async function runDaily(districtIds, fetchFn){
  const today = new Date().toISOString().slice(0,10);
  for(const id of districtIds){
    try {
      const data = await fetchFn(id,today);
      if(data){
        await saveFromUpstream(id,today,data);
      }
    } catch(e){
      console.warn('Batch district error', id, e.message);
    }
  }
  console.log('Daily batch finished', today);
}

module.exports = { runDaily };
