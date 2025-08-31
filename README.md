# Namaz Vakti API 🕌

Türkiye'deki tüm illerin namaz vakitlerini Diyanet İşleri Başkanlığı'ndan çeken REST API.

## 🚀 Özellikler

- ✅ **Gerçek Zamanlı Veri**: Diyanet İşleri Başkanlığı'ndan güncel veriler
- ✅ **Otomatik Güncelleme**: Her gün saat 02:00'da cache güncellenir
- ✅ **Mobil Uyumlu**: CORS desteği ile Flutter/React Native uygulamaları için hazır
- ✅ **Hızlı Yanıt**: Bellek içi cache sistemi
- ✅ **Kolay Kullanım**: RESTful API yapısı

## 📍 Desteklenen Şehirler

- İstanbul
- Ankara  
- İzmir
- Bursa
- Adana
- Antalya
- *Diğer şehirler eklenmeye devam ediyor...*

## 🔗 API Endpoints

### Namaz Vakitlerini Getir
```
GET /vakitler?il={ŞEHİR_ADI}&tarih={YYYY-MM-DD}
```

**Örnek:**
```bash
curl "https://your-app.railway.app/vakitler?il=İstanbul&tarih=2025-09-01"
```

**Yanıt:**
```json
{
  "success": true,
  "data": {
    "imsak": "04:30",
    "gunes": "05:58",
    "ogle": "12:43",
    "ikindi": "16:22",
    "aksam": "19:17",
    "yatsi": "20:45",
    "il": "İstanbul",
    "tarih": "2025-09-01",
    "sourceUrl": "https://namazvakitleri.diyanet.gov.tr/tr-TR/istanbul-icin-namaz-vakti"
  },
  "source": "cache"
}
```

### Şehir Listesi
```
GET /iller
```

### Health Check
```
GET /health
```

## 🛠️ Kurulum

```bash
# Proje klasörüne git
cd namazVaktiApi

# Bağımlılıkları kur
npm install

# Uygulamayı başlat
npm start
```

## ☁️ Railway.app Deployment

1. [Railway.app](https://railway.app) hesabı oluşturun
2. GitHub repo'nuzu bağlayın
3. Deploy butonuna tıklayın
4. Otomatik deployment tamamlanacak!

## 📱 Flutter Entegrasyonu

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class NamazVaktiService {
  static const String baseUrl = 'https://your-app.railway.app';
  
  static Future<Map<String, dynamic>> getVakitler(String il, String tarih) async {
    final response = await http.get(
      Uri.parse('$baseUrl/vakitler?il=$il&tarih=$tarih'),
    );
    
    if (response.statusCode == 200) {
      return json.decode(response.body);
    } else {
      throw Exception('Veri alınamadı');
    }
  }
}
```

## 📄 Lisans

MIT License

---

💡 **Not**: Bu API Diyanet İşleri Başkanlığı'nın resmi verilerini kullanır ve günlük olarak güncellenir.
