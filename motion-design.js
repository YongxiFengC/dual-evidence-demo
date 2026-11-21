'use strict';
/* Original vector motion design. Every animation uses the film clock, including
   seek/replay/pause. These are schematic illustrations, never case measurements. */
window.MotionDesign=(()=>{
const clamp=n=>Math.max(0,Math.min(1,n)),smooth=n=>{n=clamp(n);return n*n*(3-2*n);};
const layer=(kind,html,props={})=>'<g class="mg-layer" data-mg="'+kind+'" '+Object.entries(props).map(([k,v])=>'data-'+k+'="'+v+'"').join(' ')+'>'+html+'</g>';
const ring=(x,y,r,tone='blue')=>layer('orbit','<circle r="'+r+'" class="mg-orbit '+tone+'"/><circle cx="'+r+'" r="5" class="mg-dot '+tone+'"/><circle cx="'+(-r)+'" r="3" class="mg-dot '+tone+'"/>',{x,y});
const sheet=(tone='blue')=>'<g class="mg-sheet '+tone+'"><rect x="-17" y="-23" width="34" height="46" rx="6"/><path d="M-9-10H9M-9-2H4M-9 7H9"/><circle cx="9" cy="16" r="2"/></g>';
const icon=(type,x,y,tone='blue',scale=1)=>'<g transform="translate('+x+' '+y+') scale('+scale+')" class="mg-icon '+tone+'"><circle r="24"/>'+(type==='heart'?'<path d="M0 11C-27-4-10-23 0-10C10-23 27-4 0 11Z"/>':type==='pulse'?'<path d="M-15 0H-8L-3-10 3 12 8-3 12 0H16"/>':type==='lens'?'<circle cx="-3" cy="-3" r="9"/><path d="M4 4L13 13"/>':'<path d="M-10-14H5L11-8V14H-10ZM4-14V-7H11M-5 0H5M-5 6H5"/>')+'</g>';
const transfer=(from,to,at,dur=1.8,tone='blue',index=0)=>layer('transfer',sheet(tone),{x:from[0],y:from[1],tx:to[0],ty:to[1],at,dur,index});
const float=(html,x,y,at=0,phase=0)=>layer('float',html,{x,y,at,phase});
function scene(i){
let back='<g class="mg-environment" aria-hidden="true"><ellipse cx="540" cy="424" rx="455" ry="27" class="mg-ground"/><path d="M33 388H1047M63 400H1017" class="mg-floor"/>';
back+='<circle cx="'+([355,535,675,574,477,678,364,711][i])+'" cy="229" r="211" class="mg-atmosphere"/>';
back+='<path d="M35 87V55H67M1013 55H1045V87M35 368V400H67M1013 400H1045V368" class="mg-frame"/></g>';
let front='';
if(i===0){
 // The lens moves from the common bars to the rare bar; its magnified glyph
 // is illustrative, not a probability estimate.
front+=layer('lens','<ellipse cx="9" cy="50" rx="54" ry="9" class="mg-lens-shadow"/><path d="M32 30L65 63" class="mg-lens-handle"/><circle r="47" class="mg-lens-glass"/><circle r="40" class="mg-lens-rim"/><rect x="-12" y="8" width="24" height="12" rx="4" class="mg-rare-bar"/><path d="M-25-19Q-17-32-3-32" class="mg-lens-shine"/>',{at:.6});
front+=float(icon('heart',0,0,'teal',.8),955,300,4.3,1);
front+=float(icon('pulse',0,0,'blue',.75),583,146,4.5,3);
back+=layer('pulse','<circle r="72" class="mg-pulse orange"/>',{x:413,y:261,at:1.6,end:4.3});
}
if(i===1){
back+=ring(535,82,59);
front+=float(icon('record',0,0,'blue',.85),125,195,1.1);
front+=float(icon('heart',0,0,'teal',.85),947,195,1.8,2);
front+=layer('bracket','<path d="M725 296V289H814V296M725 353V360H814V353" class="mg-support-bracket"/>',{at:3.1});
// Two independent visual witnesses: history at left, patient factors at right.
back+=float('<g class="mg-people"><circle cx="-24" cy="-9" r="7"/><circle cy="-17" r="9"/><circle cx="24" cy="-9" r="7"/><path d="M-36 15V7Q-24-6-12 7V15M-14 15V0Q0-16 14 0V15M12 15V7Q24-6 36 7V15"/></g>',278,185,.4);
}
if(i===2){
back+=ring(676,230,112);back+=ring(676,230,128,'teal');
for(let j=0;j<9;j++)front+=transfer([170+(j%3)*105,123+Math.floor(j/3)*105],[676,230],1.4+j*.17,.8,j%2?'teal':'blue',j);
front+=float(icon('record',0,0,'teal',.7),994,135,3.2,1);
front+=layer('emerge',sheet('teal'),{x:929,y:324,at:4.5});
}
if(i===3){
back+=ring(573,196,71,'teal');
for(let j=0;j<6;j++)front+=layer('compress','<rect x="-6" y="-6" width="12" height="12" rx="4" class="mg-dot '+(j%2?'teal':'blue')+'"/>',{x:264,y:151+j*18,tx:573,ty:196,at:1.2+j*.065,dur:.6,index:j});
front+=float(icon('pulse',0,0,'blue',.65),714,49,2.1);
front+=float(icon('record',0,0,'teal',.65),714,263,2.8,2);
// A visual feedback loop denotes joint optimization, not recurrent inference.
back+=layer('bracket','<path d="M868 423Q868 453 573 453T155 453V310" class="mg-feedback" marker-end="url(#arrow-blue)"/>',{at:3.8});
}
if(i===4){
back+=ring(477,235,133);
front+=layer('bracket','<g class="mg-grid"><path d="M706 192H971M706 245H971M706 298H971M759 140V350M812 140V350M865 140V350M918 140V350"/></g>',{at:1.9});
front+=layer('scan','<path d="M0 143V349" class="mg-scan"/><rect x="-12" y="143" width="24" height="206" class="mg-scan-light"/>',{at:2.3,dur:3.7});
[[969,160,'blue'],[969,266,'teal'],[969,336,'orange']].forEach(([x,y,tone],j)=>{front+=layer('pulse','<circle r="10" class="mg-pulse '+tone+'"/><circle r="4" class="mg-dot '+tone+'"/>',{x,y,at:4.7+j*.5});});
front+=float(icon('pulse',0,0,'blue',.72),1017,84,2.4,1);
}
if(i===5){
back+=ring(678,237,110,'teal');
front+=layer('alternation','<g class="mg-param blue"><rect x="-55" y="-15" width="45" height="30" rx="12"/><text x="-32" y="6">ψ</text></g><path d="M-3 0H9" class="mg-param-link"/><g class="mg-param teal"><rect x="16" y="-15" width="45" height="30" rx="12"/><text x="38" y="6">ξ</text></g>',{x:674,y:352,at:2.2});
for(let j=0;j<3;j++)front+=transfer([500,174+j*61],[678,237],2.3+j*.75,1.1,'teal',j);
front+=layer('bracket','<path d="M858 206V196H1000V206M858 271V282H1000V271" class="mg-support-bracket"/>',{at:4.2});
front+=float(icon('record',0,0,'blue',.62),54,72,.2);
}
if(i===6){
back+=ring(100,207,70,'teal');
back+=layer('pulse','<circle r="117" class="mg-pulse blue"/>',{x:364,y:212,at:1.2});
front+=float(icon('pulse',0,0,'teal',.58),144,146,.2,1);
front+=layer('bracket','<path d="M680 362V369H801V362" class="mg-support-bracket"/>',{at:3.2});
front+=layer('arrival','<rect x="-12" y="-9" width="24" height="18" rx="5" class="mg-rare-bar"/>',{at:4.8});
}
if(i===7){
back+=ring(711,237,126,'teal');
for(let j=0;j<4;j++)front+=transfer([162+(j%2)*237,137+Math.floor(j/2)*177],[712,246],2+j*.47,1.5,j===0||j===3?'blue':'teal',j);
front+=layer('bracket','<path d="M649 228l4 4 8-9M649 250l4 4 8-9M649 272l4 4 8-9" class="mg-package-ticks"/>',{at:4.4});
front+=float(icon('lens',0,0,'teal',.8),982,154,4.2,2);
front+=layer('bracket','<path d="M868 329Q931 351 997 329" class="mg-human-arc"/>',{at:4});
}
return {back,front:'<g aria-hidden="true" class="mg-foreground">'+front+'</g>'};
}
function update(svg,t,reduced){
svg.querySelectorAll('[data-mg]').forEach(e=>{
const d=e.dataset,kind=d.mg,x=+(d.x||0),y=+(d.y||0),at=+(d.at||0),u=t-at,q=smooth(u/.65);
let opacity=q,transform='translate('+x+' '+y+')';
if(kind==='orbit')transform+=' rotate('+(reduced?0:t*13)+')';
else if(kind==='float')transform+=' translate(0 '+(reduced?0:Math.sin(t*1.6+(+d.phase||0))*5)+')';
else if(kind==='lens'){
const v=smooth((t-.6)/1.6);transform='translate('+(248+165*v)+' '+(217+44*v)+') rotate('+(-12+12*v)+')';opacity=q*(1-smooth((t-4.1)/.5));
}else if(kind==='pulse'){
const v=reduced?0:((Math.max(0,u)%2)/2);transform+=' scale('+(1+v*.22)+')';opacity=q*(1-v)*.7;if(d.end)opacity*=1-smooth((t-(+d.end))/.5);
}else if(kind==='transfer'||kind==='compress'){
const v=smooth(u/(+d.dur)),bend=Math.sin(v*Math.PI)*(-24-(+d.index||0)*3);transform='translate('+(x+((+d.tx)-x)*v)+' '+(y+((+d.ty)-y)*v+bend)+') scale('+(1-v*.64)+') rotate('+(Math.sin(v*Math.PI)*15)+')';opacity=q*(1-smooth((v-.82)/.18));if(reduced)opacity=0;
}else if(kind==='scan'){
transform='translate('+(706+263*smooth(u/(+d.dur)))+' 0)';opacity=q*(1-smooth((u-4.1)/.7));if(reduced)opacity=0;
}else if(kind==='alternation'){
const active=reduced?0:Math.floor(Math.max(0,u)/.9)%2;e.querySelectorAll('.mg-param').forEach((p,j)=>p.classList.toggle('active',j===active));
}else if(kind==='arrival'){
const v=smooth(u/2);transform='translate('+(485+523*v)+' '+(404-194*smooth(v*2))+')';opacity=q*(1-smooth((u-2)/.5));if(reduced)opacity=0;
}else if(kind==='emerge')transform+=' translate(0 '+((1-q)*-60)+') rotate('+((1-q)*-15)+')';
e.setAttribute('transform',transform);e.style.opacity=opacity;
});
}
return {scene,update};
})();
