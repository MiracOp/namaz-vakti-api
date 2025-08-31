const db = require('../db/connection');

function upsertPrayerTime(pt){
  const sql = `INSERT INTO prayer_times
    (district_id,date,imsak,gunes,ogle,ikindi,aksam,yatsi,source_hash,fetched_at)
    VALUES (?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(district_id,date) DO UPDATE SET
      imsak=excluded.imsak,
      gunes=excluded.gunes,
      ogle=excluded.ogle,
      ikindi=excluded.ikindi,
      aksam=excluded.aksam,
      yatsi=excluded.yatsi,
      source_hash=excluded.source_hash,
      fetched_at=excluded.fetched_at`;
  return new Promise((resolve,reject)=>{
    db.run(sql,[pt.district_id,pt.date,pt.imsak,pt.gunes,pt.ogle,pt.ikindi,pt.aksam,pt.yatsi,pt.source_hash,pt.fetched_at],function(err){
      if(err) return reject(err); resolve();
    });
  });
}

function getPrayerTime(districtId,date){
  return new Promise((resolve,reject)=>{
    db.get('SELECT * FROM prayer_times WHERE district_id=? AND date=?',[districtId,date],(err,row)=>{
      if(err) return reject(err); resolve(row||null);
    });
  });
}

module.exports = { upsertPrayerTime, getPrayerTime };
