import 'package:flutter/material.dart';
import 'namaz_vakti_service.dart';

class NamazVakitleriPage extends StatefulWidget {
  @override
  _NamazVakitleriPageState createState() => _NamazVakitleriPageState();
}

class _NamazVakitleriPageState extends State<NamazVakitleriPage> {
  Map<String, dynamic>? vakitler;
  List<String> iller = [];
  String selectedIl = 'İstanbul';
  bool isLoading = false;

  @override
  void initState() {
    super.initState();
    loadIller();
    loadVakitler();
  }

  Future<void> loadIller() async {
    final illerData = await NamazVaktiService.getIller();
    setState(() {
      iller = illerData;
    });
  }

  Future<void> loadVakitler() async {
    setState(() {
      isLoading = true;
    });

    final vakitlerData = await NamazVaktiService.getVakitler(selectedIl);
    setState(() {
      vakitler = vakitlerData;
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Namaz Vakitleri'),
        backgroundColor: Colors.green,
      ),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            // İl Seçimi
            DropdownButton<String>(
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
                  setState(() {
                    selectedIl = newValue;
                  });
                  loadVakitler();
                }
              },
            ),
            SizedBox(height: 20),
            
            // Vakitler
            isLoading
                ? CircularProgressIndicator()
                : vakitler != null
                    ? Expanded(
                        child: Card(
                          child: Padding(
                            padding: EdgeInsets.all(16.0),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  '${vakitler!['il']} - ${vakitler!['tarih']}',
                                  style: TextStyle(
                                    fontSize: 18,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                                SizedBox(height: 16),
                                _buildVakitRow('İmsak', vakitler!['imsak']),
                                _buildVakitRow('Güneş', vakitler!['gunes']),
                                _buildVakitRow('Öğle', vakitler!['ogle']),
                                _buildVakitRow('İkindi', vakitler!['ikindi']),
                                _buildVakitRow('Akşam', vakitler!['aksam']),
                                _buildVakitRow('Yatsı', vakitler!['yatsi']),
                              ],
                            ),
                          ),
                        ),
                      )
                    : Text('Veri yüklenemedi'),
          ],
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: loadVakitler,
        child: Icon(Icons.refresh),
        backgroundColor: Colors.green,
      ),
    );
  }

  Widget _buildVakitRow(String vakit, String saat) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            vakit,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          Text(
            saat,
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: Colors.green,
            ),
          ),
        ],
      ),
    );
  }
}
