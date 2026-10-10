# Projeyi kendi cümlelerinle anlat

DealLens Web, şirketlerin inceleme kayıtlarını takip eden React uygulamasıdır. Şirket eklenir, listelenir, düzenlenir ve silinir. Arama ve filtreler kaydı bulmayı kolaylaştırır. Özet kartları kayıtların durumunu gösterir.

## Kısa kullanım
1. Canlı uygulamayı aç, Şirket ekle düğmesine bas.
2. Adı yaz, sektör ve durum seç. Gelir ve not isteğe bağlıdır.
3. Kaydet. Satırdaki kalem kaydı düzenler, çöp kutusu silme onayı açar.
4. Sayfayı yenile: kayıt aynı tarayıcıda kalır. Yedek indir ile JSON kopyasını al.

## Teknik açıklama
- React bileşenleri arayüzü oluşturur; state değişince liste ve özetler güncellenir.
- CompanyForm formu, Dashboard ekranı ve company.js veri doğrulamasını yönetir.
- localStorage JSON veriyi tarayıcıda saklar. Veritabanı ve sunucu yoktur; cihazlar arasında paylaşılmaz.
- Kayıt önce depolamaya yazılır; başarıdan sonra ekran güncellenir. Kaydetme başarısızsa form girdisi korunur.
- Aynı şirket adı, geçersiz gelir ve eksik ad reddedilir. Bozuk kayıtlar sessizce örnek veriye çevrilmez.
- Vite uygulamayı statik dosyalara dönüştürür; GitHub Pages bu dosyaları yayınlar.

## Kendini dene
Bir şirket ekleyip düzenle, filtrele, silmeden vazgeç ve yenile. Ardından şu soruları cevapla: CRUD ne demek? React state neden var? localStorage ile sunucu veritabanı arasındaki fark ne? Kaydetme hatasında neden başarı mesajı göstermiyoruz? Bu ekran neden ML tahmini sayılmaz?

Bu sürümde öncelik ve durum elle belirlenir. Python/ML modelleri ayrı projelerdir. Ortak arayüz entegrasyonu sonraki aşamadır. Örnek şirketler kurgusaldır. AI desteği kullanıldı; bağımsız kavrayış kontrolü henüz yapılmadı.
