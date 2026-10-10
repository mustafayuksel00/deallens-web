# DealLens ortak çalışma alanı — 10 Ekim 2026

Dört eğitim projesi tek React arayüzünde birleşti. Basit: şirket CRUD/filtre/yedek, beş oranlı çalışan Python ağacı, sonuç kaydı/yeniden açma, içerik galerisi. Pro: 64 oranlı çalışan CatBoost,500 kayıt/2MB CSV, tam sonuç indirme, geçmiş model kıyası, karar ağacı yolu, sözlük ve kaynak/notebook/marka ayrıntıları. Pro ücretli değildir.

## Kanıtlı kontroller
-12/12 otomatik test. Şirket CRUD/depolama, sayısal giriş, CSV biçimi/sınırları, güvenli dışa aktarma, bozuk analiz geçmişini koruma.
-Her model için5.910 kaynak satırı:11.820 tahmin, tüm sınıf etiketleri aynı. En büyük skor farkı1.4432899320127035e-15. hub-evidence/model-parity.json.
-Gerçek Chrome: boş giriş reddi; virgüllü örnek skor0.1721; kaydet/yenile/yeniden aç; şirketten analize bağlama;64 oran örnek skor0.0017;Pro geçmişini Basit moddan açınca Pro etkinleşti; mod tercihi yenilemede korundu.
-CSV tarayıcıda12 satırın tamamını işledi. İndirilen767byteCSV'nin12satır skoru/etiketi kodla yeniden eşleştirildi. hub-evidence/download-verification.json. Dosya chooser ve indirme olayını yakalama bir kez timeout oldu; yerel seçim doğal düğmeyle tamamlandı, gerçek indirme Downloads altında doğrulandı. Ürün hatası veya veri kaybı görülmedi.
-MP4 ve MP3 gerçek tarayıcıda sonuna kadar oynadı:18s/17.835333s, hata yok. hub-evidence/media-browser.json. İnsan dinlemesi yapılmadı.
-390×844 mobil: başlangıç, Basit ve Pro analizde yatay taşma yok; belge375px, viewport390px. Resimler hub-evidence/. Masaüstü gerçek ekranlar kaydedildi.
-İçerik blog/sosyal metin,7gün takvim,panoya kopyalama, dört proje kartı veML kartındanPro alanına geçiş kontrol edildi. Konsol hatası yok.
-Her derlenmiş dosyanın HTTP indirmesi ve docs/ kopyası aynı byte'larla doğrulanır: hub-evidence/asset-verification.json.

## Teslim
Canlı adres: https://mustafayuksel00.github.io/deallens-web/
Yeni yayın ve son canlı tarayıcı kanıtı hub-evidence/live-verification.json dosyasına kaydedilir.
Yerel paket: DealLens_Birlesik_Basit_Pro.zip. Çıkar, DealLens-Baslat.bat çift tıkla. Paket CRC ve tüm byte eşliği hub-evidence/package-verification.json altında saklanır. Yerel sunucu yalnız127.0.0.1:5276'da çalışır. Python standart kütüphanesi yeter; model servisinin kurulması gerekmez.

## Korunan sınırlar
Eski deallens-companies-v1 anahtarı korunur; şirket kayıtları silinmez/otomatik taşınmaz. Girdiler tarayıcıda hesaplanır; şirket/finans kayıtları sunucuya gönderilmez. Farklı site/yerel adres/cihaz ayrı depolamadır. JSON geçmişi yeniden içe aktarma yok; Pro indirme mevcut. Geçmiş200 ile sınırlı; topluCSV500ile sınırlı ve ekran ilk50sonucu gösterir, indirmenin tümü tamdır.

Model kıyas tablosu önceki deneyin kayıtlı sonuçlarıdır; yeni girdiye beş ayrı canlı model tahmini iddiası yok. Skorlar iflas yüzdesi değildir; tarihsel Polonya verisinin güncel Türkiye geçerliliği kanıtlanmamıştır. Content Flow PDF'leri ilk ders tesliminin tarihli kopyası; birleşik ekrandaki marka stratejisi entegrasyona göre güncellendi. Dört özgün proje asılları korunur. Resmî form gönderilmedi.
