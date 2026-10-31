from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit,unquote
ROOT=Path(__file__).resolve().parents[1]
class Handler(SimpleHTTPRequestHandler):
 def translate_path(self,path):
  path=unquote(urlsplit(path).path)
  base=ROOT if path.startswith('/tests/') or path.startswith('/dist/') else ROOT/'dist'
  result=(base/path.lstrip('/')).resolve()
  if not result.is_relative_to(base):return str(base/'404')
  return str(result)
ThreadingHTTPServer(('127.0.0.1',5174),Handler).serve_forever()
