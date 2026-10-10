"""Local launcher: fixed origin preserves browser storage between runs."""
from pathlib import Path
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from functools import partial
import urllib.request,webbrowser,sys
root=Path(__file__).resolve().parent
site=root/'uygulama'
if not site.exists():site=root/'dist'
url='http://127.0.0.1:5276/'
if not (site/'index.html').exists():
 print('Uygulama dosyalari bulunamadi. ZIP paketini tamamen bir klasore cikarin.');sys.exit(1)
try:server=ThreadingHTTPServer(('127.0.0.1',5276),partial(SimpleHTTPRequestHandler,directory=str(site)))
except OSError:
 try:
  text=urllib.request.urlopen(url,timeout=3).read().decode('utf-8')
  if 'DealLens — Ortak Çalışma Alanı' not in text:raise ValueError()
  if '--no-open' not in sys.argv:webbrowser.open(url)
  print('DealLens zaten acik.');sys.exit(0)
 except Exception:
  print('5276 portu baska bir uygulamada kullaniliyor. DealLens acilmadi.');sys.exit(1)
print(f'DealLens hazir: {url}\nBu pencereyi kapatirsan yerel uygulama durur. Kayitlar tarayicida kalir.')
if '--no-open' not in sys.argv:webbrowser.open(url)
try:server.serve_forever()
except KeyboardInterrupt:pass
finally:server.server_close()
