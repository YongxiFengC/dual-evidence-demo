'use strict';
/* Semantic attention follows the same seekable clock as narration and drawing.
   Coordinates identify diagram regions, not clinical quantities. */
window.CueFlow=(()=>{
 const boxes={
  2:[[40,62,405,330],[125,83,307,300],[561,105,225,255],[831,146,209,218]],
  3:[[41,107,212,195],[308,118,323,147],[727,25,286,178],[726,205,288,267],[307,25,708,446]],
  4:[[39,112,550,248],[655,62,358,343],[655,62,358,343],[655,62,358,343],[655,62,358,343]],
  5:[[28,74,210,281],[260,112,260,230],[570,143,216,229],[570,143,216,229],[806,179,263,167]],
  6:[[42,105,451,213],[603,31,381,365],[244,357,247,84],[972,173,72,74]],
  7:[[42,49,477,176],[42,226,477,175],[601,126,214,230],[863,121,145,239],[593,382,414,51]]
 };
 const S=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
 function update(svg,index,cue,reduced,autoPan=false){
  if(index<2||svg.classList.contains('mechanism-story-board'))return;
  let rect=svg.querySelector('.cue-focus');
  if(!rect){rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('class','cue-focus');rect.setAttribute('rx','20');rect.setAttribute('aria-hidden','true');svg.append(rect);}
  const list=boxes[index],target=list[Math.min(cue.n,list.length-1)],previous=list[Math.max(0,cue.n-1)];
  const p=(cue.visual-cue.from)/(cue.to-cue.from),blend=reduced?1:S(p/.22);
  ['x','y','width','height'].forEach((key,j)=>rect.setAttribute(key,previous[j]+(target[j]-previous[j])*blend));
  // On narrow screens, follow the component being explained, not a generic
  // elapsed-time pan that can leave the named decoder outside the viewport.
  if(autoPan){
   const view=b=>{const w=b[2]>650?1080:580;return [Math.max(0,Math.min(1080-w,b[0]+b[2]/2-w/2)),w];};
   const a=view(previous),b=view(target),x=a[0]+(b[0]-a[0])*blend,w=a[1]+(b[1]-a[1])*blend;
   svg.setAttribute('viewBox',x+' 0 '+w+' 480');
  }
  rect.style.opacity=cue.n===0?S(p/.2)*.7:.7;
  if(index===2){
   svg.querySelectorAll('.timeline-dot').forEach((dot,j)=>{
    const active=cue.n===1&&(j%5)<=Math.floor(p*5);
    dot.classList.toggle('cue-record-active',active);
   });
  }
  if(index===4){
   const active=cue.n>=1&&cue.n<=3?'ABC'[cue.n-1]:null;
   svg.querySelector('.card.orange .card-title').textContent=active?'候选剂量 '+active:'候选剂量';
   svg.querySelectorAll('[data-candidate]').forEach(path=>{
    path.style.opacity=!active||path.dataset.candidate===active?1:.24;
    path.style.strokeWidth=path.dataset.candidate===active?'4.5':'';
   });
   svg.querySelectorAll('.future-chart text').forEach(label=>{
    const j='ABC'.indexOf(label.textContent);
    if(label.textContent.length===1&&j>=0)label.style.opacity=cue.n>=j+1?'1':'0';
   });
  }
  if(index===5){
   const title=svg.querySelector('.range-learner .card-title'),sub=svg.querySelector('.range-learner .card-sub');
   title.textContent=cue.n===2?'更新条件 ψ':cue.n===3?'更新范围 ξ':'条件 ↔ 范围';
   sub.textContent=cue.n===2?'范围固定':cue.n===3?'条件固定':'共享映射';
   svg.querySelectorAll('.mg-param').forEach((p,j)=>p.classList.toggle('active',cue.n===2?j===0:cue.n===3?j===1:false));
  }
 }
 return {update};
})();
