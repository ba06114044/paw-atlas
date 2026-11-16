#!/usr/bin/env python3
"""Validate PAW ATLAS's data contract with only Python stdlib."""
from pathlib import Path
import json,re,sys,urllib.parse

ROOT=Path(__file__).resolve().parents[1]
JS=ROOT/'data/breeds.js'
raw=JS.read_text(encoding='utf-8')
match=re.search(r'window\.DOG_BREEDS\s*=\s*(\[.*\])\s*;',raw,re.S)
if not match:
    raise SystemExit('FAIL: data/breeds.js 格式不符 AGENTS.md（預期 window.DOG_BREEDS = [ ... ];）')
items=json.loads(match.group(1))
assert isinstance(items,list) and items,'犬種資料必須為非空陣列'
required={'id','name','english','group','origin','size','appearance','temperament','activity','care','source','disclaimer','summary','image','featured'}
seen=set()
for i,d in enumerate(items,1):
    assert isinstance(d,dict),f'第 {i} 筆不是 object'
    missing=required-set(d)
    assert not missing,f'第 {i} 筆缺少欄位：{sorted(missing)}'
    slug=d['id']
    assert isinstance(slug,str) and re.fullmatch(r'[a-z0-9]+(?:-[a-z0-9]+)*',slug),f'非法 slug: {slug}'
    assert slug not in seen,f'重複 slug: {slug}'
    seen.add(slug)
    for key in required-{'featured'}:
        assert isinstance(d[key],str),f'{slug}.{key} 必須為字串'
        if key != 'image': assert d[key].strip(),f'{slug}.{key} 不可空白'
    assert isinstance(d['featured'],bool),f'{slug}.featured 必須為 boolean'
    assert d['size'] in ('玩具型','小型','小型至中型','中型','中大型','中型至大型','大型'),f'{slug} 體型未使用規範詞彙：{d["size"]}'
    src=urllib.parse.urlparse(d['source'])
    assert src.scheme=='https' and src.netloc and src.netloc.endswith('akc.org'),f'{slug}.source 無可信網址'
    if d['image']:
        assert d['image']==f'assets/images/dogs/{slug}.webp',f'{slug} 圖片路徑不符規範'
        assert (ROOT/d['image']).is_file(),f'{slug} 圖片檔案不存在'
    assert len(d['summary'])>=8,f'{slug} 摘要太短'
for f in ('index.html','breed.html','about.html','AGENTS.md','README.md','assets/css/site.css','assets/js/index.js','assets/js/breed.js'):
    assert (ROOT/f).is_file(),f'缺少必要檔案：{f}'
print(f'PASS: {len(items)} 種犬種；{sum(bool(d["image"]) for d in items)} 張插畫；ID、必備欄位、來源與圖檔全部檢查完成。')
