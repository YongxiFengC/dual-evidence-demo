'use strict';
/* Each schematic historical window contributes exactly one token. The same
   tokens form the histogram; counts are illustrative, not study estimates. */
window.CrowdFrequency=(()=>{
 const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
 const counts=[12,20,28,16,4],colors=['#aac6dc','#80aaca','#548daf','#39728e','#8fabc0'];
 const records=[];
 counts.forEach((count,level)=>{for(let slot=0;slot<count;slot++){const i=records.length;records.push({i,pos:(i*37)%80,level,slot});}});
 const text=(x,y,s,c='cf-note')=>`<text x="${x}" y="${y}" class="${c}">${s}</text>`;
 function art(){
 return '<g data-ib-panel="1" class="crowd-frequency">'+
 '<g class="cf-people">'+records.map(r=>`<g data-cf-person="${r.i}"><circle cy="-9" r="6"/><path d="M-10 13V3Q-10-3 0-3Q10-3 10 3V13Z"/></g>`).join('')+'</g>'+
 '<g class="cf-lanes">'+counts.map((n,k)=>`<g data-cf-lane="${k}"><rect class="cf-lane" width="74" height="205" rx="18"/>${text(37,230,String(k),'cf-level')}</g>`).join('')+'</g>'+
 '<g class="cf-tokens">'+records.map(r=>`<rect data-cf-token="${r.i}" width="12" height="8" rx="3" fill="${colors[r.level]}"/>`).join('')+'</g>'+
 '<g data-cf-source>'+text(540,427,'每个标记 = 一次历史补液档位','cf-caption')+'</g>'+
 '<g data-cf-axis>'+text(540,427,'补液档位 · 同一批历史记录的选择频率','cf-caption')+'</g>'+
 '<g data-cf-common>'+text(0,0,'常见','cf-caption')+'</g>'+
 '<g data-cf-focus><ellipse rx="45" ry="19" class="cf-focus"/><path d="M0-12L10 0 0 12-10 0Z" class="cf-current"/><path d="M0-54V-22M-5-28L0-22 5-28" class="cf-arrow"/>'+text(0,-65,'记录的补液档位','cf-current-label')+'</g>'+
 '<g data-cf-question>'+text(0,0,'少见 = 有错？','cf-question')+'</g>'+
 '<g data-cf-stop><path d="M-56 9L63-17" class="cf-strike"/>'+text(0,48,'先看看这位患者','cf-stop')+'</g>'+
 '<g data-cf-badge>'+text(0,0,'人群与数量均为机制示意','cf-small')+'</g></g>';
 }
 function update(svg,t,reduced){
 const root=svg.querySelector('.crowd-frequency');if(!root)return;
 const mobile=matchMedia('(max-width:600px)').matches;
 const startX=mobile?52:112,startY=mobile?151:155,cols=mobile?10:16,gapX=mobile?48:56,gapY=mobile?45:49;
 const base=mobile?480:373,step=mobile?86:120,first=mobile?98:300;
 const morph=ease((t-2.36)/.58),lane=ease((t-2.46)/.45);
 root.querySelectorAll('[data-cf-person]').forEach(e=>{const r=records[+e.dataset.cfPerson],row=Math.floor(r.pos/cols),q=ease((t-2-row*.018)/.16);e.setAttribute('transform',`translate(${startX+r.pos%cols*gapX} ${startY+row*gapY})`);e.style.opacity=q*(1-morph*.96);});
 root.querySelectorAll('[data-cf-token]').forEach(e=>{const r=records[+e.dataset.cfToken],row=Math.floor(r.pos/cols),x=startX+r.pos%cols*gapX-6,y=startY+row*gapY+19,tx=first+r.level*step+(r.slot%4-1.5)*15-6,ty=base-Math.floor(r.slot/4)*22;
 const q=reduced?(t>=2.65?1:0):ease((t-2.34-r.level*.045-Math.floor(r.slot/4)*.006)/.30);
 e.setAttribute('x',x+(tx-x)*q);e.setAttribute('y',y+(ty-y)*q-(reduced?0:Math.sin(q*Math.PI)*(18+r.level*6)));e.style.opacity=ease((t-2.12-row*.015)/.13);});
 root.querySelectorAll('[data-cf-lane]').forEach(e=>{const k=+e.dataset.cfLane;e.setAttribute('transform',`translate(${first+k*step-37} ${base-183})`);e.querySelector('text').setAttribute('y','212');e.style.opacity=lane;});
 const place=(sel,x,y,opacity=1)=>{const e=root.querySelector(sel);e.setAttribute('transform',`translate(${x} ${y})`);e.style.opacity=opacity;return e;};
 // Source and resulting chart share objects, not separate illustrative counts.
 place('[data-cf-source]',mobile?-270:0,mobile?145:0,lane<.5?1:0);
 place('[data-cf-axis]',mobile?-270:0,mobile?126:0,lane>=.5?1:0);
 place('[data-cf-common]',first+2*step,base-161,ease((t-2.85)/.12));
 const focus=ease((t-3)/.22),fx=first+4*step;
 place('[data-cf-focus]',fx,base+4,focus);
 root.querySelector('.cf-current').style.opacity=0; // The persistent story token arrives here.
 const questionX=mobile?270:905,questionY=mobile?610:165;
 place('[data-cf-question]',questionX,questionY,ease((t-3.12)/.22)*(1-.55*ease((t-3.62)/.2)));
 place('[data-cf-stop]',questionX,questionY,ease((t-3.62)/.22));
 place('[data-cf-badge]',mobile?270:540,mobile?120:119,1);
 root.dataset.phase=t<2.36?'population':t<2.96?'aggregation':'distribution';
 }
 return {art,update};
})();
