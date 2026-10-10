# DealLens — dört proje, tek çalışma alanı

Mustafa Yüksel · Software Persona · 10 Ekim 2026

Şirket takibi, çalışan finansal analiz ve Content Flow tek React uygulamasında. Basit/Pro seçimi sağ üstte; Pro ücretli bir servis değildir.

## Kullanım
Canlı adres: https://mustafayuksel00.github.io/deallens-web/

- **Basit:** Şirketler → şirket ekle/düzenle/sil/filtrele. Satırdaki analiz oku şirketi Finansal analiz alanında seçer. Beş oranı gir → Analiz et → Analizi kaydet. Örneği doldur kurgusal değerleri getirir.
- **Pro:** 64 oranlı ML, CSV ile500 kayda kadar analiz, indirilebilir sonuçlar, beş yöntemin önceden tamamlanmış test tablosu, karar ağacı yolu,64 oran sözlüğü, marka/prompt/kaynak ve notebook dosyaları.
- **İçerik stüdyosu:** Gerçek üç görsel,18sn MP4, Türkçe MP3, blog, üç sosyal metin,7günlük takvim ve PDF/Excel. Sayfadan ayrılınca medya duraklar.
- **Dört proje:** Her çalışmanın açıklaması, kullanım alanı, raporu; Pro modda Colab ve notebook indirme bağlantısı.
- **Analiz geçmişi:** Kaydı yeniden aç, gerekirse oranları değiştirip tekrar hesapla. Son200analiz saklanır. Pro modda tüm geçmişi indir. Şirket silinse de geçmiş analiz, tarihli bağımsız kayıt olarak kalır.

## Yerel paket
DealLens_Birlesik_Basit_Pro.zip dosyasını tamamen çıkar. **DealLens-Baslat.bat** dosyasına çift tıkla. Python kurulu olmalı; bu bilgisayarda mevcut. Python model kütüphaneleri veya Node kurmak gerekmez. Sabit adres http://127.0.0.1:5276/ tarayıcıda açılır. Küçük sunucu penceresi kapanınca yerel uygulama durur; kayıtlar kalır. Yerel ZIP tüm uygulama, medya ve rapor dosyalarını taşır. Kod kaynağı kaynak/ altında bulunur.

Canlı site ve yerel uygulama farklı adreslerdir; tarayıcıdaki kayıtları ayrı tutulur. Aynı adresi kullan. Başka cihazla otomatik senkronizasyon yok. Şirketler alanından JSON yedeği; Pro analiz alanından geçmiş/tek analiz/toplu CSV sonucu indirilebilir. Geçmişi yeniden içe aktarma bu sürümde yok.

## Modeller nasıl çalışır?
Python projesindeki beş oranlı Decision Tree ve ML projesindeki seçilmiş64 oranlı CatBoost, mevcut eğitilmiş parametrelerden sayısal JSON'a aktarılmıştır. Tarayıcı medyan/eksik göstergesi, float32 karşılaştırmaları, ağaç dalları ve sigmoid hesaplamasını uygular. Girdi kullanıcı cihazında işlenir; Python/ML model sunucusu, kişisel veri gönderimi veya canlı piyasa bağlantısı yok.

İki model toplam11.820 kaynak satırı tahmininde orijinal Python ile eşleşti: tüm etiketler aynı, en büyük skor farkı1,45e-15'ten küçük. Ayrıntı hub-evidence/model-parity.json. Test fikstürü orijinal modellerden üretilmiştir; tarayıcı uygulamasının kendi çıktısından üretilmez.

CSV: UTF-8, virgül/noktalı virgül/tab ayırıcı; Attr1–Attr64 başlıklarının tamamı gerekli. Boş hücreler medyanla tamamlanır; tümü boş kayıt, metin/NaN/sonsuz, eksik başlık, tekrarlanan sütun veya hatalı satır reddedilir. 2MB/500kayıt üst sınırı açık hata verir; sessizce kayıt atlanmaz. Örnek CSV6negatif/6pozitif tarihsel kayıttır. Ekranda ilk50toplu sonuç, indirmede tamamı bulunur.

Model skoru kalibre edilmiş iflas yüzdesi değildir. Tarihsel Polonya verisi güncel Türkiye şirketlerine doğrudan genellenemez. Test verisi önceki eğitim çalışmalarında incelenmiştir; yeni dış test iddiası yok. Model kıyas tablosu geçmiş deneydir; her yeni girdi için beş model çalıştığı iddia edilmez. Finansal sonuçlar yatırım veya satın alma önerisi değildir.

## Geliştirme ve kontrol
Node24 ve sabit package-lock.json. `npm ci`, `npm test`, `npm run build`, `npm run dev`. npm test: şirket verisi, giriş ve depolama, CSV/dışa aktarma ve orijinal model eşliği kontrolleri. src/Components,src/Pages,src/Interfaces ayrımı korunur. Önceki şirketler localStorage anahtarı korunmuştur.

Model yeniden aktarımı scripts/export-hub-models.py ile, içerik kopyaları scripts/prepare-hub-assets.py ile mevcut ortak workspace'teki asıl Python/ML/Content Flow projelerinden üretilir. Bağımsız ZIP/Git klonunda uygulama ve test fikstürü hazırdır; asıl projeler olmadan yeniden export gerekmez.

docs/ GitHub Pages yayınıdır. Öğrenci raporlarının ilk teslim kopyaları korunur; birleşik ekrandaki marka stratejisi model entegrasyonuna göre güncellenmiştir. Eski DELIVERY-2026-10-10.md ilk Proje3'ün tarihli kontrolüdür; güncel kayıt HUB-DELIVERY-2026-10-10.md. Resmî form gönderilmedi.
