/* 製造ツール サービスワーカー（2026-09-24）
   ・画面のファイル（index.html など）：まずネットから。3秒待っても来なければ端末の保存分を出す
     （電波が弱い蔵の中でもすぐ開く。電波があれば常に最新）
   ・表示用の部品（cdnjs の mammoth / xlsx）：一度取ったら端末の保存分を使う
   ・サーバー（script.google.com）とのやりとりは一切さわらない */
const V = 'mfg-sw-1';
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
  e.respondWith((async () => {
    const c = await caches.open(V);
    const net = fetch(r).then(res => { if (res.ok) c.put(key, res.clone()); return res; });
    try {
      const res = await Promise.race([net, new Promise(ok => setTimeout(() => ok(null), 3000))]);
      if (res) return res;
    } catch (err) {}
    const hit = await c.match(key);
    if (hit) return hit;
    return net;
  })());
});
