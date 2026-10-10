// Exact inference from the existing fitted models; no training or remote API.
export const SIMPLE_FIELDS=[
 {key:'liabilities_to_assets',label:'Yükümlülük / varlık',hint:'Toplam yükümlülük ÷ toplam varlık. %35 için 0,35.',example:'0,35'},
 {key:'current_ratio',label:'Cari oran',hint:'Dönen varlık ÷ kısa vadeli yükümlülük.',example:'2'},
 {key:'sales_to_assets',label:'Satış / varlık',hint:'Satış ÷ toplam varlık.',example:'1,5'},
 {key:'sales_growth_ratio',label:'Satış değişimi',hint:'Bu dönem satış ÷ önceki dönem satış. 1,10 yaklaşık %10 artış.',example:'1,10'},
 {key:'operating_profit_to_sales',label:'Faaliyet kârı / satış',hint:'Faaliyet kârı ÷ satış. %10 için 0,10.',example:'0,10'}
];
export function numberValue(raw,{allowMissing=false}={}){
 if(raw===null||raw===undefined||String(raw).trim()===''){
  if(allowMissing)return null;
  throw new Error('Bu alanı doldur.');
 }
 if(typeof raw==='boolean')throw new Error('Geçerli bir sayı yaz.');
 const s=String(raw).trim();
 if(!/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(s))throw new Error('Sadece sayı yaz; %35 için 0,35 kullan.');
 const n=Number(s.replace(',','.'));
 if(!Number.isFinite(n)||!Number.isFinite(Math.fround(n)))throw new Error('Sayı modelin desteklediği aralıkta olmalı.');
 return n;
}
export function infer(model,values,{allowMissing=false,threshold=model.threshold}={}){
 if(values.length!==model.features.length)throw new Error('Oran sayısı modelle eşleşmiyor.');
 const parsed=values.map(v=>numberValue(v,{allowMissing}));
 if(parsed.every(v=>v===null))throw new Error('En az bir gerçek oran gir; tüm alanlar boş olamaz.');
 const x=parsed.map((v,i)=>Math.fround(v===null?model.medians[i]:v));
 let score,path=[];
 if(model.kind==='tree'){
  let index=0;
  while(model.nodes[index].left!==-1){
   const node=model.nodes[index],left=x[node.feature]<=node.border;
   path.push({feature:model.features[node.feature],value:parsed[node.feature],border:node.border,left});
   index=left?node.left:node.right;
  }
  score=model.nodes[index].score;
 }else if(model.kind==='catboost'){
  x.push(...model.indicators.map(i=>parsed[i]===null?1:0));
  let sum=0;
  for(const tree of model.trees){let leaf=0;for(let i=0;i<tree.splits.length;i++){const [feature,border]=tree.splits[i];if(x[feature]>border)leaf|=1<<i;}sum+=tree.leaves[leaf];}
  const raw=model.scale*sum+model.bias;
  score=raw>=0?1/(1+Math.exp(-raw)):Math.exp(raw)/(1+Math.exp(raw));
 }else throw new Error('Model desteklenmiyor.');
 return {score,label:score>=threshold?1:0,threshold,missing:parsed.filter(v=>v===null).length,values:parsed,path,version:model.version,kind:model.kind};
}
export function csvRows(text){
 const raw=text.replace(/^\uFEFF/,'');
 const firstLine=raw.split(/\r?\n/,1)[0];
 const separator=firstLine.includes(';')?';':firstLine.includes('\t')?'\t':',';
 const rows=[];let row=[],field='',quoted=false;
 for(let i=0;i<raw.length;i++){
  const c=raw[i];
  if(c==='"'){
   if(quoted&&raw[i+1]==='"'){field+='"';i++;}
   else if(quoted)quoted=false;
   else if(field==='')quoted=true;
   else throw new Error('CSV tırnak yapısı geçersiz.');
  }else if(!quoted&&c===separator){row.push(field);field='';}
  else if(!quoted&&(c==='\n'||c==='\r')){
   if(c==='\r'&&raw[i+1]==='\n')i++;
   row.push(field);if(row.some(s=>s.trim()!==''))rows.push(row);row=[];field='';
  }else field+=c;
 }
 if(quoted)throw new Error('CSV içinde kapanmamış tırnak var.');
 row.push(field);if(row.some(s=>s.trim()!==''))rows.push(row);
 return rows;
}
export function batchFromCSV(text,model,threshold=model.threshold){
 const rows=csvRows(text);if(rows.length<2)throw new Error('CSV başlık ve en az bir veri satırı içermeli.');
 if(rows.length>501)throw new Error('Tek seferde en fazla 500 kayıt yükleyebilirsin.');
 const headers=rows[0].map(v=>v.trim());
 if(new Set(headers).size!==headers.length)throw new Error('CSV sütun adları tekrarlanamaz.');
 const indices=model.features.map(f=>headers.indexOf(f));
 if(indices.includes(-1))throw new Error('CSV, Attr1–Attr64 sütunlarının tamamını içermeli. Örnek dosyayı indir.');
 const idIndex=headers.indexOf('record_id');
 return rows.slice(1).map((row,i)=>{
  if(row.length!==headers.length)throw new Error(`${i+2}. satırdaki sütun sayısı geçersiz.`);
  try{return {id:idIndex===-1?String(i+1):row[idIndex],...infer(model,indices.map(j=>row[j]),{allowMissing:true,threshold})};}
  catch(error){throw new Error(`${i+2}. satır: ${error.message}`);}
 });
}
export function csvResult(rows){
 const safe=v=>{let s=String(v);if(/^[=+\-@\t\r]/.test(s))s="'"+s;return '"'+s.replaceAll('"','""')+'"';};
 return '\uFEFFrecord_id,model_score,predicted_label,threshold,missing_features\r\n'+rows.map(r=>[r.id,r.score,r.label,r.threshold,r.missing].map(safe).join(',')).join('\r\n');
}
export const HISTORY_KEY='deallens-analysis-v1';
export function readHistory(storage){
 try{const raw=storage.getItem(HISTORY_KEY);const data=raw===null?[]:JSON.parse(raw);if(!Array.isArray(data)||data.length>200||new Set(data.map(r=>r?.id)).size!==data.length||data.some(r=>{
  const v=r?.result;
  return typeof r?.id!=='string'||!r.id||typeof r.companyName!=='string'||!r.companyName.trim()||r.companyName.length>80||Number.isNaN(Date.parse(r.date))||!v||!['tree','catboost'].includes(v.kind)||!Number.isFinite(v.score)||v.score<0||v.score>1||!Number.isFinite(v.threshold)||v.threshold<0||v.threshold>1||![0,1].includes(v.label)||!Array.isArray(v.values)||v.values.length!==(v.kind==='tree'?5:64)||v.values.some(n=>n!==null&&(!Number.isFinite(n)||!Number.isFinite(Math.fround(n))))||!Array.isArray(v.path);
 }))throw new Error();return {items:data,error:''};}
 catch{return {items:[],error:'Analiz geçmişi okunamadı; üzerine yazılmadı. Yedeğini kontrol et.'};}
}
export function saveHistory(storage,items){
 const current=readHistory(storage);if(current.error)return current.error;
 try{storage.setItem(HISTORY_KEY,JSON.stringify(items.slice(0,200)));return '';}
 catch{return 'Analiz kaydedilemedi; depolama kapalı veya dolu.';}
}
