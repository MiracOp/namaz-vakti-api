# Flutter Entegrasyonu - Namaz Vakti API

## 1. Gerekli Paketleri Yükle

`pubspec.yaml` dosyanda şu paketi ekle:

```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0  # HTTP istekleri için
```

Sonra terminalde:
```bash
flutter pub get
```

## 2. API Servisini Kopyala

`namaz_vakti_service.dart` dosyasını Flutter projenin `lib/services/` klasörüne kopyala.

## 3. Basit Kullanım Örneği

```dart
import 'package:flutter/material.dart';
import 'services/namaz_vakti_service.dart';

class NamazVakitleriWidget extends StatefulWidget {
  @override
  _NamazVakitleriWidgetState createState() => _NamazVakitleriWidgetState();
}

class _NamazVakitleriWidgetState extends State<NamazVakitleriWidget> {
  Map<String, dynamic>? vakitler;
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    loadVakitler();
  }

  Future<void> loadVakitler() async {
    setState(() {
      isLoading = true;
    });

    final data = await NamazVaktiService.getVakitler('İstanbul');
    setState(() {
      vakitler = data;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Namaz Vakitleri')),
      body: isLoading
          ? Center(child: CircularProgressIndicator())
          : vakitler != null
              ? Column(
                  children: [
                    Text('İmsak: ${vakitler!['imsak']}'),
                    Text('Güneş: ${vakitler!['gunes']}'),
                    Text('Öğle: ${vakitler!['ogle']}'),
                    Text('İkindi: ${vakitler!['ikindi']}'),
                    Text('Akşam: ${vakitler!['aksam']}'),
                    Text('Yatsı: ${vakitler!['yatsi']}'),
                  ],
                )
              : Text('Veri yüklenemedi'),
    );
  }
}
```

## 4. API Fonksiyonları

### Namaz Vakitleri Al
```dart
// Bugünün vakitleri
final vakitler = await NamazVaktiService.getVakitler('İstanbul');

// Belirli bir tarihin vakitleri
final vakitler = await NamazVaktiService.getVakitler('İstanbul', tarih: '2025-09-01');
```

### İl Listesi Al
```dart
final iller = await NamazVaktiService.getIller();
print(iller); // ['Adana', 'Adıyaman', 'Afyonkarahisar', ...]
```

### API Durumu Kontrol Et
```dart
final isHealthy = await NamazVaktiService.checkHealth();
if (isHealthy) {
  print('API çalışıyor');
} else {
  print('API erişilemez');
}
```

## 5. Hata Yönetimi

```dart
try {
  final vakitler = await NamazVaktiService.getVakitler('İstanbul');
  if (vakitler != null) {
    // Veri başarıyla alındı
    print('İmsak: ${vakitler['imsak']}');
  } else {
    // API'den veri alınamadı
    print('Namaz vakitleri alınamadı');
  }
} catch (e) {
  print('Hata: $e');
}
```

## 6. Test Etme

API'yi test etmek için tarayıcıda şu adresleri kontrol et:
- https://namaz-vakti-api-pied.vercel.app/health
- https://namaz-vakti-api-pied.vercel.app/vakitler?il=İstanbul
- https://namaz-vakti-api-pied.vercel.app/iller

Bu adreslerden JSON veri geliyorsa API çalışıyor demektir.
