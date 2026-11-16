const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {async fetch(request,env){
const url=new URL(request.url);
if(url.pathname!=='/api/comments')return env.ASSETS.fetch(request);
try{
if(request.method==='GET'){
const {results}=await env.DB.prepare('SELECT id,name,message,created_at FROM comments ORDER BY created_at DESC LIMIT 100').all();
return json({comments:results});
}
if(request.method!=='POST')return json({error:'Method not allowed'},405);
if(request.headers.get('Origin')!==url.origin)return json({error:'Please submit from this website.'},403);
if(!request.headers.get('Content-Type')?.includes('application/json'))return json({error:'Expected JSON'},415);
const reader=request.body?.getReader();if(!reader)return json({error:'Empty request'},400);
let size=0,parts=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>12000){await reader.cancel();return json({error:'Comment too long'},413);}parts.push(value);}
let data;try{data=JSON.parse(await new Blob(parts).text());}catch{return json({error:'Invalid request'},400);}
if(!data||typeof data.name!=='string'||typeof data.message!=='string')return json({error:'Please enter your name and comment.'},400);
const name=data.name.trim(),message=data.message.trim();
if(data.website||!name||name.length>80||message.length<3||message.length>2000||data.consent!==true)return json({error:'Enter a name (up to 80 characters), a comment (3–2,000 characters), and confirm public posting.'},400);
const ip=request.headers.get('CF-Connecting-IP')||'unknown';
const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new Date().toISOString().slice(0,10)+ip));
const key=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
const id=crypto.randomUUID(),now=Date.now();
const result=await env.DB.prepare('INSERT INTO comments (id,name,message,created_at,visitor) SELECT ?,?,?,?,? WHERE NOT EXISTS (SELECT 1 FROM comments WHERE visitor=? AND created_at>?)').bind(id,name,message,now,key,key,now-60000).run();
if(!result.meta.changes)return json({error:'Please wait a minute before posting again.'},429);
return json({comment:{id,name,message,created_at:now}},201);
}catch(error){console.error(JSON.stringify({event:'comments_error',message:error.message}));return json({error:'Comments are temporarily unavailable. Please try again.'},503);}
}};
