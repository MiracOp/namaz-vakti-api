// API test scripti
const axios = require('axios');

async function testAPI() {
  try {
    console.log('API test ediliyor...');
    
    // Yarının İstanbul namaz vakitleri
    const response = await axios.get('http://localhost:3000/vakitler?il=İstanbul&tarih=2025-09-02');
    console.log('\n=== 2 Eylül 2025 İstanbul Namaz Vakitleri ===');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('API Hatası:', error.message);
    
    // Diyanet'ten doğrudan çekmeyi deneyelim
    console.log('\nDiyanet\'ten doğrudan çekiliyor...');
    try {
      const cheerio = require('cheerio');
      const diyanetResponse = await axios.get('https://namazvakti.diyanet.gov.tr/tr-TR/İstanbul');
      const $ = cheerio.load(diyanetResponse.data);
      
      // Bugünün vakitleri
      console.log('\n=== Bugünün İstanbul Namaz Vakitleri (Diyanet) ===');
      console.log('İmsak:', $('table tr:nth-child(2) td:nth-child(1)').text().trim());
      console.log('Güneş:', $('table tr:nth-child(2) td:nth-child(2)').text().trim());
      console.log('Öğle:', $('table tr:nth-child(2) td:nth-child(3)').text().trim());
      console.log('İkindi:', $('table tr:nth-child(2) td:nth-child(4)').text().trim());
      console.log('Akşam:', $('table tr:nth-child(2) td:nth-child(5)').text().trim());
      console.log('Yatsı:', $('table tr:nth-child(2) td:nth-child(6)').text().trim());
      
    } catch (err) {
      console.error('Diyanet Hatası:', err.message);
    }
  }
}

testAPI();
