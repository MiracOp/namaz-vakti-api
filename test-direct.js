const axios = require('axios');

async function testDirect() {
  try {
    console.log('Diyanet URL test ediliyor...');
    const response = await axios.get('https://namazvakitleri.diyanet.gov.tr/tr-TR/9541/istanbul-icin-namaz-vakti', {
      timeout: 10000,
      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36' }
    });
    
    // JavaScript değişkenlerini ara
    const html = response.data;
    const imsakMatch = html.match(/var _imsakTime = "([^"]+)"/);
    const gunesMatch = html.match(/var _gunesTime = "([^"]+)"/);
    const ogleMatch = html.match(/var _ogleTime = "([^"]+)"/);
    const ikindiMatch = html.match(/var _ikindiTime = "([^"]+)"/);
    const aksamMatch = html.match(/var _aksamTime = "([^"]+)"/);
    const yatsiMatch = html.match(/var _yatsiTime = "([^"]+)"/);
    
    if (imsakMatch && gunesMatch && ogleMatch && ikindiMatch && aksamMatch && yatsiMatch) {
      console.log('✅ Başarılı! Namaz vakitleri:');
      console.log({
        imsak: imsakMatch[1],
        gunes: gunesMatch[1],
        ogle: ogleMatch[1],
        ikindi: ikindiMatch[1],
        aksam: aksamMatch[1],
        yatsi: yatsiMatch[1]
      });
    } else {
      console.log('❌ JavaScript değişkenleri bulunamadı');
      console.log('HTML uzunluğu:', html.length);
      console.log('İlk 500 karakter:', html.substring(0, 500));
    }
  } catch (error) {
    console.log('❌ Hata:', error.message);
  }
}

testDirect();
