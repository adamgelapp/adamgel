import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
const root = resolve('public');
let checked=0;
for (const page of ['index.html', 'collaborative-resource/index.html', 'what-is-adamgel/index.html', 'projects/index.html', 'global/index.html', 'contact/index.html']) {
const html = readFileSync(resolve(root,page),'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
for(const [,url] of html.matchAll(/(?:href|src|data-image)="([^"]+)"/g)){
 if(url.startsWith('#')){if(!ids.has(url.slice(1)))throw Error(`Missing anchor ${url}`);}
 else if(url.startsWith('/')){ const [pathname,anchor]=url.split('#'); let path=resolve(root,'.'+pathname); if(existsSync(path)&&statSync(path).isDirectory())path=resolve(path,'index.html'); if(!existsSync(path)||statSync(path).size<100)throw Error(`Missing or empty asset ${url}`); if(anchor&&!readFileSync(path,'utf8').includes(`id="${anchor}"`))throw Error(`Missing destination anchor ${url}`); }
 checked++;
}
}
const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));
if(config.name!=='adamgel'||config.assets.directory!=='./public')throw Error('Unexpected deployment configuration');
console.log(`Validated ${checked} links and image references, all local assets, and Worker configuration.`);
