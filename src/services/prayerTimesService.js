const { getPrayerTime, upsertPrayerTime } = require('../repositories/prayerTimesRepo');
const crypto = require('crypto');

async function saveFromUpstream(districtId, date, data){
  const hash = crypto.createHash('sha1').update(JSON.stringify(data)).digest('hex');
  await upsertPrayerTime({
    district_id: districtId,
    date,
    imsak: data.imsak,
    gunes: data.gunes,
    ogle: data.ogle,
    ikindi: data.ikindi,
    aksam: data.aksam,
    yatsi: data.yatsi,
    source_hash: hash,
    fetched_at: new Date().toISOString()
  });
  return await getPrayerTime(districtId,date);
}

async function getOrFetch(districtId,date,fetchFn){
  const existing = await getPrayerTime(districtId,date);
  if(existing) return { ...existing, source: 'db' };
  const upstream = await fetchFn(districtId,date);
  if(!upstream) return null;
  const saved = await saveFromUpstream(districtId,date,upstream);
  return { ...saved, source: 'live' };
}

module.exports = { saveFromUpstream, getOrFetch };
