import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const dist = new URL('../dist/', import.meta.url);
async function files(dir, prefix = '') {
  const entries = await readdir(dir, { withFileTypes: true });
  const output = [];
  for (const entry of entries) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) output.push(...await files(new URL(name + '/', dist), name + '/'));
    else if (name !== 'sw.js' && !name.endsWith('.map')) output.push(name);
  }
  return output.sort();
}
const assets = await files(dist);
const hash = createHash('sha256');
for (const name of assets) hash.update(name).update(await readFile(new URL(name, dist)));
const version = hash.digest('hex').slice(0, 16);
const source = `const PREFIX = 'brainwave:' + self.registration.scope + ':';
const CACHE = PREFIX + ${JSON.stringify(version)};
const ASSETS = ${JSON.stringify(assets)}.map(path => new URL(path, self.registration.scope).href);
const SHELL = new URL('index.html', self.registration.scope).href;
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !request.url.startsWith(self.registration.scope)) return;
  const relative = request.url.slice(self.registration.scope.length);
  if (relative.startsWith('api/') || relative.startsWith('admin/')) return;
  if (request.mode === 'navigate') {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(SHELL)).then(hit => hit || fetch(request)));
  } else if (ASSETS.includes(request.url)) {
    event.respondWith(caches.open(CACHE).then(cache => cache.match(request)).then(hit => hit || fetch(request)));
  }
});
`;
await writeFile(new URL('sw.js', dist), source);
console.log('Generated offline cache for ' + assets.length + ' build assets (' + version + ')');
