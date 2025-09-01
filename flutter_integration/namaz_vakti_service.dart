import 'dart:convert';
import 'package:http/http.dart' as http;

class NamazVaktiService {
  // API URL'inizi buraya yazın (deploy ettikten sonra)
  static const String baseUrl = 'https://namaz-vakti-api-pied.vercel.app';
  
  // Namaz vakitlerini al
  static Future<Map<String, dynamic>?> getVakitler(String il, {String? tarih}) async {
    try {
      String url = '$baseUrl/vakitler?il=$il';
      if (tarih != null) {
        url += '&tarih=$tarih';
      }
      
      final response = await http.get(
        Uri.parse(url),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return data['data'];
        }
      }
      return null;
    } catch (e) {
      print('API Error: $e');
      return null;
    }
  }
  
  // İl listesini al
  static Future<List<String>> getIller() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/iller'),
        headers: {'Content-Type': 'application/json'},
      );
      
      if (response.statusCode == 200) {
        final data = json.decode(response.body);
        if (data['success']) {
          return List<String>.from(data['data']);
        }
      }
      return [];
    } catch (e) {
      print('API Error: $e');
      return [];
    }
  }
  
  // API durumunu kontrol et
  static Future<bool> checkHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
      );
      return response.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
