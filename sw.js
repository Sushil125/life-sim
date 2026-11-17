/* Life Simulator offline helper. Bump VERSION when you change this file. */
const VERSION='life-v1';
const CORE=['./','index.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  /* network first so updates show at once; cached copy when offline */
  e.respondWith(fetch(req).then(r=>{if(r.ok&&r.type==='basic'){const cp=r.clone();caches.open(VERSION).then(c=>c.put(req,cp))}return r})
    .catch(()=>caches.open(VERSION).then(c=>c.match(req,{ignoreSearch:true})).then(h=>h||Response.error())));
});
