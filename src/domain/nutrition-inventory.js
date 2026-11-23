/* Nutrition, meal composition, pantry ledger, and meal-plan optimisation. */
/* KOST Student - ingredient-based nutrition + daily stock ledger.
 * Amounts are raw/dry unless stated; nutrition values are indicative per 100 g/ml
 * or per individual egg. No pork or oatmeal ingredients are included.
 * Sources: Matvaretabellen and package-comparable generic values; see README.
 */
const FOOD_NUTRITION = Object.freeze({
  chicken:{protein:18.0,kcal:143}, eggs:{protein:6.8,kcal:78,per:'stk'},
  cottage:{protein:13.0,kcal:97}, milk:{protein:3.5,kcal:41},
  tuna:{protein:24.0,kcal:105}, salmon:{protein:20.0,kcal:206},
  mackerel:{protein:13.0,kcal:190}, peas:{protein:22.0,kcal:337},
  lentils:{protein:24.0,kcal:345}, bread:{protein:10.0,kcal:230},
  rice:{protein:7.0,kcal:355}, pasta:{protein:12.0,kcal:340},
  potatoes:{protein:2.0,kcal:80}, carrots:{protein:0.9,kcal:41},
  cabbage:{protein:1.4,kcal:30}, onions:{protein:1.1,kcal:40},
  bananas:{protein:1.1,kcal:89}, apples:{protein:0.3,kcal:52},
  broccoli:{protein:3.0,kcal:34}, tomatoes:{protein:1.1,kcal:28},
  oil:{protein:0,kcal:884}, spices:{protein:0,kcal:0,per:'stk'}
});
const MEAL_SLOT_NAMES = Object.freeze({breakfast:'Frokost',lunch:'Lunsj',dinner:'Middag',evening:'Kveldsmat',extra:'Mellommåltid',secondSnack:'Ettermiddag'});
const MEAL_COUNTS = Object.freeze({2:['lunch','dinner'],3:['breakfast','lunch','dinner'],4:['breakfast','lunch','dinner','evening'],5:['breakfast','lunch','dinner','evening','extra'],6:['breakfast','lunch','secondSnack','dinner','evening','extra']});
const MEAL_SLOTS = MEAL_COUNTS[4];
function configuredMealCount(state){const n=Number(state.mealCount);return Number.isInteger(n)&&n>=2&&n<=6?n:4;}
function dayMealCount(state,date){return Number(state.dayMealCounts?.[date])||configuredMealCount(state);}
function activeMealSlots(state,date){return MEAL_COUNTS[dayMealCount(state,date)]||MEAL_SLOTS;}

const MINI_MEALS = Object.freeze({
 breakfast:[
  {id:'budget_eggs',name:'Egg, grovbrød og banan',image:'meal_mini_budget_eggs',minutes:12,ingredients:[{id:'eggs',qty:2,unit:'stk'},{id:'bread',qty:120,unit:'g'},{id:'bananas',qty:100,unit:'g'}],steps:['Kok eggene i 9–10 minutter til de er faste.','Server med grovbrød og en banan.']},
  {id:'eggs_bread',name:'Egg, brød og eple',image:'meal_mini_eggs_bread',ingredients:[{id:'eggs',qty:3,unit:'stk'},{id:'bread',qty:120,unit:'g'},{id:'apples',qty:150,unit:'g'}]},
  {id:'cottage_banana',name:'Cottage cheese og banan',image:'meal_mini_cottage_banana',ingredients:[{id:'cottage',qty:250,unit:'g'},{id:'bread',qty:80,unit:'g'},{id:'bananas',qty:120,unit:'g'}]},
  {id:'tuna_toast',name:'Tunfisk på grovbrød',image:'meal_mini_tuna_toast',ingredients:[{id:'tuna',qty:120,unit:'g'},{id:'bread',qty:120,unit:'g'},{id:'carrots',qty:120,unit:'g'}]}
 ],
 lunch:[
  {id:'budget_lentils',name:'Krydret linsebolle med ris',image:'meal_mini_budget_lentils',minutes:30,ingredients:[{id:'rice',qty:100,unit:'g'},{id:'lentils',qty:100,unit:'g'},{id:'carrots',qty:150,unit:'g'},{id:'onions',qty:50,unit:'g'},{id:'oil',qty:10,unit:'ml',optional:true}],steps:['Skyll risen og kok etter anvisningen på posen.','Skyll de tørre røde linsene og kok dem helt myke, vanligvis 12–15 minutter.','Finhakk løken og rasp gulroten. Stek kort med litt olje, bland inn linser og server med ris.']},
  {id:'lentil_eggs',name:'Linser, egg og ris',image:'meal_mini_lentil_eggs',ingredients:[{id:'lentils',qty:100,unit:'g'},{id:'eggs',qty:2,unit:'stk'},{id:'tomatoes',qty:200,unit:'g'},{id:'onions',qty:80,unit:'g'},{id:'rice',qty:75,unit:'g'}]},
  {id:'tuna_rice',name:'Tunfiskbolle med ris',image:'meal_mini_tuna_rice',ingredients:[{id:'tuna',qty:130,unit:'g'},{id:'rice',qty:90,unit:'g'},{id:'broccoli',qty:200,unit:'g'},{id:'oil',qty:5,unit:'ml',optional:true}]},
  {id:'cottage_eggs',name:'Egg og cottage cheese',image:'meal_mini_cottage_eggs',ingredients:[{id:'eggs',qty:2,unit:'stk'},{id:'cottage',qty:200,unit:'g'},{id:'bread',qty:100,unit:'g'},{id:'carrots',qty:100,unit:'g'}]}
 ],
 evening:[
  {id:'budget_lentil_eggs',name:'Linser, egg og brød',image:'meal_mini_budget_lentil_eggs',minutes:20,ingredients:[{id:'lentils',qty:80,unit:'g'},{id:'eggs',qty:2,unit:'stk'},{id:'bread',qty:60,unit:'g'}],steps:['Skyll de tørre røde linsene og kok dem helt møre i cirka 12–15 minutter.','Kok eggene til de er faste.','Server linsene med eggene og grovbrød.']},
  {id:'cottage_eggs_snack',name:'Cottage cheese og egg',image:'meal_mini_cottage_eggs_snack',ingredients:[{id:'cottage',qty:250,unit:'g'},{id:'eggs',qty:2,unit:'stk'}]},
  {id:'mackerel_bread',name:'Makrell på grovbrød',image:'meal_mini_mackerel_bread',ingredients:[{id:'mackerel',qty:120,unit:'g'},{id:'bread',qty:100,unit:'g'},{id:'apples',qty:100,unit:'g'}]},
  {id:'tuna_eggs_snack',name:'Tunfisk og egg',image:'meal_mini_tuna_eggs_snack',ingredients:[{id:'tuna',qty:120,unit:'g'},{id:'eggs',qty:2,unit:'stk'},{id:'bread',qty:60,unit:'g'}]}
 ], extra:[
  {id:'topup_cottage',name:'Litt ekstra cottage cheese',image:'meal_mini_topup_cottage',ingredients:[{id:'cottage',qty:150,unit:'g'}]},
  {id:'topup_tuna',name:'En liten tunfiskporsjon',image:'meal_mini_topup_tuna',ingredients:[{id:'tuna',qty:100,unit:'g'}]},
  {id:'topup_eggs',name:'To kokte egg',image:'meal_mini_topup_eggs',ingredients:[{id:'eggs',qty:2,unit:'stk'}]}
 ]
});
// A separate snack slot for six-meal days, with full ingredient and nutrition data.
const SECOND_SNACK_MEALS = [
 {id:'afternoon_cottage',name:'Cottage cheese og eple',image:'meal_mini_cottage_banana',ingredients:[{id:'cottage',qty:175,unit:'g'},{id:'apples',qty:120,unit:'g'}],steps:['Vei opp cottage cheese.','Skjær eplet i biter og server sammen.']},
 {id:'afternoon_tuna',name:'Tunfisk og grovbrød',image:'meal_mini_tuna_toast',ingredients:[{id:'tuna',qty:80,unit:'g'},{id:'bread',qty:60,unit:'g'}],steps:['Hell av tunfisken.','Server med grovbrød.']},
 {id:'afternoon_eggs',name:'Egg og banan',image:'meal_mini_budget_eggs',ingredients:[{id:'eggs',qty:2,unit:'stk'},{id:'bananas',qty:100,unit:'g'}],steps:['Kok eggene helt faste.','Server med banan.']}
];
function mealPool(slot){return slot==='secondSnack'?SECOND_SNACK_MEALS:(MINI_MEALS[slot]||[]);}
function rounded(num,digits=1){return Math.round((num+Number.EPSILON)*10**digits)/10**digits;}
function nutritionFor(ingredients){
 const out={protein:0,kcal:0,unknown:[]};
 for(const part of ingredients){
  const data=FOOD_NUTRITION[part.id];if(!data){out.unknown.push(part.id);continue;}
  const mult=data.per==='stk'?part.qty:part.qty/100;
  out.protein+=mult*data.protein;out.kcal+=mult*data.kcal;
 }
 return {protein:rounded(out.protein),kcal:Math.round(out.kcal),unknown:out.unknown};
}
function recipeServing(recipe){
 if(!recipe||!Number.isFinite(recipe.servings)||recipe.servings<1)throw Error('Invalid recipe servings');
 return {id:recipe.id,name:recipe.name,image:`meal_${recipe.id}`,ingredients:recipe.ingredients.map(p=>({...p,qty:p.qty/recipe.servings})),recipeId:recipe.id};
}
function dayKeyLocal(date=new Date()){const d=new Date(date);return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function parseDayKey(key){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(key||'');if(!m)throw Error('Invalid date');const d=new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),12);if(dayKeyLocal(d)!==key)throw Error('Invalid calendar date');return d;}
function shiftDay(key,n){const d=parseDayKey(key);d.setDate(d.getDate()+n);return dayKeyLocal(d);}
function weekdayFor(key){return (parseDayKey(key).getDay()+6)%7;}
function scaledMeal(template,ratio=1){
 // Eggs stay whole; dry/fresh ingredients are rounded for usable recipe quantities.
 const scale=Math.max(.5,Math.min(3.5,Number(ratio)||1));
 return {...template,scale:rounded(scale,2),ingredients:template.ingredients.map(ing=>({
  ...ing,qty:ing.id==='eggs'||ing.id==='spices'?Math.max(1,Math.round(ing.qty*scale)):
   rounded(ing.qty*scale,ing.qty<20?1:0)
 }))};
}
// Rotate the seven available dinner recipes across the seven days of each week.
// Unlike the old one-day optimizer, this guarantees variety without requiring a network service.
// Week-to-week rotation also avoids serving exactly the same Monday dinner forever.
const DINNER_VARIETY_PLAN_VERSION='v16-seven-distinct-dinners';
function recommendedDinnerId(date){
 const weekday=weekdayFor(date),monday=parseDayKey(shiftDay(date,-weekday));
 const weekIndex=Math.floor((Date.UTC(monday.getFullYear(),monday.getMonth(),monday.getDate())-Date.UTC(2026,0,5))/604800000);
 const offset=((weekIndex%RECIPE_DATA.length)+RECIPE_DATA.length)%RECIPE_DATA.length;
 return RECIPE_DATA[(weekday+offset)%RECIPE_DATA.length].id;
}
function selectedDinnerId(state,date){
 const chosen=state.dailyChoices?.[date]?.dinner;
 // A logged dinner is immutable; an explicitly picked dinner outranks the rotation.
 if(state.mealLog?.[date]?.dinner&&chosen)return chosen;
 return state.pinnedDinners?.[date]||chosen||recommendedDinnerId(date);
}
function baseDailyMeal(state,date,slot){
 const weekday=weekdayFor(date),selected=state.dailyChoices?.[date]?.[slot];
 if(slot==='dinner'){
  const id=selectedDinnerId(state,date);
  return recipeServing(RECIPE_DATA.find(r=>r.id===id)||RECIPE_DATA.find(r=>r.id===recommendedDinnerId(date)));
 }
 const options=mealPool(slot);if(!options.length)return null;
 let chosen=options.find(o=>o.id===selected)||options[(weekday+(slot==='lunch'?1:slot==='evening'?2:0))%options.length];
 return {...chosen,ingredients:chosen.ingredients.map(p=>({...p}))};
}
function getDailyMeal(state,date,slot){
 if(!activeMealSlots(state,date).includes(slot))return null;
 const base=baseDailyMeal(state,date,slot);if(!base)return null;
 return scaledMeal(base,state.dailyPortions?.[date]?.[slot]||1);
}
function dailyMeals(state,date){return activeMealSlots(state,date).map(slot=>({slot,label:MEAL_SLOT_NAMES[slot],meal:getDailyMeal(state,date,slot)}));}
function tallyDay(state,date){
 const bySlot=dailyMeals(state,date).map(entry=>{const log=state.mealLog?.[date]?.[entry.slot];const plan=nutritionFor(entry.meal.ingredients);return {...entry,planned:plan,logged:log||null};});
 return {slots:bySlot,planned:{protein:rounded(bySlot.reduce((s,x)=>s+x.planned.protein,0)),kcal:bySlot.reduce((s,x)=>s+x.planned.kcal,0)},
  eaten:{protein:rounded(bySlot.reduce((s,x)=>s+(x.logged?.nutrition?.protein||0),0)),kcal:bySlot.reduce((s,x)=>s+(x.logged?.nutrition?.kcal||0),0)}};
}
function inventoryAmount(state,id){const g=FOOD.find(x=>x.id===id);return g?Math.max(0,Number(state.pantry?.[id]||0))*g.grams:0;}
function dayShortages(state,date){
 const tally=dailyMeals(state,date),need={};for(const row of tally){if(state.mealLog?.[date]?.[row.slot])continue;for(const i of row.meal.ingredients){if(i.optional)continue;need[i.id]=(need[i.id]||0)+i.qty;}}
 return Object.entries(need).map(([id,required])=>({id,needed:rounded(Math.max(0,required-inventoryAmount(state,id)),2),required:rounded(required,2),unit:FOOD.find(x=>x.id===id)?.unit})).filter(row=>row.needed>0.001);
}
function checkMealStock(state,meal){return meal.ingredients.filter(i=>!i.optional && inventoryAmount(state,i.id)+0.01<i.qty).map(i=>({id:i.id,short:rounded(i.qty-inventoryAmount(state,i.id),2)}));}
function eatSlot(state,date,slot){
 if(!MEAL_SLOT_NAMES[slot])return {ok:false,reason:'unknown-slot'};
 state.mealLog??={};state.mealLog[date]??={};
 if(state.mealLog[date][slot])return {ok:false,reason:'already-eaten'};
 const m=getDailyMeal(state,date,slot);if(!m)return {ok:false,reason:'unplanned'};
 const missing=checkMealStock(state,m);if(missing.length)return {ok:false,reason:'missing',missing};
 const used=m.ingredients.filter(i=>!i.optional||inventoryAmount(state,i.id)+0.01>=i.qty)
  .map(i=>({id:i.id,qty:i.qty,unit:i.unit}));
 // Validate before changing a single stock entry. Snapshot is what can be reversed later.
 const plannedStock={...state.pantry};for(const ing of used){const g=FOOD.find(x=>x.id===ing.id);if(!g)return {ok:false,reason:'unknown-item'};
  const before=inventoryAmount({pantry:plannedStock},ing.id);if(before+0.01<ing.qty)return {ok:false,reason:'missing',missing:[{id:ing.id,short:rounded(ing.qty-before,2)}]};
  plannedStock[ing.id]=Math.max(0,rounded((before-ing.qty)/g.grams,6));}
 state.pantry=plannedStock;
 state.dayMealCounts??={};state.dayMealCounts[date]??=configuredMealCount(state);
 const event={mealId:m.id,mealName:m.name,date,slot,ingredients:used,nutrition:nutritionFor(used),at:new Date().toISOString()};
 state.mealLog[date][slot]=event;
 state.dailyChoices??={};state.dailyChoices[date]??={};state.dailyChoices[date][slot]=m.id;
 return {ok:true,event};
}
function undoSlot(state,date,slot){const event=state.mealLog?.[date]?.[slot];if(!event)return {ok:false,reason:'not-eaten'};
 const next={...state.pantry};for(const ing of event.ingredients){const g=FOOD.find(x=>x.id===ing.id);if(!g)continue;const current=inventoryAmount({pantry:next},ing.id);next[ing.id]=rounded((current+ing.qty)/g.grams,6);}
 state.pantry=next;delete state.mealLog[date][slot];if(Object.keys(state.mealLog[date]).length===0)delete state.mealLog[date];return {ok:true,event};
}
function changeSlot(state,date,slot,direction=1){
 if(!activeMealSlots(state,date).includes(slot)||state.mealLog?.[date]?.[slot])return false;
 const options=slot==='dinner'?RECIPE_DATA:(mealPool(slot));
 if(!options.length)return false;
 const current=getDailyMeal(state,date,slot);const idx=options.findIndex(o=>o.id===current.id);
 const next=options[(idx+direction+options.length)%options.length];state.dailyChoices??={};state.dailyChoices[date]??={};state.dailyChoices[date][slot]=next.id;
 state.dailyPortions??={};state.dailyPortions[date]??={};state.dailyPortions[date][slot]=1;
 if(slot==='dinner'){
  // Save the swap for this actual calendar date, not every occurrence of that weekday.
  state.pinnedDinners??={};state.pinnedDinners[date]=next.id;
 }
 return true;
}
function mealIngredientCost(parts){return parts.reduce((sum,p)=>{const g=FOOD.find(x=>x.id===p.id);return sum+(g?g.price*p.qty/g.grams:0)},0);}
function ingredientTotals(meals){const out={};for(const meal of meals)for(const ing of meal.ingredients)if(!ing.optional)out[ing.id]=(out[ing.id]||0)+ing.qty;return out;}
function inventoryPurchaseCost(state,parts){
 let cost=0,count=0;
 for(const [id,amount] of Object.entries(parts)){
  const g=FOOD.find(x=>x.id===id);if(!g)continue;
  const amountMissing=Math.max(0,amount-inventoryAmount(state,id));
  if(amountMissing>0.01){count++;cost+=g.price*Math.ceil((amountMissing-.00001)/g.grams);}
 }
 return {cost:rounded(cost,2),count};
}
function proposeMealOptions(state,date,slot){
 if(state.mealLog?.[date]?.[slot]){const fixed=getDailyMeal(state,date,slot);return [{...fixed,nu:state.mealLog[date][slot].nutrition,cost:mealIngredientCost(fixed.ingredients)}];}
 // Keep one different planned dinner for each weekday; other meals and portions stay optimizable.
 // Explicit user swaps/pins and already eaten dinners are preserved separately.
 const preferredDinner=state.pinnedDinners?.[date]||recommendedDinnerId(date);
 const opts=slot==='dinner'?[recipeServing(RECIPE_DATA.find(r=>r.id===preferredDinner)||RECIPE_DATA[weekdayFor(date)])]:mealPool(slot);
 const results=[];
 const factors=activeMealSlots(state,date).length<=2?[1,1.25,1.5,1.75,2,2.5,3,3.5]:
  activeMealSlots(state,date).length>=5?[.65,.85,1,1.2,1.4,1.65,1.9]:[.75,1,1.25,1.5,1.8,2.1];
 for(const base of opts)for(const scale of factors){
  const cand=scaledMeal(base,scale),nu=nutritionFor(cand.ingredients);
  if(cand.ingredients.some(i=>i.id==='tuna'&&i.qty>170)||nu.protein<7)continue;
  const cost=mealIngredientCost(cand.ingredients);
  results.push({...cand,nu,cost});
 }
 return results;
}
function suggestDayFromPantry(state,date,priority='budget'){
 // Beam search over whole-meal choices and adjustable portions. Logged meals are immutable.
 const slots=activeMealSlots(state,date),proteinTarget=Math.max(30,Number(state.proteinTarget)||150);
 const energyTarget=Math.max(800,Number(state.energyTarget)||2400),dailyCap=dayTargetBudget(state);
 const count=slots.length,beamSize=count<=3?25000:190;
 let beam=[{meals:[],protein:0,kcal:0,cost:0,eggs:0,cottage:0,tuna:0,ingredients:{},score:0}];
 for(let index=0;index<count;index++){
  const opts=proposeMealOptions(state,date,slots[index]);if(!opts.length)return null;
  const next=[];
  for(const state0 of beam)for(const cand of opts){
   const eggs=cand.ingredients.filter(i=>i.id==='eggs').reduce((n,i)=>n+i.qty,0);
   const cottage=cand.ingredients.filter(i=>i.id==='cottage').reduce((n,i)=>n+i.qty,0);
   const tuna=cand.ingredients.some(i=>i.id==='tuna')?1:0;
   if(state0.eggs+eggs>6||state0.cottage+cottage>650||state0.tuna+tuna>1)continue;
   const ingredients={...state0.ingredients};
   if(!state.mealLog?.[date]?.[slots[index]])for(const ing of cand.ingredients)if(!ing.optional)ingredients[ing.id]=(ingredients[ing.id]||0)+ing.qty;
   const protein=state0.protein+cand.nu.protein,kcal=state0.kcal+cand.nu.kcal,cost=state0.cost+cand.cost;
   const progress=(index+1)/count;
   const calorieError=Math.abs(kcal-energyTarget*progress)/energyTarget;
   const proteinError=Math.abs(protein-proteinTarget*progress)/proteinTarget;
   const {count:missingTypes,cost:purchaseCost}=inventoryPurchaseCost(state,ingredients);
   const duplicate=state0.meals.some(m=>m.id===cand.id)?3:0;
   const score=calorieError*98+proteinError*140+Math.max(0,cost-dailyCap*progress)*3.2+
     Math.max(0,purchaseCost-dailyCap*progress)*.45+cost*.10+purchaseCost*.025+missingTypes*.15+
     Math.max(0,state0.eggs+eggs-4)*1.8+duplicate;
   next.push({meals:[...state0.meals,cand],protein,kcal,cost,eggs:state0.eggs+eggs,cottage:state0.cottage+cottage,tuna:state0.tuna+tuna,ingredients,score});
  }
  if(!next.length)return null;
  // Retain alternatives across calorie/protein ranges, not only one greedy local optimum.
  next.sort((a,b)=>a.score-b.score);
  const groups=new Map(),kept=[];
  for(const cand of next){
   const bucket=`${Math.floor(cand.kcal/125)}|${Math.floor(cand.protein/9)}`;
   const used=groups.get(bucket)||0;
   if(used>=3)continue;groups.set(bucket,used+1);kept.push(cand);if(kept.length>=beamSize)break;
  }
  beam=kept;
 }
 const ranked=beam.map(candidate=>{
  const proteinShort=Math.max(0,proteinTarget-candidate.protein),proteinExcess=Math.max(0,candidate.protein-proteinTarget-20);
  const calorieMiss=Math.abs(candidate.kcal-energyTarget),costOver=Math.max(0,candidate.cost-dailyCap);
  const missing=inventoryPurchaseCost(state,candidate.ingredients);
  const feasible=proteinShort<=1&&proteinExcess<5&&calorieMiss<=energyTarget*.085&&costOver<.01;
  // Keep attainable daily goals the main ranking criterion; never silently claim an infeasible target.
  const mealBalance=candidate.meals.reduce((n,m)=>n+Math.max(0,(m.nu.kcal-(energyTarget/count)*1.65))*.02,0);
  const loss=proteinShort*3.7+proteinExcess*1.3+calorieMiss*.14+costOver*3.3+
    candidate.cost*.22+missing.count*.25+missing.cost*.035+mealBalance;
  return {...candidate,missingCost:missing.cost,missingCount:missing.count,feasible,loss};
 }).sort((a,b)=>(b.feasible?1:0)-(a.feasible?1:0)||a.loss-b.loss);
 const best=ranked[0];if(!best)return null;
 state.dailyChoices??={};state.dailyChoices[date]??={};state.dailyPortions??={};state.dailyPortions[date]??={};
 slots.forEach((slot,i)=>{
  if(!state.mealLog?.[date]?.[slot]){
   state.dailyChoices[date][slot]=best.meals[i].id;
   state.dailyPortions[date][slot]=best.meals[i].scale;
  }
 });
 return {protein:rounded(best.protein),kcal:best.kcal,mealCost:rounded(best.cost,2),missingCost:best.missingCost,
  missingCount:best.missingCount,feasible:best.feasible,energyGoal:energyTarget,proteinGoal:proteinTarget,mealCount:count};
}

const MINI_GUIDES={
  eggs_bread:['Kok eggene til de er faste.','Server dem med grovbrød og et eple.'],
  cottage_banana:['Ha cottage cheese i en skål.','Skjær bananen i biter og server med grovbrød ved siden av.'],
  tuna_toast:['Hell av vannet fra tunfisken.','Fordel den over grovbrødet og server gulrot i staver ved siden av.'],
  lentil_eggs:['Skyll linser og kok helt myke. Kok ris etter pakken.','Kok eggene til de er faste.','Stek finhakket løk kort og rør inn hakkede tomater og linsene. Server med ris og egg.'],
  tuna_rice:['Kok risen etter pakken.','Damp brokkolien til den er mør.','Hell av tunfisken og bland den med ris og brokkoli. Ha på litt olje om ønskelig.'],
  cottage_eggs:['Kok eggene til de er faste.','Server cottage cheese sammen med egg, grovbrød og gulrotstaver.'],
  cottage_eggs_snack:['Kok eggene til de er faste.','Server med cottage cheese.'],
  mackerel_bread:['Smør makrell i tomat på grovbrødet.','Skyll og skjær eplet i biter.'],
  tuna_eggs_snack:['Kok eggene til de er faste.','Hell av tunfisken og server den med egg og grovbrød.'],
  topup_cottage:['Mål opp cottage cheese og server den kald.'],
  topup_tuna:['Hell av tunfisken og server i en liten skål.'],
  topup_eggs:['Kok eggene til de er faste og spis dem varme eller kalde.']
};
function quickMealSteps(meal){return meal.steps||MINI_GUIDES[meal.id]||[];}

