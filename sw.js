/* 製造ツール サービスワーカー（2026-09-24／2026-10-09 画面は最新優先に変更）
   ・画面のファイル（index.html など）：まずネットから。3秒待っても来なければ端末の保存分を出す
     （電波が弱い蔵の中でもすぐ開く。電波があれば常に最新）
   ・表示用の部品（cdnjs の mammoth / xlsx）：一度取ったら端末の保存分を使う
   ・サーバー（script.google.com）とのやりとりは一切さわらない */
const V = 'mfg-sw-2';   // 2026-10-09 古い保存分を一度捨てる
self.addEventListener('install', e => { self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== V).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith((async () => {
      const c = await caches.open(V);
      const hit = await c.match(r.url);
      if (hit) return hit;
      const res = await fetch(r);
      if (res.ok || res.type === 'opaque') c.put(r.url, res.clone());
      return res;
    })());
    return;
  }
  if (u.origin !== self.location.origin) return;
  const key = u.origin + u.pathname;
  // 2026-10-09：画面（HTML）は、つながる限り必ず最新を出す。端末の保存分は「圏外・15秒たっても来ない」ときだけ
  //   （以前は3秒で古い保存分を出していたため、電波が弱いと古いホーム画面が出ていた）
  //   cache:'no-cache' … ブラウザの10分キャッシュも使わず、変わっていないかをGitHubに確かめる
  const isPage = r.mode === 'navigate' || /\.html?$|\/$/.test(u.pathname);
  e.respondWith((async () => {
    const c = await caches.open(V);
    const net = fetch(r, isPage ? { cache: 'no-cache' } : undefined)
      .then(res => { if (res.ok) c.put(key, res.clone()); return res; });
    try {
      const res = await Promise.race([net, new Promise(ok => setTimeout(() => ok(null), isPage ? 15000 : 3000))]);
      if (res) return res;
    } catch (err) {}
    const hit = await c.match(key);
    if (hit) return hit;
    return net;
  })());
});
