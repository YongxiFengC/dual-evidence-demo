'use strict';
/* Object-led interludes. All coordinates are schematic; every transformation
   follows the shared playback clock, including reverse seeking. */
window.MechanismStory=(()=>{
 const S=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const T=(x,y,s,c='ms-label')=>`<text x="${x}" y="${y}" class="${c}">${s}</text>`;
 const path=(d,c='ms-trace')=>`<path d="${d}" class="${c}"/>`;
 const tiles=()=>Array.from({length:16},(_,j)=>`<rect data-ms-tile="${j}" x="${j%4*18-32}" y="${Math.floor(j/4)*18-32}" width="13" height="13" rx="4" fill="${['#6b96b9','#64a68f','#aec9c0','#b3c8db'][j%4]}"/>`).join('');
 function art(index,h){
  let body='';
  if(index===3){
   body+='<g aria-hidden="true"><path data-ms-link="0" class="ms-link"/><path data-ms-link="1" class="ms-link"/><circle data-ms-link-dot="0" r="5" class="ms-link-dot"/><circle data-ms-link-dot="1" r="5" class="ms-link-dot"/></g>';
   body+=`<g data-ms-history><rect x="-7" y="9" width="252" height="242" rx="20" class="ms-page back"/><rect width="252" height="242" rx="20" class="ms-page"/>${T(23,38,'治疗前的病历','ms-sub')}${T(23,83,'生理状态')}${path('M24 116H62L75 94 90 126 104 108H224')}${T(23,155,'既往治疗')}${[28,50,39,65,22].map((v,j)=>`<rect x="${24+j*40}" y="${220-v}" width="25" height="${v}" rx="5" class="ms-dose"/>`).join('')}</g>`;
   body+=`<g data-ms-summary><circle r="68" class="ms-summary-halo"/>${tiles()}${T(-48,103,'患者摘要 z','ms-label')}</g>`;
   body+=Array.from({length:12},(_,j)=>`<rect data-ms-fragment="${j}" width="12" height="8" rx="3" class="ms-fragment"/>`).join('');
   body+=`<g data-ms-rebuild>${h.hot('encoder',`<rect width="288" height="118" rx="18" class="ms-output"/>${T(22,32,'还原患者信息','ms-sub')}<path data-ms-wave d="M22 86H67L82 62 98 98 113 72 142 83 181 78H260" class="ms-trace"/>`,265,20,'查看编码器、患者解码器与训练目标')}</g>`;
   body+=`<g data-ms-practice>${h.hot('practice',`<rect width="288" height="146" rx="18" class="ms-output"/>${T(22,32,'学习历史治疗选择','ms-sub')}${[30,65,45,24,14].map((v,j)=>`<rect data-ms-bar="${j}" data-height="${v}" x="${25+j*47}" y="${119-v}" width="30" height="${v}" rx="5" class="ms-practice-bar"/>`).join('')}`,265,20,'查看动作解码器及医护情境 U')}</g>`;
   body+=`<g data-ms-training>${h.hot('encoder',`<rect width="340" height="38" rx="19" class="ms-chip"/>${T(21,25,'重建患者信息 ＋ 学习治疗选择','ms-sub')}`,319,19,'查看联合训练目标')}</g>`;
  }else{
   body+=`<g data-ms-question>${h.hot('template',`<rect width="420" height="108" rx="22" class="ms-page"/>${T(28,38,'先定下复盘问题','ms-sub')}${T(28,78,'是否启动？怎样调整剂量？')}`,396,22,'查看治疗阶段模板')}</g>`;
   body+=`<g data-ms-ruler><path d="M0 100H680" class="ms-axis"/>${[0,1,2,3,4].map((j)=>`<g><circle data-ms-level="${j}" cx="${j*170}" cy="100" r="12" class="ms-level"/>${T(j*170-5,141,''+j,'ms-sub')}</g>`).join('')}${T(230,185,'候选治疗档位 · 机制示意','ms-sub')}<g data-ms-direction>${path('M180 25H65L80 10M65 25L80 40','ms-direction')}${path('M500 25H615L600 10M615 25L600 40','ms-direction')}${T(0,-4,'减量方向','ms-sub')}${T(554,-4,'加量方向','ms-sub')}</g><g data-ms-range><rect data-ms-band y="72" height="56" rx="18" class="ms-band"/><path data-ms-bracket class="ms-bracket"/>${T(230,57,'学习范围的中心与宽度','ms-sub')}</g></g>`;
   body+=`<g data-ms-optimizer>${h.hot('range',`<rect width="450" height="42" rx="21" class="ms-chip"/>${T(26,28,'范围固定 · 学习方向条件','ms-sub')}`,429,21,'查看条件和范围参数怎样交替更新')}</g>`;
   body+=`<g data-ms-patients>${[[1,2],[2,3],[1,3]].map(([lo,hi],j)=>`<g data-ms-patient="${j}">${T(0,21,'患者 '+['A','B','C'][j])}<path d="M142 14H530" class="ms-axis"/><rect x="${142+lo*97-16}" y="-5" width="${(hi-lo)*97+32}" height="38" rx="15" class="ms-band"/>${[0,1,2,3,4].map(k=>`<circle cx="${142+k*97}" cy="14" r="6" class="ms-level ${k>=lo&&k<=hi?'supported':''}"/>`).join('')}</g>`).join('')}</g>`;
  }
  return `<svg class="mechanism-story-board" data-ms-scene="${index}" viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="${index===3?'病历整理成患者摘要与两种学习输出':'预测档位形成患者特异治疗范围'}"><rect class="ms-paper" width="1080" height="480" rx="12"/>${T(49,40,index===3?'从历史病历学习':'从预测中学习剂量参考','ms-kicker')}<text x="49" y="85" class="ms-title" data-ms-title></text>${body}<text x="49" y="459" class="ms-foot">群体共同训练 · 画面为机制示意</text></svg>`;
 }
 function update(svg,cue,reduced){
  if(!svg.classList.contains('mechanism-story-board'))return false;
  const i=+svg.dataset.msScene,t=cue.visual,mobile=matchMedia('(max-width:600px)').matches;
  svg.setAttribute('viewBox',mobile?'0 0 540 700':'0 0 1080 480');svg.querySelector('.ms-paper').setAttribute('height',mobile?700:480);svg.querySelector('.ms-foot').setAttribute('y',mobile?680:459);
  const place=(sel,x,y,opacity=1,scale=1)=>{const e=svg.querySelector(sel);e.setAttribute('transform',`translate(${x} ${y}) scale(${scale})`);e.style.opacity=opacity;e.style.pointerEvents=opacity>.85?'auto':'none';e.querySelectorAll('[data-topic]').forEach(h=>h.setAttribute('tabindex',opacity>.85?'0':'-1'));return e;};
  if(i===3){
   const titles=['翻开病历，看看患者的情况。','把这些信息，整理成一份摘要。','摘要保留了哪些患者信息？','医生通常会怎样治疗？','两项任务，一起训练这份摘要。'];
   svg.querySelector('[data-ms-title]').textContent=titles[cue.n];
   const q=S((t-1.2)/.8),sx=mobile?270:525,sy=mobile?324:249;
   place('[data-ms-history]',mobile?62:72,mobile?132:135,1-q*.72,mobile?.72:1);
   place('[data-ms-summary]',sx,sy,S((t-1.2)/.35),mobile?.85:1);
   svg.querySelectorAll('[data-ms-fragment]').forEach(e=>{const j=+e.dataset.msFragment,u=reduced?1:S((t-1.2-j*.035)/.45),x=(mobile?95:110)+(j%3)*(mobile?44:67),y=(mobile?190:206)+Math.floor(j/3)*(mobile?20:34);e.setAttribute('transform',`translate(${x+(sx-x)*u} ${y+(sy-y)*u}) scale(${1-u*.35})`);e.style.opacity=reduced?0:S((t-1.2)/.1)*(1-S((u-.85)/.15));});
   place('[data-ms-rebuild]',mobile?126:734,mobile?413:124,S((t-2)/.26),mobile?.9:1);
   const wave=svg.querySelector('[data-ms-wave]'),len=wave.getTotalLength();wave.style.strokeDasharray=len;wave.style.strokeDashoffset=len*(1-(reduced?1:S((t-2)/.5)));
   place('[data-ms-practice]',mobile?126:734,mobile?537:269,S((t-2.6)/.25),mobile?.9:1);
   svg.querySelectorAll('[data-ms-link]').forEach(e=>{
    const j=+e.dataset.msLink,q=reduced?1:S((t-(j?2.6:2))/.4);
    e.setAttribute('d',mobile?(j?'M218 324Q88 324 88 375V602H126':'M270 382V413'):(j?'M585 270Q655 340 734 340':'M585 229Q655 183 734 183'));
    const len=e.getTotalLength();e.style.strokeDasharray=len;e.style.strokeDashoffset=len*(1-q);e.style.opacity=S((t-(j?2.6:2))/.12);
    const dot=svg.querySelector('[data-ms-link-dot="'+j+'"]'),p=e.getPointAtLength(q*len);dot.setAttribute('cx',p.x);dot.setAttribute('cy',p.y);dot.style.opacity=reduced?0:Math.sin(q*Math.PI);
   });
   svg.querySelectorAll('[data-ms-bar]').forEach(e=>{const h=+e.dataset.height*(reduced?1:S((t-2.6-(+e.dataset.msBar)*.06)/.65));e.setAttribute('height',h);e.setAttribute('y',119-h);});
   place('[data-ms-training]',354,400,mobile?0:S((t-4)/.4));
  }else{
   const titles=['先问清楚：这次要复盘什么？','找出有预测支持的剂量档位。','看看往哪个方向调整。','把范围的边界调到合适位置。','每位患者，都得到自己的参考。'];
   svg.querySelector('[data-ms-title]').textContent=titles[cue.n];
   place('[data-ms-question]',mobile?59:330,mobile?170:184,1-S((t-.8)/.3));
   const fade=S((t-.8)/.25)*(1-S((t-4.5)/.4));
   place('[data-ms-ruler]',mobile?65:200,mobile?246:173,fade,mobile?.60:1);
   svg.querySelectorAll('[data-ms-level]').forEach(e=>{const j=+e.dataset.msLevel;e.classList.toggle('supported',j>=1&&j<=3&&t>=.9+j*.14);});
   svg.querySelector('[data-ms-direction]').style.opacity=S((t-2)/.22)*(1-S((t-3.2)/.3));
   const g=S((t-3.2)/1.2),left=95+75*g,right=624-114*g,band=svg.querySelector('[data-ms-band]');band.setAttribute('x',left);band.setAttribute('width',right-left);
   svg.querySelector('[data-ms-range]').style.opacity=S((t-3.2)/.22);
   svg.querySelector('[data-ms-bracket]').setAttribute('d',`M${left} 65V140M${right} 65V140M${(left+right)/2} 76V124`);
   const opt=place('[data-ms-optimizer]',mobile?46:315,mobile?445:403,S((t-2)/.25)*(1-S((t-4.5)/.3)),mobile?1:1);
   opt.querySelector('.ms-sub').textContent=cue.n===2?'范围固定 · 学习方向条件':'条件固定 · 调整范围边界';
   place('[data-ms-patients]',mobile?55:270,mobile?237:170,S((t-4.5)/.35),mobile?.8:1);
   svg.querySelectorAll('[data-ms-patient]').forEach(e=>{const j=+e.dataset.msPatient,q=reduced?1:S((t-4.5-j*.12)/.4);e.setAttribute('transform',`translate(${(1-q)*28} ${j*(mobile?110:82)})`);e.style.opacity=q;});
  }
  return true;
 }
 return {art,update};
})();
