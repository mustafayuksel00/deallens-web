from pathlib import Path
import shutil,hashlib,json,zipfile,urllib.request
r=Path(__file__).resolve().parents[1]
dist=r/'dist';docs=r/'docs'
assert dist.resolve().is_relative_to(r.resolve()) and docs.resolve().is_relative_to(r.resolve())
# Preserve historical assets. Copy every current build file to the existing Pages directory.
for p in dist.rglob('*'):
 if p.is_file():
  dest=docs/p.relative_to(dist);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
  assert p.read_bytes()==dest.read_bytes()
# Every production asset is served and exactly equals its local build bytes.
checked=[]
for p in dist.rglob('*'):
 if p.is_file():
  rel=p.relative_to(dist).as_posix();url='http://127.0.0.1:5190/'+urllib.parse.quote(rel)
  body=urllib.request.urlopen(url,timeout=20).read();assert body==p.read_bytes(),rel;checked.append(rel)
(r/'hub-evidence/asset-verification.json').write_text(json.dumps({'count':len(checked),'all_http_bytes_equal':True,'files':checked},indent=2),encoding='utf-8')
files=[]
for p in dist.rglob('*'):
 if p.is_file():files.append((p,'uygulama/'+p.relative_to(dist).as_posix()))
for name in ['README.md','HUB-DELIVERY-2026-10-10.md','DATA-LICENSE.md','DealLens-Baslat.bat','start-deallens.py']:
 files.append((r/name,name))
for directory in ['src','public','tests','scripts','hub-evidence']:
 for p in (r/directory).rglob('*'):
  if p.is_file() and p.suffix not in ['.pyc'] and p.name not in ['catboost-export.json','package-verification.json']:files.append((p,'kaynak/'+p.relative_to(r).as_posix()))
for name in ['index.html','package.json','package-lock.json','vite.config.js','HUB-GOAL-LOOP.md']:
 files.append((r/name,'kaynak/'+name))
zip_path=r/'DealLens_Birlesik_Basit_Pro.zip'
with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
 for path,target in sorted(files,key=lambda t:t[1]):z.write(path,target)
with zipfile.ZipFile(zip_path) as z:
 assert z.testzip() is None
 assert len(z.namelist())==len(files)==len(set(z.namelist()))
 for path,target in files:assert z.read(target)==path.read_bytes(),target
proof={'files':len(files),'crc':'passed','all_bytes_equal':True,'sha256':hashlib.sha256(zip_path.read_bytes()).hexdigest(),'bytes':zip_path.stat().st_size}
(r/'hub-evidence/package-verification.json').write_text(json.dumps(proof,indent=2),encoding='utf-8')
print(json.dumps(proof))
