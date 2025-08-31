

const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Mobil uygulama için gerekli
app.use(cors());
app.use(express.json());

const ILLER = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya', 'Artvin', 'Aydın',
  'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı',
  'Çorum', 'Denizli', 'Diyarbakır', 'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir',
  'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari', 'Hatay', 'Isparta', 'Mersin', 'İstanbul',
  'İzmir', 'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş', 'Nevşehir',
  'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Tekirdağ',
  'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak', 'Van', 'Yozgat', 'Zonguldak',
  'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale', 'Batman', 'Şırnak', 'Bartın', 'Ardahan',
  'Iğdır', 'Yalova', 'Karabük', 'Kilis', 'Osmaniye', 'Düzce'
];

// Basit bellek içi cache
const cache = {};

// Basit zaman doğrulama (HH:MM)
function isValidTime(str){
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(str || '');
}

// İl -> (id, slug) eşleme (örnek; genişletilecek)
const LOCATIONS = {
  'İstanbul': { id: 9541, slug: 'istanbul-icin-namaz-vakti' },
  'Ankara': { id: 9206, slug: 'ankara' },
  'İzmir': { id: 9206, slug: 'izmir' },
  'Bursa': { id: 9206, slug: 'bursa' },
  'Adana': { id: 9206, slug: 'adana' },
  'Antalya': { id: 9206, slug: 'antalya' }
  // Diğer iller buraya eklenecek
};

// Olası resmi domain varyasyonları
const DOMAIN_CANDIDATES = [
  'https://namazvakitleri.diyanet.gov.tr',
  'https://namazvakti.diyanet.gov.tr'
];

// Diyanet'ten vakitleri çekme fonksiyonu (JavaScript değişkenlerinden parse eder)
async function fetchVakitler(il, tarih) {
  const loc = LOCATIONS[il];
  // Eğer ID varsa ID + slug formatını dener, yoksa eski yaklaşım
  const candidateUrls = [];
  if (loc) {
    for (const d of DOMAIN_CANDIDATES) {
      candidateUrls.push(`${d}/tr-TR/${loc.id}/${loc.slug}`);
    }
  }
  // Eski basit yol (yalnız slug'sız il ismi) – geri planda
  for (const d of DOMAIN_CANDIDATES) {
    candidateUrls.push(`${d}/tr-TR/${il}`);
  }

  const maxRetry = 2; // Her URL için deneme sayısı
  console.log(`[fetchVakitler] Başlıyor: il=${il}, tarih=${tarih}`);
  
  for (const url of candidateUrls) {
    console.log(`[fetchVakitler] Deneniyor: ${url}`);
    for (let attempt = 1; attempt <= maxRetry; attempt++) {
      try {
        const response = await axios.get(url, { timeout: 15000, headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }});
        const html = response.data;

        // JavaScript'ten veriyi çıkar
        const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
        let scriptMatch;
        let vakitler = null;
        
        while ((scriptMatch = scriptRegex.exec(html)) !== null) {
          const scriptContent = scriptMatch[1];
          
          // Namaz vakitleri değişkenlerini ara
          const imsakMatch = scriptContent.match(/var _imsakTime = "([^"]+)"/);
          const gunesMatch = scriptContent.match(/var _gunesTime = "([^"]+)"/);
          const ogleMatch = scriptContent.match(/var _ogleTime = "([^"]+)"/);
          const ikindiMatch = scriptContent.match(/var _ikindiTime = "([^"]+)"/);
          const aksamMatch = scriptContent.match(/var _aksamTime = "([^"]+)"/);
          const yatsiMatch = scriptContent.match(/var _yatsiTime = "([^"]+)"/);
          
          if (imsakMatch && gunesMatch && ogleMatch && ikindiMatch && aksamMatch && yatsiMatch) {
            vakitler = {
              imsak: imsakMatch[1],
              gunes: gunesMatch[1],
              ogle: ogleMatch[1],
              ikindi: ikindiMatch[1],
              aksam: aksamMatch[1],
              yatsi: yatsiMatch[1]
            };
            break;
          }
        }

        if (!vakitler) {
          console.warn(`[fetchVakitler] JavaScript değişkenleri bulunamadı url=${url} attempt=${attempt}`);
          if (attempt === maxRetry) break;
          await new Promise(r=>setTimeout(r, attempt*400));
          continue;
        }

        const allOk = [vakitler.imsak, vakitler.gunes, vakitler.ogle, vakitler.ikindi, vakitler.aksam, vakitler.yatsi].every(isValidTime);
        if (!allOk) {
          console.warn(`[fetchVakitler] Geçersiz/eksik veri url=${url} attempt=${attempt}`);
          if (attempt === maxRetry) break;
          await new Promise(r=>setTimeout(r, attempt*400));
          continue;
        }
        
        vakitler.il = il;
        vakitler.tarih = tarih;
        vakitler.sourceUrl = url;
        return vakitler;
      } catch (err) {
        console.warn(`[fetchVakitler] Hata url=${url} attempt=${attempt}:`, err.message);
        if (attempt === maxRetry) break;
        await new Promise(r=>setTimeout(r, attempt*600));
      }
    }
  }
  return null; // Hiçbiri başarılı olmadı
}

// Günlük otomatik cache güncelleme
async function updateCacheForToday() {
  const today = new Date().toISOString().slice(0, 10);
  for (const il of ILLER) {
    const vakitler = await fetchVakitler(il, today);
    if (vakitler) {
      cache[`${il}_${today}`] = vakitler;
    }
  }
  console.log('Cache güncellendi:', today);
}

// Her gün saat 02:00'de cache güncelle (node-cron ile)
const cron = require('node-cron');
cron.schedule('0 2 * * *', () => {
  updateCacheForToday();
});

// Sunucu başlatıldığında bugünün cache'ini doldur (şimdilik devre dışı test için)
// updateCacheForToday();

// API endpoint: /vakitler?il=İstanbul&tarih=2025-09-01 (tarih opsiyonel)
app.get('/vakitler', async (req, res) => {
  const { il, tarih } = req.query;
  
  if (!il || !ILLER.includes(il)) {
    return res.status(400).json({ 
      success: false,
      error: 'Geçersiz il adı',
      validIller: ILLER 
    });
  }
  
  // Tarih belirtilmemişse bugünün tarihini kullan
  const selectedTarih = tarih || new Date().toISOString().slice(0, 10);

  // Önce cache'e bak
  const cacheKey = `${il}_${selectedTarih}`;
  if (cache[cacheKey]) {
    return res.json({
      success: true,
      data: cache[cacheKey],
      source: 'cache'
    });
  }

  // Cache yoksa Diyanet'ten çek
  const vakitler = await fetchVakitler(il, selectedTarih);
  if (vakitler && vakitler.imsak) {
    cache[cacheKey] = vakitler;
    return res.json({ success: true, data: vakitler, source: 'live' });
  }
  return res.status(502).json({
    success: false,
    error: 'Diyanet verisi alınamadı. Lütfen tekrar deneyin.',
    il,
    tarih: selectedTarih
  });
});

// İl listesi endpoint'i - Mobil uygulama için
app.get('/iller', (req, res) => {
  res.json({
    success: true,
    data: ILLER,
    count: ILLER.length
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'API çalışıyor',
    timestamp: new Date().toISOString(),
    cacheSize: Object.keys(cache).length
  });
});

app.listen(PORT, () => {
  console.log(`Namaz Vakti API ${PORT} portunda çalışıyor.`);
});
