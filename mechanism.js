'use strict';
(()=>{
const $=s=>document.querySelector(s), narration=window.ExplainerNarration, durations=narration.durations, starts=durations.map((_,i)=>durations.slice(0,i).reduce((a,b)=>a+b,0)), TOTAL=durations.reduce((a,b)=>a+b,0), reduced=matchMedia('(prefers-reduced-motion: reduce)');
const chapters=['你会怎样判断','再看两次选择','参考从哪来','读懂患者信息','换一种治疗呢','为什么是一组','回到这份病历','把依据交给医生'];
const acts=['一个问题','两个视角','群体学习','群体学习','群体学习','群体学习','个体应用','医生复盘'];
const details={
 rareExample:{tag:'SCHEMATIC EXAMPLE A',title:'少见，为什么不能直接判错？',body:'<p>这里用合成情境说明复盘逻辑。蓝色柱形表示历史动作分布，橙色代表记录动作；绿色表示该患者学得的支持范围。</p><p>相似患者并不完全相同：既往治疗反应、当前生理状态与治疗阶段都可能不同。因此，一个在历史上较少出现的动作，也可能落在这位患者的支持范围内。</p><div class="detail-pair"><span>Practice 的信息<br><b>这个动作少见</b></span><span>Clinical 的信息<br><b>该患者有相应支持</b></span></div><p>这解释了为什么不能仅凭低概率判错；范围内也不意味着已经证明治疗正确。动画未假定“少见”就等于没有观测支持。</p>'},
 commonExample:{tag:'SCHEMATIC EXAMPLE B',title:'常见，为什么还要进一步查看？',body:'<p>这也是合成解释情境。群体里常用某一档位，不代表该档位在每位患者、每个阶段都同样适用。</p><p>例如，当前状态或既往反应已发生变化，患者特异范围可能与常用动作不同。如果显式临床因素或合格预测比较也提示同方向的关注，就形成了一个可以追问的复盘问题。</p><div class="detail-pair"><span>Practice 的信息<br><b>这个动作很常见</b></span><span>Clinical 的信息<br><b>存在需要解释的差异</b></span></div><p>需要复盘不等于治疗错误。实际路由综合因素、范围、轨迹和支持资格；不会仅凭这一幅示意图或范围外标记自动判定 Priority。</p>'},
 rarity:{tag:'THE QUESTION',title:'看到少见治疗，接下来查什么？',body:'<p>Practice 估计相似患者状态及医护情境下，历史上怎样选择治疗。低概率说明行为少见，不直接表示错误；常见动作也可能与当前患者的参考不一致。</p><div class="detail-pair"><span>行为频率<br><b>常见吗？</b></span><span>患者特异支持<br><b>有何依据？</b></span></div><p>开场的分布与动作卡为概念示意，没有使用真实概率或病例判断。</p>'},
 practice:{tag:'PRACTICE',title:'学习历史治疗分布',body:'<p>动作解码器结合患者表示 z 与医护情境 U，估计候选动作的概率。记录动作的概率用于描述 typicality；观测支持用于约束可比较动作，两者用途不同。</p><div class="formula">p(a | z, U)</div><p>这个概率描述历史治疗选择的常见程度。Clinical 使用同一 Practice 支持边界，两种输出回答不同问题，并共享部分信息。</p>'},
 clinical:{tag:'CLINICAL',title:'生成患者特异的支持范围',body:'<p>临床模板规定适用阶段、治疗坐标、方向与因素。共享的条件和范围模型将患者状态映射成数值参考，再按导出条件与观测支持约束生成动作集合。</p><div class="formula">患者状态 + 模板因素 → 支持的治疗集合</div><p>它提供一组模型支持的治疗参考，供医生复盘时比较。页面中的档位均为示意。</p>'},
 population:{tag:'POPULATION LEARNING',title:'目标属于患者，参数在群体间共享',body:'<p>每个历史患者都有观测与治疗序列。决策前历史 H 包含已知状态和既往治疗，不包含当前待复盘动作。</p><p>训练使用群体中的决策窗口；每个窗口可有自己的预测目标，但编码器、Practice、GRU 以及每条模板的条件/范围参数都由多个窗口共同训练。</p><div class="formula">患者特异目标 × 群体共享参数</div>'},
 encoder:{tag:'JOINT LATENT–PRACTICE',title:'编码、重建与动作预测共同学习',body:'<p>编码器产生 latent posterior；患者解码器重建生理状态及可用性，动作解码器结合 U 预测历史治疗分布。</p><div class="formula">L_repr = L_rec + λ_act L_act<br>+ β_KL L_KL + λ_anchor L_anchor</div><p>这是包含 VAE 重建与 KL 项的联合目标示意。编码器及两个解码器共同训练；后续使用一个模型的表示，不对多个模型的 latent 求平均。</p>'},
 gru:{tag:'ONE GRU',title:'输入状态与动作，输出未来观测',body:'<p>固定已学得的表示，用历史动作及后续观测训练一个 GRU。轨迹训练包含生理/latent 状态预测与未来测量可用性的损失。</p><div class="formula">当前状态 + 动作 → 未来状态 / 观测</div><p>GRU 负责预测未来状态与观测。多步展开的后续动作由独立续行策略提供。冻结后，GRU 可计算候选动作轨迹；动画中的曲线用于说明这一计算过程。</p>'},
 template:{tag:'CLINICAL STRUCTURE',title:'临床模板规定要复盘的问题',body:'<p>模板给出治疗阶段、需要考察的坐标、双向关注点、显式临床因素与效用定义。这些结构由临床知识预先指定。</p><p>冻结预测模型与支持边界提供患者特异目标；某坐标的证据可在支持的 companion actions 中投影取最佳效用。直接复盘比较则另行固定记录 companion。</p>'},
 range:{tag:'CONDITION–RANGE LEARNING',title:'把预测监督学成可复用的映射',body:'<p>每个训练窗口的候选预测经规则特异效用、近优平台与细化规则形成监督。共享范围模型在群体训练窗口上拟合这些目标，并受几何、安全与阶段约束共同影响。</p><div class="detail-pair"><span>固定范围参数 ξ<br><b>更新条件参数 ψ</b></span><span>固定条件参数 ψ<br><b>更新范围参数 ξ</b></span></div><p>内部 gate q 影响范围拟合；范围目标、几何、安全及阶段结构共同约束学习。软支持比例用于训练权重，硬支持边界用于导出和比较。</p><p>固定因素摘要 C、内部 gate q 和最终路由是不同量。动画仅展示机制，省略完整分支、掩码与停止规则。</p>'},
 frozen:{tag:'NEW PATIENT',title:'生成参考时，不重新训练',body:'<p>新患者的决策前历史经过固定编码器与各输出模型，得到 Practice 分布和 Clinical 范围。共享模型直接前向计算，不为新患者再优化参数或重建预测平台。</p><p>随后用当前记录动作评分、检查范围差异。有可用比较时，冻结 GRU 仍负责生成动作特异的预测轨迹。</p>'},
 comparison:{tag:'RETROSPECTIVE REVIEW',title:'先有参考，再对照当前动作',body:'<p>当前记录动作不作为 Clinical 范围头的输入。范围生成后，分别组织行为概率、固定因素 C、范围差异与预测轨迹。</p><p>直接动作对比较要求支持资格，并固定另一治疗分量。没有直接比较时应保留缺口；不能从坐标投影范围推断任意 companion 搭配均有支持。</p>'},
 packet:{tag:'REVIEW PACKET',title:'把依据交给医生复核',body:'<p>证据包包含行为概率、临床因素、患者特异范围、合格比较及预测权衡，并呈现缺失或冲突的证据。医生结合实际指征与未记录背景判断。</p><div class="detail-pair"><span>AI 提供<br><b>结构化参考</b></span><span>医生负责<br><b>复核与解释</b></span></div><p>本分享版使用虚构病例和合成示意，不载入真实病例数据。</p>'}
};
let elapsed=0,playing=false,last=0,frame=null,scene=-1,phase=-1,speed=1,motion=[],traces=[],travel=[],returnFocus=null,fullMap=false,frequencyOnly=false;
const text=(x,y,t,cls='svg-label',anchor='middle')=>'<text x="'+x+'" y="'+y+'" class="'+cls+'" text-anchor="'+anchor+'">'+t+'</text>';
const reveal=(html,at=0,until=99,from='up')=>'<g data-at="'+at+'" data-until="'+until+'" data-from="'+from+'">'+html+'</g>';
const hot=(key,html,x,y,label)=>'<g class="hotspot" tabindex="0" role="button" aria-label="'+label+'" data-topic="'+key+'">'+html+'<g class="hot-pin"><circle cx="'+x+'" cy="'+y+'" r="13"/><path d="M'+(x-4)+' '+y+'h8 M'+x+' '+(y-4)+'v8"/></g></g>';
const line=(d,cls='blue')=>'<path d="'+d+'" class="connector '+cls+'" marker-end="url(#arrow-'+cls+')"/>';
const trail=(d,cls='blue',at=0)=>line(d,cls)+'<g class="travel '+cls+'" data-path="'+d+'" data-start="'+at+'"><circle r="4.5"/></g>';
const card=(x,y,w,h,title,tone='blue',sub='')=>'<g class="card '+tone+'"><rect class="card-shadow" x="'+(x+6)+'" y="'+(y+9)+'" width="'+w+'" height="'+h+'" rx="18"/><rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="18"/>'+text(x+w/2,y+h/2+(sub?-3:6),title,'card-title')+(sub?text(x+w/2,y+h/2+25,sub,'card-sub'):'')+'</g>';
const person=(x,y,s=1,doctor=false)=>'<g transform="translate('+x+' '+y+') scale('+s+')"><ellipse cy="44" rx="40" ry="6" class="mg-person-shadow"/><path d="M-30 36V7Q-30-9-14-9L0 2 14-9Q30-9 30 7V36Z" class="'+(doctor?'doctor-body':'person-body')+'"/><path d="M-7-19V-8Q0 0 7-8V-19" class="person-head"/><circle cy="-31" r="17" class="person-head"/><path d="M-17-28Q-24-52-2-51Q21-53 18-29L12-37Q-2-31-12-40Z" class="mg-hair"/><path d="M-6-28h1M6-28h1M-3-21Q0-19 3-21" class="mg-face"/>'+(doctor?'<path d="M-13-7L0 28 13-7M-11 7v12a5 5 0 0010 0V9" class="coat-line"/><path d="M13 7v12m-6-6h12" class="doctor-cross"/><g transform="translate(23 24) rotate(-12)"><rect x="-13" y="-15" width="26" height="33" rx="4" class="mg-tablet"/><path d="M-6-5H6M-6 1H3M-6 7H6" class="coat-line"/></g><path d="M-27 12L-21 28H3" class="mg-doctor-arm"/>':'<path d="M-17 8V31M17 8V31" class="mg-patient-seam"/><path d="M-12-8L0 2 12-8" class="mg-collar"/><rect x="8" y="10" width="12" height="10" rx="2" class="mg-pocket"/>')+'</g>';
const waveform=(x,y,w=180,h=75,cls='blue',at=0)=>'<g transform="translate('+x+' '+y+')"><path d="M0 '+h+'H'+w+'" class="chart-axis"/><path class="draw '+cls+'" data-draw="'+at+'" d="M0 '+(h*.7)+'L'+(w*.18)+' '+(h*.68)+'L'+(w*.27)+' '+(h*.35)+'L'+(w*.36)+' '+(h*.83)+'L'+(w*.46)+' '+(h*.18)+'L'+(w*.54)+' '+(h*.62)+'L'+(w*.72)+' '+(h*.5)+'L'+w+' '+(h*.4)+'"/></g>';
const bars=(x,y,vals,cls='blue',at=0,w=27,gap=12)=>'<g transform="translate('+x+' '+y+')">'+vals.map((h,i)=>'<rect class="bar '+cls+'" data-bar="'+(at+i*.12)+'" data-height="'+h+'" x="'+i*(w+gap)+'" y="'+(100-h)+'" width="'+w+'" height="'+h+'" rx="6"/>').join('')+'</g>';
const set=(x,y,vals,at=0)=>'<g transform="translate('+x+' '+y+')">'+[0,1,2,3,4].map((v,i)=>reveal('<g class="set-tile '+(vals.includes(v)?'selected':'')+'"><rect x="'+i*49+'" y="0" width="40" height="43" rx="10"/>'+text(i*49+20,28,''+v,'tile-number')+'</g>',at+i*.13)).join('')+'</g>';
const tag=(x,y,w,t,cls='blue')=>'<g class="tag '+cls+'"><rect x="'+x+'" y="'+y+'" width="'+w+'" height="30" rx="15"/>'+text(x+w/2,y+20,t,'tag-text')+'</g>';
const cloud=(x,y,n=16)=>'<g transform="translate('+x+' '+y+')">'+Array.from({length:n},(_,i)=>'<circle cx="'+((i%4)*18)+'" cy="'+(Math.floor(i/4)*18)+'" r="5" class="data-dot"/>').join('')+'</g>';
function art(i){
if(i<2)return window.StoryOpening.art(i,{text,reveal,hot,person,bars});
if(i===3||i===5)return window.MechanismStory.art(i,{hot});
let g='';
if(i===0){
g=reveal('<g class="distribution-card"><rect x="75" y="80" width="450" height="300" rx="24"/>'+text(112,123,'历史治疗分布','svg-overline','start')+bars(124,175,[55,89,66,47,8],'blue',.6,43,24)+text(202,337,'常见','svg-small')+text(413,337,'少见','orange-text')+'</g>',0);
g+=reveal(line('M535 245H607')+hot('rarity',card(630,136,280,185,'少见 = 错误？','orange','一个直觉判断'),891,153,'为什么少见不等于错误'),1.3,4.5,'right');
g+=reveal(hot('rarity',card(604,106,335,240,'先别急着下结论','teal')+person(668,266,.75)+waveform(730,240,157,45,'teal',4.6)+tag(704,293,171,'还要看患者状态','teal'),917,124,'了解频率与患者支持的区别'),4.1);

}
if(i===1){
g=reveal(person(535,82,.9)+card(436,116,198,58,'同一记录动作','orange'),0);
g+=reveal(trail('M436 146Q280 146 280 218','blue',1)+trail('M634 146Q790 146 790 218','teal',1.4),.7);
g+=reveal(hot('practice','<g class="panel blue"><rect x="100" y="222" width="360" height="207" rx="22"/>'+text(280,262,'Practice','panel-title')+bars(161,278,[30,70,48,82,22],'blue',1.8)+text(280,411,'群体中常见吗？','panel-caption')+'</g>',440,239,'查看 Practice 如何学习'),1.3);
g+=reveal(hot('clinical','<g class="panel teal"><rect x="612" y="222" width="360" height="207" rx="22"/>'+text(792,262,'Clinical','panel-title')+set(677,304,[1,2],2.4)+text(792,411,'患者状态支持吗？','panel-caption')+'</g>',951,239,'查看 Clinical 支持范围'),1.9);
g+=reveal(text(535,341,'≠','big-symbol'),4);
}
if(i===2){
for(let row=0;row<3;row++){const y=123+105*row;g+=reveal(person(85,y,.58)+text(60,y+57,['患者 A','患者 B','患者 C'][row],'svg-small')+'<path d="M130 '+y+'H425" class="timeline-line"/>'+[0,1,2,3,4].map((j)=>'<circle cx="'+(145+j*59)+'" cy="'+y+'" r="7" class="timeline-dot"/><rect x="'+(140+j*59)+'" y="'+(y+16)+'" width="10" height="'+(8+(j+row)%3*7)+'" rx="3" class="dose-bar"/>').join('')+trail('M440 '+y+'Q520 '+y+' 578 230','blue',row*.5),row*.45);}
g+=reveal(hot('population','<g class="learning-core"><circle cx="676" cy="230" r="91" class="halo"/><circle cx="676" cy="230" r="68" class="core"/>'+text(676,225,'群体学习','core-title')+text(676,252,'共享参数','core-sub')+'</g>',744,170,'学习目标和参数分别属于谁'),1.7);
g+=reveal(trail('M770 230H837','teal',3.8)+card(848,163,176,134,'个体化映射','teal'),3.8);
g+=reveal(tag(385,410,300,'患者特异的目标 · 群体共享的参数'),3.5);
}
if(i===3){
g=reveal('<g class="history-stack"><rect x="45" y="147" width="178" height="145" rx="16"/><rect x="56" y="135" width="178" height="145" rx="16"/><rect x="67" y="122" width="178" height="145" rx="16"/>'+text(155,156,'决策前历史','svg-label')+waveform(89,172,132,57,'blue',.4)+'</g>',0);
g+=reveal(trail('M252 196H312','blue',.8)+hot('encoder',card(322,132,158,126,'编码器'),462,147,'查看联合表征学习目标'),.6);
g+=reveal(trail('M486 196H529','blue',1.5)+'<g class="latent-core"><circle cx="573" cy="196" r="53" class="latent-halo"/><circle cx="573" cy="196" r="34" class="latent-circle"/>'+text(573,205,'z','latent-z')+'</g>',1.2);
g+=reveal(trail('M614 176Q659 89 729 89','blue',2)+trail('M614 215Q659 302 729 302','teal',2.4),1.8);
g+=reveal(hot('encoder',card(738,36,263,111,'患者解码器','blue')+waveform(771,156,190,35,'blue',2.2),983,53,'患者重建与联合目标'),2);
g+=reveal(hot('practice',card(738,245,263,111,'动作解码器','teal')+bars(778,366,[24,48,33,55,19],'teal',2.8,26,12)+tag(784,212,174,'医护情境 U','teal'),983,262,'动作分布与医护情境'),2.6);
g+=reveal(tag(307,386,328,'重建患者信息 + 学习治疗选择'),4);
}
if(i===4){
g=reveal(card(49,126,177,84,'患者状态')+card(49,264,177,84,'候选动作','orange'),0);
g+=reveal(trail('M233 168H285Q321 168 321 221H365','blue',.5)+trail('M233 307H285Q321 307 321 249H365','orange',1),.5);
g+=reveal(hot('gru','<g class="gru-core"><rect x="375" y="164" width="205" height="146" rx="28"/>'+text(477,227,'GRU','model-title')+text(477,260,'一个预测模型','core-sub')+'<path d="M409 181Q477 134 545 181" class="recur-arrow" marker-end="url(#arrow-blue)"/></g>',562,183,'GRU 预测什么，如何训练'),1);
g+=reveal(trail('M586 235H655','blue',2),1.6);
g+=reveal('<g class="future-chart"><rect x="665" y="73" width="340" height="326" rx="23"/>'+text(705,115,'未来观测','svg-overline','start')+'<path d="M706 140V350H971" class="chart-axis"/><path d="M706 298C766 270 793 324 842 248S932 189 969 160" class="draw blue" data-draw="2.2" data-duration=".75" data-candidate="A"/><path d="M706 298C763 285 796 291 842 277S930 257 969 266" class="draw teal" data-draw="3" data-duration=".75" data-candidate="B"/><path d="M706 298C756 314 791 342 841 317S930 330 969 336" class="draw orange" data-draw="3.8" data-duration=".75" data-candidate="C"/>'+text(840,379,'预测时间 →','svg-small')+text(985,164,'A','svg-small')+text(985,270,'B','svg-small')+text(985,340,'C','svg-small')+'</g>',1.9);
g+=reveal(tag(350,397,244,'比较候选剂量的预测走势'),4.3);
}
if(i===5){
g=reveal(hot('template','<g class="rule-sheet"><rect x="40" y="86" width="185" height="254" rx="17"/>'+text(133,128,'临床模板','panel-title')+'<path d="M83 166h98M83 187h75M83 208h90" class="sheet-line"/>'+text(106,282,'↑','direction-up')+text(166,282,'↓','direction-down')+'</g>',208,101,'哪些内容由临床模板预先定义'),0);
g+=reveal(trail('M232 215H285','blue',1)+text(391,126,'患者特异预测目标','svg-label')+set(274,153,[1,2],.8)+set(274,214,[2,3,4],.95)+set(274,275,[0,1],1.1),.8);
g+=reveal(trail('M519 237H569','blue',2)+hot('range','<g class="range-learner"><rect x="582" y="157" width="192" height="160" rx="23"/>'+text(678,211,'条件 ↔ 范围','card-title')+text(678,247,'共享映射','card-sub')+'<path d="M620 270Q678 304 736 270" class="recur-arrow" marker-end="url(#arrow-teal)"/></g>',756,174,'查看条件与范围怎样交替学习'),2);
g+=reveal(trail('M780 237H816','teal',4.5)+text(929,191,'个体化范围','svg-label')+set(813,217,[1,2,3],4.5)+tag(842,303,182,'受观测支持约束','teal'),4.5);
g+=reveal(tag(368,405,330,'学习这位患者的剂量参考','teal'),4.5);
}
if(i===6){
g=reveal(person(100,210,1.1)+text(100,288,'新患者','svg-label')+trail('M145 210H236','blue',.4),0);
g+=reveal(hot('frozen','<g class="fixed-model"><rect x="247" y="127" width="233" height="170" rx="23"/>'+text(364,200,'已训练模型','card-title')+'<g class="lock"><rect x="348" y="230" width="31" height="23" rx="5"/><path d="M353 230V220a10 10 0 0121 0v10"/></g></g>',460,145,'新患者是否需要重新训练'),.5);
g+=reveal(trail('M488 184Q536 107 603 107','blue',1.5)+trail('M488 237Q536 310 603 310','teal',2),1);
g+=reveal(hot('practice','<g class="mini-reference blue"><rect x="615" y="44" width="355" height="145" rx="20"/>'+text(647,87,'Practice','panel-title','start')+bars(752,75,[16,48,31,63,22],'blue',1.7,24,10)+'</g>',949,63,'查看行为参考'),1.4);
g+=reveal(hot('clinical','<g class="mini-reference teal"><rect x="615" y="237" width="355" height="145" rx="20"/>'+text(647,279,'Clinical','panel-title','start')+set(674,307,[1,2],2.4)+'</g>',949,256,'查看患者特异范围'),2);
g+=reveal(hot('comparison',card(256,369,221,68,'当前记录动作','orange')+trail('M485 404H551V210H978','orange',4.6)+line('M974 160Q1008 160 1008 180','blue')+line('M974 264Q1008 264 1008 240','teal')+'<g class="comparison-mark"><circle cx="1008" cy="210" r="25"/>'+text(1008,215,'对照','compare-text')+'</g>',457,383,'为什么当前记录动作最后进入'),4.5);
}
if(i===7){
const cards=[['行为概率','practice','blue'],['临床因素','comparison','teal'],['学得范围','clinical','teal'],['预测权衡','gru','blue']];
cards.forEach((a,j)=>{const x=55+(j%2)*237,y=62+Math.floor(j/2)*177;let content='<g class="evidence-card '+a[2]+'"><rect x="'+x+'" y="'+y+'" width="215" height="150" rx="18"/>'+text(x+24,y+36,a[0],'svg-overline','start');if(j===0)content+=bars(x+27,y+40,[22,52,36,61],'blue',.3,24,17);if(j===1)content+='<path d="M'+(x+52)+' '+(y+98)+'h28l10-24 14 43 15-29h37" class="draw teal" data-draw=".8"/>';if(j===2)content+='<g transform="translate('+(x+17)+' '+(y+75)+') scale(.75)">'+set(0,0,[1,2],1.1)+'</g>';if(j===3)content+=waveform(x+27,y+65,153,52,'blue',1.5);content+='</g>';g+=reveal(hot(a[1],content,x+194,y+18,'查看'+a[0]),j*.4);});
g+=reveal(trail('M510 235H599','teal',2.3)+hot('packet','<g class="packet-stack"><rect x="608" y="151" width="182" height="197" rx="17"/><rect x="620" y="138" width="182" height="197" rx="17"/>'+text(711,199,'复盘证据包','card-title')+'<path d="M657 234h110M657 255h86M657 276h97" class="sheet-line"/><circle cx="749" cy="301" r="9" class="evidence-dot"/></g>',784,156,'打开复盘证据包说明'),2);
g+=reveal(trail('M811 236H863','teal',3)+person(930,208,1.5,true)+text(930,305,'医生复核','svg-label'),3);
g+=reveal(tag(596,394,395,'把缺口与冲突，也留在证据里','teal'),4);
}
const design=window.MotionDesign.scene(i);
return '<svg viewBox="0 0 1080 480" xmlns="http://www.w3.org/2000/svg" aria-label="'+chapters[i]+'示意"><defs>'+['blue','teal','orange'].map(c=>'<marker id="arrow-'+c+'" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" class="arrow '+c+'"/></marker>').join('')+'<linearGradient id="coreGradient" x2="1" y2="1"><stop stop-color="#527fef"/><stop offset="1" stop-color="#24aca9"/></linearGradient></defs><g class="scene-root">'+design.back+g+design.front+'</g></svg>';
}
// Keep the established illustrations and technical detail cards reusable.
if(window.StoryFilm){window.MechanismAssets={art,details,person,hot,card,text,bars,set,tag,trail,reveal,waveform};return;}
const ease=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x);};
function updateVisual(t){
$('#stage').classList.toggle('primer-stage',scene===0&&t<0);
const board=$('#stage svg'),objectScene=board.classList.contains('mechanism-story-board');
$('#stage').classList.toggle('ms-stage',objectScene);
if(objectScene){$('#stage').classList.remove('story-cases','intro-stage');window.MechanismStory.update(board,narration.at(scene,elapsed-starts[scene]),reduced.matches);return;}
window.MotionDesign.update($('#stage svg'),t,reduced.matches);
window.StoryOpening.update($('#stage svg'),t,reduced.matches);
const svg=$('#stage svg');$('#stage').classList.toggle('story-cases',scene===1);$('#stage').classList.toggle('intro-stage',scene===0);if(scene===0&&matchMedia('(max-width:600px)').matches){svg.setAttribute('viewBox',t<0?'0 0 540 520':'0 0 540 740');}else if(scene===1&&matchMedia('(max-width:600px)').matches){svg.setAttribute('viewBox','0 0 540 850');}else if(matchMedia('(max-width: 600px)').matches&&!fullMap&&!reduced.matches){const pan=ease((t-2.7)/2.6);svg.setAttribute('viewBox',(pan*550)+' 0 '+(600-pan*70)+' 480');}else svg.setAttribute('viewBox','0 0 1080 480');
motion.forEach(e=>{if(e.dataset.mg)return;const at=+e.dataset.at,until=+e.dataset.until;const q=ease((t-at)/.4)*(1-ease((t-until)/.5));const from=e.dataset.from;e.style.opacity=q;e.style.pointerEvents=q>.9?'auto':'none';e.setAttribute('transform',reduced.matches?'translate(0 0)':from==='right'?'translate('+((1-q)*45)+' 0)':'translate(0 '+((1-q)*23)+')');e.querySelectorAll('[data-topic]').forEach(h=>h.setAttribute('tabindex',q>.9?'0':'-1'));});
traces.forEach(e=>{if(e.dataset.draw!==undefined){const q=reduced.matches?1:ease((t-+e.dataset.draw)/(+(e.dataset.duration||.7)));e.style.strokeDashoffset=(1-q)*e._length;}else{const q=reduced.matches?1:ease((t-+e.dataset.bar)/.7),h=+e.dataset.height;e.setAttribute('height',h*q);e.setAttribute('y',100-h*q);}});
travel.forEach(e=>{const t0=+e.dataset.start;if(t<t0||reduced.matches){e.style.opacity=0;return;}const k=((t-t0)*.4)%1;const p=e._path.getPointAtLength(k*e._length);e.setAttribute('transform','translate('+p.x+' '+p.y+')');e.style.opacity=.75;});
}
function render(){
const index=Math.max(0,starts.findLastIndex(s=>elapsed>=s)),local=elapsed-starts[index];
if(index!==scene){scene=index;$('#stage').innerHTML=art(index);$('#act-label').textContent=acts[index];$('#scene-counter').textContent='0'+(index+1)+' / 08';$('#chapters').innerHTML=chapters.map((c,j)=>'<button data-chapter="'+j+'" aria-pressed="'+(index===j)+'"><span>0'+(j+1)+'</span>'+c+'</button>').join('');motion=[...$('#stage').querySelectorAll('[data-at]')];traces=[...$('#stage').querySelectorAll('[data-draw],[data-bar]')];traces.forEach(e=>{if(e.dataset.draw!==undefined){e._length=e.getTotalLength();e.style.strokeDasharray=e._length;}});travel=[...$('#stage').querySelectorAll('[data-path]')];travel.forEach(e=>{e._path=document.createElementNS('http://www.w3.org/2000/svg','path');e._path.setAttribute('d',e.dataset.path);e._length=e._path.getTotalLength();});phase=-1;}
const cue=narration.at(index,local),ph=cue.n;$('#narration-position').textContent='讲解 '+(ph+1)+' / '+cue.count;$('#sentence-prev').disabled=index===0&&ph===0;$('#sentence-next').disabled=index===7&&ph===cue.count-1;
$('#story-controls').hidden=index!==1;$('#stage').classList.toggle('frequency-only',index===1&&frequencyOnly);$('#frequency-only').setAttribute('aria-pressed',String(frequencyOnly));$('#patient-context').setAttribute('aria-pressed',String(!frequencyOnly));const spoken=index===1&&frequencyOnly?'现在，画面只显示医生选择治疗的常见程度。我们还没有查看患者自身的情况，因此不能仅凭这些柱子判断治疗是否合理。':cue.text;if($('#caption').textContent!==spoken)$('#caption').textContent=spoken;
updateVisual(index===0?cue.visual:Math.max(.05,cue.visual));
window.CueFlow.update($('#stage svg'),index,cue,reduced.matches,matchMedia('(max-width:600px)').matches&&!fullMap&&!reduced.matches);
// Opening exposition belongs to the image, not a second reading surface below it.
$('#film').classList.toggle('inline-story',index<2);
if(index<2){
 const heading=$('#stage '+(index===0?'#ib-title':'.story-heading'));
 const line=index===1&&frequencyOnly?'只看频率，还不能判断合适。':cue.stageText;
 if(heading&&heading.textContent!==line)heading.textContent=line;
 $('#narration-position').textContent='画面 '+(ph+1)+' / '+cue.count;
}
$('#seek').value=elapsed;$('#film').style.setProperty('--progress',elapsed/TOTAL*100+'%');$('#film').classList.toggle('is-playing',playing);$('#play').textContent=playing?'Ⅱ 暂停':elapsed>=TOTAL?'↺ 再看一次':elapsed<3?'▶ 开始观看':'▶ 继续观看';$('#clock').textContent=fmt(elapsed)+' / '+fmt(TOTAL);$('#previous').disabled=index===0;$('#next').disabled=index===7;
}
function fmt(t){return String(Math.floor(t/60)).padStart(2,'0')+':'+String(Math.floor(t%60)).padStart(2,'0');}
function pause(){playing=false;cancelAnimationFrame(frame);render();}
function focusFilm(){if(!document.fullscreenElement)$('#film').scrollIntoView({behavior:reduced.matches?'auto':'smooth',block:'start'});}
function tick(now){if(!playing)return;elapsed=Math.min(TOTAL,elapsed+(now-last)/1000*speed);last=now;if(elapsed>=TOTAL)playing=false;render();if(playing)frame=requestAnimationFrame(tick);}
function play(){if(playing){pause();return;}if(elapsed>=TOTAL){elapsed=0;frequencyOnly=false;}playing=true;last=performance.now();render();focusFilm();frame=requestAnimationFrame(tick);}
function jump(i){pause();i=Math.max(0,Math.min(7,i));elapsed=starts[i]+narration.sections[i].cues[0].duration*.5;frequencyOnly=false;render();focusFilm();}
function sentence(direction){pause();let i=scene,n=narration.at(i,elapsed-starts[i]).n+direction;if(n<0){i=Math.max(0,i-1);n=narration.sections[i].cues.length-1;}else if(n>=narration.sections[i].cues.length){i=Math.min(7,i+1);n=0;}const c=narration.sections[i].cues[n];elapsed=starts[i]+c.start+c.duration*.5;frequencyOnly=false;render();}
$('#sentence-prev').addEventListener('click',()=>sentence(-1));$('#sentence-next').addEventListener('click',()=>sentence(1));
function openDetail(key,target){if(!details[key])return;pause();returnFocus=target;const d=details[key];$('#detail-tag').textContent=d.tag;$('#detail-title').textContent=d.title;$('#detail-body').innerHTML=d.body;$('#detail').showModal();}
function closeDetail(){if($('#detail').open)$('#detail').close();returnFocus?.focus();}
$('#camera').addEventListener('click',()=>{fullMap=!fullMap;$('#camera').textContent=fullMap?'镜头跟随':'看全图';render();});window.addEventListener('resize',()=>render());
$('#frequency-only').addEventListener('click',()=>{pause();frequencyOnly=true;elapsed=starts[1]+durations[1]-1;render();});$('#patient-context').addEventListener('click',()=>{pause();frequencyOnly=false;elapsed=starts[1]+durations[1]-1;render();});
$('#stage').addEventListener('click',e=>{const h=e.target.closest('[data-topic]');if(h)openDetail(h.dataset.topic,h);});
$('#stage').addEventListener('keydown',e=>{const h=e.target.closest('[data-topic]');if(h&&['Enter',' '].includes(e.key)){e.preventDefault();e.stopPropagation();openDetail(h.dataset.topic,h);}});
$('#close-detail').addEventListener('click',closeDetail);$('#detail').addEventListener('click',e=>{if(e.target===$('#detail')){const b=e.target.getBoundingClientRect();if(e.clientX<b.left||e.clientX>b.right||e.clientY<b.top||e.clientY>b.bottom)closeDetail();}});
$('#resume-detail').addEventListener('click',()=>{closeDetail();play();});
$('#play').addEventListener('click',play);$('#previous').addEventListener('click',()=>jump(scene-1));$('#next').addEventListener('click',()=>jump(scene+1));$('#restart').addEventListener('click',()=>{pause();elapsed=0;frequencyOnly=false;play();});$('#seek').addEventListener('input',e=>{const v=+e.target.value;pause();elapsed=v;render();});$('#speed').addEventListener('change',e=>speed=+e.target.value);$('#chapters').addEventListener('click',e=>{const b=e.target.closest('[data-chapter]');if(b)jump(+b.dataset.chapter);});
$('#film').addEventListener('keydown',e=>{if(e.target.closest('button,input,select,a,[data-topic]'))return;if(e.code==='Space'){e.preventDefault();play();}else if(e.key==='ArrowRight'){e.preventDefault();jump(scene+1);}else if(e.key==='ArrowLeft'){e.preventDefault();jump(scene-1);}});
$('#fullscreen').addEventListener('click',async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('#film').requestFullscreen();}catch{document.body.classList.toggle('theater');}});document.addEventListener('fullscreenchange',()=>$('#fullscreen').textContent=document.fullscreenElement?'⤢ 退出全屏':'⛶ 全屏');document.addEventListener('keydown',e=>{if(e.key==='Escape')document.body.classList.remove('theater');});document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});
$('#seek').max=TOTAL;$('#transcript').innerHTML=narration.sections.map((s,i)=>'<section><h3>'+String(i+1).padStart(2,'0')+' / '+s.title+'</h3>'+s.cues.map(c=>'<p>'+c.text+'</p>').join('')+(s.detail?'<p>'+s.detail+'</p>':'')+'</section>').join('');
elapsed=.2;render();
})();
