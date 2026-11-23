const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),vm=require("node:vm");
const context=vm.createContext({console,Date,Math,Number,Object,Map,Set});
for(const file of ["src/data/catalog.js","src/domain/nutrition-inventory.js"])vm.runInContext(fs.readFileSync(file,"utf8"),context,{filename:file});
vm.runInContext("globalThis.api={nutritionFor,inventoryAmount,inventoryPurchaseCost};",context);const api=context.api;
test("nutrition is calculated from ingredient quantities",()=>{const r=api.nutritionFor([{id:"eggs",qty:2,unit:"stk"}]);assert.equal(r.protein,13.6);assert.equal(r.kcal,156);assert.deepEqual(Array.from(r.unknown),[]);});
test("inventory uses package sizes and whole-pack rounding",()=>{const s={pantry:{lentils:0.6}};assert.equal(api.inventoryAmount(s,"lentils"),300);const c=api.inventoryPurchaseCost(s,{lentils:600});assert.equal(c.count,1);assert.equal(c.cost,27.9);});
test("unknown nutrition ingredients are surfaced",()=>{const r=api.nutritionFor([{id:"not-in-catalogue",qty:100,unit:"g"}]);assert.deepEqual(Array.from(r.unknown),["not-in-catalogue"]);});
