# Eğitim verisi ve model kaynağı
Python ve ML modelleri mevcut iki DealLens eğitim projesinden aktarılmıştır; yeniden eğitilmedi. Kaynak veri: Tomczak S. (2016), UCI Polish Companies Bankruptcy, CC BY 4.0. Kaynak: https://archive.ics.uci.edu/dataset/365/polish+companies+bankruptcy+data . Lisans: https://creativecommons.org/licenses/by/4.0/ . Kaynak tanımları ilk projede 8 Ekim 2026'da kontrol edilmiştir.

Örnek CSV tarihsel test bölümünden altı negatif/altı pozitif kaydı içerir; toplumdaki sınıf oranını temsil etmez. record_id kaynak satırıdır, şirket kimliği değildir. Tarayıcı test fikstürü her model için 5.910 kaynak satırını ve orijinal Python tahminini taşır. src/data/models.json yalnız sayısal model parametreleridir; executable pickle/joblib yüklemesi yapılmaz. Kaynak model SHA256 ve sürümü JSON içinde bulunur.

Content Flow görselleri özgün AI üretimi, ses stok TTS, video bu görsellerden oluşturulmuş montajdır. Telif/süreç kaydı Pro içerik alanındaki prompt ve kaynaklarda görünür. Ayrı eğitim raporları ilk teslimin tarihli kopyalarıdır. Birleşik ürünün güncel işlevleri README ve HUB-DELIVERY-2026-10-10.md içinde açıklanır.
