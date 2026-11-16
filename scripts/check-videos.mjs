import {readFileSync,statSync} from 'node:fs';
for(const name of ['making','recycling']){
 const root=`public/videos/${name}/`;
 const playlist=readFileSync(root+'index.m3u8','utf8');
 if(!playlist.includes('#EXT-X-ENDLIST'))throw Error(`${name} conversion incomplete`);
 const segments=playlist.split(/\r?\n/).filter(line=>line&&!line.startsWith('#'));
 for(const file of segments){const size=statSync(root+file).size;if(size===0||size>=25*1024*1024)throw Error(`Invalid segment ${file}`);}
 console.log(`${name}: ${segments.length} complete playable segments`);
}
