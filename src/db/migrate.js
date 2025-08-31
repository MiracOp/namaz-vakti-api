const db = require('./connection');

function migrate() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS provinces (
      id INTEGER PRIMARY KEY,
      name TEXT NOT NULL,
      slug TEXT NOT NULL UNIQUE
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS districts (
      id INTEGER PRIMARY KEY,
      province_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      slug TEXT NOT NULL,
      FOREIGN KEY(province_id) REFERENCES provinces(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS prayer_times (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      district_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      imsak TEXT NOT NULL,
      gunes TEXT NOT NULL,
      ogle TEXT NOT NULL,
      ikindi TEXT NOT NULL,
      aksam TEXT NOT NULL,
      yatsi TEXT NOT NULL,
      source_hash TEXT,
      fetched_at TEXT NOT NULL,
      UNIQUE(district_id, date),
      FOREIGN KEY(district_id) REFERENCES districts(id)
    )`);
  });
}

module.exports = { migrate };
