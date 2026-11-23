<!-- hinashi1123 -->
<script>
/* ================= 🔥 火入無（2026-11-23 泰広さん指示） =================
   火入をしない液種があるので、火入の予定の中で「火入無」を選べるようにする。
   ・火入の窓（🔥火入の予定・記録）の仕込順号のアイコンの並び（先頭）に「🚫 火入無」のアイコン。押すと選んだ状態になり、予定日・済んだ日・担当・タンク・数量・温度は隠れる。
     仕込順号を選んで、いつもの「保存」を押せば火入無で保存される。濾過の予定がまだの仕込みも選べる（上槽の前後）
     （2026-11-23 泰広さん指示で、窓の上の切り替えから 仕込順号のアイコンの中のアイコン＋いつもの保存 に変更）
   ・📅予定の「＋ この日に予定」にも「🚫 火入無」→ 火入無のアイコンを選んだ状態で窓が開く
   ・保存：表「濾過火入」に 工程＝火入・区分(kind)＝火入無・予定日/済んだ日/担当は空 の行（サーバーの変更なし。
     日が無いので部署カレンダー・本日の予定・出勤表には何も出ない。前に火入の予定が入っていた行を火入無にすると、その予定はサーバーが消す）
   ・火入無の仕込みは「火入予定 ○号」の注意を出さない。🔥火入の一覧では「済」の並びに「火入無」の札（灰色）。📊解析の火入も「火入無」
   ・火入無をやめる：窓を開いて切り替えをオフにし、ふつうに予定日を入れて保存
   控え：seishu-workbook_github\_src_hinashi1123.js（index.html の hinashi1123 の目印の間、</body> の直前） */
const HN_KIND='火入無';
const _hnOf0=rkOf;
rkOf=function(m,today){
  const o=_hnOf0(m,today);
  try{ if(o.hi && String(o.hi.kind||'')===HN_KIND){ o.hiN=true; o.hiP=''; o.hiD=o.R||o.J||dtoday(); o.warn=o.warn.filter(w=>w.k!=='火入'); } }catch(e){}
  return o;
};
/* 🔥火入の一覧：火入無の札 */
const _hnDraw0=rkDraw;
rkDraw=function(){
  _hnDraw0();
  try{
    if(RK_TAB!=='火入') return;
    const by={}; rkAll().forEach(o=>by[String(o.m.no)]=o);
    document.querySelectorAll('#rkBox .rks-t[data-no]').forEach(b=>{ const o=by[String(b.dataset.no)]; if(!o||!o.hiN) return;
      b.className='rks-t hn'; const s=b.querySelector('.s'); if(s) s.textContent='🚫 火入無'; });
  }catch(e){}
};
/* 📅予定の「＋ この日に予定」に 火入無 */
const _hnYk0=ykDraw;
ykDraw=function(){
  _hnYk0();
  try{
    app.querySelectorAll('.yk-pick').forEach(p=>{ if(p.querySelector('[data-hn]')) return;
      const b=document.createElement('button'); b.dataset.hn='1'; b.textContent='🚫 火入無';
      b.onclick=()=>{ p.hidden=true; window.HN_PRE=true; rkDialog('火入',[]); };
      p.appendChild(b); });
  }catch(e){}
};
/* 火入の窓に切り替えを足す（どこから開いても：窓ができたら付ける） */
function hnEnhance(d){
  if(d.dataset.hn) return; const hd=d.querySelector('.rk-hd'); if(!hd||!/火入/.test(hd.textContent)) return;
  d.dataset.hn='1';
  const pre=!!window.HN_PRE; window.HN_PRE=false;
  const nosBox=d.querySelector('.rk-nos'); if(!nosBox) return;
  const on0=[...nosBox.querySelectorAll('button.on')].map(b=>b.dataset.n);
  const first=on0.length?rkRow('火入',on0[0]):null;
  let on=pre||!!(first&&String(first.kind||'')===HN_KIND);
  /* 濾過の予定がまだの仕込み（上槽の前後）も選べるように（火入無のときだけ出す） */
  const today=dtoday(), have=new Set([...nosBox.querySelectorAll('button[data-n]')].map(b=>String(b.dataset.n)));
  let extra=[]; try{ extra=rkAll().filter(o=>!o.R&&o.J&&o.J<=dadd(today,21)&&o.J>=dadd(today,-60)&&!have.has(String(o.m.no))).sort((a,b)=>Number(a.m.no)-Number(b.m.no)); }catch(e){}
  nosBox.querySelectorAll('.tl-note').forEach(x=>x.classList.add('hn-empty'));
  extra.forEach(o=>{ const b=document.createElement('button'); b.type='button'; b.className='hn-x'; b.dataset.n=String(o.m.no);
    b.innerHTML=`${esc(String(o.m.no))}<small>${esc(o.m.liquid||'')}<br>上槽 ${rcMD(o.J)}</small>`; b.onclick=()=>b.classList.toggle('on'); nosBox.appendChild(b); });
  const ic=document.createElement('button'); ic.type='button'; ic.className='hn-ic'; ic.innerHTML='🚫 火入無<small>火入をしない</small>';
  nosBox.prepend(ic);
  const note=document.createElement('div'); note.className='hn-note'; note.textContent='火入無：選んだ仕込順号を「火入をしない」として保存します（火入の注意・カレンダー・出勤表には出ません）';
  nosBox.after(note);
  const memoL=d.querySelector('#rkMemo')&&d.querySelector('#rkMemo').closest('.rk-f');
  const hideEls=[...d.querySelectorAll('.rk-f, .rk-lim')].filter(x=>x!==memoL);
  const paint=()=>{ ic.classList.toggle('on',on); note.style.display=on?'':'none';
    hideEls.forEach(x=>x.style.display=on?'none':''); d.querySelectorAll('.hn-x').forEach(x=>{ x.style.display=on?'':'none'; if(!on) x.classList.remove('on'); });
    d.querySelectorAll('.hn-empty').forEach(x=>x.style.display=on&&extra.length?'none':'');
  };
  ic.onclick=()=>{ on=!on; paint(); };
  paint();
  /* 火入無のときの保存（もとの保存より先に受ける） */
  d.addEventListener('click',async e=>{
    const btn=e.target.closest&&e.target.closest('#rkSave'); if(!btn||!on) return;
    e.stopPropagation(); e.preventDefault();
    const s=[...nosBox.querySelectorAll('button[data-n].on')].map(b=>b.dataset.n); if(!s.length){ rcToast('仕込順号を選んでください',true); return; }
    const st=dpState()||{}, memo=(d.querySelector('#rkMemo')||{}).value||'';
    btn.disabled=true; btn.textContent='保存中…';
    try{
      for(const n of s){ const m=(st.master||[]).find(x=>String(x.no)===String(n))||{}; const old=rkRow('火入',n);
        const item={ id:old?old.id:'', name:'火入', kind:HN_KIND, no:String(n), liquid:m.liquid||(old&&old.liquid)||'', plan:'', date:'', tank:'', qty:'', memo:memo.trim(), staff:'' };
        const j=await rkApi({action:'save', item, noShukkin:true}); rkKeep(j); if(j.calErr) rcToast('カレンダー：'+j.calErr,true,8000); if(j.shErr) rcToast(j.shErr,true,10000); }
      d.remove(); rcToast(`${s.join('・')}号を「火入無」にしました`);
      if(document.getElementById('rkBox')||document.getElementById('ykBox')) rkDraw();
    }catch(err){ btn.disabled=false; btn.textContent='保存'; rcToast(String(err.message||err),true,8000); }
  },true);
}
new MutationObserver(ms=>{ ms.forEach(m=>m.addedNodes.forEach(n=>{ if(n.nodeType===1&&n.classList&&n.classList.contains('rk-dlg')) try{ hnEnhance(n); }catch(e){} })); }).observe(document.body,{childList:true});
(function(){ const s=document.createElement('style'); s.textContent=`
.rk-nos button.hn-ic{border:1px dashed #777;color:#444;font-size:14px}.rk-nos button.hn-ic small{color:#777}
.rk-nos button.hn-ic.on{background:#555;border:1px solid #555;color:#fff}.rk-nos button.hn-ic.on small{color:#eee}
.hn-note{font-size:12px;color:#444;background:#f1f1f1;border-radius:8px;margin:6px 0 0;padding:6px 8px;line-height:1.5}
.rks-t.hn{border:1px dashed #888;background:#f4f4f4}.rks-t.hn .s{color:#555}
.yk-pick button[data-hn]{border-color:#777;color:#444}`; document.head.appendChild(s); })();
</script>
<!-- /hinashi1123 -->