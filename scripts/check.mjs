import {readFileSync, existsSync, statSync} from 'node:fs';
import {resolve} from 'node:path';
const root = resolve('public');
const html = readFileSync(resolve(root,'index.html'),'utf8');
const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]));
let checked=0;
for(const [,url] of html.matchAll(/(?:href|src|data-image)="([^"]+)"/g)){
 if(url.startsWith('#')){if(!ids.has(url.slice(1)))throw Error(`Missing anchor ${url}`);}
 else if(url.startsWith('/') && url!=='/'){ const path=resolve(root,'.'+url); if(!existsSync(path)||statSync(path).size<100)throw Error(`Missing or empty asset ${url}`); }
 checked++;
}
const config=JSON.parse(readFileSync('wrangler.jsonc','utf8'));
if(config.name!=='adamgel'||config.assets.directory!=='./public')throw Error('Unexpected deployment configuration');
console.log(`Validated ${checked} links and image references, all local assets, and Worker configuration.`);
