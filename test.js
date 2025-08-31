const axios = require('axios');

async function testAPI() {
  try {
    const response = await axios.get('http://localhost:3000/vakitler?il=İstanbul&tarih=2025-09-02');
    console.log('Yarın (2 Eylül 2025) İstanbul Namaz Vakitleri:');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log('Hata:', error.message);
  }
}

testAPI();
