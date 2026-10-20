const CACHE='pouch-tracker-v44';const ASSETS=['./','./index.html','./style.css?v=44','./app.js?v=44','./resources.js?v=44','./tapering.js?v=44','./sudoku.js?v=44','./fonts/merriweather-latin.ttf','./fonts/oswald-latin.ttf','./manifest.webmanifest','./icons/icon-192.png','./icons/icon-512.png'];self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('pouch-tracker-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));self.addEventListener('fetch',e=>{if(e.request.method!=='GET'||new URL(e.request.url).origin!==self.location.origin)return;// Fonts have stable URLs and are precached; avoid a network round trip on reopening.
const fontPaths=['./fonts/oswald-latin.ttf','./fonts/merriweather-latin.ttf'].map(path=>new URL(path,self.location.href).pathname);
if(fontPaths.includes(new URL(e.request.url).pathname)&&e.request.cache!=='reload'){
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(e.request);if(cached)return cached;
    const response=await fetch(e.request);if(response.ok)await cache.put(e.request,response.clone());return response;
  }));return;
}
e.respondWith(fetch(e.request).then(r=>{if(r.ok){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}).catch(()=>e.request.cache==='reload'?Response.error():caches.match(e.request).then(r=>r||(e.request.mode==='navigate'?caches.match('./index.html'):Response.error()))))});
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
