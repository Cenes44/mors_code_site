# 📡 Mors Kodu Eğitmeni & Dönüştürücü

![Lisans](https://img.shields.io/badge/lisans-MIT-blue.svg)
![Sürüm](https://img.shields.io/badge/sürüm-1.0.0-green.svg)
![Durum](https://img.shields.io/badge/durum-Yayında-success.svg)

Mors kodunu öğrenmek ve dönüştürmek için tasarlanmış modern, etkileşimli bir "Progressive Web App" (PWA) uygulaması. Saf JavaScript (Vanilla JS) ile geliştirilen bu araç; çift yönlü çeviri, sesli oynatma/dışa aktarma ve ses analizi sunar.

## ✨ Özellikler

- **Çift Yönlü Dönüştürme:** Metinden Morsa ve Morstan Metne gerçek zamanlı çeviri.
- **Sesli & Görsel Geri Bildirim:**
  - Ayarlanabilir frekans ve hız (WPM) ile yüksek hassasiyetli ses oynatma.
  - 🎵 **Dışa Aktar (WAV):** Mors kodunuzu yüksek kaliteli WAV ses dosyası olarak indirin.
- **İçe Aktar & Çöz:** Ses dosyalarını (WAV) yükleyerek Mors sinyallerini analiz edin ve metne çevirin.
- **PWA Desteği:** Mobil ve masaüstü cihazlara kurulabilir, çevrimdışı çalışabilir.
- **Kişiselleştirilebilir:**
  - Ayarlanabilir WPM (Dakikadaki Kelime Sayısı).
  - Ayarlanabilir Ses Frekansı (Ton).
  - Karanlık/Aydınlık (Dark/Light) tema desteği.
  - Türkçe ve İngilizce dil desteği.

## 🚀 Demo

[Canlı Demo Bağlantısı](https://cenes44.github.io/mors_code_site/)

## 🛠️ Kullanım

### Metinden Morsa (ve Tersi)
1. **Normal Metin** kutusuna yazınız.
2. **Mors Kodu** kutusu anında güncellenir.
3. **Ses Çal** butonuna basarak diziyi dinleyebilirsiniz.
4. **Ses İndir (WAV)** butonu ile sesi bilgisayarınıza kaydedebilirsiniz.

### İçe Aktar / Analiz
1. **İçe / Dışa Aktar** bölümüne gidin.
2. Bir Mors kodu ses dosyası seçin.
3. **Analiz Et ve Çöz** butonuna tıklayın.

## 💻 Teknolojiler

- **Çekirdek:** HTML5, CSS3, JavaScript (ES6+)
- **Ses:** Web Audio API (Dışa aktarım için OfflineAudioContext, Gerçek zamanlı analiz)
- **PWA:** Service Workers, Manifest
- **Stil:** CSS3 Değişkenleri, Flexbox/Grid, Responsive Tasarım, Glassmorphism

## 📦 Kurulum & Çalıştırma

1. **Depoyu klonlayın:**
   ```bash
   git clone https://github.com/Cenes44/mors_code_site.git
   cd mors_code_site
   ```

2. **Yerel olarak çalıştırın:**
   Bu proje gelişmiş tarayıcı özellikleri (AudioContext, Workers) kullandığı için bir yerel sunucu gerektirir.
   
   Python kullanarak:
   ```bash
   python -m http.server 8080
   ```
   
   Node (http-server) kullanarak:
   ```bash
   npx http-server .
   ```

3. **Tarayıcıda Açın:**
   `http://localhost:8080` adresine gidin.

## 🤝 Katkıda Bulunma

Katkılarınız, hata bildirimleriniz ve özellik istekleriniz memnuniyetle karşılanır!

1. Projeyi Fork'layın
2. Yeni bir özellik dalı (Feature Branch) oluşturun (`git checkout -b ozellik/HarikaOzellik`)
3. Değişikliklerinizi Commit'leyin (`git commit -m 'HarikaOzellik eklendi'`)
4. Dalınıza Push edin (`git push origin ozellik/HarikaOzellik`)
5. Bir Pull Request açın

## 📝 Lisans

Bu proje MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---
**[Cenes44](https://github.com/Cenes44) tarafından ❤️ ile geliştirilmiştir.**