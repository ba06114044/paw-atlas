(() => {
  'use strict';
  const breeds = Array.isArray(window.DOG_BREEDS) ? window.DOG_BREEDS : [];
  const grid = document.querySelector('#breed-grid');
  const search = document.querySelector('#search');
  const count = document.querySelector('#result-count');
  const empty = document.querySelector('#no-results');
  const filters = [...document.querySelectorAll('.filter')];
  let currentSize = 'all';
  const normalize = text => String(text || '').toLocaleLowerCase('zh-Hant').trim();
  const sizeOf = text => /大型/.test(text) ? 'large' : (/小型/.test(text) && !/中型/.test(text) || /玩具型/.test(text)) ? 'small' : 'medium';
  const make = (tag, className, value) => { const el = document.createElement(tag); if (className) el.className=className; if (value) el.textContent=value; return el; };
  function makeCard(dog, number) {
    const a = make('a','breed-card');
    a.href = 'breed.html?id=' + encodeURIComponent(dog.id);
    a.setAttribute('aria-label', dog.name + '，查看詳細資料');
    const image = make('div','card-visual ' + (dog.image ? 'has-image' : 'no-image'));
    if(dog.image){const pic=make('img'); pic.src=dog.image; pic.alt=dog.name + ' AI 插畫示意'; pic.loading='lazy';pic.decoding='async';image.append(pic);}
    else {const monogram=make('span','monogram',dog.english.slice(0,2).toUpperCase()); image.append(monogram,make('span','placeholder-stamp','PAW ATLAS  ✳'));}
    const n=make('span','card-number',String(number).padStart(2,'0'));image.append(n);
    const arrow=make('span','card-arrow','↗');arrow.setAttribute('aria-hidden','true');image.append(arrow);
    const meta=make('div','card-meta'); meta.append(make('span','card-size',dog.size),make('span','card-group',dog.group));
    const title=make('h3','card-title',dog.name);const en=make('p','card-english',dog.english);
    const desc=make('p','card-desc',dog.summary);
    const body=make('div','card-body'); body.append(meta,title,en,desc);
    a.append(image,body);
    return a;
  }
  function render(){
    const query=normalize(search.value);
    const found=breeds.filter(dog => {
      const fitsSize=currentSize==='all' || sizeOf(dog.size)===currentSize;
      const searchable=[dog.name,dog.english,dog.origin,dog.temperament,dog.activity,dog.group].map(normalize).join(' ');
      return fitsSize && (!query || searchable.includes(query));
    });
    grid.replaceChildren(...found.map((dog,i)=>makeCard(dog,breeds.indexOf(dog)+1)));
    count.textContent=`顯示 ${found.length} / ${breeds.length} 種犬種`;
    empty.hidden = found.length>0;
  }
  search.addEventListener('input',render);
  filters.forEach(btn=>btn.addEventListener('click',()=>{currentSize=btn.dataset.size;filters.forEach(other=>{const is=other===btn;other.classList.toggle('selected',is);other.setAttribute('aria-pressed',String(is));});render();}));
  document.querySelector('#reset-search').addEventListener('click',()=>{search.value='';filters[0].click();search.focus();});
  document.querySelector('#breed-count').textContent=String(breeds.length).padStart(2,'0');
  render();
})();
