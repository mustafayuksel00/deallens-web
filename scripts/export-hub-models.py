"""Convert the existing trusted training artifacts; never train a replacement model."""
from pathlib import Path
import sys,json,hashlib,csv
import joblib,numpy as np,pandas as pd
root=Path(__file__).resolve().parents[1]
projects=root.parent
sys.path.insert(0,str(projects/'deallens-ml-risk/scripts'))
out=root/'src/data';out.mkdir(parents=True,exist_ok=True)
evidence=root/'hub-evidence';evidence.mkdir(exist_ok=True)
sources={'simple':projects/'deallens-python-risk/outputs/revised/deallens_tree_5.joblib','advanced':projects/'deallens-ml-risk/outputs/selected_model.joblib'}
models={}
for name,path in sources.items():
 b=joblib.load(path);pipeline=b['model'];imp=pipeline.named_steps['imputer'];est=pipeline.named_steps['model']
 model={'kind':'tree' if name=='simple' else 'catboost','features':b['features'],'medians':imp.statistics_.tolist(),'threshold':b['threshold'],'version':b['version'],'source_sha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 if name=='simple':
  t=est.tree_
  model['nodes']=[{'left':int(t.children_left[i]),'right':int(t.children_right[i]),'feature':int(t.feature[i]),'border':float(t.threshold[i]),'score':float(t.value[i,0,1]/t.value[i,0].sum())} for i in range(t.node_count)]
 else:
  temp=evidence/'catboost-export.json';est.save_model(str(temp),format='json');raw=json.loads(temp.read_text(encoding='utf-8'))
  assert all(s['split_type']=='FloatFeature' for t in raw['oblivious_trees'] for s in t['splits'])
  model['indicators']=imp.indicator_.features_.tolist()
  model['scale']=raw['scale_and_bias'][0];model['bias']=raw['scale_and_bias'][1][0]
  model['trees']=[{'splits':[[s['float_feature_index'],s['border']] for s in t['splits']],'leaves':t['leaf_values']} for t in raw['oblivious_trees']]
 models[name]=model
ml=json.loads((projects/'deallens-ml-risk/outputs/results.json').read_text(encoding='utf-8'))
models['advanced']['recallThreshold']=ml['selection']['recall80_threshold'] if 'selection' in ml else json.loads((projects/'deallens-ml-risk/outputs/selection_before_test.json').read_text())['recall80_threshold']
(out/'models.json').write_text(json.dumps(models,separators=(',',':'),allow_nan=False),encoding='utf-8')
dictionary=list(csv.DictReader((projects/'deallens-ml-risk/data/data_dictionary_64.csv').open(encoding='utf-8-sig')))
study={'version':ml['version'],'selected':ml['selected_model'],'data':ml.get('data',{}),'models':[{'name':k,**v['test']} for k,v in ml['models'].items()],'dictionary':[{'key':r['column'],'label':r['meaning_tr'],'formula':r['source_formula'],'note':r['note']} for r in dictionary if r['column'].startswith('Attr')]}
(out/'study.json').write_text(json.dumps(study,ensure_ascii=False,indent=2),encoding='utf-8')
# Full 5,910-source-row parity fixture (all partitions, including missing data).
five=pd.read_csv(projects/'deallens-python-risk/data/deallens_financial_risk.csv');full=pd.read_csv(projects/'deallens-ml-risk/data/deallens_financial_risk_64.csv')
fixtures={}
for name,path in sources.items():
 b=joblib.load(path);df=five if name=='simple' else full;X=df[b['features']]
 scores=b['model'].predict_proba(X)[:,1]
 rows=X.astype(object).where(pd.notna(X),None).values.tolist()
 fixtures[name]={'rows':rows,'scores':scores.tolist(),'labels':(scores>=b['threshold']).astype(int).tolist()}
(evidence/'parity-fixture.json').write_text(json.dumps(fixtures,separators=(',',':'),allow_nan=False),encoding='utf-8')
print('Exported original tree and CatBoost; full 5,910-row fixtures per model.')
