const axios = require('axios');

async function testTarihler() {
  console.log('🔍 Diyanet sitesinin tarih davranışını test ediyoruz...\n');
  
  // Test 1: Bugünün vakitleri (1 Eylül 2025)
  console.log('📅 Test 1: Bugünün vakitleri');
  try {
    const response1 = await axios.get('https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/istanbul-icin-namaz-vakti', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    
    const imsakMatch1 = response1.data.match(/var _imsakTime = "([^"]+)"/);
    const gunesMatch1 = response1.data.match(/var _gunesTime = "([^"]+)"/);
    
    if (imsakMatch1 && gunesMatch1) {
      console.log(`✅ Başarılı: İmsak ${imsakMatch1[1]}, Güneş ${gunesMatch1[1]}`);
    } else {
      console.log('❌ JavaScript değişkenleri bulunamadı');
    }
    
    // HTML'de tarih bilgisi var mı kontrol et
    const tarihMatch = response1.data.match(/(\d{1,2}\s+\w+\s+\d{4})/);
    if (tarihMatch) {
      console.log(`📆 Sayfadaki tarih: ${tarihMatch[1]}`);
    }
    
  } catch (error) {
    console.log('❌ Hata:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 2: Farklı şehir ID'si ile
  console.log('📅 Test 2: Ankara için (ID: farklı)');
  try {
    // Ankara'nın ID'sini bulmaya çalış
    const response2 = await axios.get('https://namazvakitleri.diyanet.gov.tr/tr-TR/ankara', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    
    const imsakMatch2 = response2.data.match(/var _imsakTime = "([^"]+)"/);
    const gunesMatch2 = response2.data.match(/var _gunesTime = "([^"]+)"/);
    
    if (imsakMatch2 && gunesMatch2) {
      console.log(`✅ Ankara başarılı: İmsak ${imsakMatch2[1]}, Güneş ${gunesMatch2[1]}`);
    } else {
      console.log('❌ Ankara için veri bulunamadı');
    }
    
  } catch (error) {
    console.log('❌ Ankara hatası:', error.message);
  }
  
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test 3: URL'de tarih parametresi var mı test et
  console.log('📅 Test 3: URL yapısını analiz et');
  try {
    const response3 = await axios.get('https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/istanbul-icin-namaz-vakti', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    
    console.log('🔗 Response URL:', response3.request.res.responseUrl || 'Aynı URL');
    console.log('📊 Response uzunluğu:', response3.data.length);
    
    // JavaScript'te tarih bilgisi var mı?
    const jsDateMatch = response3.data.match(/var\s+\w*[Dd]ate\w*\s*=\s*"([^"]+)"/);
    if (jsDateMatch) {
      console.log('📅 JS tarih:', jsDateMatch[1]);
    }
    
    // Sayfa başlığında tarih var mı?
    const titleMatch = response3.data.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
      console.log('📰 Sayfa başlığı:', titleMatch[1]);
    }
    
  } catch (error) {
    console.log('❌ URL analiz hatası:', error.message);
  }
}

testTarihler();
