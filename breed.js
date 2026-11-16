(() => {
  'use strict';
  const breeds=Array.isArray(window.DOG_BREEDS)?window.DOG_BREEDS:[];
  const id=new URLSearchParams(location.search).get('id');
  const dog=breeds.find(d=>d.id===id);
  const root=document.querySelector('#breed-detail');
  function el(tag,cls,text){const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;}
  if(!dog){const box=el('section','missing-dog');box.append(el('span','section-kicker','SORRY, NOT FOUND'),el('h1','','這位朋友還沒加入圖鑑。'),el('p','','請回首頁選擇其他犬種，或檢查網址是否正確。'));const a=el('a','primary-button','返回圖鑑 ↗');a.href='index.html#explore';box.append(a);root.replaceChildren(box);document.title='找不到犬種｜PAW ATLAS';return;}
  document.title=dog.name+' '+dog.english+'｜狗狗大全 PAW ATLAS';
  const hero=el('section','detail-hero');
  const left=el('div','detail-intro');left.append(el('span','section-kicker','BREED PROFILE / '+String(breeds.indexOf(dog)+1).padStart(2,'0')));
  const title=el('h1','',dog.name);left.append(title,el('p','detail-english',dog.english));
  const tagline=el('p','detail-tagline',dog.summary);left.append(tagline);
  const pills=el('div','detail-tags');[dog.size,dog.group,dog.origin].forEach(t=>pills.append(el('span','pill',t)));left.append(pills);
  const visual=el('div','detail-visual');
  if(dog.image){let img=el('img');img.src=dog.image;img.alt=dog.name+'的 AI 生成示意插畫';visual.append(img,el('small','','AI 插畫示意・非真實犬種照片'));}
  else{visual.classList.add('plain');visual.append(el('span','monogram',dog.english.slice(0,2).toUpperCase()),el('small','','文字圖卡・此犬種尚未加入插畫'));}
  hero.append(left,visual);root.append(hero);
  const info=el('section','detail-content');
  const lead=el('div','info-lead');lead.append(el('span','section-kicker','GET TO KNOW THEM'),el('h2','','認識這位朋友。'),el('p','','以下資訊是一般犬種教學摘要，不代表每隻個體必然有相同個性或需求。'));
  const blocks=el('div','info-blocks');
  const data=[['01','起源與背景','origin',dog.origin],['02','外觀與原有用途','appearance',dog.appearance],['03','常見行為特徵','temperament',dog.temperament],['04','活動與訓練','activity',dog.activity],['05','照護注意事項','care',dog.care]];
  data.forEach(([no,label,key,value])=>{const a=el('article','info-row');a.dataset.field=key;a.append(el('span','info-number',no),el('h3','',label),el('p','',value));blocks.append(a);});
  info.append(lead,blocks);root.append(info);
  const source=el('aside','source-panel');const top=el('div','source-heading');top.append(el('span','section-kicker','SOURCE & DISCLAIMER'),el('h2','','資料來源與使用提醒'));source.append(top);
  const link=el('a','source-link','American Kennel Club (AKC) - '+dog.english+' ↗');link.href=dog.source;link.target='_blank';link.rel='noopener noreferrer';source.append(link);
  source.append(el('p','',dog.disclaimer || '本內容為教學性質的概略摘要；飼養或健康相關問題需考量個別情況並諮詢專業人士。'));
  root.append(source);
})();
