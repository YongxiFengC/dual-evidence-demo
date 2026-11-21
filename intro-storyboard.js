'use strict';
/* Four compositions, eight narrated beats. All timing derives from the seekable
   film clock. No decorative free-running loops or numerical case claims. */
window.IntroStoryboard=(()=>{
const S=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
const T=(x,y,s,c='ib-label')=>'<text x="'+x+'" y="'+y+'" class="'+c+'">'+s+'</text>';
const group=(side,html)=>'<g class="ib-'+side+'">'+html+'</g>';
const stroke=(d,beat,at=0)=>'<path d="'+d+'" class="ib-draw" data-ib-draw="'+beat+'" data-delay="'+at+'"/>';
const bars=(beat,scale=1)=>[44,95,155,78,27].map(v=>v*scale).map((h,j)=>'<rect class="ib-bar" x="'+(40+j*65)+'" y="'+(220-h)+'" width="40" height="'+h+'" rx="7" data-ib-bar="'+beat+'" data-h="'+h+'" data-j="'+j+'"/>').join('');
function art(h){
const {person:P,hot:H}=h;let panels='';
panels+='<g data-ib-panel="0">'+group('left','<rect width="400" height="278" rx="24" class="ib-record"/>'+T(24,29,'虚构病例 · 仅作机制示意','ib-small')+T(24,66,'林女士 · 67 岁','ib-case-name')+T(24,95,'脓毒症，正在接受治疗','ib-label')+'<path d="M24 111H376" class="ib-axis"/>'+T(24,137,'治疗前血压','ib-small')+T(225,137,'心率','ib-small')+T(24,168,'88/56 mmHg','ib-case-value')+T(225,168,'112 次/分','ib-case-value')+T(24,198,'体温 38.7°C · 近 2 小时尿量减少','ib-case-detail')+'<g data-ib-record><rect x="20" y="215" width="360" height="48" rx="12" class="ib-correct"/>'+T(66,246,'医生记录：补液档位 4','ib-label')+'</g>')+group('right','<rect width="400" height="278" rx="24" class="ib-record"/>'+T(30,36,'林女士','ib-small')+'<g data-case-neighbours>'+Array.from({length:8},(_,j)=>'<g data-case-neighbour="'+j+'">'+P(j<4?65:335,65+(j%4)*39,.35)+'</g>').join('')+'</g><g data-case-avatar>'+P(200,117,1.45)+'</g><g data-case-question>'+T(91,219,'这个剂量合适吗？','ib-question')+'</g><g data-ib-ask>'+T(42,239,'先看这个选择常不常见。','ib-label')+'</g>')+'</g>';
panels+=window.CrowdFrequency.art();
const patient=(side)=>{let x='<g data-ib-leaf="'+side+'"><rect x="-5" y="-14" width="407" height="301" rx="18" class="ib-file-page"/><path d="M14 10V263" class="ib-file-spine"/></g><ellipse cx="188" cy="236" rx="78" ry="12" class="ib-shadow"/>'+P(188,155,1.65)+T(149,271,side===0?'患者 A':'患者 B','ib-label');x+='<g data-ib-state="'+side+'"><rect x="5" y="-6" width="360" height="72" rx="15" class="ib-state-card"/>'+T(22,18,'当前状态','ib-small')+stroke(side===0?'M145 35L184 35 197 12 210 49 223 25 246 35H340':'M145 35L169 35 181 18 195 38 219 38 236 24 253 35H340',4,side*.15)+'</g>';x+='<g data-ib-response="'+side+'"><rect x="251" y="95" width="140" height="104" rx="15" class="ib-response-card"/>'+T(266,119,'既往治疗反应','ib-small')+stroke(side===0?'M267 174Q291 142 318 150T376 134':'M267 160Q290 135 315 168T376 166',5,side*.15)+'</g>';return x;};
panels+='<g data-ib-panel="2">'+group('left',patient(0))+group('right',patient(1))+'</g>';
const ref=(clinical)=>'<g data-ib-reference="'+(clinical?'clinical':'practice')+'"><rect x="0" y="0" width="400" height="278" rx="24" class="'+(clinical?'ib-clinical':'ib-choice')+'"/>'+T(30,48,clinical?'还要问':'不只问','ib-reference-title')+T(30,84,clinical?'这位患者，有什么依据？':'别人通常怎样选？','ib-label')+(clinical?P(200,177,1.3)+T(95,254,'接下来，看两个情境','ib-small'):bars(6,.68))+'</g>';
panels+='<g data-ib-panel="3">'+group('left',H('practice',ref(false),377,20,'查看 Practice 参考'))+group('right',H('clinical',ref(true),377,20,'查看 Clinical 参考'))+'</g>';
return '<svg class="intro-board" viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="从一次治疗选择开始的故事"><rect class="ib-paper" width="1080" height="480" fill="#f8f6ef"/><circle cx="1020" cy="45" r="200" fill="#e4eeea"/>'+T(61,45,'01 / 复盘情境 · 以补液为例','story-kicker')+'<text x="61" y="91" class="ib-title" id="ib-title"></text>'+panels+'<g data-ib-thread aria-hidden="true"><circle r="17" class="ib-thread-halo"/><path d="M0-10L10 0 0 10-10 0Z" class="cf-current"/><text y="33" class="ib-thread-label">待复盘的选择</text></g><g class="ib-beats">'+Array.from({length:8},(_,j)=>'<rect x="'+(420+j*31)+'" y="453" width="21" height="4" rx="2" data-ib-beat="'+j+'"/>').join('')+'</g>'+window.DosePrimer.art()+'</svg>';
}
function update(svg,t,reduced){
if(!svg.classList.contains('intro-board'))return;
if(window.DosePrimer.update(svg,t,reduced))return;
svg.querySelector('.ib-beats').style.opacity=1;
window.CrowdFrequency.update(svg,t,reduced);
const beat=Math.min(7,Math.floor(t)),phase=t-beat,panel=Math.floor(beat/2),mobile=matchMedia('(max-width:600px)').matches;
const titles=['一位医生，做了一次治疗选择。','你会怎样判断这次选择？','先看看，其他医生怎样选。','少见，就能说明选错了吗？','等等，先翻开他的病历。','同样的治疗，不同的反应。','频率告诉我们：它有多常见。','患者信息，让我们再问一步。'];
svg.querySelector('#ib-title').textContent=titles[beat];svg.dataset.beat=beat;
svg.querySelector('.ib-paper').setAttribute('height',mobile?'740':'480');
svg.querySelectorAll('.ib-left').forEach(e=>e.setAttribute('transform',mobile?'translate(60 124) scale(.9)':'translate(75 145)'));
svg.querySelectorAll('.ib-right').forEach(e=>e.setAttribute('transform',mobile?'translate(60 420) scale(.9)':'translate(602 145)'));
svg.querySelectorAll('.ib-bridge').forEach(e=>e.setAttribute('transform',mobile?'translate(240 373) rotate(90) scale(.5)':'translate(500 267)'));
svg.querySelector('.ib-beats').setAttribute('transform',mobile?'translate(-270 266)':'translate(0 0)');
// Brief, clock-driven handoff preserves spatial continuity without independent timers.
const handoff=reduced?1:S((t-panel*2)/.10);
svg.querySelectorAll('[data-ib-panel]').forEach(e=>{const ix=+e.dataset.ibPanel,active=ix===panel,outgoing=ix===panel-1&&handoff<1;
e.style.display=active||outgoing?'inline':'none';e.style.opacity=active?(panel===0?1:handoff):1-handoff;
e.setAttribute('transform','translate('+(reduced?0:active?(1-handoff)*18:-handoff*18)+' 0)');
e.style.pointerEvents=active?'auto':'none';e.setAttribute('aria-hidden',String(!active));e.querySelectorAll('[data-topic]').forEach(h=>h.setAttribute('tabindex',active?'0':'-1'));});
const thread=svg.querySelector('[data-ib-thread]');
const home=mobile?[94,340]:[113,384],park=mobile?[470,122]:[987,143],focus=mobile?[442,484]:[780,377],patientPoint=mobile?[229,313]:[263,355];
const lerp=(a,b,q)=>a.map((v,i)=>v+(b[i]-v)*q);
let pos=t<2?lerp(home,park,S((t-1.75)/.25)):t<3?park:t<3.85?lerp(park,focus,S((t-3)/.24)):lerp(focus,patientPoint,S((t-3.85)/.3));
if(reduced)pos=t<2?home:t<3?park:t<4?focus:patientPoint;
thread.setAttribute('transform','translate('+pos.join(' ')+')');thread.style.opacity=S((t-.3)/.3)*(1-S((t-4.15)/.2));
thread.querySelector('text').style.opacity=mobile?0:S((t-1.9)/.15)*(1-S((t-2.95)/.1));
svg.querySelectorAll('[data-ib-beat]').forEach(e=>{e.style.fill=+e.dataset.ibBeat<=beat?'#568fb5':'#d7e0e5';});
svg.querySelectorAll('[data-ib-record]').forEach(e=>{const q=reduced?1:S(t/.7);e.style.opacity=q;e.setAttribute('transform','translate(0 '+((1-q)*24)+')');});
svg.querySelectorAll('[data-ib-ask]').forEach(e=>{const q=S((t-1)/.25);e.style.opacity=q;e.setAttribute('transform','translate(0 '+(reduced?0:(1-q)*18)+')');});
const avatar=svg.querySelector('[data-case-avatar]'),arrival=reduced?1:S(t/.35),gather=S((t-1)/.6);
avatar.style.opacity=arrival;avatar.setAttribute('transform','translate(200 '+(117+(1-arrival)*25-gather*8)+') scale('+(1-gather*.15)+') translate(-200 -117)');
svg.querySelector('[data-case-question]').style.opacity=S((t-.3)/.25)*(1-S((t-1)/.2));
svg.querySelectorAll('[data-case-neighbour]').forEach(e=>{const j=+e.dataset.caseNeighbour,q=S((t-1-j*.045)/.3);e.style.opacity=q*.8;e.setAttribute('transform','translate('+(reduced?0:(1-q)*(j<4?-35:35))+' 0)');});
svg.querySelectorAll('[data-ib-marker]').forEach(e=>e.style.opacity=S((t-2.45)/.4));
svg.querySelectorAll('[data-ib-bar="2"]').forEach(e=>e.style.fill=+e.dataset.j===4?'#c49272':'#6f9dbf');
svg.querySelectorAll('[data-ib-card]').forEach(e=>{const j=+e.dataset.ibCard,q=reduced?1:S((t-j*.11)/.3);e.style.opacity=q;e.setAttribute('transform','translate('+(j%3*124)+' '+(Math.floor(j/3)*109+(1-q)*22)+')');});
svg.querySelectorAll('[data-ib-bar]').forEach(e=>{const j=+e.dataset.j||[...e.parentNode.querySelectorAll('[data-ib-bar]')].indexOf(e),q=reduced?1:S((t-+e.dataset.ibBar-j*.09)/.45),h=+e.dataset.h;e.setAttribute('height',h*q);e.setAttribute('y',220-h*q);});
svg.querySelectorAll('.ib-callout').forEach(e=>e.style.opacity=S((t-1.3)/.4));
svg.querySelectorAll('[data-ib-flight]').forEach(e=>{const j=+e.dataset.ibFlight,u=(t-1-j*.045)/.52,q=S(u),x=mobile?110+(j%3)*110:100+(j%3)*124,y=mobile?230:210+Math.floor(j/3)*36,tx=mobile?120+j%5*58:642+j%5*65,ty=mobile?610:335;e.style.opacity=reduced||u<0||u>1?0:Math.sin(q*Math.PI);e.setAttribute('transform','translate('+(x+(tx-x)*q)+' '+(y+(ty-y)*q-45*Math.sin(q*Math.PI))+')');});
svg.querySelectorAll('[data-ib-draw]').forEach(e=>{if(!e._len)e._len=e.getTotalLength();e.style.strokeDasharray=e._len;e.style.strokeDashoffset=e._len*(1-(reduced?1:S((t-+e.dataset.ibDraw-(+e.dataset.delay||0))/.65)));});
svg.querySelectorAll('[data-ib-metric="correct"],[data-ib-not-equal]').forEach(e=>{const delay=e.hasAttribute('data-ib-not-equal')?.5:0,q=S((t-3-delay)/.4);e.style.opacity=q;e.setAttribute('transform','translate(0 '+(reduced?0:(1-q)*15)+')');});
svg.querySelectorAll('[data-ib-response]').forEach(e=>{const q=S((t-5-(+e.dataset.ibResponse)*.1)/.5);e.style.opacity=q;e.setAttribute('transform','translate('+(reduced?0:(1-q)*25)+' 0)');});
svg.querySelectorAll('[data-ib-state]').forEach(e=>e.classList.toggle('ib-active',beat===4));
svg.querySelectorAll('[data-ib-leaf]').forEach(e=>{const q=S((t-4-(+e.dataset.ibLeaf)*.12)/.65);e.style.opacity=q;e.setAttribute('transform',reduced?'translate(0 0)':'translate(0 130) scale('+(0.08+.92*q)+' 1) translate(0 -130)');});
svg.querySelectorAll('[data-ib-reference="clinical"]').forEach(e=>{const q=S((t-7)/.6);e.style.opacity=q;e.setAttribute('transform','translate('+(reduced?0:(1-q)*35)+' 0)');const hot=e.closest('[data-topic]');hot.setAttribute('tabindex',panel===3&&q>.8?'0':'-1');hot.style.pointerEvents=q>.8?'auto':'none';});
}
return {art,update};
})();
