const axios = require('axios');

// Test edilecek şehirler ve olası ID'ler
const testCities = [
  { name: 'Ankara', possibleUrls: ['ankara', 'ankara-icin-namaz-vakti'] },
  { name: 'İzmir', possibleUrls: ['izmir', 'izmir-icin-namaz-vakti'] },
  { name: 'Bursa', possibleUrls: ['bursa', 'bursa-icin-namaz-vakti'] },
  { name: 'Adana', possibleUrls: ['adana', 'adana-icin-namaz-vakti'] },
  { name: 'Antalya', possibleUrls: ['antalya', 'antalya-icin-namaz-vakti'] }
];

async function findCityIds() {
  console.log('🔍 Şehir ID\'lerini ve URL formatlarını buluyoruz...\n');
  
  const foundCities = {};
  
  for (const city of testCities) {
    console.log(`📍 ${city.name} test ediliyor...`);
    
    for (const urlPart of city.possibleUrls) {
      try {
        const url = `https://namazvakitleri.diyanet.gov.tr/tr-TR/${urlPart}`;
        console.log(`   🔗 Deneniyor: ${url}`);
        
        const response = await axios.get(url, {
          timeout: 10000,
          headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
        });
        
        // JavaScript değişkenlerini ara
        const imsakMatch = response.data.match(/var _imsakTime = "([^"]+)"/);
        const gunesMatch = response.data.match(/var _gunesTime = "([^"]+)"/);
        
        // ID ve slug bilgilerini ara
        const ilceIdMatch = response.data.match(/var ilceId = (\d+)/);
        const urlMatch = response.request.res.responseUrl || url;
        
        if (imsakMatch && gunesMatch) {
          console.log(`   ✅ Başarılı! İmsak: ${imsakMatch[1]}, Güneş: ${gunesMatch[1]}`);
          
          if (ilceIdMatch) {
            console.log(`   🆔 ID bulundu: ${ilceIdMatch[1]}`);
          }
          
          console.log(`   🔗 Final URL: ${urlMatch}`);
          
          // URL'den ID ve slug çıkar
          const urlParts = urlMatch.match(/\/tr-TR\/(\d+)\/(.+)/) || urlMatch.match(/\/tr-TR\/(.+)/);
          
          foundCities[city.name] = {
            id: ilceIdMatch ? ilceIdMatch[1] : null,
            slug: urlParts ? urlParts[urlParts.length - 1] : urlPart,
            workingUrl: urlMatch,
            vakitler: {
              imsak: imsakMatch[1],
              gunes: gunesMatch[1]
            }
          };
          
          console.log(`   💾 Kaydedildi: ID=${foundCities[city.name].id}, slug=${foundCities[city.name].slug}\n`);
          break; // Bu şehir için başarılı, sonraki şehre geç
        } else {
          console.log(`   ❌ Veri bulunamadı`);
        }
        
      } catch (error) {
        console.log(`   ❌ Hata: ${error.message}`);
      }
    }
    
    console.log('---');
  }
  
  console.log('\n🎯 SONUÇLAR:');
  console.log('const LOCATIONS = {');
  for (const [cityName, data] of Object.entries(foundCities)) {
    if (data.id) {
      console.log(`  '${cityName}': { id: ${data.id}, slug: '${data.slug}' },`);
    } else {
      console.log(`  '${cityName}': { slug: '${data.slug}' }, // ID bulunamadı`);
    }
  }
  console.log('};');
}

findCityIds();
