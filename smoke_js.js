// Node-only lightweight DOM smoke test: no packages, no network.
const fs = require('fs');
const vm = require('vm');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const text = name => fs.readFileSync(path.join(ROOT, name), 'utf8');
const dataContext = {window: {}};
vm.runInNewContext(text('data/breeds.js'), dataContext);
const breeds = dataContext.window.DOG_BREEDS;
function assert(x, message) { if (!x) throw new Error(message); }
class Element {
  constructor(tag='div') {
    this.tag=tag;this.children=[];this.dataset={};this.attributes={};this.listeners={};this.value='';this.className='';this.textContent='';this.hidden=false;
    this.classList={add: s=>{this.className += ' '+s;},toggle:(s,bool)=>{this.className=(this.className||'').split(' ').filter(x=>x&&x!==s).join(' ')+(bool?' '+s:'');}};
  }
  append(...kids){this.children.push(...kids);}
  replaceChildren(...kids){this.children=[...kids];}
  setAttribute(k,v){this.attributes[k]=v;}
  addEventListener(k,fn){this.listeners[k]=fn;}
  click(){if(this.listeners.click)this.listeners.click();}
  focus(){}
}
const selectors=['#breed-grid','#search','#result-count','#no-results','#reset-search','#breed-count'];
const els=Object.fromEntries(selectors.map(x=>[x,new Element()]));
const filters=['all','small','medium','large'].map(size=>{let e=new Element('button');e.dataset.size=size;return e;});
const document1={querySelector: x=>els[x],querySelectorAll: x=> x==='.filter'?filters:[],createElement: tag=>new Element(tag)};
vm.runInNewContext(text('assets/js/index.js'), {window:dataContext.window,document:document1,console});
assert(els['#breed-grid'].children.length===20,'Home should show 20 cards');
assert(els['#breed-count'].textContent==='20','Count should equal 20');
els['#search'].value='柴犬';els['#search'].listeners.input();
assert(els['#breed-grid'].children.length===1,'Search 柴犬 should return exactly one card');
assert(els['#breed-grid'].children[0].href==='breed.html?id=shiba-inu','Search result link wrong');
els['#search'].value='no-such-breed';els['#search'].listeners.input();
assert(els['#breed-grid'].children.length===0 && els['#no-results'].hidden===false,'Empty state must display');
els['#search'].value='';filters[1].click();
const sc=els['#breed-grid'].children.length;
assert(sc>0&&sc<20, 'Small filter should be nonempty subset');
const detailEl=new Element();const detailDoc={querySelector:()=>detailEl,createElement:tag=>new Element(tag),title:''};
vm.runInNewContext(text('assets/js/breed.js'),{window:dataContext.window,document:detailDoc,location:{search:'?id=shiba-inu'},URLSearchParams,console});
function descendants(el){return el.children.flatMap(k=>[k,...descendants(k)]);}
const d=descendants(detailEl);
assert(d.filter(x=>x.className==='info-row').length===5,'Detail should show five fields');
assert(d.some(x=>x.textContent==='柴犬'),'Detail title missing');
assert(d.some(x=>x.className==='source-link'&&x.href.includes('akc.org')),'AKC source missing');
console.log('PASS JS smoke: homepage 20 cards; search; empty state; size filter; detail 5 fields and source');
