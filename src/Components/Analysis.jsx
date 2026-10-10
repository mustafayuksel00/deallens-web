import React,{useEffect,useState} from 'react';
import {ArrowUpRight,Check,Download,FlaskConical,RotateCcw,Save,Upload} from 'lucide-react';
import models from '../data/models.json';import study from '../data/study.json';import example from '../data/example.json';
import {SIMPLE_FIELDS,infer,numberValue,batchFromCSV,csvResult,readHistory,saveHistory} from '../Interfaces/inference.js';
import {load} from '../Interfaces/company.js';
const asset=p=>`${import.meta.env.BASE_URL}${p}`;
const decimal=n=>Number(n).toLocaleString('tr-TR',{maximumFractionDigits:4});
export function download(name,text,type='application/json'){
 const url=URL.createObjectURL(new Blob([text],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);
}
export default function Analysis({pro,target,requestedVariant,onSaved,onPro}){
 const [variant,setVariant]=useState('simple');const advanced=pro&&variant==='advanced';const model=advanced?models.advanced:models.simple;
 const [simple,setSimple]=useState(Array(5).fill(''));const [full,setFull]=useState(Array(64).fill(''));
 const [errors,setErrors]=useState({});const [result,setResult]=useState(null);const [resultKind,setResultKind]=useState('');const [message,setMessage]=useState('');const [simpleSource,setSimpleSource]=useState('manual');const [fullSource,setFullSource]=useState('manual');
 const source=advanced?fullSource:simpleSource;const setSource=advanced?setFullSource:setSimpleSource;
 const [company,setCompany]=useState('');const [companyName,setCompanyName]=useState('');const [balanced,setBalanced]=useState(false);const [batch,setBatch]=useState([]);const [busy,setBusy]=useState(false);const [fileName,setFileName]=useState('');
 const [initialHistory]=useState(()=>readHistory(localStorage));const [history,setHistory]=useState(initialHistory.items);
 const companies=load(localStorage).records;
 useEffect(()=>{if(target){setCompany(target.id);setCompanyName(target.name);setMessage('Şirket seçildi. Analiz için finansal oranlarını gir.');}},[target]);
 useEffect(()=>{if(requestedVariant){setVariant(requestedVariant.value);setResult(null);setBatch([]);setErrors({});setMessage('');}},[requestedVariant]);
 const fields=advanced?study.dictionary:SIMPLE_FIELDS;const values=advanced?full:simple;
 const threshold=advanced&&balanced?model.recallThreshold:model.threshold;
 const updateThreshold=value=>{setBalanced(value);setBatch([]);if(advanced)setResult(null);};
 const resetResult=()=>{setResult(null);setBatch([]);setErrors({});setMessage('');};
 const changeVariant=value=>{setVariant(value);resetResult();};
 const change=(i,value)=>{const next=[...values];next[i]=value;(advanced?setFull:setSimple)(next);setSource('manual');resetResult();};
 const fillExample=()=>{
  if(advanced)setFull(example.values.map(n=>n===null?'':String(n).replace('.',',')));
  else setSimple(SIMPLE_FIELDS.map(f=>f.example));
  resetResult();setSource('example');setMessage(advanced?`Tarihsel test örneği #${example.record_id} dolduruldu. Seçili şirketin gerçek verisi değildir.`:'Kurgusal beş oranlı örnek dolduruldu. Seçili şirketin gerçek verisi değildir.');
 };
 const run=e=>{
  e.preventDefault();setMessage('');setResult(null);const next={};
  values.forEach((v,i)=>{try{numberValue(v,{allowMissing:advanced});}catch(error){next[i]=error.message;}});
  setErrors(next);if(Object.keys(next).length){setMessage('İşaretli alanları düzelt; henüz tahmin yapılmadı.');return;}
  try{const r=infer(model,values,{allowMissing:advanced,threshold});setResult(r);setResultKind(advanced?'advanced':'simple');}
  catch(error){setMessage(error.message);}
 };
 const persist=()=>{
  const chosen=companies.find(c=>c.id===company);const name=chosen?.name||companyName.trim();
  if(!name){setMessage('Kaydetmek için bir şirket seç veya analiz adı yaz.');return;}
  if(name.length>80){setMessage('Analiz adı en fazla 80 karakter olabilir.');return;}
  const entry={id:crypto.randomUUID(),companyId:chosen?.id??null,companyName:name,date:new Date().toISOString(),source,result};
  const next=[entry,...history].slice(0,200);const error=saveHistory(localStorage,next);
  if(error){setMessage(error);return;}setHistory(next);setMessage('Analiz bu tarayıcıya kaydedildi.');onSaved?.();
 };
 const reopen=item=>{
  const isAdvanced=item.result.kind==='catboost';if(isAdvanced&&!pro)onPro?.();setVariant(isAdvanced?'advanced':'simple');
  (isAdvanced?setFull:setSimple)(item.result.values.map(v=>v===null?'':String(v).replace('.',',')));
  (isAdvanced?setFullSource:setSimpleSource)(item.source||'manual');
  setBalanced(isAdvanced&&item.result.threshold===models.advanced.recallThreshold);
  const exists=companies.some(c=>c.id===item.companyId);setCompany(exists?item.companyId:'');setCompanyName(item.companyName);
  setResult(item.result);setResultKind(isAdvanced?'advanced':'simple');setErrors({});setMessage('Kaydedilen analiz açıldı. Değerleri değiştirebilir veya tekrar hesaplayabilirsin.');
  window.scrollTo({top:0,behavior:'smooth'});
 };
 const upload=async e=>{
  const file=e.target.files?.[0];e.target.value='';if(!file)return;
  setBatch([]);setMessage('');setFileName('');if(file.size>2*1024*1024){setMessage('Dosya en fazla 2 MB olabilir.');return;}
  setBusy(true);
  try{const text=await file.text();const rows=batchFromCSV(text,models.advanced,balanced?models.advanced.recallThreshold:models.advanced.threshold);setBatch(rows);setFileName(file.name);setMessage(`${rows.length} kaydın tamamı analiz edildi.`);}
  catch(error){setMessage(error.message);}finally{setBusy(false);}
 };
 const showResult=result&&resultKind===(advanced?'advanced':'simple');
 return <>
 <div className="page-title"><div><p className="eyebrow">01 / PYTHON + 02 / MAKİNE ÖĞRENMESİ</p><h1>Oranları gir.<br/><span>İncelemeye bir adım ekle.</span></h1><p>Analiz bu ekranda çalışır. Colab açman veya dosya yüklemen gerekmez.</p></div><div className="label-pill"><FlaskConical size={16}/>Eğitim modeli</div></div>
 {pro&&<div className="tab-buttons" aria-label="Analiz türü"><button className={!advanced?'selected':''} aria-pressed={!advanced} onClick={()=>changeVariant('simple')}>5 oran · Python</button><button className={advanced?'selected':''} aria-pressed={advanced} onClick={()=>changeVariant('advanced')}>64 oran · ML</button></div>}
 <div className="analysis-layout"><form className="panel analysis-form" onSubmit={run} noValidate>
 <div className="panel-head"><div><h2>{advanced?'64 oranlı gelişmiş analiz':'Beş oranla başla'}</h2><p>{advanced?'Kaynak CSV ölçeğini kullan. Boş alanlar eğitim medyanıyla tamamlanır.':'Sayıları virgülle veya noktayla yazabilirsin.'}</p></div><button type="button" className="text-button" onClick={fillExample}><FlaskConical size={15}/>Örneği doldur</button></div>
 <div className="context-fields"><label className="field">Şirkete bağla (isteğe bağlı)<select aria-label="Analiz şirketi" value={company} onChange={e=>{setCompany(e.target.value);setCompanyName(companies.find(c=>c.id===e.target.value)?.name||'');}}><option value="">Şirket seçmeden analiz et</option>{companies.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>{!company&&<label className="field">Analiz adı (kaydetmek için)<input aria-label="Analiz adı" value={companyName} maxLength={80} onChange={e=>setCompanyName(e.target.value)} placeholder="Örn. İlk denemem"/></label>}</div>
 {advanced&&<label className="check-line"><input type="checkbox" checked={balanced} onChange={e=>updateThreshold(e.target.checked)}/>Daha fazla pozitif yakalama hedefli doğrulama eşiği <span>(%80 hedef; testte garanti değil)</span></label>}
 <div className={advanced?'ratio-fields full-ratios':'ratio-fields'}>{fields.map((f,i)=><label key={f.key} className="field"><span>{advanced&&<b className="attr-key">{f.key}</b>}{f.label}</span><input aria-label={advanced?`${f.key} ${f.label}`:f.label} inputMode="decimal" value={values[i]} onChange={e=>change(i,e.target.value)} aria-invalid={!!errors[i]} aria-describedby={`ratio-hint-${i}`} placeholder={advanced?'Boş bırakılabilir':f.example}/><small className={errors[i]?'input-error':'field-hint'} id={`ratio-hint-${i}`}>{errors[i]||(advanced?f.formula:f.hint)}</small></label>)}</div>
 {advanced&&<p className="help-note">En az bir oran gerekli. Attr29 log tabanı, Attr55 para birimi/ölçeği ve Attr48–49 tanımı kaynakta belirsizdir. Gerçek muhasebe kalemlerini otomatik dönüştürmez.</p>}
 <div className="form-actions"><button type="submit" className="primary">Analiz et<ArrowUpRight size={17}/></button><button type="button" className="secondary" onClick={()=>{(advanced?setFull:setSimple)(Array(advanced?64:5).fill(''));resetResult();setSource('manual');}}><RotateCcw size={15}/>Alanları temizle</button></div>
 </form>
 <aside className="analysis-aside"><div className={`panel result-panel ${showResult&&result.label===1?'attention':''}`} aria-live="polite">
 <p className="eyebrow">ANALİZ SONUCU</p>{showResult?<><span className="result-marker"><Check size={21}/></span><h2>{result.label===1?'Model iflas etiketini tahmin etti.':'Model iflas yok etiketini tahmin etti.'}</h2><p>Girdiğin oranlar, tarihsel eğitim modelinde bu sınıfa düştü. Sonuç bir güvence veya satın alma önerisi değildir.</p><div className="score-line"><span>Model skoru <small>0–1</small></span><strong>{decimal(result.score)}</strong></div>{result.missing>0&&<p className="help-note">{result.missing} boş alan eğitim medyanıyla tamamlandı.</p>}{source==='example'&&<p className="example-note">Örnek verilerle çalıştırıldı.</p>}<button className="primary" onClick={persist} disabled={!!initialHistory.error}><Save size={16}/>Analizi kaydet</button>{pro&&<button className="secondary" onClick={()=>download('deallens-analiz.json',JSON.stringify({companyName,source,date:new Date().toISOString(),...result},null,2))}><Download size={16}/>Sonucu indir</button>}</>:<><div className="result-placeholder"><FlaskConical size={34}/></div><h2>İlk sonucun burada.</h2><p>Oranlarını gir veya örneği doldur. Ardından “Analiz et” düğmesine bas.</p><ol><li>Finansal oranları hazırla.</li><li>Alanları doldur.</li><li>Sonucu inceleyip kaydet.</li></ol></>}
 </div><div className="model-note"><strong>Skor, gerçek iflas yüzdesi değildir.</strong><p>Model tarihsel Polonya verisiyle eğitildi. Güncel Türkiye şirketlerinde doğrulanmış bir sonuç olarak kullanılamaz.</p></div>
 {pro&&showResult&&<details className="panel technical" open><summary>Model ayrıntıları</summary><dl><dt>Çalışan model</dt><dd>{result.kind==='tree'?'Karar ağacı · 5 oran':'CatBoost · 64 oran'}</dd><dt>Sınıf eşiği</dt><dd>{decimal(result.threshold)}</dd><dt>Eksik oran</dt><dd>{result.missing}</dd><dt>Sürüm</dt><dd>{result.version}</dd></dl>{result.path.length>0&&<div><h3>Ağacın izlediği yol</h3>{result.path.map((step,i)=><p key={i}>{SIMPLE_FIELDS.find(f=>f.key===step.feature)?.label}: {decimal(step.value??model.medians[model.features.indexOf(step.feature)])} {step.left?'≤':'>'} {decimal(step.border)}</p>)}</div>}</details>}
 </aside></div>
 <p className="action-status" role="status">{message}</p>{initialHistory.error&&<p className="error-banner" role="alert">{initialHistory.error}</p>}
 {pro&&<section className="panel batch-panel"><div className="panel-head"><div><p className="eyebrow">PRO / TOPLU ML ANALİZİ</p><h2>CSV ile birden fazla kaydı incele.</h2><p>Attr1–Attr64 başlıkları; en fazla 500 kayıt ve 2 MB. Dosya bu cihazda işlenir.</p></div><a className="secondary" href={asset('files/Ornek_64_Oran.csv')} download><Download size={16}/>Örnek CSV</a></div><label className="check-line batch-threshold"><input type="checkbox" checked={balanced} onChange={e=>updateThreshold(e.target.checked)}/>Toplu analizde daha fazla pozitif yakalama hedefli eşik kullan</label><div className="batch-actions"><label className="upload-button"><Upload size={17}/>{busy?'İşleniyor…':'CSV seç ve analiz et'}<input aria-label="64 oranlı CSV yükle" type="file" accept=".csv,text/csv" onChange={upload} disabled={busy}/></label><a className="text-link" href={asset('files/Oran_Sozlugu.csv')} download>64 oran sözlüğünü indir</a><p>Model: CatBoost. Eşik: {decimal(balanced?models.advanced.recallThreshold:models.advanced.threshold)}</p></div>{batch.length>0&&<><div className="batch-summary"><strong>{batch.length} kayıt tamamlandı</strong><span>{batch.filter(r=>r.label===1).length} iflas etiketi tahmini · {fileName}</span><button className="secondary" onClick={()=>download('deallens-toplu-sonuclar.csv',csvResult(batch),'text/csv;charset=utf-8')}><Download size={16}/>Tüm sonuçları indir</button></div><div className="table-scroll"><table><thead><tr><th>KAYIT</th><th>SKOR</th><th>TAHMİN EDİLEN ETİKET</th><th>EKSİK ORAN</th></tr></thead><tbody>{batch.slice(0,50).map((r,i)=><tr key={i}><td>{r.id}</td><td>{decimal(r.score)}</td><td>{r.label===1?'İflas':'İflas yok'}</td><td>{r.missing}</td></tr>)}</tbody></table></div>{batch.length>50&&<p className="help-note">Ekranda ilk 50 sonuç gösteriliyor. İndirilen dosya {batch.length} sonucun tamamını içerir.</p>}</>}</section>}
 {pro&&<section className="panel comparison"><div className="panel-head"><div><p className="eyebrow">PRO / PROJE 2 DENEYİ</p><h2>Modeller nasıl karşılaştırıldı?</h2><p>Önceden tamamlanan testin sonuçları. Bu tablo, yeni girdin için beş ayrı canlı tahmin değildir.</p></div><a className="secondary" href={asset('files/ML_Rapor.pdf')} target="_blank" rel="noreferrer">Raporu aç<ArrowUpRight size={16}/></a></div><div className="table-scroll"><table><thead><tr><th>MODEL</th><th>F1</th><th>POZİTİFLERİ YAKALAMA</th><th>PRECISION</th><th>AP</th></tr></thead><tbody>{study.models.map(m=><tr key={m.name} className={m.name===study.selected?'chosen-model':''}><td>{m.name}{m.name===study.selected&&<span className="chosen">Seçilmiş model</span>}</td><td>{decimal(m.f1)}</td><td>{decimal(m.recall)}</td><td>{decimal(m.precision)}</td><td>{decimal(m.average_precision)}</td></tr>)}</tbody></table></div><p className="help-note">F1: yakalama ve doğru alarm dengesi. AP: farklı eşiklerde sıralama başarısı. Seçim eğitim çapraz doğrulamasıyla yapıldı; test tablosundaki en yüksek değere göre yeniden seçilmedi.</p></section>}
 <section className="panel history-panel"><div className="panel-head"><div><h2>Kaydettiğin analizler</h2><p>Son 200 analiz bu tarayıcıda saklanır. Şirket kaydıyla ilişkilendirdiğinde adı burada görünür.</p></div>{pro&&history.length>0&&<button className="secondary" onClick={()=>download('deallens-analiz-gecmisi.json',JSON.stringify(history,null,2))}><Download size={16}/>Geçmişi indir</button>}</div>{history.length?<div className="history-list">{history.slice(0,10).map(item=><article key={item.id}><div><strong>{item.companyName}</strong><span>{new Date(item.date).toLocaleString('tr-TR')} · {item.result.kind==='tree'?'5 oran':'64 oran'}{item.source==='example'?' · Örnek veri':''}</span></div><div><b>{decimal(item.result.score)}</b><small>{item.result.label===1?'İflas etiketi':'İflas yok etiketi'}</small></div><button className="secondary history-open" onClick={()=>reopen(item)} aria-label={`${item.companyName} analizini aç`}>Analizi aç</button></article>)}{history.length>10&&<p className="help-note">Son 10 analiz gösteriliyor. Pro modda tüm geçmişi indirebilirsin.</p>}</div>:<p className="empty-copy">Henüz kayıt yok. İlk sonucunu “Analizi kaydet” ile saklayabilirsin.</p>}</section>
 </>;
}
