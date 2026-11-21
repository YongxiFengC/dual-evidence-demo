'use strict';
const D=window.RESEARCH_DATA,$=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const S={case:'PHYS-11',rule:'MR1',view:'clinical',phase:0,history:null,cell:null,comparator:null,endpoint:'MAP',hour:0,packet:false,source:'range',micro:'PHYS-14',layer:'full',tour:false,tourIndex:0};
let tourTimer=null,scopeTimer=null;
const RULES={MR1:{name:'补液启动',axis:'补液 F',fluid:true},MR2:{name:'升压药启动',axis:'升压药 V',fluid:false},MR3:{name:'补液调整',axis:'补液 F',fluid:true},MR4:{name:'升压药调整',axis:'升压药 V',fluid:false}};
const ENDPOINTS={MAP:{name:'平均动脉压',unit:'mmHg',digits:1},lactate:{name:'乳酸',unit:'mmol/L',digits:2},creatinine:{name:'肌酐',unit:'mg/dL',digits:2}};
const PHASES=[['患者 / HISTORY','点击时间点查看决策前记录。模型参考对应 t = 0。'],['AI / REFERENCE','同一动作空间，两种参考。点击格子检查支持与范围。'],['AI / COMPARISON','固定另一治疗分量，比较已有的动作条件预测。'],['医生 / REVIEW','点击证据标签，追溯这个问题依据的数值。']];
const c=()=>D.cases.find(x=>x.id===S.case),r=()=>c().rules[S.rule];
const action=a=>a===null?'无可用比较':`F${Math.floor(a/5)} · V${a%5}`;
const num=(v,d=1)=>v===null||v===undefined?'未记录':Number(v).toFixed(d);
const prob=v=>v>0&&v<.000001?'<0.000001':v<.001?v.toFixed(6):v.toFixed(3);
const sign=(v,d=2)=>`${v<0?'−':'+'}${Math.abs(v).toFixed(d)}`;
const format=n=>n.toLocaleString('en-US');
const active=(selector,key,value)=>$$(selector).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[key]===String(value))));
const path=pts=>pts.map((p,i)=>`${i?'L':'M'}${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' ');
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('visible');setTimeout(()=>$('#toast').classList.remove('visible'),2800);}
function initializeCase(alias){S.case=alias;S.rule=alias==='PHYS-11'?'MR1':alias==='PHYS-02'?'MR2':'MR4';S.history=c().history.length-1;S.cell=c().action;setComparator();S.endpoint='MAP';S.hour=0;S.phase=0;S.packet=false;S.source='range';}
function setComparator(){const rule=r();S.comparator=rule.comparators.includes(rule.canonicalComparator)?rule.canonicalComparator:rule.comparators[0]??null;}
function setPhase(phase){S.phase=phase;S.packet=phase===3;renderPhase();if(S.packet)renderPacket();}
function renderPhase(){
 active('[data-phase]','phase',S.phase);$('#guide-label').textContent=PHASES[S.phase][0];$('#guide-text').textContent=PHASES[S.phase][1];
 ['patient-panel','reference-panel','trajectory-panel'].forEach((id,i)=>$('#'+id).classList.toggle('focus-panel',i===S.phase));
 $('#packet').hidden=!S.packet;$('#open-packet').textContent=S.packet?'收起复盘证据卡 ↙':'展开复盘证据卡 ↗';
 $('#announcer').textContent=PHASES[S.phase][1];
}
function renderHistory(){
 const C=c(),hist=C.history,H=hist[S.history];$('#case-alias').textContent=C.id;
 const valid=hist.map((h,i)=>({...h,i})).filter(h=>h.map!==null),xmin=hist[0].hour,xspan=-xmin||4;
 const low=Math.min(...valid.map(h=>h.map))-6,high=Math.max(...valid.map(h=>h.map))+6;
 const xy=h=>[18+(h.hour-xmin)/xspan*174,76-(h.map-low)/(high-low||1)*56];
 let segments=[],seg=[];hist.forEach(h=>{if(h.map===null){if(seg.length)segments.push(seg);seg=[];}else seg.push(xy(h));});if(seg.length)segments.push(seg);
 $('#history-chart').innerHTML=`<div class="chart-top"><span>MAP 最低值</span><span>mmHg</span></div><svg viewBox="0 0 214 104" role="img" aria-label="决策前MAP记录，缺失点不插值"><line x1="15" y1="80" x2="198" y2="80" stroke="#dce4e0"/>${segments.filter(s=>s.length>1).map(s=>`<path d="${path(s)}" fill="none" stroke="#799f94" stroke-width="2"/>`).join('')}${valid.map(h=>{const [x,y]=xy(h);return `<circle cx="${x}" cy="${y}" r="${h.i===S.history?5:3}" fill="${h.i===S.history?'#df8659':'#2a7667'}"/><text x="${x}" y="${y-10}" text-anchor="middle">${num(h.map,0)}</text>`;}).join('')}<text x="16" y="100">${xmin}h</text><text x="193" y="100" text-anchor="end">0h</text></svg>`;
 $('#history-times').innerHTML=hist.map((h,i)=>`<button data-history="${i}" aria-pressed="${i===S.history}" aria-label="浏览${h.hour}小时的历史片段">${h.hour===0?'0h':h.hour}</button>`).join('');
 $('#history-label').textContent=H.hour===0?'决策前 · t = 0':`历史片段 · ${H.hour}h`;
 $('#history-values').innerHTML=[['MAP 最低值',H.map,'mmHg',1],['24h 乳酸峰值',H.lactate,'mmol/L',1],['6h 累计尿量',H.urine,'mL',0],['前 4h 补液',H.fluid,'mL',0]].map(([n,v,u,d])=>`<div><span>${n}</span><strong>${num(v,d)}<small>${v===null?'':u}</small></strong></div>`).join('');
 $('#recorded-action').textContent=action(C.action);$('#recorded-scope').textContent=`${C.typical==='typical'?'Practice 常见':'Practice 罕见'} · p = ${prob(C.probabilities[C.action])}`;
}
function renderMap(){
 const C=c(),R=r(),meta=RULES[S.rule];active('[data-view]','view',S.view);
 $('#map-mode-label').textContent=S.view==='practice'?'色深：本病例内相对概率':'描边：可进行同轴比较';
 const max=Math.max(...C.probabilities);let html='<span></span>'+[0,1,2,3,4].map(v=>`<span class="grid-label">V${v}</span>`).join('');
 for(let f=0;f<5;f++){html+=`<span class="grid-label">F${f}</span>`;for(let v=0;v<5;v++){
  const a=f*5+v,inRange=R.actions.full.includes(a),allowed=R.comparators.includes(a),p=C.probabilities[a];
  const classes=['action-cell',inRange?'in-range':'',allowed?'can-compare':'',C.support[a]?'':'unsupported',a===C.action?'documented':'',a===S.comparator?'comparator':'',a===S.cell?'inspected':'',S.view==='practice'?'prob-mode':''].filter(Boolean).join(' ');
  const bg=S.view==='practice'?`style="--heat:${.05+.8*(p/max)}"`:'';
  html+=`<button class="${classes}" ${bg} data-action="${a}" aria-pressed="${a===S.cell}" aria-label="F${f} V${v}，概率${prob(p)}，${C.support[a]?'有支持':'支持不足'}，${inRange?'在学习范围内':'不在范围内'}${allowed?'，可切换比较':''}"><span class="cell-main">${S.view==='practice'?prob(p):inRange?'●':'·'}</span>${a===C.action?'<small>记录</small>':a===S.comparator?'<small>比较</small>':allowed?'<small>可比较</small>':''}</button>`;
 }}$('#action-map').innerHTML=html;
 const a=S.cell;let reason='';
 if(a===C.action)reason='这是记录动作；从描边格子选择同轴替代动作。';
 else if(R.comparators.includes(a))reason='已选择：两动作有支持、同轴且位于 Full 导出范围内。';
 else if(!C.support[C.action])reason='记录动作支持不足，当前不开放直接比较。';
 else if(!C.support[a])reason='该动作支持不足；仅显示概率，不开放直接比较。';
 else if(!R.actions.full.includes(a))reason='不在当前 Full 导出范围内，未切换比较。';
 else reason='改变了另一治疗分量；不是当前规则的同轴比较。';
 $('#cell-detail').innerHTML=`<div><b>${action(a)}</b><span>p = ${prob(C.probabilities[a])}</span></div><p>${reason}</p>`;
 const docLevel=meta.fluid?Math.floor(C.action/5):C.action%5,cmpLevel=S.comparator===null?null:meta.fluid?Math.floor(S.comparator/5):S.comparator%5;
 $('#range-title').textContent=`${meta.axis} · 导出档位 ${setText(R.levels.full)}`;
 $('#range-axis').innerHTML=[0,1,2,3,4].map(v=>`<div class="range-tick ${R.levels.full.includes(v)?'on':''} ${v===docLevel?'doc':''}"><b>${v}</b><small>${v===docLevel?'记录':v===cmpLevel?'比较':''}</small></div>`).join('');
}
function setText(v){return v.length?`{${v.join(', ')}}`:'∅';}
function delta(endpoint){const C=c();return C.predictions[S.comparator][endpoint][S.hour]-C.predictions[C.action][endpoint][S.hour];}
function renderTrajectory(){
 active('[data-endpoint]','endpoint',S.endpoint);const C=c(),R=r();
 if(S.comparator===null){$('#trajectory-content').innerHTML=`<div class="no-comparison"><div class="empty-orbit"><span>∅</span></div><h3>当前没有可用的动作对</h3><p>${!C.support[C.action]?'记录动作缺少精确支持。':R.levels.full.length?'当前范围没有可用的同轴替代动作。':'当前规则未导出非空范围。'}</p><span>保留证据缺口，不生成替代曲线</span></div>`;$('#tradeoff-chips').innerHTML='';$('#comparison-contract').textContent='当前显示证据可用性；缺少直接比较不是“治疗正确”的判断。';return;}
 const meta=ENDPOINTS[S.endpoint],doc=C.predictions[C.action][S.endpoint],cmp=C.predictions[S.comparator][S.endpoint];
 const min=Math.min(...doc,...cmp),max=Math.max(...doc,...cmp),padding=Math.max((max-min)*.2,.05),lo=Math.max(0,min-padding),hi=max+padding;
 const x=h=>38+(h-4)/20*266,y=v=>162-(v-lo)/(hi-lo)*125;
 const lines=[0,1,2,3].map(i=>{const v=lo+(hi-lo)*i/3;return `<line x1="38" y1="${y(v)}" x2="304" y2="${y(v)}" stroke="#e7ece8"/><text x="31" y="${y(v)+3}" text-anchor="end">${v.toFixed(meta.digits)}</text>`;}).join('');
 const chart=`<svg viewBox="0 0 326 194" class="trajectory-svg" role="img" aria-label="${meta.name}预测，记录动作${doc.map(v=>num(v,2)).join('、')}，比较动作${cmp.map(v=>num(v,2)).join('、')}，时间4、8、12、24小时">${lines}<line x1="${x(D.hours[S.hour])}" y1="29" x2="${x(D.hours[S.hour])}" y2="166" stroke="#bbcbc2" stroke-dasharray="3 4"/><path d="${path(doc.map((v,i)=>[x(D.hours[i]),y(v)]))}" stroke="#d28c68" fill="none" stroke-width="2" stroke-dasharray="5 4"/><path d="${path(cmp.map((v,i)=>[x(D.hours[i]),y(v)]))}" stroke="#217764" fill="none" stroke-width="2.5"/>${[doc,cmp].map((arr,j)=>arr.map((v,i)=>`<circle cx="${x(D.hours[i])}" cy="${y(v)}" r="${i===S.hour?4:2.5}" fill="${j?'#217764':'#d28c68'}"/>`).join('')).join('')}${D.hours.map(h=>`<text x="${x(h)}" y="186" text-anchor="middle">${h}h</text>`).join('')}</svg>`;
 const canonical=S.comparator===R.canonicalComparator;
 $('#trajectory-content').innerHTML=`<div class="trajectory-caption"><span>${meta.name} <small>${meta.unit}</small></span><b class="${canonical?'':'manual'}">${canonical?'原比较':'手动比较'}</b></div><div class="line-legend"><span><i class="dashed"></i>记录 ${action(C.action)}</span><span><i></i>比较 ${action(S.comparator)}</span></div>${chart}<div class="horizon-controls" role="group" aria-label="查看预测时间点">${D.hours.map((h,i)=>`<button data-hour="${i}" aria-pressed="${i===S.hour}">${h}h</button>`).join('')}</div><div class="delta-summary"><span>比较 − 记录<br><small>${D.hours[S.hour]}h · ${meta.name}</small></span><strong>${sign(delta(S.endpoint))}<small>${meta.unit}</small></strong></div>`;
 $('#tradeoff-chips').innerHTML=Object.entries(ENDPOINTS).map(([key,m])=>`<button data-endpoint="${key}" aria-pressed="${key===S.endpoint}"><span>${m.name}</span><b>${sign(delta(key))}</b></button>`).join('');
 $('#comparison-contract').textContent=canonical?'当前为原路由比较。曲线展示一个 GRU 的预测，不是实际观察到的治疗效果。':'手动比较仅更新缓存轨迹；不重算路由，不把原 Priority 判断转移给此动作。';
}
function sourceText(source){const C=c(),R=r();switch(source){
 case 'practice':return `<b>Practice / 记录动作的模型概率</b><p>${action(C.action)}：p = ${prob(C.probabilities[C.action])}；开发集固定的罕见阈值 ${D.cutoff.toFixed(6)}。该输出描述行为频率，不是治疗正确率。</p>`;
 case 'factor':return `<b>Clinical factors / 固定因素摘要</b><p>C↑ = ${R.factors[0].toFixed(3)}，C↓ = ${R.factors[1].toFixed(3)}。这些是从患者数据计算的固定因素指数，不是 learned gate q，也不是因果贡献度。</p>`;
 case 'range':return `<b>Learned range / 实际导出集合</b><p>${RULES[S.rule].name}：${setText(R.levels.full)}。该集合按治疗坐标投影展示；比较动作另需满足固定 companion 与精确支持。</p>`;
 default:const e=source==='trajectory'?'MAP':source,m=ENDPOINTS[e];return S.comparator===null?'<b>Trajectory / 不可用</b><p>没有满足条件的同轴动作对，因此不展示数值差异。</p>':`<b>Trajectory / ${m.name} · ${D.hours[S.hour]}h</b><p>${action(S.comparator)} − ${action(C.action)}：${sign(delta(e))} ${m.unit}。来源为冻结单 GRU 的已计算动作条件预测。</p>`;
}}
function renderPacket(){
 const C=c(),R=r(),canonical=S.comparator!==null&&S.comparator===R.canonicalComparator;
 $('#packet-title').textContent=`${C.id} · ${RULES[S.rule].name}`;
 let question=C.id==='PHYS-11'&&S.rule==='MR1'?'当前灌注背景下，为什么未启动补液？预测改善与肾功能变化需要怎样权衡？':S.comparator===null?'这个记录治疗的背景是什么？现有支持缺口限制了哪些比较？':`记录动作 ${action(C.action)} 与学得范围的差异，是否有临床背景可以解释？`;
 $('#packet-content').innerHTML=`<div class="packet-question"><span>复盘问题</span><p>${question}</p><small>${canonical&&R.canonicalPair?(R.priority?'原比较路由：Priority':'原比较已有直接证据'):S.comparator===null?'当前规则没有可用直接比较':'手动探索 · 不生成新路由结论'}</small></div><div class="packet-evidence"><span class="micro">点击标签，查看具体依据</span><div class="source-buttons">${[['practice','行为概率'],['factor','临床因素'],['range','学得范围'],['MAP','灌注预测'],['creatinine','肾功能预测']].map(([key,label])=>`<button data-source="${key}" aria-pressed="${key===S.source}">${label} ↗</button>`).join('')}</div><p>${C.id==='PHYS-11'?'待补背景：直接液体反应性、容量负担及实际治疗限制。':'待补背景：实际用药指征、当时的床旁评估与未记录信息。'}</p></div>`;
 $('#evidence-source').innerHTML=sourceText(S.source);
}
function renderAll(){
 active('[data-case]','case',S.case);$('#rule-select').innerHTML=Object.keys(c().rules).map(key=>`<option value="${key}" ${key===S.rule?'selected':''}>${RULES[key].name} · ${key}</option>`).join('');
 renderHistory();renderMap();renderTrajectory();renderPhase();if(S.packet)renderPacket();
}

const layers=[['support','观测支持'],['direct_core','Direct core'],['direct_hull','Direct hull'],['full','Full learned']];
function renderScope(){
 const C=D.cases.find(x=>x.id===S.micro),R=C.rules.MR4;
 $('#micro-cases').innerHTML=['PHYS-14','PHYS-07','PHYS-05'].map(id=>{const item=D.cases.find(x=>x.id===id);return `<button data-micro="${id}" aria-pressed="${id===S.micro}"><b>${id}</b><span>记录 ${action(item.action)}</span><i>↗</i></button>`;}).join('');
 $('#scope-alias').textContent=`${C.id} / SAME TEMPLATE, INDIVIDUAL REFERENCE`;
 const supported=[0,1,2,3,4].filter(v=>C.support.some((yes,a)=>yes&&a%5===v));
 $('#set-comparison').innerHTML=`<div class="set-labels"><span>治疗档位</span>${[0,1,2,3,4].map(v=>`<span>V${v}</span>`).join('')}<span>大小</span></div>`+layers.map(([key,label],i)=>{const vals=key==='support'?supported:R.levels[key];return `<button class="set-row ${key==='full'?'learned-row':''}" data-layer="${key}" aria-pressed="${S.layer===key}" aria-label="${label}，集合${setText(vals)}"><span class="set-name"><small>0${i+1}</small>${label}</span>${[0,1,2,3,4].map(v=>`<span class="set-cell ${vals.includes(v)?'included':''} ${key==='direct_hull'&&vals.includes(v)&&!R.levels.direct_core.includes(v)?'filled-gap':''}">${vals.includes(v)?'<i></i>':'−'}</span>`).join('')}<b>${vals.length}</b></button>`;}).join('');
 const counts={direct_core:R.levels.direct_core.length,direct_hull:R.levels.direct_hull.length,full:R.levels.full.length};
 const gaps=R.levels.direct_hull.filter(v=>!R.levels.direct_core.includes(v));
 const explanations={support:`当前患者有观测支持的升压药档位为 ${setText(supported)}；这里沿坐标投影，不表示任意另一治疗分量都受支持。`,direct_core:`原始平台导出 ${setText(R.levels.direct_core)}。${gaps.length?`中间存在空隙，凸包会额外纳入 ${setText(gaps)}。`:'这个病例的原始平台没有内部空隙。'}`,direct_hull:`凸包为 ${setText(R.levels.direct_hull)}，相对 core ${gaps.length?`新增 ${setText(gaps)} 档。`:'没有新增档位。'}`,full:`共享模型导出 ${setText(R.levels.full)}。它是学得映射的输出，不是现场对 core 做几何填补。`};
 $('#set-explanation').innerHTML=`<span class="explanation-dot"></span><p>${explanations[S.layer]}</p>`;
 $('#scope-summary').innerHTML=`<div><span>Direct core</span><b>${setText(R.levels.direct_core)}</b></div><div><span>Direct hull</span><b>${setText(R.levels.direct_hull)}</b></div><div><span>Full learned</span><b>${setText(R.levels.full)}</b></div>`;
}
function renderResearch(){
 const rows=D.matrix,assessable=rows.filter(x=>['signal_present','no_detected_signal'].includes(x.clinical_axis_standard)).reduce((n,x)=>n+x.windows,0);
 let html='<span></span><span class="axis">Practice 常见</span><span class="axis">Practice 罕见</span>';
 ['signal_present','no_detected_signal'].forEach((cl,i)=>{html+=`<span class="axis">${i?'未检测到信号':'有复盘信号'}</span>`;['typical','atypical'].forEach((pr,j)=>{const n=rows.find(x=>x.clinical_axis_standard===cl&&x.practice_axis===pr).windows;html+=`<div class="matrix-value ${i===0&&j===0?'highlight':''}"><b>${(n/assessable*100).toFixed(2)}%</b><span>${format(n)} 个窗口</span></div>`;});});$('#matrix').innerHTML=html;
 $('#matrix-note').textContent=`Standard 工作点；分母 ${format(assessable)} 个可评估窗口。另有 15,986 个不可评估、8,284 个无适用规则。`;
 $('#geometry').innerHTML='<div class="metric-head"><span></span><span>碎片率</span><span>平均档位数</span></div>'+D.geometry.filter(x=>x.rule==='MR4').map(x=>`<div class="metric-row"><span>${{full:'Full learned',direct_core:'Direct core',direct_hull:'Direct hull'}[x.arm]}</span><strong>${x.fragmentation_pct.toFixed(x.fragmentation_pct<.1?3:2)}%</strong><span class="size-bar"><i style="width:${x.mean_coordinate_size/5*100}%"></i><b>${x.mean_coordinate_size.toFixed(2)}</b></span></div>`).join('');
}
function stopTour(){clearTimeout(tourTimer);S.tour=false;$('#tour-play').textContent='▶ 自动演示';$('#hero-play').textContent='▶ 自动演示一次复盘';$('#tour-progress').textContent='';}
const tourSteps=[
 ()=>{initializeCase('PHYS-11');S.history=1;renderAll();},
 ()=>{S.history=c().history.length-1;setPhase(0);renderAll();},
 ()=>{S.view='practice';setPhase(1);renderAll();},
 ()=>{S.view='clinical';setPhase(1);renderAll();},
 ()=>{S.endpoint='MAP';setPhase(2);renderAll();},
 ()=>{S.endpoint='creatinine';S.hour=3;setPhase(2);renderAll();},
 ()=>{S.source='creatinine';setPhase(3);renderAll();$('#packet').scrollIntoView({behavior:motion(),block:'nearest'});}
];
const motion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth';
function runTour(){if(!S.tour)return;tourSteps[S.tourIndex]();$('#tour-play').textContent='Ⅱ 暂停演示';$('#hero-play').textContent='Ⅱ 暂停演示';$('#tour-progress').textContent=`演示 ${S.tourIndex+1} / ${tourSteps.length}`;const focus=S.phase===3?$('#packet'):window.matchMedia('(max-width: 600px)').matches?$('#'+['patient-panel','reference-panel','trajectory-panel'][S.phase]):$('.guide-bar');focus.scrollIntoView({behavior:motion(),block:'start'});tourTimer=setTimeout(()=>{S.tourIndex++;if(S.tourIndex<tourSteps.length)runTour();else{stopTour();notify('演示完成，可以继续手动探索');}},4500);}
function toggleTour(){if(S.tour){stopTour();return;}clearTimeout(scopeTimer);S.tour=true;S.tourIndex=0;$('#workbench').scrollIntoView({behavior:motion(),block:'start'});runTour();}
function scopeReplay(){stopTour();clearTimeout(scopeTimer);let i=0;const step=()=>{S.layer=layers[i][0];renderScope();if(++i<layers.length)scopeTimer=setTimeout(step,1500);};step();}
function manual(){stopTour();clearTimeout(scopeTimer);}
document.addEventListener('click',event=>{
 const b=event.target.closest('button');if(!b)return;
 if(['tour-play','hero-play'].includes(b.id)){toggleTour();return;}
 manual();
 if(b.dataset.case){initializeCase(b.dataset.case);renderAll();}
 else if(b.dataset.phase!==undefined){setPhase(+b.dataset.phase);if(S.packet)$('#packet').scrollIntoView({behavior:motion(),block:'nearest'});}
 else if(b.dataset.history!==undefined){S.history=+b.dataset.history;S.phase=0;renderHistory();renderPhase();}
 else if(b.dataset.view){S.view=b.dataset.view;setPhase(1);renderMap();}
 else if(b.dataset.action!==undefined){S.cell=+b.dataset.action;if(r().comparators.includes(S.cell)){S.comparator=S.cell;setPhase(2);}renderMap();renderTrajectory();if(S.packet)renderPacket();}
 else if(b.dataset.endpoint){S.endpoint=b.dataset.endpoint;setPhase(2);renderTrajectory();}
 else if(b.dataset.hour!==undefined){S.hour=+b.dataset.hour;renderTrajectory();if(S.packet)renderPacket();}
 else if(b.dataset.source){S.source=b.dataset.source;renderPacket();$('#evidence-source').classList.remove('flash');void $('#evidence-source').offsetWidth;$('#evidence-source').classList.add('flash');if(ENDPOINTS[S.source]){S.endpoint=S.source;renderTrajectory();}}
 else if(b.dataset.micro){S.micro=b.dataset.micro;renderScope();}
 else if(b.dataset.layer){S.layer=b.dataset.layer;renderScope();}
 else if(b.id==='scope-replay')scopeReplay();
 else if(b.id==='open-packet'){S.packet=!S.packet;if(S.packet){S.phase=3;renderPhase();renderPacket();$('#packet').scrollIntoView({behavior:motion(),block:'nearest'});}else setPhase(2);}
 else if(b.id==='close-packet'){setPhase(2);$('#open-packet').focus();}
 else if(b.id==='trace-range'){S.packet=true;S.source='range';S.phase=3;renderPhase();renderPacket();$('#evidence-source').scrollIntoView({behavior:motion(),block:'nearest'});}
 else if(b.id==='download-packet')downloadPacket();
});
$('#rule-select').addEventListener('change',e=>{manual();S.rule=e.target.value;setComparator();S.cell=c().action;S.source='range';S.phase=1;S.packet=false;renderAll();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stopTour();clearTimeout(scopeTimer);}});
function downloadPacket(){const C=c(),R=r(),output={version:D.version,case:C.id,reviewWindow:'t = 0',rule:S.rule,documented:action(C.action),probability:C.probabilities[C.action],range:R.levels.full,selectedComparison:action(S.comparator),canonicalComparison:action(R.canonicalComparator),comparisonType:S.comparator===null?'unavailable':S.comparator===R.canonicalComparator?'canonical':'manual exploration; no new router result',factors:{up:R.factors[0],down:R.factors[1],type:'fixed summaries, not learned q'},hours:D.hours,predictions:S.comparator===null?null:{documented:C.predictions[C.action],comparison:C.predictions[S.comparator]},scope:'De-identified research demonstration; cached model predictions, not treatment recommendations.'};const url=URL.createObjectURL(new Blob([JSON.stringify(output,null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`${C.id}-${S.rule}-review-demo.json`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);notify('已导出当前复盘证据包');}
initializeCase('PHYS-11');renderAll();renderScope();renderResearch();
