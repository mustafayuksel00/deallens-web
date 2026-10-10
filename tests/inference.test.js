import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {infer,numberValue,batchFromCSV,csvResult,readHistory,saveHistory} from '../src/Interfaces/inference.js';
const models=JSON.parse(fs.readFileSync(new URL('../src/data/models.json',import.meta.url),'utf8'));
test('Five-ratio model has unchanged real inference; decimal comma accepted',()=>{
 const a=infer(models.simple,['0,35','2','1,5','1,10','0,10']);const b=infer(models.simple,[.35,2,1.5,1.1,.1]);assert.deepEqual(a,b);assert.ok(Math.abs(a.score-.1721)<.0001);
});
test('Non-finite, booleans, percents, empty or wrong-size inputs cannot masquerade as results',()=>{
 for(const v of ['',null,'NaN','Infinity','%35','abc','0x10',true,'1e309','1e39'])assert.throws(()=>numberValue(v));
 assert.throws(()=>infer(models.simple,[1,2]));assert.throws(()=>infer(models.advanced,Array(64).fill(null),{allowMissing:true}));
});
test('Pro CSV matches manual inference, handles BOM, semicolons and quoted decimals',()=>{
 const headers=['record_id',...models.advanced.features];const row=['demo',...models.advanced.medians.map(n=>String(n).replace('.',','))];row[4]='';
 const csv='\uFEFF'+headers.join(';')+'\r\n'+row.map(v=>'"'+v+'"').join(';');const actual=batchFromCSV(csv,models.advanced)[0];
 const manual=infer(models.advanced,row.slice(1),{allowMissing:true});assert.equal(actual.score,manual.score);assert.equal(actual.missing,1);
 assert.throws(()=>batchFromCSV('Attr1,Attr1\n1,2',models.advanced));assert.throws(()=>batchFromCSV(headers.join(',')+'\n1,2',models.advanced));assert.throws(()=>batchFromCSV(headers.join(',')+'\n'+row.map(()=> '').join(','),models.advanced));
 assert.throws(()=>batchFromCSV('record_id,Attr1\n"bad,1',models.advanced));
});
test('Batch refuses oversize jobs rather than silently skipping records; exports protect spreadsheet formulas',()=>{
 const head=models.advanced.features.join(',');assert.throws(()=>batchFromCSV(head+'\n'+Array(501).fill(Array(64).fill('1').join(',')).join('\n'),models.advanced));
 assert.match(csvResult([{id:'=HYPERLINK("bad")',score:.2,label:0,threshold:.3,missing:0}]),/"'=HYPERLINK/);
});
test('Corrupted or blocked analysis storage is preserved and reported',()=>{
 const s={getItem:()=>'{broken',setItem:()=>assert.fail('Must not overwrite')};assert.ok(readHistory(s).error);assert.ok(saveHistory(s,[]));
 const closed={getItem:()=>null,setItem:()=>{throw new Error();}};assert.ok(saveHistory(closed,[]));
});
test('Exported models reproduce every original source-row score and label',()=>{
 const path=new URL('../hub-evidence/parity-fixture.json',import.meta.url);if(!fs.existsSync(path))throw new Error('Run model export first; parity fixture is required.');
 const fixtures=JSON.parse(fs.readFileSync(path,'utf8'));let count=0,maxError=0;
 for(const name of ['simple','advanced']){const f=fixtures[name];assert.equal(f.rows.length,5910);for(let i=0;i<f.rows.length;i++){
  const r=infer(models[name],f.rows[i],{allowMissing:true});const err=Math.abs(r.score-f.scores[i]);maxError=Math.max(maxError,err);assert.ok(err<1e-12,`${name} row ${i}: ${err}`);assert.equal(r.label,f.labels[i]);count++;
 }}
 fs.writeFileSync(new URL('../hub-evidence/model-parity.json',import.meta.url),JSON.stringify({prediction_count:count,max_absolute_error:maxError,all_labels_match:true},null,2));
});
