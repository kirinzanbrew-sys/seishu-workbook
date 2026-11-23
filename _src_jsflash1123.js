<!-- jsflash1123 -->
<style>
/* 上槽日の点滅（2026-11-23 泰広さん：案2） */
@keyframes jfYa{0%,100%{background:#fde3dc}50%{background:#ff6b5e;color:#fff}}
@keyframes jfDo{0%,100%{background:#fff0d6}50%{background:#ffa53a;color:#fff}}
.kg-t tr.top td.jf-ya{animation:jfYa 1s infinite;font-weight:800;cursor:pointer}
.kg-t tr.top td.jf-do{animation:jfDo 1s infinite;font-weight:800;cursor:pointer}
.kg-t tr.top td .jf-mk{display:inline-block;font-size:9px;font-weight:800;border-radius:3px;padding:0 2px;margin-left:2px;color:#fff;vertical-align:1px;line-height:1.3}
.jf-mk.ya{background:#d62f2f}.jf-mk.do{background:#e07b00}
.jf-kind{display:inline-block;color:#fff;font-size:12px;font-weight:800;border-radius:6px;padding:2px 8px;margin:2px 0 6px}
.jf-kind.ya{background:#d62f2f}.jf-kind.do{background:#e07b00}
.jf-p{margin:5px 2px;line-height:1.6;font-size:13.5px}
.jf-sm{font-size:11.5px;color:#7a7466;margin:4px 2px;line-height:1.5}
.jf-tb{border-collapse:collapse;width:100%;font-size:12.5px;margin:4px 0}
.jf-tb td,.jf-tb th{border:1px solid #eee;padding:3px 6px;text-align:left}
.jf-tb th{background:#f6f3ec}
.jf-h{font-size:12.5px;font-weight:800;color:#1b2a41;margin:10px 2px 4px}
.jf-days{display:grid;grid-template-columns:repeat(7,1fr);gap:4px}
.jf-d{border:1px solid #e4ded1;background:#fff;border-radius:8px;padding:4px 1px;font-family:inherit;text-align:center;cursor:pointer;color:#222;line-height:1.25}
.jf-d b{display:block;font-size:13px}
.jf-d small{display:block;font-size:9.5px;color:#7a7466}
.jf-d .ng{color:#d62f2f;font-weight:800}
.jf-d .wn{color:#e07b00;font-weight:800}
.jf-d .ok{color:#2f7d5d;font-weight:800}
.jf-d.now{border:2px solid #8a6cc8}
.jf-d.on{background:#1b2a41;color:#fff;border-color:#1b2a41}
.jf-d.on small{color:#cfd7e3}
.jf-d.sat b{color:#2a62c9}.jf-d.sun b{color:#d03030}
.jf-d.on.sat b,.jf-d.on.sun b{color:#fff}
.jf-pv{min-height:22px;margin:6px 2px;font-size:12.5px}
</style>
<script>
/* ================= 🍶 上槽日の点滅（2026-11-23 泰広さん指示・案2） =================
   ① ヤブタが重なる上槽日 → 表の上槽の日のマスを赤で点滅＋「ヤ」（いつでも）
      ・ヤブタは2台。伝辛・超辛・純米辛口は2台とも、ほかは1台
      ・金・土・日に上槽すると、月曜の粕放しまでその台はふさがる（月曜からまた使える）
      ・使う台数が2台を超える日に上槽する仕込み（あとから搾るほう）を点滅
   ② 四段洗米（上槽の2日前／日程に四洗があればその日）が土曜 → 上槽まで残り7日から 上槽の日のマスを橙で点滅＋「四洗」
      ・四段があるかは 🧾配合表（いちばん新しい版）の 四段 の総米。配合表が読めないときは 四段の日程があるもの
      ・繰り上げ・繰り下げはその時にならないと決められないので、知らせるだけ（どちらがよいかは出さない）
   ③ 点滅しているマスを押す → 理由（ふさいでいる仕込み・空き台数／四洗の日・上槽まであと何日）と、
      上槽日の前後3日の候補（その日にしたときの ヤブタの空き・四洗の曜日）。選んで「決定」で 四洗〜上槽 をまとめてずらす
      （四段の日程があれば全部を同じ日数ずらす。日程が無ければ上槽日だけ）。「1日ずつ変える」で今までの作業の窓（ydMenu）
   上槽日を選び直して重ならなくなれば／四洗が土曜でなくなれば 点滅は消える
   サーバー（Apps Script）の変更なし。控え：seishu-workbook_github\_src_jsflash1123.js（index.html の jsflash1123 の目印の間、</body> の直前） */
const JF={ big:/伝辛|超辛|純米辛口/ };
function jfBig(m){ return JF.big.test(String(m&&m.liquid||'')); }
function jfHasYodan(m){
  try{ if(typeof hgRevs==='function'){ const R=hgRevs(); if(R.length){ const bl=R[R.length-1].blocks||[];
        const b=bl.find(x=>hgN(x.sym)===hgN(m.sym)); if(b){ const v=Number(((b.v||{})['総米']||{})['四段']); return v>0; } } } }catch(e){}
  try{ return !!(ydSch(m)&&ydSch(m).sen); }catch(e){ return false; }
}
function jfSen(m, jo){ const s=(typeof ydSch==='function')?ydSch(m):null; if(s&&s.sen&&jo===(m.joso||'')) return s.sen; return jo?dadd(jo,-2):''; }
/* ヤブタ：上槽日 jo の仕込みが搾れるか。over＝{no:上槽日} で差し替えて調べる */
function jfYabuta(over){
  const st=RC.state||{}, today=dtoday(), lo=dadd(today,-4);   // 4日前までの上槽も入れる（金曜の上槽は月曜までふさぐ）
  const L=((st.master)||[]).map(m=>({m, jo:(over&&over[m.no]!==undefined)?over[m.no]:m.joso})).filter(x=>x.jo&&x.jo>=lo)
    .sort((a,b)=>a.jo<b.jo?-1:a.jo>b.jo?1:(Number(a.m.no)-Number(b.m.no)));
  const use={}, res={};
  L.forEach(({m,jo})=>{
    const need=jfBig(m)?2:1, busy=use[jo]||[], used=busy.reduce((s,x)=>s+x.n,0);
    if(used+need>2) res[m.no]={jo, need, free:Math.max(0,2-used), with:busy.map(x=>x)};
    let end=jo; const w=dparse(jo).getDay();
    if(w===5||w===6||w===0){ let e=jo; while(dparse(e).getDay()!==1) e=dadd(e,1); end=dadd(e,-1); }
    for(let d=jo; d<=end; d=dadd(d,1)) (use[d]=use[d]||[]).push({m, jo, n:need});
  });
  return res;
}
function jfDoyo(m, jo, today){
  if(!jo||!jfHasYodan(m)) return null;
  const sen=jfSen(m, jo); if(!sen||dparse(sen).getDay()!==6) return null;
  const left=rcDays(today, jo);
  return {sen, left, on:left>=0&&left<=7&&today<=sen};
}
function jfState(){
  const st=RC.state||{}, T=st.today||{}, today=dtoday(), Y=jfYabuta(), out={};
  ((st.master)||[]).forEach(m=>{ if(!m.joso||!m.tome) return; if((T[m.no]||{}).state==='上槽済') return;
    const ya=Y[m.no]&&m.joso>=today?Y[m.no]:null, d=jfDoyo(m, m.joso, today), dy=d&&d.on?d:null;
    if(ya||dy) out[m.no]={ya, dy, kind:ya?'ya':'do'}; });
  return out;
}
function jfPaint(box){
  try{
    box=box||document.querySelector('.kg-home[data-mk]')||document.querySelector('.kg-home'); if(!box) return;
    if(!document.getElementById('kgHd')) return;   // 🍶仕込みの表だけ
    box.querySelectorAll('td.jf-ya,td.jf-do').forEach(x=>x.classList.remove('jf-ya','jf-do'));
    box.querySelectorAll('.jf-mk').forEach(x=>x.remove());
    const S=jfState();
    box.querySelectorAll('.kg-t tr.top[data-kg]').forEach(tr=>{
      const no=tr.dataset.kg, s=S[no]; if(!s) return; const m=rcMaster(no); if(!m) return;
      const i=rcDays(m.tome, m.joso)+1, td=tr.querySelector(`td[data-i="${i}"]`); if(!td) return;
      td.classList.add('jf-'+s.kind);
      td.insertAdjacentHTML('beforeend', `<span class="jf-mk ${s.kind}">${s.kind==='ya'?'ヤ':'四洗'}</span>`);
      if(s.ya&&s.dy) td.insertAdjacentHTML('beforeend', `<span class="jf-mk do">四洗</span>`);
    });
  }catch(e){ console.log('jf paint', e); }
}
(function(){ try{ const _p=ydPaint; ydPaint=function(...a){ const r=_p.apply(this,a); jfPaint(a[0]); return r; }; }catch(e){} })();

/* 押したとき：理由と、上槽日の前後3日の候補 */
function jfOpen(m){
  const today=dtoday(), S=jfState()[m.no]||{}, jo0=m.joso, s0=(typeof ydSch==='function')?ydSch(m):null, yod=jfHasYodan(m);
  const md=d=>{ const x=dparse(d); return `${x.getMonth()+1}/${x.getDate()}（${WD[x.getDay()]}）`; };
  const w=document.createElement('div'); w.className='o2-mask yd-mask'; document.body.appendChild(w);
  const close=()=>w.remove(); w.onclick=e=>{ if(e.target===w) close(); };
  let sel=jo0;
  const why=()=>{ let h='';
    if(S.ya){ h+=`<span class="jf-kind ya">ヤブタが重なっています</span>
      <p class="jf-p">上槽 <b>${md(jo0)}</b> にヤブタが空いていません。</p>
      <table class="jf-tb"><tr><th>ふさいでいる仕込み</th><th>上槽日</th><th>台数</th></tr>${S.ya.with.map(o=>`<tr><td>${esc(String(o.m.no))}号 ${esc(o.m.liquid||'')}</td><td>${md(o.jo)}</td><td>${o.n}台${[5,6,0].includes(dparse(o.jo).getDay())?'（月曜の粕放しまで）':''}</td></tr>`).join('')}</table>
      <p class="jf-sm">この日に要る台数 ${S.ya.need}台 ／ 空き ${S.ya.free}台。ヤブタは2台で、伝辛・超辛・純米辛口は2台とも使います。金・土・日に搾ると月曜の粕放しまで使えません。</p>`; }
    if(S.dy){ h+=`<span class="jf-kind do">四段洗米が土曜になります</span>
      <p class="jf-p">上槽 <b>${md(jo0)}</b>（${rcDays(m.tome,jo0)+1}日目）のままだと、四段洗米が <b>${md(S.dy.sen)}</b> になります。土曜は洗米しません。上槽まで あと <b>${S.dy.left}日</b>。</p>
      <p class="jf-sm">繰り上げるか繰り下げるかは、醪の様子を見て決めてください。</p>`; }
    if(!h) h=`<p class="jf-p">いまは重なりも土曜の洗米もありません。</p>`;
    return h; };
  /* 候補の日：その日を上槽日にしたら */
  const cand=x=>{ const Y=jfYabuta({[m.no]:x})[m.no];
    const sen=yod?(s0&&s0.sen?dadd(s0.sen, rcDays(jo0,x)):dadd(x,-2)):'';
    return {ya:!!Y, sen, sat:!!(sen&&dparse(sen).getDay()===6)}; };
  const newSch=x=>{ const n=rcDays(jo0,x); if(!s0) return null;
    const o={}; ['sen','shi','soe','alc'].forEach(k=>o[k]=s0[k]?dadd(s0[k],n):''); return o; };
  const pv=x=>{ if(x===jo0) return '<span class="jf-sm">日を選ぶと、ずらしたあとの作業予定が出ます</span>';
    const s=newSch(x);
    if(s){ return ydPv(Object.assign({}, s, {jo:x})); }
    return `<span class="yd-pvi"><span class="yd-tg yd-jo">上槽</span><b>${md(x)}</b></span>${yod?`<span class="jf-sm">（四段の日程はまだ入っていません。四洗は ${md(dadd(x,-2))} の見込み）</span>`:''}`; };
  const draw=msg=>{
    const D=[-3,-2,-1,0,1,2,3].map(i=>dadd(jo0,i));
    w.innerHTML=`<div class="yd-sheet"><div class="yd-grab"></div>
      <div class="yd-hd"><b>${esc(String(m.no))}号 ${esc(m.liquid||'')}</b>　<span class="yd-tk">T${esc(String(m.tank||''))}</span><button type="button" class="yd-x" data-a="close">✕</button></div>
      ${why()}
      <div class="jf-h">作業予定を変える（上槽日を選ぶ）</div>
      <div class="jf-days">${D.map(x=>{ const c=cand(x), wd=dparse(x).getDay(), past=x<today;
        return `<button type="button" class="jf-d${x===jo0?' now':''}${x===sel?' on':''}${wd===6?' sat':wd===0?' sun':''}" data-d="${x}"${past?' disabled':''}>
          <b>${dparse(x).getMonth()+1}/${dparse(x).getDate()}</b><small>（${WD[wd]}）</small><small>${rcDays(m.tome,x)+1}日目</small>
          <small>ヤブタ ${c.ya?'<span class="ng">×</span>':'<span class="ok">○</span>'}</small>
          ${yod?`<small>四洗 ${c.sat?'<span class="wn">土</span>':WD[dparse(c.sen).getDay()]}</small>`:''}
          ${x===jo0?'<small>いま</small>':''}</button>`; }).join('')}</div>
      <div class="jf-pv">${pv(sel)}</div>
      <div class="yd-er" style="min-height:18px;margin:2px">${esc(msg||'')}</div>
      <div class="yd-row"><button type="button" class="yd-b" data-a="close">やめる</button><button type="button" class="yd-b go" data-a="ok"${sel===jo0?' disabled':''}>決定</button></div>
      <div class="yd-row"><button type="button" class="yd-b sm" data-a="menu">1日ずつ作業を変える ›</button></div></div>`;
    w.querySelectorAll('[data-a="close"]').forEach(b=>b.onclick=close);
    w.querySelectorAll('.jf-d[data-d]').forEach(b=>b.onclick=()=>{ sel=b.dataset.d; draw(); });
    w.querySelector('[data-a="menu"]').onclick=()=>{ close(); const st=(s0&&s0.sen)||(yod?dadd(jo0,-2):jo0); ydMenu(m, st<today?today:st); };
    w.querySelector('[data-a="ok"]').onclick=()=>{ if(save()) close(); };
  };
  const save=()=>{
    if(sel===jo0) return true;
    const p=jsPlan(m), s=newSch(sel), keys=[];
    if(s){ if(s.sen&&s.sen<today){ draw('四洗が今日より前になります。「1日ずつ作業を変える」で直してください'); return false; }
      const item={name:YD_SCH, kind:'日程', no:String(m.no), liquid:m.liquid||'', tank:String(m.tank||''), plan:s.soe||s.alc||s.shi||s.sen, memo:JSON.stringify({sen:s.sen||'', shi:s.shi||'', soe:s.soe||'', alc:s.alc||''})};
      keys.push(['mw', ydLocal('mw', item)]);
      keys.push(['rk', ydLocal('rk', {name:'上槽', no:String(m.no), liquid:m.liquid||'', tank:String(m.tank||''), plan:sel, memo:'計画 '+p})]);
      rcToast(`${m.no}号の作業予定を ${rcDays(jo0,sel)>0?rcDays(jo0,sel)+'日後ろ':(-rcDays(jo0,sel))+'日前'}へずらしました（上槽 ${md(sel)}）`); ydAfterJo();
      ydBg('日程', async()=>{ const it=(MW.items||[]).find(x=>!x.deleted&&x.name===YD_SCH&&String(x.no)===String(m.no)&&x.id);
        mwKeep(await mwApi({action:'save', item:Object.assign({}, item, {id:it?it.id:''})})); ydReapply();
        const j=await ydSaveJo(m, sel); if(j&&j.calErr) rcToast('日程は保存しました（カレンダーに入れられませんでした：'+j.calErr+'）', true, 8000);
        ydReapply(); try{ jsApply(RC.state); }catch(e){} ydRepaint(); return true; }, keys);
    } else {
      keys.push(['rk', ydLocal('rk', {name:'上槽', no:String(m.no), liquid:m.liquid||'', tank:String(m.tank||''), plan:sel, memo:'計画 '+p})]);
      rcToast(`${m.no}号の上槽日を ${md(sel)} にしました`); ydAfterJo();
      ydBg('上槽日', async()=>{ const j=await ydSaveJo(m, sel); if(j&&j.calErr) rcToast('カレンダーに入れられませんでした：'+j.calErr, true, 8000);
        ydReapply(); try{ jsApply(RC.state); }catch(e){} ydRepaint(); return j; }, keys);
    }
    return true;
  };
  draw();
}
/* 点滅しているマスだけ横取りする（ほかのマスは今までどおり作業の窓） */
window.addEventListener('click', e=>{
  const td=e.target.closest&&e.target.closest('.kg-home .kg-t tr.top td.jf-ya, .kg-home .kg-t tr.top td.jf-do'); if(!td) return;
  if(!document.getElementById('kgHd')) return;
  if(e.target.closest('input,select,textarea,a,.yd-box,.yd-pm,.yd-tkadd')) return;
  const tr=td.closest('tr[data-kg]'); const m=tr&&rcMaster(tr.dataset.kg); if(!m||!m.tome) return;
  e.stopImmediatePropagation(); e.preventDefault();
  jfOpen(m);
}, true);
</script>
<!-- /jsflash1123 -->
