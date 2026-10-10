# DealLens — Şirket Takibi

Mustafa Yüksel · Software Persona · Web Geliştirme / Proje 3

React ile şirket inceleme kayıtlarını ekleme, listeleme, düzenleme ve silme uygulaması. Kayıtlar localStorage ile bu tarayıcıda saklanır. Arama, sektör/durum filtresi, özet kartları, silmeden vazgeçme ve JSON yedek indirme bulunur.

## Kullanım
Şirket ekle → şirket adı, sektör, durum, isteğe bağlı gelir ve not → Şirketi kaydet. Satırdaki kalemle düzenle, çöp kutusuyla sil. Sayfa yenilendiğinde kayıtlar korunur. Gelir milyon TL cinsindendir; virgüllü ondalık kabul edilir. Yedek indir düğmesi kayıtların JSON kopyasını verir; içe aktarma bu sürümde yoktur.

Örnek şirketler kurgusaldır. İnceleme durumu ve öncelik kullanıcı tarafından belirlenir. Bu web projesi ML tahmini yapmaz. Python/ML projeleri ayrı teslimdir; ortak arayüze entegrasyon ileride yapılabilir.

## Kurulum
Node.js 20.19+ veya 22.12+ gerekir (kontrol edilen ortam24.19.0).

```sh
npm ci
npm run dev
```

```sh
npm test
npm run build
npm run preview
```

## Yapı
- `src/Components`: şirket formu ve erişilebilir diyalog.
- `src/Pages`: takip ekranı ve CRUD işlemleri.
- `src/Interfaces`: kayıt yapısı, veri doğrulama ve depolama.
- `tests`: gerçek veri sınırları ve kalıcılık testleri.
- `docs`: GitHub Pages için üretilmiş statik sürüm.
- `screenshots`: masaüstü ve mobil ekran görüntüleri.

React19, Vite7, Pure CSS ve Lucide simgeleri. Kesin bağımlılıklar package-lock.json içinde. Fontlar Google Fonts üzerinden gelir; ağ yoksa sistem fontu kullanılır. Veriler sunucuya gönderilmez; başka cihazla otomatik senkronize olmaz. Tarayıcı verilerini silmek kayıtları kaldırır; düzenli yedek alın. Bozuk depolama sessizce sıfırlanmaz, kaydetme hatası görünür.

## Yönerge eşleştirmesi
Modern JS kütüphanesi: React. Stil: Pure CSS. Components/Pages/Interfaces klasörleri mevcut. Ekle/listele/güncelle/sil mevcut. Ekran görüntüleri kaynak deposuna eklenir. Public GitHub ve canlı yayın bağlantıları TESLIM-KONTROL.md içinde.

[Resmî yönerge](https://docs.google.com/document/d/13cxFoWiMSyQlOa2jBhCwlFdMiHUL1ph6qJYMRhZKbtU/edit),10 Ekim2026 kontrolü. Netlify veya muadili yayın kabul edilir; public teslim için GitHub Pages kullanılır.

AI destekli geliştirme kullanıldı. Kullanıcının projeyi kendi cümleleriyle açıklaması ve resmî form teslimi ayrı adımlardır.
