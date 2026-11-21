'use strict';
window.OpeningStory=(()=>{
 const S=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 const txt=(x,y,v,cl='os-label')=>`<text x="${x}" y="${y}" class="${cl}">${v}</text>`;
 function art(){return `<svg class="opening-story-v2" viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="同一患者的治疗、状态变化与回到治疗前的病历复盘">
 <rect width="1080" height="800" fill="#f5f4ff"/>
 ${txt(46,49,'治疗前 · 血压下降','os-title')}
 <g data-os-patient>
 <ellipse cx="260" cy="345" rx="106" ry="16" fill="#dedcf1"/>
 <path d="M155 330V250Q155 224 184 224H336V330" fill="#ded5f6"/>
 <g data-os-body><path d="M185 333V252Q185 215 222 211H292Q326 217 330 255V333Z" fill="#7661cf"/><path d="M222 211L257 245 292 211" fill="none" stroke="#e9e3fa" stroke-width="8"/><path d="M201 266L212 318M312 264L307 317" stroke="#5d48b3" stroke-width="8" stroke-linecap="round"/>
 <rect x="245" y="191" width="27" height="35" rx="8" fill="#edbe9f"/>
 <g data-os-head><ellipse cx="258" cy="162" rx="44" ry="51" fill="#f2c9ad"/>
 <path d="M214 161Q197 107 250 108Q307 102 303 159L285 135Q256 150 229 131Z" fill="#374b70"/>
 <path data-os-brows d="M230 154l13-4M274 150l13 4" class="os-face"/>
 <path data-os-eyes d="M230 166q7-4 13 0M274 166q7-4 13 0" class="os-face"/>
 <path data-os-mouth d="M246 190Q258 181 270 190" class="os-face"/>
 <ellipse data-os-cheek cx="230" cy="181" rx="8" ry="4" fill="#dc998d" opacity=".5"/>
 <path data-os-sweat d="M308 156Q296 173 308 177Q320 173 308 156" fill="#74b9ce"/>
 </g></g>${txt(217,383,'同一位患者','os-label')}${txt(170,409,'表情与指标变化为示意','os-note')}
 </g>
 <g data-os-vitals><rect x="542" y="102" width="460" height="235" rx="24" class="os-panel"/>${txt(570,141,'治疗前观测','os-sub')}
 ${txt(570,188,'血压','os-label')}<path d="M650 164V216H966" class="os-axis"/><path data-os-pressure d="M665 174L730 176 787 188 845 198 908 207 955 210" class="os-trace"/><circle data-os-dot cx="955" cy="210" r="6" fill="#ef9c5a"/>
 ${txt(570,269,'器官供血','os-label')}<rect x="706" y="251" width="250" height="18" rx="9" fill="#e9e7f3"/><rect data-os-perfusion x="706" y="251" width="115" height="18" rx="9" fill="#a393d3"/>${txt(706,304,'同时查看多项观测','os-note')}
 </g>
 <g data-os-treatment>${window.MechanismAssets.person(627,210,1.1,true)}<rect x="729" y="113" width="270" height="222" rx="22" class="os-panel"/>${txt(754,152,'治疗记录','os-sub')}<g data-os-fluid><rect x="750" y="176" width="225" height="51" rx="12" fill="#fbe5d0"/>${txt(771,208,'补液','os-label')}</g><g data-os-pressor><rect x="750" y="245" width="225" height="51" rx="12" fill="#e1ddfa"/>${txt(771,277,'升压药','os-label')}</g><path data-os-write d="M752 316H950" stroke="#ed9b5b" stroke-width="3" stroke-linecap="round"/> </g>
 <g data-os-follow><rect x="542" y="102" width="460" height="235" rx="24" class="os-panel"/>${txt(570,141,'几小时后 · 新的观测','os-sub')}${txt(570,188,'血压','os-label')}<path d="M650 164V216H966" class="os-axis"/><path data-os-follow-line class="os-trace" d="M665 210L720 202 780 186 842 197 903 185 955 190"/>${txt(570,269,'其他生理指标','os-label')}<rect x="764" y="251" width="192" height="18" rx="9" fill="#e9e7f3"/><rect data-os-other x="764" y="251" width="142" height="18" rx="9" fill="#9b87d3"/>${txt(570,308,'不同指标，可能有不同变化','os-note')}</g>
 <g data-os-file><rect x="542" y="100" width="460" height="242" rx="24" class="os-panel"/>${txt(570,140,'回到治疗前的病历','os-sub')}
 <g data-os-facts><rect x="564" y="161" width="416" height="48" rx="10" fill="#e0f2ee"/>${txt(581,192,'治疗前病情','os-label')}${txt(846,191,'查看依据','os-small')}<rect x="564" y="218" width="416" height="48" rx="10" fill="#e8e2f8"/>${txt(581,249,'既往治疗与反应','os-label')}</g>
 <g data-os-question><rect x="564" y="275" width="416" height="49" rx="10" fill="#fff0df" stroke="#e9a266" stroke-width="2"/>${txt(581,306,'这次剂量为何这样选？','os-label')}<circle cx="951" cy="299" r="16" fill="#d88d43"/>${txt(945,307,'?','os-white')}</g></g>
 <g data-os-dose><rect x="542" y="100" width="460" height="242" rx="24" class="os-panel"/>${txt(570,140,'按剂量划分档位','os-sub')}${['补液','升压药'].map((n,j)=>`<g transform="translate(569 ${193+j*85})">${txt(0,0,n,'os-label')}<path d="M110-9H390" class="os-axis"/>${[0,1,2,3,4].map(k=>`<rect data-os-level="${k}" x="${105+k*58}" y="-29" width="43" height="39" rx="10" fill="${k===j+2?'#edb584':'#e6e0f6'}"/>${txt(120+k*58,-2,k,'os-small')}`).join('')}</g>`).join('')}${txt(570,321,'0 未使用 · 1—4 剂量逐渐增加','os-note')}</g>
 <g data-os-clock><circle cx="451" cy="214" r="34" fill="#fff" stroke="#c7b8e8" stroke-width="2"/><path data-os-hand d="M451 192V214L466 222" stroke="#7d5ac1" stroke-width="4" fill="none" stroke-linecap="round"/></g>
 <g data-os-timeline><path d="M110 452H971" class="os-axis"/>${[150,540,930].map((x,i)=>`<circle cx="${x}" cy="452" r="6" fill="#b7aad8"/>${txt(x-25,437,['治疗前','治疗记录','后续观测'][i],'os-note')}`).join('')}<circle data-os-time cx="150" cy="452" r="11" fill="#ee9c51" stroke="#fff" stroke-width="4"/></g>
 </svg>`}
 function update(svg,kind,t,reduced){
 const q=s=>svg.querySelector(s),op=(s,a)=>{q(s).style.opacity=a},set=(s,n,v)=>q(s).setAttribute(n,v);
 for(const k of ['patient','vitals','treatment','follow','file','dose','clock','timeline'])set(`[data-os-${k}]`,'transform','translate(0 0)');
 const back=kind==='rewind',u=back?4+t:t,changed=S((u-2)/.65)*(1-S((u-3)/.65)),rewind=S((u-3)/.8),review=S((u-3.3)/.65),dose=back?S((t-1.5)/.7):0;
 q('.os-title').textContent=back?(t<1.4?'当时，为什么这样选？':'按剂量划分档位'):u<1?'治疗前 · 血压下降':u<2?'医生记录这次治疗':u<3?'几小时后 · 重新观察患者':'倒回治疗前 · 查看依据与疑点';
 op('[data-os-vitals]',1-S((u-.82)/.3));op('[data-os-treatment]',S((u-.9)/.25)*(1-S((u-1.9)/.25)));
 op('[data-os-fluid]',S((u-1)/.3));op('[data-os-pressor]',S((u-1.35)/.3));set('[data-os-write]','stroke-dasharray',200);set('[data-os-write]','stroke-dashoffset',200*(1-S((u-1.55)/.35)));
 op('[data-os-follow]',S((u-1.9)/.25)*(1-S((u-3.12)/.45)));set('[data-os-follow]','transform',`translate(${rewind*110} 0) scale(${1-.08*rewind})`);
 op('[data-os-file]',review*(1-dose));op('[data-os-facts]',S((u-3.35)/.3));op('[data-os-question]',S((u-3.6)/.35));set('[data-os-file]','transform',`translate(0 ${18*(1-review)})`);
 op('[data-os-dose]',dose);svg.querySelectorAll('[data-os-level]').forEach(e=>{e.style.opacity=S((t-1.5-Number(e.dataset.osLevel)*.12)/.3)});
 set('[data-os-head]','transform',`rotate(${6*(1-changed)} 258 205) translate(0 ${4*(1-changed)})`);
 set('[data-os-mouth]','d',`M246 190Q258 ${181+9*changed} 270 190`);set('[data-os-eyes]','d',`M230 166q7 ${-4+3*changed} 13 0M274 166q7 ${-4+3*changed} 13 0`);op('[data-os-sweat]',1-changed*.9);
 set('[data-os-body]','transform',`translate(0 ${3*(1-changed)+(reduced?0:Math.sin(t*4)*1.2)})`);
 set('[data-os-follow-line]','stroke-dasharray','335');set('[data-os-follow-line]','stroke-dashoffset',335*(1-S((u-2)/.8)));
 set('[data-os-other]','width',142-48*changed);set('[data-os-perfusion]','width',162-47*S(u/.8));set('[data-os-pressure]','stroke-dasharray','330');set('[data-os-pressure]','stroke-dashoffset',330*(1-S(u/.8)));
 op('[data-os-clock]',S((u-1.6)/.25)*(1-S((u-3.85)/.15)));set('[data-os-hand]','transform',`rotate(${(u<3?S((u-1.6)/1.4):1-rewind)*640} 451 214)`);
 const x=u<1?150:u<2?150+390*S(u-1):u<3?540+390*S(u-2):930-780*rewind;set('[data-os-time]','cx',x);
 const phone=matchMedia('(max-width:600px)').matches;svg.setAttribute('viewBox',phone?'0 0 540 660':'0 0 1080 480');
 if(phone){set('[data-os-patient]','transform','translate(98 -8) scale(.68)');for(const k of ['vitals','treatment','follow','file','dose'])set(`[data-os-${k}]`,'transform','translate(-504 232)');set('[data-os-clock]','transform','translate(-193 88)');set('[data-os-timeline]','transform','translate(0 380) scale(.5)');q('.os-title').setAttribute('font-size','26');}
 }
 return {art,update};
})();
