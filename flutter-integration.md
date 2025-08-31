# Flutter Mobil Uygulama Entegrasyonu

## 1. Flutter'da HTTP İstekleri için Gerekli Paket

`pubspec.yaml` dosyanıza ekleyin:
```yaml
dependencies:
  flutter:
    sdk: flutter
  http: ^1.1.0  # HTTP istekleri için
  # Diğer paketleriniz...
```

## 2. Model Sınıfı (namaz_vakti_model.dart)

```dart
// lib/models/namaz_vakti_model.dart
class NamazVakti {
  final String imsak;
  final String gunes;
  final String ogle;
  final String ikindi;
  final String aksam;
  final String yatsi;
  final String il;
  final String tarih;
  final String sourceUrl;

  NamazVakti({
    required this.imsak,
    required this.gunes,
    required this.ogle,
    required this.ikindi,
    required this.aksam,
    required this.yatsi,
    required this.il,
    required this.tarih,
    required this.sourceUrl,
  });

  factory NamazVakti.fromJson(Map<String, dynamic> json) {
    return NamazVakti(
      imsak: json['imsak'],
      gunes: json['gunes'],
      ogle: json['ogle'],
      ikindi: json['ikindi'],
      aksam: json['aksam'],
      yatsi: json['yatsi'],
      il: json['il'],
      tarih: json['tarih'],
      sourceUrl: json['sourceUrl'],
    );
  }
}
```

## 3. API Service Sınıfı (namaz_vakti_service.dart)

```dart
// lib/services/namaz_vakti_service.dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/namaz_vakti_model.dart';

class NamazVaktiService {
  // Sunucunuzun IP adresi (localhost yerine gerçek IP)
  static const String baseUrl = 'http://192.168.1.100:3000'; // IP'nizi buraya yazın
  
  // Namaz vakitlerini getir
  static Future<NamazVakti?> getVakitler(String il, {String? tarih}) async {
    try {
      String url = '$baseUrl/vakitler?il=$il';
      if (tarih != null) {
        url += '&tarih=$tarih';
      }
      
      final response = await http.get(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 10));
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        if (jsonData['success'] == true) {
          return NamazVakti.fromJson(jsonData['data']);
        }
      }
      return null;
    } catch (e) {
      print('API Hatası: $e');
      return null;
    }
  }
  
  // İl listesini getir
  static Future<List<String>?> getIller() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/iller'),
        headers: {'Content-Type': 'application/json'},
      ).timeout(Duration(seconds: 10));
      
      if (response.statusCode == 200) {
        final jsonData = json.decode(response.body);
        if (jsonData['success'] == true) {
          return List<String>.from(jsonData['data']);
        }
      }
      return null;
    } catch (e) {
      print('İller API Hatası: $e');
      return null;
    }
  }
}
```

## 4. UI Widget Örneği (namaz_vakti_widget.dart)

```dart
// lib/widgets/namaz_vakti_widget.dart
import 'package:flutter/material.dart';
import '../models/namaz_vakti_model.dart';
import '../services/namaz_vakti_service.dart';

class NamazVaktiWidget extends StatefulWidget {
  @override
  _NamazVaktiWidgetState createState() => _NamazVaktiWidgetState();
}

class _NamazVaktiWidgetState extends State<NamazVaktiWidget> {
  NamazVakti? namazVakti;
  bool isLoading = false;
  String selectedIl = 'İstanbul';
  List<String> iller = ['İstanbul', 'Ankara'];

  @override
  void initState() {
    super.initState();
    getVakitler();
  }

  Future<void> getVakitler() async {
    setState(() => isLoading = true);
    
    final vakitler = await NamazVaktiService.getVakitler(selectedIl);
    
    setState(() {
      namazVakti = vakitler;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Namaz Vakitleri'),
        backgroundColor: Colors.teal,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            // İl Seçimi
            Card(
              child: Padding(
                padding: EdgeInsets.all(16.0),
                child: Row(
                  children: [
                    Text('İl: ', style: TextStyle(fontSize: 16)),
                    Expanded(
                      child: DropdownButton<String>(
                        value: selectedIl,
                        isExpanded: true,
                        items: iller.map((String il) {
                          return DropdownMenuItem<String>(
                            value: il,
                            child: Text(il),
                          );
                        }).toList(),
                        onChanged: (String? newValue) {
                          if (newValue != null) {
                            setState(() => selectedIl = newValue);
                            getVakitler();
                          }
                        },
                      ),
                    ),
                    IconButton(
                      icon: Icon(Icons.refresh),
                      onPressed: getVakitler,
                    ),
                  ],
                ),
              ),
            ),
            
            SizedBox(height: 20),
            
            // Vakitler
            if (isLoading)
              Center(child: CircularProgressIndicator())
            else if (namazVakti != null)
              Expanded(
                child: Card(
                  child: Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Column(
                      children: [
                        Text(
                          '${namazVakti!.il} - ${namazVakti!.tarih}',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        SizedBox(height: 20),
                        
                        // Vakitler Listesi
                        Expanded(
                          child: ListView(
                            children: [
                              VakitItem('İmsak', namazVakti!.imsak, Icons.nights_stay),
                              VakitItem('Güneş', namazVakti!.gunes, Icons.wb_sunny),
                              VakitItem('Öğle', namazVakti!.ogle, Icons.wb_sunny_outlined),
                              VakitItem('İkindi', namazVakti!.ikindi, Icons.brightness_6),
                              VakitItem('Akşam', namazVakti!.aksam, Icons.brightness_4),
                              VakitItem('Yatsı', namazVakti!.yatsi, Icons.brightness_2),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              )
            else
              Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.error, size: 64, color: Colors.red),
                    SizedBox(height: 16),
                    Text('Namaz vakitleri yüklenemedi'),
                    ElevatedButton(
                      onPressed: getVakitler,
                      child: Text('Tekrar Dene'),
                    ),
                  ],
                ),
              ),
          ],
        ),
      ),
    );
  }
}

class VakitItem extends StatelessWidget {
  final String vakit;
  final String saat;
  final IconData icon;

  VakitItem(this.vakit, this.saat, this.icon);

  @override
  Widget build(BuildContext context) {
    return Container(
      margin: EdgeInsets.symmetric(vertical: 8),
      padding: EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.teal.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.teal.shade200),
      ),
      child: Row(
        children: [
          Icon(icon, color: Colors.teal, size: 24),
          SizedBox(width: 16),
          Expanded(
            child: Text(
              vakit,
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
            ),
          ),
          Text(
            saat,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Colors.teal.shade700,
            ),
          ),
        ],
      ),
    );
  }
}
```

## 5. Ana Sayfada Kullanım (main.dart)

```dart
// lib/main.dart
import 'package:flutter/material.dart';
import 'widgets/namaz_vakti_widget.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Namaz Vakitleri',
      theme: ThemeData(
        primarySwatch: Colors.teal,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: NamazVaktiWidget(),
    );
  }
}
```

## 6. Önemli Notlar

### API Sunucusu IP Adresi:
- `localhost` yerine gerçek IP adresinizi kullanın
- Terminal'de `ifconfig` (Mac/Linux) veya `ipconfig` (Windows) ile IP'nizi bulun
- Örnek: `192.168.1.100:3000`

### Android için Network İzni:
`android/app/src/main/AndroidManifest.xml` dosyasına ekleyin:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

### Test Etmek İçin:
1. API sunucunuzu çalıştırın: `node index.js`
2. IP adresinizi güncelleyin
3. Flutter uygulamasını çalıştırın: `flutter run`

Bu entegrasyon ile mobil uygulamanız gerçek zamanlı Diyanet verilerini kullanacak! 🚀
