import http from "node:http";import fs from "node:fs";import path from "node:path";
const root=path.resolve(process.argv[2]||"."),port=Number(process.env.PORT||4173);
const mime={".html":"text/html; charset=utf-8",".css":"text/css; charset=utf-8",".js":"text/javascript; charset=utf-8",".json":"application/json; charset=utf-8",".webmanifest":"application/manifest+json",".jpg":"image/jpeg",".jpeg":"image/jpeg",".png":"image/png"};
http.createServer((req,res)=>{const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname),target=path.resolve(root,pathname==="/"?"index.html":pathname.replace(/^\\/+/, ""));
if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403).end("Forbidden");return;}
fs.stat(target,(err,stat)=>{const file=err||!stat.isFile()?path.join(root,"index.html"):target;fs.readFile(file,(readErr,data)=>{if(readErr){res.writeHead(404).end("Not found");return;}res.writeHead(200,{"Content-Type":mime[path.extname(file).toLowerCase()]||"application/octet-stream","Cache-Control":"no-cache","X-Content-Type-Options":"nosniff"});res.end(data);});});}).listen(port,"127.0.0.1",()=>console.log(`KOST Student running at http://localhost:${port}`));
