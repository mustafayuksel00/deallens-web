import React,{useEffect,useRef,useState} from 'react';
import {X} from 'lucide-react';
import {EMPTY,SECTORS,STAGES,validate} from '../Interfaces/company.js';
export default function CompanyForm({company,records,onClose,onSave}){
 const [form,setForm]=useState(company?{...company,revenue:company.revenue??''}:{...EMPTY});
 const [errors,setErrors]=useState({}); const dialog=useRef(null);
 useEffect(()=>{dialog.current.showModal();return()=>dialog.current?.close();},[]);
 const change=e=>setForm({...form,[e.target.name]:e.target.value});
 const submit=e=>{e.preventDefault();const checked=validate(form,records,company?.id);setErrors(checked.errors);if(!Object.keys(checked.errors).length&&onSave(checked.value)===false)setErrors({storage:'Kaydedilemedi. Tarayıcı depolamasını kontrol et; girdiğin bilgiler bu formda korunuyor.'});};
 const field=(name,label,children)=><label className="field" key={name}><span>{label}</span>{children}{errors[name]&&<small role="alert" id={`${name}-error`}>{errors[name]}</small>}</label>;
 const attrs=name=>({name,id:name,value:form[name],onChange:change,'aria-invalid':!!errors[name],'aria-describedby':errors[name]?`${name}-error`:undefined});
 return <dialog ref={dialog} onCancel={onClose} aria-labelledby="form-title"><form onSubmit={submit} noValidate><header className="modal-head"><div><p className="eyebrow">ŞİRKET BİLGİLERİ</p><h2 id="form-title">{company?'Kaydı düzenle':'Yeni şirket ekle'}</h2></div><button type="button" className="icon-button" onClick={onClose} aria-label="Pencereyi kapat"><X size={20}/></button></header>
 {field('name','Şirket adı *',<input {...attrs('name')} autoFocus maxLength={80} placeholder="Örn. Atlas Yazılım"/>)}
 <div className="form-grid">{field('sector','Sektör',<select {...attrs('sector')}>{SECTORS.map(s=><option key={s}>{s}</option>)}</select>)}{field('stage','İnceleme durumu',<select {...attrs('stage')}>{STAGES.map(s=><option key={s}>{s}</option>)}</select>)}{field('priority','Öncelik',<select {...attrs('priority')}><option>Normal</option><option>Yüksek</option></select>)}{field('revenue','Yıllık gelir (milyon TL)',<input {...attrs('revenue')} inputMode="decimal" placeholder="İsteğe bağlı"/>)}</div>
 {field('note','İnceleme notu',<textarea {...attrs('note')} rows={3} maxLength={1000} placeholder="Takip etmek istediğin bilgileri yaz…"/>)}
 <p className="hint">Gelir bilgisi elle girilir. Bu kayıt model tahmini üretmez.</p>{errors.storage&&<p role="alert" className="error-banner">{errors.storage}</p>}<footer className="modal-actions"><button type="button" className="secondary" onClick={onClose}>Vazgeç</button><button className="primary" type="submit">{company?'Değişiklikleri kaydet':'Şirketi kaydet'}</button></footer></form></dialog>;
}
