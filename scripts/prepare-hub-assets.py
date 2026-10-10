from pathlib import Path
import shutil,json,pandas as pd
r=Path(__file__).resolve().parents[1];p=r.parent
public=r/'public';public.mkdir(exist_ok=True)
files={
 'files/Python_Rapor.pdf':p/'deallens-python-risk/TESLIME-HAZIR/03_YEDEK_VE_EKLER/Basitlestirilmis_Python_DealLens_Rapor.pdf',
 'files/Python_Sunum.pptx':p/'deallens-python-risk/TESLIME-HAZIR/01_ZORUNLU_TESLIMLER/Basitlestirilmis_Python_DealLens_Sunum.pptx',
 'files/Python_Notebook.ipynb':p/'deallens-python-risk/notebooks/DealLens_Finansal_Risk_Siniflandirmasi.ipynb',
 'files/ML_Rapor.pdf':p/'deallens-ml-risk/deliverables/DealLens_ML_Rapor.pdf',
 'files/ML_Notebook.ipynb':p/'deallens-ml-risk/deliverables/DealLens_ML_Finansal_Risk.ipynb',
 'files/Oran_Sozlugu.csv':p/'deallens-ml-risk/data/data_dictionary_64.csv',
}
for directory in ['documents','media']:
 for source in (p/'deallens-contentflow'/directory).iterdir():
  if source.is_file() and not source.name.endswith('.ndjson'):files[f'content/{directory}/{source.name}']=source
for target,source in files.items():
 dest=public/target;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(source,dest)
df=pd.read_csv(p/'deallens-ml-risk/data/deallens_financial_risk_64.csv')
features=[f'Attr{i}' for i in range(1,65)]
test=df[df['partition']=='test']
sample=pd.concat([test[test.bankruptcy_label==0].head(6),test[test.bankruptcy_label==1].head(6)])
sample[['record_id',*features]].to_csv(public/'files/Ornek_64_Oran.csv',index=False,encoding='utf-8-sig')
content=p/'deallens-contentflow/content'
data={key:(content/file).read_text(encoding='utf-8') for key,file in {'blog':'blog.md','social':'sosyal-medya.md','strategy':'marka-stratejisi.md','voice':'marka-sesi.md','prompts':'prompt-kutuphanesi.md','sources':'kaynaklar.md'}.items()}
data['strategy']=data['strategy'].replace('Web ekranına model entegrasyonu henüz yapılmadı.','Birleşik çalışma alanı beş oranlı Python karar ağacını ve 64 oranlı seçilmiş ML modelini artık tarayıcıda çalıştırır. Şirket durumları ve öncelikleri yine elle belirlenir; canlı şirket verisi alınmaz.')
data['calendar']=json.loads((content/'takvim.json').read_text(encoding='utf-8'))
(r/'src/data/content.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
one=sample.iloc[0]
example={'record_id':int(one.record_id),'partition':'test','values':[None if pd.isna(one[f]) else float(one[f]) for f in features]}
(r/'src/data/example.json').write_text(json.dumps(example,allow_nan=False),encoding='utf-8')
print(f'Copied {len(files)} real deliverables; 12-row source example CSV and inline content ready.')
