import fs from "node:fs";
import path from "node:path";
const root=process.cwd();
const out=path.join(root,"dist");
fs.rmSync(out,{recursive:true,force:true});
for(const name of ["index.html","manifest.webmanifest","src","styles","images"]){
 const from=path.join(root,name);
 if(fs.existsSync(from))fs.cpSync(from,path.join(out,name),{recursive:true});
}
console.log("Built static app into dist/");
