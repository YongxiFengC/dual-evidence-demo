'use strict';
(()=>{
const $=s=>document.querySelector(s),A=window.MechanismAssets,F=window.StoryFilm,V=window.StoryVoice;
if(!A||!F||!V)return;
const acts=['为什么复盘','两种参考','群体训练','个体复盘'];
let cursor=0;
const sections=F.sections.map((s,i)=>{const start=cursor;return {...s,start,cues:s.cues.map((c,j)=>{const duration=i===0?[3.6,3.4,3.8,4.4][j]:i===1?[3,3.5,5][j]:V.timings[i][j].duration+.09;const out={text:c[0],heading:c[1],from:c[2],to:c[3],start:cursor,duration,n:j};cursor+=duration;return out})}});
const cues=sections.flatMap((s,i)=>s.cues.map(c=>({...c,scene:i}))),TOTAL=cursor;
const reduce=matchMedia('(prefers-reduced-motion:reduce)'),mobile=()=>matchMedia('(max-width:600px)').matches;
let elapsed=0,playing=false,scene=-1,raf=0,last=0,speed=1,returnFocus=null;
let motion=[],traces=[],travel=[];
const E=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const T=(x,y,t,cls='sf-label',anchor='middle')=>`<text x="${x}" y="${y}" class="${cls}" text-anchor="${anchor}">${t}</text>`;
const R=(s,at=0,until=99)=>`<g data-at="${at}" data-until="${until}">${s}</g>`;
const card=(x,y,w,h,t,cls='sf-card')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" class="${cls}"/>${T(x+w/2,y+h/2+7,t)}`;
const svg=(body,label)=>`<svg viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="${label}"><rect width="1080" height="480" rx="12" class="sf-paper"/><defs><linearGradient id="sfGlow"><stop stop-color="#7845df"/><stop offset="1" stop-color="#11bba8"/></linearGradient></defs>${body}</svg>`;
function custom(kind){
 if(kind==='timeline'||kind==='rewind')return window.OpeningStory.art(kind);
 if(kind==='overview')return svg(
  T(540,62,'双视角治疗复盘','sf-title')+R(A.person(540,205,1.1)+card(444,264,192,55,'同一份病历','sf-orange'),0)+
  R(`<path d="M440 240H395M685 240H640" class="sf-line"/>`+A.hot('practice',card(45,130,340,230,'Practice','sf-rule')+T(215,325,'历史选择常见吗？','sf-muted'),360,150,'查看 Practice 参考'),.45)+
  R(A.hot('clinical',card(695,130,340,230,'Clinical','sf-green')+T(865,325,'患者有哪些支持？','sf-muted'),1010,150,'查看 Clinical 参考'),1)+
  R(T(540,424,'这些参考，怎样学来？','sf-strong'),2),'两种参考连接同一份病历');
 if(kind==='freeze'){
  let g=T(540,54,'从群体训练，到个体复盘','sf-title');
  g+=`<g data-training-stream>${[0,1,2].map(j=>A.person(114,140+j*106,.72)+`<path d="M155 ${140+j*106}H323" class="sf-line"/>`+Array.from({length:5},(_,k)=>`<circle data-stream="${j*5+k}" r="4" cy="${140+j*106}" fill="#9669eb"/>`).join('')).join('')}${T(200,434,'历史群体','sf-muted')}</g>`;
  g+=`<g data-frozen-model><rect x="382" y="142" width="260" height="205" rx="36" class="sf-model"/>${T(512,209,'共享模型','sf-white')}<g data-lock><rect x="494" y="267" width="36" height="30" rx="6" class="sf-lock"/><path d="M499 265V252a13 13 0 0126 0v13" class="sf-lock"/></g>${T(512,245,'参数固定','sf-white')}</g>`;
  g+=R(`<path d="M650 245H771" class="sf-line"/>${A.person(875,215,1.55)}${T(875,320,'新患者')}${T(875,353,'直接生成参考','sf-muted')}`,1);
  return svg(g,'训练完成后冻结参数，为新患者生成参考');
 }
 if(kind==='evidence'){
  let g=T(50,50,'把差异展开成依据','sf-title','start');
  g+=`<g data-pair>${card(45,94,280,84,'补液 F · 固定','sf-rule')}${card(45,195,280,84,'升压药 V · 比较','sf-orange')}<g data-dose-selector>${[1,2,3].map((k,j)=>`<circle cx="${107+j*75}" cy="316" r="23" class="sf-rule"/>${T(107+j*75,324,'V'+k,'sf-muted')}`).join('')}<circle data-pair-choice cx="107" cy="316" r="29" class="sf-frame"/></g></g>`;
  g+=`<g data-pair-chart><rect x="370" y="94" width="655" height="268" rx="24" class="sf-card"/>${T(407,128,'同一患者 · 动作条件预测','sf-muted','start')}<path d="M413 158V320H974" class="sf-line"/><path d="M416 277C520 231 605 292 716 231S889 215 975 246" class="sf-trace orange" stroke-dasharray="6 5"/><path data-pair-curve d="M416 277C520 210 605 253 716 201S889 166 975 180" class="sf-trace teal"/>${T(710,345,'预测时间','sf-muted')}</g>`;
  g+=`<g data-evidence-cards>${['临床因素','学得范围','预测权衡','证据缺口'].map((n,j)=>A.hot(j===0?'comparison':j===1?'clinical':j===2?'gru':'packet',card(45+j*255,382,235,65,n,j===3?'sf-absence':'sf-green'),260+j*255,396,'查看'+n)).join('')}</g>`;
  g+=`<g data-no-evidence><rect x="721" y="160" width="267" height="138" rx="16" class="sf-absence"/>${T(853,215,'缺少比较支持')}${T(853,252,'保留缺口，不生成曲线','sf-muted')}</g>`;
  return svg(g,'固定另一治疗分量，展示预测比较及证据缺口');
 }
 return '';
}
function prepare(s){
 const stage=$('#stage');stage.innerHTML=s.kind==='legacy'?A.art(s.art):custom(s.kind);
 stage.className='stage'+(s.art===3||s.art===5?' ms-stage':'');
 const board=stage.querySelector('svg');
 motion=[...board.querySelectorAll('[data-at]')];traces=[...board.querySelectorAll('[data-draw],[data-bar]')];travel=[...board.querySelectorAll('[data-path]')];
 traces.forEach(e=>{if(e.dataset.draw!==undefined){e._length=e.getTotalLength();e.style.strokeDasharray=e._length}});
 travel.forEach(e=>{e._path=document.createElementNS('http://www.w3.org/2000/svg','path');e._path.setAttribute('d',e.dataset.path);e._length=e._path.getTotalLength()});
 if(s.art===4){board.insertAdjacentHTML('beforeend',`<g data-observed-training><rect x="696" y="120" width="278" height="242" rx="15" fill="#f5f2ff"/>${T(837,155,'历史观测监督','sf-training')}<path d="M720 298L765 275 813 284 861 220 915 203 950 170" class="sf-trace"/>${[0,1,2,3,4,5].map((j)=>`<circle cx="${720+j*46}" cy="${[298,275,284,220,203,170][j]}" r="6" fill="#ee9c51"/>`).join('')}${T(834,340,'预测与历史记录对照','sf-muted')}</g>`)}
}
function updateCustom(s,t,p){
 if(s.kind==='timeline'||s.kind==='rewind'){window.OpeningStory.update($('#stage svg'),s.kind,t,reduce.matches);return;}
 const board=$('#stage svg'),one=sel=>board.querySelector(sel),opacity=(sel,v)=>{const e=one(sel);if(e)e.style.opacity=v};
 if(s.kind==='freeze'){
  opacity('[data-training-stream]',1-.8*E(t));opacity('[data-lock]',E(t/.5));
  board.querySelectorAll('[data-stream]').forEach(e=>{const j=+e.dataset.stream;e.setAttribute('cx',155+168*((j*.19+Math.min(t,.8)*.5)%1));e.style.opacity=1-E(t)});
 }
 if(s.kind==='evidence'){
  opacity('[data-evidence-cards]',E((t-1.8)/.4));opacity('[data-no-evidence]',E((t-2.55)/.3));
  const k=E(Math.min(1,Math.max(0,t-1)));one('[data-pair-choice]').setAttribute('cx',107+150*k);
  const y=180+65*k;one('[data-pair-curve]').setAttribute('d',`M416 277C520 ${210+25*k} 605 253 716 ${201+20*k}S889 ${166+65*k} 975 ${y}`);
  one('[data-pair-curve]').style.strokeDasharray='650';one('[data-pair-curve]').style.strokeDashoffset=650*(1-E(t/.6));
 }
}
function visual(s,c,p){
 const board=$('#stage svg'),t=c.from+(c.to-c.from)*p;
 if(s.kind==='legacy'){
  if(s.art===3||s.art===5){window.MechanismStory.update(board,{...c,visual:t},reduce.matches);const title=board.querySelector('[data-ms-title]');if(title)title.textContent=c.heading;}
  else{
   window.MotionDesign.update(board,t,reduce.matches);window.StoryOpening.update(board,t,reduce.matches);
   const heading=board.querySelector('#ib-title,.story-heading');if(heading)heading.textContent=c.heading;
  }
  if(s.art===4){const train=board.querySelector('[data-observed-training]');train.style.opacity=c.n===0?E(p*3):0;const names=['A','A','B','C'];const active=names[c.n];board.querySelectorAll('[data-candidate]').forEach(e=>{e.style.opacity=c.n===3?1:e.dataset.candidate===active?1:.16});}
 }else updateCustom(s,t,p);
 motion.forEach(e=>{if(e.dataset.mg)return;const q=reduce.matches?(t>=+e.dataset.at&&t<+(e.dataset.until||99)?1:0):E((t-+e.dataset.at)/.34)*(1-E((t-+(e.dataset.until||99))/.3));e.style.opacity=q;e.style.pointerEvents=q>.85?'auto':'none';e.setAttribute('transform',`translate(0 ${reduce.matches?0:(1-q)*18})`);e.querySelectorAll('[data-topic]').forEach(h=>h.setAttribute('tabindex',q>.85?'0':'-1'))});
 traces.forEach(e=>{if(e.dataset.draw!==undefined)e.style.strokeDashoffset=(1-E((t-+e.dataset.draw)/.7))*e._length;else{const h=+e.dataset.height*E((t-+e.dataset.bar)/.6);e.setAttribute('height',h);e.setAttribute('y',100-h)}});
 travel.forEach(e=>{const z=t-+e.dataset.start;e.style.opacity=z<0||reduce.matches?0:.8;if(z>=0){const xy=e._path.getPointAtLength(((z*.5)%1)*e._length);e.setAttribute('transform',`translate(${xy.x} ${xy.y})`)}});
 // On phones, use a continuous pan only for wide diagrams; object stories reflow.
 if(s.art!==3&&s.art!==5){
  if(mobile()){
   if(s.kind==='timeline'||s.kind==='rewind')return;
   if(s.art===0)board.setAttribute('viewBox','0 0 540 740');
   else if(s.art===1)board.setAttribute('viewBox',`0 ${c.n===2?365:0} 540 460`);
   else{let f=(elapsed-s.start)/(sections[scene+1]?.start-s.start||TOTAL-s.start);const x=480*E(f);board.setAttribute('viewBox',`${reduce.matches?240:x} 0 600 480`);}
  }else board.setAttribute('viewBox','0 0 1080 480');
 }
}
const fmt=t=>`${Math.floor(t/60).toString().padStart(2,'0')}:${Math.floor(t%60).toString().padStart(2,'0')}`;
function current(){return cues[Math.max(0,cues.findLastIndex(c=>elapsed>=c.start))]}
function render(){
 const c=current(),s=sections[c.scene];
 if(scene!==c.scene){scene=c.scene;prepare(s);$('#act-label').textContent=acts[s.act]+' / '+s.title;$('#film').dataset.act=s.act;$('#scene-counter').textContent=`${String(scene+1).padStart(2,'0')} / 13`;$('#chapters').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',i===scene));$('.story-route').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-current',i===s.act));}
 const p=Math.max(0,Math.min(1,(elapsed-c.start)/c.duration));visual(s,c,p);
 if($('#caption').textContent!==c.text)$('#caption').textContent=c.text;
 $('#narration-position').textContent=`${c.n+1} / ${s.cues.length}`;$('#seek').value=elapsed;$('#film').style.setProperty('--progress',`${elapsed/TOTAL*100}%`);
 $('#clock').textContent=fmt(elapsed)+' / '+fmt(TOTAL);$('#play').textContent=playing?'Ⅱ 暂停':elapsed>=TOTAL-.05?'↺ 再看一次':'▶ 播放';$('#previous').disabled=scene===0;$('#next').disabled=scene===12;$('#sentence-prev').disabled=elapsed<.1;$('#sentence-next').disabled=c===cues.at(-1);$('#film').classList.toggle('is-playing',playing);$('#story-end').hidden=scene!==12;
}
function tick(now){if(!playing)return;elapsed=Math.min(TOTAL,elapsed+(now-last)/1000*speed);last=now;render();if(elapsed>=TOTAL-.04){playing=false;render();return}raf=requestAnimationFrame(tick)}
function pause(){playing=false;cancelAnimationFrame(raf);render()}
function play(){if(playing){pause();return}if(elapsed>=TOTAL-.05)seek(0);playing=true;last=performance.now();render();raf=requestAnimationFrame(tick)}
function seek(t){pause();elapsed=Math.max(0,Math.min(TOTAL,t));render()}
function jump(i){seek(sections[Math.max(0,Math.min(12,i))].start+.02)}
function sentence(d){const n=cues.indexOf(current());seek(cues[Math.max(0,Math.min(cues.length-1,n+d))].start+.02)}
function openDetail(key,target){const d=A.details[key];if(!d)return;pause();returnFocus=target;$('#detail-tag').textContent=d.tag;$('#detail-title').textContent=d.title;$('#detail-body').innerHTML=d.body;$('#detail').showModal()}
function closeDetail(){if($('#detail').open)$('#detail').close();returnFocus?.focus()}
document.body.classList.add('story-edition');$('#film').classList.remove('inline-story');
$('.page-intro h1').textContent='回看一次治疗选择';$('.page-intro>span').textContent='两种参考，从群体训练到个体复盘。';
$('#film').insertAdjacentHTML('beforebegin','<nav class="story-route" aria-label="故事主线">'+acts.map((a,i)=>`<button data-act="${i}" aria-current="false"><span>0${i+1}</span>${a}</button>`).join('')+'</nav>');
$('#film').insertAdjacentHTML('beforeend','<div class="story-end" id="story-end" hidden><a href="index.html#workbench">探索病例工作台</a></div>');
$('#chapters').innerHTML=sections.map((s,i)=>`<button data-chapter="${i}" aria-pressed="false"><span>${String(i+1).padStart(2,'0')}</span>${s.title}</button>`).join('');
$('#transcript').innerHTML=sections.map((s,i)=>`<section><h3>${String(i+1).padStart(2,'0')} / ${s.title}</h3>${s.cues.map(c=>`<p>${c.text}</p>`).join('')}</section>`).join('');
$('#seek').max=TOTAL;$('#seek').step='.05';$('#play').onclick=play;$('#restart').onclick=()=>{seek(0);play()};$('#previous').onclick=()=>jump(scene-1);$('#next').onclick=()=>jump(scene+1);$('#sentence-prev').onclick=()=>sentence(-1);$('#sentence-next').onclick=()=>sentence(1);
$('#seek').oninput=e=>seek(+e.target.value);$('#speed').onchange=e=>{speed=+e.target.value};
$('#chapters').onclick=e=>{const b=e.target.closest('[data-chapter]');if(b)jump(+b.dataset.chapter)};
$('.story-route').onclick=e=>{const b=e.target.closest('[data-act]');if(b)jump(sections.findIndex(s=>s.act===+b.dataset.act))};
$('#stage').onclick=e=>{const h=e.target.closest('[data-topic]');if(h)openDetail(h.dataset.topic,h)};
$('#stage').onkeydown=e=>{const h=e.target.closest('[data-topic]');if(h&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();openDetail(h.dataset.topic,h)}};
$('#close-detail').onclick=closeDetail;$('#resume-detail').onclick=()=>{closeDetail();play()};
$('#film').onkeydown=e=>{if(e.target.closest('button,input,select,a,[data-topic]'))return;if(e.code==='Space'){e.preventDefault();play()}else if(e.key==='ArrowRight'){e.preventDefault();sentence(1)}else if(e.key==='ArrowLeft'){e.preventDefault();sentence(-1)}};
$('#fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#film').requestFullscreen()}catch{document.body.classList.toggle('theater')}};
document.addEventListener('fullscreenchange',()=>$('#fullscreen').textContent=document.fullscreenElement?'退出全屏':'全屏');document.addEventListener('visibilitychange',()=>{if(document.hidden&&playing)pause()});
window.addEventListener('resize',render);reduce.addEventListener('change',render);
render();
})();
