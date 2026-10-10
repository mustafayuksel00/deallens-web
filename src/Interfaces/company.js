export const KEY='deallens-companies-v1';
export const SECTORS=['Teknoloji','Üretim','Perakende','Enerji','Hizmet'];
export const STAGES=['Yeni','İnceleniyor','Tamamlandı'];
export const EMPTY={name:'',sector:'Teknoloji',stage:'Yeni',priority:'Normal',revenue:'',note:''};
export const DEMO=[
 {id:'demo-1',name:'Atlas Yazılım',sector:'Teknoloji',stage:'İnceleniyor',priority:'Yüksek',revenue:48,note:'Ürün ve müşteri dağılımını incele.',updatedAt:'2026-10-10T09:00:00.000Z'},
 {id:'demo-2',name:'Mavi Enerji',sector:'Enerji',stage:'Yeni',priority:'Normal',revenue:125,note:'Finansal tabloları bekleniyor.',updatedAt:'2026-10-10T09:00:00.000Z'},
 {id:'demo-3',name:'Pera Üretim',sector:'Üretim',stage:'Tamamlandı',priority:'Normal',revenue:82,note:'İlk inceleme notları tamamlandı.',updatedAt:'2026-10-10T09:00:00.000Z'},
 {id:'demo-4',name:'Nova Hizmet',sector:'Hizmet',stage:'Yeni',priority:'Yüksek',revenue:null,note:'Gelir bilgisi henüz girilmedi.',updatedAt:'2026-10-10T09:00:00.000Z'}
];
/** Educational tracking record; revenue is entered manually in million TRY. */
export function validate(form,records=[],id=null){
 const errors={}; const name=String(form.name??'').trim();
 if(name.length<2||name.length>80)errors.name='Şirket adı 2–80 karakter olmalı.';
 if(records.some(r=>r.id!==id&&r.name.toLocaleLowerCase('tr-TR')===name.toLocaleLowerCase('tr-TR')))errors.name='Bu şirket zaten listede var.';
 if(!SECTORS.includes(form.sector))errors.sector='Bir sektör seç.';
 if(!STAGES.includes(form.stage))errors.stage='Bir durum seç.';
 if(!['Normal','Yüksek'].includes(form.priority))errors.priority='Bir öncelik seç.';
 const raw=String(form.revenue??'').trim().replace(',','.');
 const revenue=raw===''?null:Number(raw);
 if(raw!==''&&(!/^\d+(\.\d+)?$/.test(raw)||!Number.isFinite(revenue)||revenue<0||revenue>1e9))errors.revenue='0 ile 1 milyar arasında bir tutar gir (milyon TL).';
 const note=String(form.note??'').trim(); if(note.length>1000)errors.note='Not en fazla 1.000 karakter olabilir.';
 return {errors,value:{name,sector:form.sector,stage:form.stage,priority:form.priority,revenue,note}};
}
export function decode(raw){
 const data=JSON.parse(raw); if(!Array.isArray(data)||data.length>10000)throw new Error('Kayıt biçimi geçersiz.');
 const records=[]; const ids=new Set();
 for(const r of data){
  if(typeof r.id!=='string'||!r.id||ids.has(r.id)||Number.isNaN(Date.parse(r.updatedAt)))throw new Error('Kayıt kimliği/tarihi geçersiz.');
  const checked=validate(r,records,r.id); if(Object.keys(checked.errors).length)throw new Error('Kayıt bilgileri geçersiz.');
  records.push({...checked.value,id:r.id,updatedAt:r.updatedAt});ids.add(r.id);
 } return records;
}
export function load(storage){try{const raw=storage.getItem(KEY);return {records:raw===null?DEMO.map(r=>({...r})):decode(raw),error:''};}catch{return {records:[],error:'Kayıtlar okunamadı. Mevcut verinin üzerine yazılmadı; tarayıcı depolamasını kontrol et.'};}}
export function save(storage,records){try{storage.setItem(KEY,JSON.stringify(records));return '';}catch{return 'Kaydedilemedi. Tarayıcı depolaması dolu veya kapalı olabilir. Değişiklik uygulanmadı.';}}
