'use strict';
/* Clinical context leads into the study's dose encoding; no dosing advice. */
window.DosePrimer=(()=>{
 const S=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 const levels=()=>'<g data-card-levels>'+[0,1,2,3,4].map(j=>'<g data-level="'+j+'"><rect x="'+(-88+j*37)+'" y="52" width="29" height="31" rx="7" class="dp-level-box"/><text x="'+(-73.5+j*37)+'" y="74" class="dp-level-number">'+j+'</text></g>').join('')+'</g>';
 function art(){return '<g class="dose-primer" aria-label="脓毒症治疗与剂量记录示意">'+
 '<g data-clinical-context><path data-treatment-link="0" class="dp-treatment-link"/><path data-treatment-link="1" class="dp-treatment-link"/>'+
 '<g data-context-patient><text x="0" y="-112" text-anchor="middle" class="dp-sepsis-label">感染相关的异常反应</text><circle cy="-65" r="25" class="dp-human-head"/><path d="M-54 95V-15Q-54-36-26-36H26Q54-36 54-15V95" class="dp-human-body"/><path data-circulation d="M0-15V40M0 5Q-37 5-37 48M0 5Q37 5 37 48M0 40V80" class="dp-circulation"/>'+[-37,0,37].map((x,j)=>'<circle data-organ="'+j+'" cx="'+x+'" cy="'+(j===1?80:50)+'" r="14" class="dp-organ"/>').join('')+
 Array.from({length:5},(_,j)=>'<circle data-infection="'+j+'" r="5" class="dp-infection"/>').join('')+
 '<g transform="translate(102 -30)"><rect x="0" y="0" width="29" height="112" rx="14" class="dp-vessel"/><rect data-pressure x="5" y="10" width="19" height="96" rx="9" class="dp-pressure"/><path d="M48 15V80L41 71M48 80L55 71" class="dp-pressure-arrow"/><text x="25" y="140" text-anchor="middle" class="dp-gauge-label">血压可能下降</text></g><text x="0" y="137" text-anchor="middle" class="dp-organ-label">器官供血可能不足</text></g>'+
 '<g data-context-fluid><rect x="-105" y="-61" width="210" height="160" rx="20" class="dp-card"/><path d="M-75-32h32v42H-75ZM-66-41h15M-59 10v15" class="dp-treatment-icon"/><path d="M-71-10h24V6H-71Z" class="dp-water"/><text x="-25" y="-10" class="dp-context-title">补液</text><text x="0" y="34" text-anchor="middle" class="dp-context-sub">补充循环容量</text>'+levels()+'</g>'+
 '<g data-context-pressor><rect x="-105" y="-61" width="210" height="160" rx="20" class="dp-card"/><rect x="-75" y="-30" width="32" height="42" rx="5" class="dp-vessel"/><path d="M-69-39h20M-59-20V2M-68-9h18" class="dp-treatment-icon"/><text x="-25" y="-10" class="dp-context-title">升压药</text><text x="0" y="34" text-anchor="middle" class="dp-context-sub">帮助维持血压</text>'+levels()+'</g></g>'+
 '<g data-dose-note text-anchor="middle" class="dp-context-sub"><text y="-8">按剂量大小，分为 0—4 档</text><text y="22">0 表示未使用，1—4 档剂量逐渐增加</text></g>';}
 function update(svg,t,reduced){
  const root=svg.querySelector('.dose-primer'),mobile=matchMedia('(max-width:600px)').matches,active=t<0;
  root.style.display=active?'inline':'none';root.setAttribute('aria-hidden',String(!active));
  svg.querySelector('.story-kicker').textContent=active?'':'01 / 复盘情境 · 以补液为例';
  if(!active)return false;
  svg.querySelector('.ib-paper').setAttribute('height',mobile?'520':'480');
  svg.querySelectorAll('[data-ib-panel]').forEach(e=>{e.style.display='none';e.setAttribute('aria-hidden','true');e.querySelectorAll('[data-topic]').forEach(h=>h.setAttribute('tabindex','-1'));});
  svg.querySelector('[data-ib-thread]').style.opacity=0;svg.querySelector('.ib-beats').style.opacity=0;
  const clinic=root.querySelector('[data-clinical-context]');
  clinic.style.opacity=1;
  const treatment=S((t+2.18)/.35),stress=S((t+2.95)/.8);
  const fluid=root.querySelector('[data-context-fluid]'),pressor=root.querySelector('[data-context-pressor]');
  fluid.setAttribute('transform',mobile?'translate(125 '+(365+(1-treatment)*30)+') scale(.75)':'translate('+(185-(1-treatment)*45)+' 248)');
  pressor.setAttribute('transform',mobile?'translate(410 '+(365+(1-treatment)*30)+') scale(.75)':'translate('+(895+(1-treatment)*45)+' 248)');
  fluid.style.opacity=treatment;pressor.style.opacity=treatment;
  root.querySelector('[data-context-patient]').setAttribute('transform',mobile?'translate(250 212) scale(.74)':'translate(520 241)');
  root.querySelectorAll('[data-organ]').forEach(e=>e.style.fill='rgba(212,151,113,'+(.15+.6*stress)+')');
  root.querySelectorAll('[data-infection]').forEach(e=>{const j=+e.dataset.infection,p=reduced?1:S((t+3-j*.07)/.7);e.setAttribute('cx',-85+75*p);e.setAttribute('cy',-65+j*18);e.style.opacity=Math.sin(p*Math.PI)*.8;});
  const pressure=root.querySelector('[data-pressure]'),height=85-52*stress;pressure.setAttribute('height',height);pressure.setAttribute('y',106-height);
  root.querySelectorAll('[data-treatment-link]').forEach(e=>{const j=+e.dataset.treatmentLink;e.setAttribute('d',mobile?(j?'M405 318Q385 273 302 228':'M125 318Q135 270 198 228'):(j?'M785 248H695':'M295 248H425'));const len=e.getTotalLength();e.style.strokeDasharray=len;e.style.strokeDashoffset=len*(reduced?0:1-treatment);e.style.opacity=treatment*.7;});
  const note=root.querySelector('[data-dose-note]');note.setAttribute('transform','translate('+(mobile?270:540)+' '+(mobile?478:427)+')');note.style.opacity=S((t+1.7)/.35);
  root.querySelectorAll('[data-level]').forEach(e=>{const j=+e.dataset.level,q=reduced?1:S((t+1.85-j*.05)/.3);e.style.opacity=q;e.setAttribute('transform','translate(0 '+((1-q)*8)+')');});
  return true;
 }
 return {art,update};
})();
