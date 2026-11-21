'use strict';
/* Designed, synthetic explanatory vignettes — no patient records or measured
   probabilities. Blue = observed frequency; green = patient-specific reference;
   coral = the documented action, not an error label. */
window.StoryOpening={
art(i,h){
if(i===0)return window.IntroStoryboard.art(h);
const {text:T,reveal:R,hot:H,person:P,bars:B}=h;
const bg='<rect class="story-paper" width="1080" height="480" fill="#f8f6ef"/><circle cx="980" cy="50" r="240" fill="#e7efed"/><circle cx="80" cy="475" r="230" fill="#e8edf4"/><path d="M26 437H1054" stroke="#cbd5dd"/>';
const pill=(x,y,w,t,c='blue')=>'<g class="story-pill '+c+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="29" rx="14"/>'+T(x+w/2,y+20,t,'story-pill-label')+'</g>';
const move=(html,at,dx,dy)=>'<g data-story-move="'+at+'" data-dx="'+dx+'" data-dy="'+dy+'">'+html+'</g>';
let g=bg;
if(i===0){
g+=R(T(61,61,'01 / 医生的治疗选择','story-kicker','start')+T(61,112,'医生很少这样治疗，','story-display','start')+T(61,162,'就说明治疗有错吗？','story-display','start'),0);
let people='';
for(let n=0;n<8;n++){const x=100+n%4*89,y=252+Math.floor(n/4)*93;people+=R(P(x,y,.66)+'<rect x="'+(x-19)+'" y="'+(y+34)+'" width="38" height="9" rx="4" fill="#578cbd"/>',.2+n*.12);}
g+=people+R(T(229,414,'相似患者中的治疗选择','story-small'),.7);
g+=move('<g class="story-action"><rect x="420" y="227" width="104" height="132" rx="15"/><path d="M445 266H498M445 283H482"/>'+T(472,320,'记录治疗','story-action-label')+'</g>',1.5,-105,40);
g+=R('<path d="M536 292C586 292 576 242 625 242" class="story-link"/>',2);
g+=R(H('rarity',T(802,213,'少见','story-word')+T(802,278,'= 错误？','story-question'),979,165,'为什么少见不等于错误'),2,4.9);
g+=R('<ellipse cx="798" cy="370" rx="153" ry="20" fill="#dce5e1"/>'+P(790,289,2.12)+pill(651,142,282,'先看这位患者的状态','teal')+'<g class="story-vital"><rect x="868" y="232" width="118" height="77" rx="12"/><path d="M883 272H905L915 252 925 289 936 268H973"/></g>'+pill(635,344,133,'既往治疗')+pill(835,352,167,'生理状态','teal'),4.8);
g+=R(T(797,415,'继续看这位患者的情况','story-takeaway'),6.5);
}else{
g+=T(43,45,'02 / 加入患者自身的信息','story-kicker','start')+T(43,83,'同一种治疗，需要两种不同的参考。','story-heading','start')+'<circle cx="781" cy="41" r="5" fill="#e6a07d"/>'+T(794,46,'记录治疗','story-legend','start')+'<rect x="883" y="35" width="20" height="12" rx="4" fill="#bce2d2"/>'+T(913,46,'学得的支持范围','story-legend','start');
const scenario=(side,rare)=>{
const x=side===0?35:558,ax=x+375,level=rare?1:3,points=[x+83,x+158,x+233,x+308,x+383];
const revealAt=rare?3.2:8.8;
let a='<g class="story-scenario '+(rare?'case-rare':'case-common')+'"><rect x="'+x+'" y="107" width="487" height="311" rx="19" class="story-case-bg"/>';
a+=T(x+22,140,rare?'A / 医生较少选择':'B / 医生经常选择','story-case-title','start')+P(x+451,143,.46);
a+=T(x+22,174,'模型估计的治疗选择概率','story-axis-label','start');
a+='<path d="M'+(x+25)+' 247H'+(x+247)+'" class="story-baseline"/>';
const heights=rare?[29,7,42,53,23]:[16,28,41,57,25];
a+='<g transform="translate('+(x+34)+' 162)">'+heights.map((v,j)=>'<rect data-story-hist="'+v+'" data-hist-index="'+j+'" x="'+j*42+'" y="'+(80-v)+'" width="26" height="'+v+'" rx="4" fill="'+(j===level?'#e6a07d':'#8aafd0')+'"/>').join('')+'</g>';
a+=pill(x+288,185,157,rare?'这种治疗少见':'这种治疗常见');
a+='<g class="story-with-patient">'+R(T(x+22,265,'患者特异参考','story-axis-label','start')+'<rect x="'+(points[rare?1:0]-24)+'" y="284" width="123" height="42" rx="14" class="story-range"/>'+'<path d="M'+points[0]+' 306H'+points[4]+'" class="story-scale"/>'+points.map((p,j)=>'<circle cx="'+p+'" cy="306" r="4" class="story-tick"/>'+T(p,347,''+j,'story-level')).join('')+'<g class="story-marker"><path d="M'+(points[level]-9)+' 278L'+points[level]+' 288L'+(points[level]+9)+' 278Z"/><circle cx="'+points[level]+'" cy="306" r="9"/>'+T(points[level],272,'记录动作','story-marker-label')+'</g>',revealAt);
a+='<g class="story-flight" data-story-token="'+(revealAt-.7)+'" data-x="'+(x+47+42*level)+'" data-y="'+(242-heights[level]/2)+'" data-tx="'+points[level]+'"><rect x="-9" y="-9" width="18" height="18" rx="5"/></g>';
a+=R(T(x+244,380,rare?'少见，但落在该患者支持范围内':'常见，但与该患者参考存在差异','story-case-outcome')+T(x+244,400,rare?'不能仅凭低频就判错':'结合因素与预测证据，进一步查看','story-case-reason'),revealAt+1.4)+'</g>';
a+='<g class="story-frequency-only"><path d="M'+(x+55)+' 301H'+(x+430)+'" class="story-hidden-line"/>'+T(x+244,335,'仅凭频率，患者层面的依据仍然缺失','story-hidden-label')+'</g></g>';
return H(rare?'rareExample':'commonExample',a,x+465,123,rare?'为什么少见动作不一定有错':'为什么常见动作仍可能值得复盘');
};
g+=scenario(0,true)+scenario(1,false);
g+=R(T(540,459,'少见不等于错误，常见也可能值得复盘。','story-bottom'),13.6);
}
return '<svg class="story-svg" viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="'+(i===0?'先看频率，再看患者':'少见与常见的两种示意情境')+'">'+g+'</svg>';
},
update(svg,t,reduced){
window.IntroStoryboard.update(svg,t,reduced);
// A single visual focus follows the explanation; both cases return for the takeaway.
svg.querySelectorAll('.story-scenario').forEach(e=>{const rare=e.classList.contains('case-rare'),leftFocus=Math.min(1,Math.max(0,(t-3.2)/.5))*(1-Math.min(1,Math.max(0,(t-8.3)/.5))),rightFocus=Math.min(1,Math.max(0,(t-8.8)/.5))*(1-Math.min(1,Math.max(0,(t-13)/.5)));e.style.opacity=1-.62*(rare?rightFocus:leftFocus);e.querySelector('.story-case-bg').style.strokeWidth=1+1.5*(rare?leftFocus:rightFocus);});
svg.querySelectorAll('[data-story-hist]').forEach(e=>{const u=Math.min(1,Math.max(0,(t-.2-(+e.dataset.histIndex)*.18)/1.2)),q=reduced?1:u*u*(3-2*u),h=+e.dataset.storyHist*q;e.setAttribute('height',h);e.setAttribute('y',80-h);});
const stacked=matchMedia('(max-width:600px)').matches&&!!svg.querySelector('[data-topic="commonExample"]');
const second=svg.querySelector('[data-topic="commonExample"]');if(second)second.setAttribute('transform',stacked?'translate(-523 340)':'translate(0 0)');
const foot=svg.querySelector('.story-bottom');if(foot)foot.setAttribute('transform',stacked?'translate(-270 355)':'translate(0 0)');
const paper=svg.querySelector('.story-paper');if(paper)paper.setAttribute('height',stacked?'850':'480');
svg.querySelectorAll('[data-story-move]').forEach(e=>{let p=Math.min(1,Math.max(0,(t-+e.dataset.storyMove)/1.3));p=1-Math.pow(1-p,3);e.style.opacity=p;e.setAttribute('transform','translate('+(reduced?0:(1-p)*+e.dataset.dx)+' '+(reduced?0:(1-p)*+e.dataset.dy)+') rotate('+(reduced?0:(1-p)*-12)+' 472 293)');});
svg.querySelectorAll('[data-story-token]').forEach(e=>{const d=e.dataset,u=(t-+d.storyToken)/1.25,p=Math.min(1,Math.max(0,u)),q=p*p*(3-2*p);e.style.opacity=reduced||u<0||u>1?0:Math.min(1,p*8,(1-p)*8);e.setAttribute('transform','translate('+(+d.x+(+d.tx-+d.x)*q)+' '+(+d.y+(306-+d.y)*q)+') rotate('+(q*90)+')');});
}
};
