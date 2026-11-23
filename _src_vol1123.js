<!-- vol1123 -->
<script>
/* ================= 本日の予定：作業量（盛・蒸米・仕込み）を棒の中にkg 2026-11-23 =================
   泰広さん指示：その日の作業量で麹の盛の量、仕込みの蒸米の量がパッと見て分かるように（多いと分かれば対策ができる）。
   見本 Claude outputs/製造ツール_作業量_盛と蒸米_見本.html から 案3（予定の棒の中にkg）に決定。
   ・盛＝麹管理の盛日の麹米kgの合計／蒸米＝前日の洗米予定表の合計kg／仕込み＝前日の洗米の 添・仲・留 の掛米kg
   ・多い＝橙、とても多い＝赤（数字の色＋棒の縁）。目安は DP_VOL だけ直す（仮：盛 350/450kg、蒸米・仕込み 1,500/2,500kg）
   ・dpItems を外側から包み、ラベルの後ろに「 480kg」を足す。描画は dpPlanHTML の棒の文字を dpLbl(x) で出す
   控え：seishu-workbook_github\_src_vol1123.js（index.html の vol1123 の目印の間、</body> の直前） */
const DP_VOL={mori:[350,450], mushi:[1500,2500], shk:[1500,2500]};
(function(){
  const s=document.createElement('style'); s.textContent=`
.dp-b .dp-kg{font-style:normal;font-weight:800;margin-left:2px}
.dp-b .dp-kg.l1{color:#c46a00}.dp-b .dp-kg.l2{color:#b31b14}
.dp-b.dp-v1{box-shadow:inset 0 0 0 1.5px #e39a2d}.dp-b.dp-v2{box-shadow:inset 0 0 0 1.5px #d62b22}`;
  document.head.appendChild(s);
})();
function dpVolLv(k,v){ const t=DP_VOL[k]; return !t||!(v>0)?0:v>=t[1]?2:v>=t[0]?1:0; }
function dpLbl(x){
  const L=String(x.label||'');
  if(!x.kgs||L.slice(-x.kgs.length)!==x.kgs) return esc(L);
  return esc(L.slice(0,-x.kgs.length).replace(/ $/,''))+`<em class="dp-kg ${x.kgl?'l'+x.kgl:''}">${esc(x.kgs)}</em>`;
}
(function(){
  if(typeof dpItems!=='function') return;
  const base=dpItems;
  dpItems=function(date){
    const out=base.apply(this,arguments);
    try{
      const S=MFG&&MFG.senmai, s=S&&S.days&&S.days[dadd(date,-1)];
      let mu=0, sk=0;
      if(s&&s.e) s.e.forEach(e=>{ const c=(S.cols||[])[e[0]]||[], q=Number(e[6]||0); mu+=q; if(/^(添|仲|留)$/.test(c[0]||'')&&c[1]==='掛') sk+=q; });
      const j=RC&&RC.koji&&RC.koji[date]; let mo=0;
      if(j&&j.koji) j.koji.forEach(r=>{ if(r['盛日']===date) mo+=Number(r['麹米kg']||0); });
      const put=(x,k,v)=>{ if(!x||!(v>0)||x.kgs) return; const t=Math.round(v).toLocaleString('ja-JP')+'kg'; x.kgs=t; x.label=String(x.label)+' '+t; x.kgl=dpVolLv(k,v); if(x.kgl) x.cls=(x.cls||'')+' dp-v'+x.kgl; };
      put(out.find(x=>x.lane==='koji'&&String(x.label).indexOf('盛')===0),'mori',mo);
      put(out.find(x=>x.lane==='mushi'),'mushi',mu);
      put(out.find(x=>x.lane==='shk'&&!x.odori&&x.d&&x.d.title==='仕込み'),'shk',sk);
    }catch(e){}
    return out;
  };
})();
</script>
<!-- /vol1123 -->
