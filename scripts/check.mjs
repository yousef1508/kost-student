import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
const files=[];
function walk(dir){
 for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  const full=path.join(dir,entry.name);
  if(entry.isDirectory())walk(full);
  else if([".js",".mjs",".cjs"].includes(path.extname(entry.name)))files.push(full);
 }
}
for(const dir of ["src","scripts","tests"])if(fs.existsSync(dir))walk(dir);
let failed=false;
for(const file of files){
 const result=spawnSync(process.execPath,["--check",file],{encoding:"utf8"});
 if(result.status!==0){failed=true;process.stderr.write("\n"+file+"\n"+result.stderr);}
}
if(failed)process.exit(1);
console.log("Syntax check passed for "+files.length+" JavaScript files.");
