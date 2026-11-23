/* KOST daily meal planning UI. */
const portion=r=>state.portionOverrides[r.id]||r.servings;
const factor=r=>portion(r)/r.servings;
const required=(ingredient,r)=>ingredient.qty*factor(r);
function availableGrams(ingredient){const g=item(ingredient.id);if(!g)return 0;return (state.pantry[ingredient.id]||0)*g.grams;}
function enough(ingredient,r){return availableGrams(ingredient)>=required(ingredient,r)-.0001;}
function missing(r){return r.ingredients.filter(i=>!i.optional&&!enough(i,r));}
function amount(i,r){let val=required(i,r);return `${nfmt(val)} ${i.unit}`;}
function categoryColor(r){return r.accent==='mango'?'mango':r.accent==='coral'?'coral':r.accent==='aqua'?'aqua':'lime';}
function nutritionOne(r){return nutritionFor(recipeServing(r).ingredients);}
function displayDayDate(key){const d=new Intl.DateTimeFormat(currentLocale(),{weekday:'long',day:'numeric',month:'long'}).format(parseDayKey(key));return d.charAt(0).toLocaleUpperCase(currentLocale())+d.slice(1);}
function planKey(){return state.planDate||dayKeyLocal();}
function planConfig(date){return [DINNER_VARIETY_PLAN_VERSION,dayMealCount(state,date),state.proteinTarget,state.energyTarget,state.monthlyBudget,state.stockVersion||0].join('|');}
function ensureDailyPlan(date){
 state.dailyPlanConfigs??={};
 const current=planConfig(date);
 if(state.dailyPlanConfigs[date]!==current){
  const calculated=suggestDayFromPantry(state,date,'budget');
  if(calculated)state.dailyPlanConfigs[date]=current;
 }
}
function planDay(){ensureDailyPlan(planKey());return tallyDay(state,planKey());}
function shopNeeds(){ensureDailyPlan(planKey());return dayShortages(state,planKey());}
function mealIcon(slot){return {breakfast:'☀',lunch:'◐',dinner:'✦',evening:'☾',extra:'+',secondSnack:'◌'}[slot]||'✦';}
function fmtUnit(num,unit){return `${nfmt(rounded(num,1))} ${unit}`;}
function shortageText(id,qty){const g=item(id);return `${displayItemName(id)}: ${fmtUnit(qty,g?.unit||'g')}`;}
function slotCard(row){
 const stock=checkMealStock(state,row.meal),eaten=!!row.logged;
 const status=eaten?say('Spist ✓','Eaten ✓'):stock.length?(state.lang==='en'?`Missing ${stock.length} ${stock.length===1?'item':'items'}`:`Mangler ${stock.length} ${stock.length===1?'vare':'varer'}`):say('Har alt hjemme','Everything at home');
 const macros=eaten?row.logged.nutrition:row.planned;
 const scaled=row.meal.scale||1;const size=scaled!==1?` · ${nfmt(scaled)}× porsjon`:'';
 return `<article class="day-meal ${eaten?'eaten':''}">
   ${pic(row.meal.image,'day-meal-photo',state.lang==='en'?(EN_RECIPES[row.meal.recipeId]?.name||EN_MINIS[row.meal.recipeId]||row.meal.name):row.meal.name)}<div class="day-meal-content">
    <span class="day-meal-type">${mealIcon(row.slot)} ${row.label}</span>
    <strong>${safe(row.meal.name)}</strong><small>${nfmt(macros.protein)} g protein · ${Math.round(macros.kcal)} kcal${size}</small>
    <span class="day-meal-stock ${!eaten&&stock.length?'short':''}">${status}</span>
   </div><div class="day-meal-actions"><button class="day-meal-recipe" data-day-recipe="${row.slot}">${say('Oppskrift 👀','Recipe 👀')}</button>
    ${eaten?`<button class="day-meal-done" data-undo-meal="${row.slot}" aria-label="${say('Angre spist','Undo logged')} ${row.label}">${icon('check',18)} ${say('Angre','Undo')}</button>`:
    `<button class="day-meal-done" data-eat="${row.slot}" aria-label="${say('Marker', 'Log')} ${row.label} ${say('som spist','as eaten')}">${say('Logg 🍽️','Log 🍽️')}</button>
     <button class="day-meal-swap" data-swap-slot="${row.slot}" aria-label="Bytt ${row.label}"><span class="emoji-action" aria-hidden="true">🎲</span></button>`}
   </div></article>`;
}
function goalsSummary(data){
 const p=data.planned,pr=state.proteinTarget,cal=state.energyTarget;
 const proteinGap=rounded(pr-p.protein),calorieGap=cal-p.kcal;
 const both=proteinGap<=1&&proteinGap>=-25&&Math.abs(calorieGap)<=cal*.085;
 return {both,proteinGap,calorieGap};
}
function mealCountMessage(date){
 const locked=Object.keys(state.mealLog?.[date]||{}).length>0;
 return locked&&dayMealCount(state,date)!==configuredMealCount(state)?
   `<p class="plan-count-note">${state.lang==='en'?`Meals logged today are preserved. ${configuredMealCount(state)} meals apply from the next day.`:`Dagens spiste måltider er bevart. ${configuredMealCount(state)} måltider gjelder fra neste nye dag.`}</p>`:'';
}
function mealCountControl(date){let count=dayMealCount(state,date);
 return `<div class="meal-count-control"><div><strong>${say('Måltider per dag','Meals per day')}</strong><small>${say('Fordeles etter dine mål','Adjusted to your goals')}</small></div>
 <div class="count-stepper"><button type="button" data-meal-count="-1" ${configuredMealCount(state)<=2?'disabled':''} aria-label="Færre måltider">−</button><strong>${count}</strong><button type="button" data-meal-count="1" ${configuredMealCount(state)>=6?'disabled':''} aria-label="Flere måltider">+</button></div></div>${mealCountMessage(date)}`;
}
function fullDayPlan(){
 const data=planDay(),shortages=shopNeeds(),p=data.planned,e=data.eaten;
 const {both,proteinGap,calorieGap}=goalsSummary(data);
 const dayCost=data.slots.reduce((sum,x)=>sum+mealIngredientCost(x.meal.ingredients),0);
 const dailyCap=dayTargetBudget(state),mealCount=data.slots.length;
 const isOverCost=dayCost>dailyCap;
 const summary=state.lang==='en'?
  (both?'Your plan is close to both goals.':
   `${proteinGap>0?`Short by ${nfmt(proteinGap)} g protein.`:proteinGap< -25?`${nfmt(-proteinGap)} g above your protein goal.`:'Protein goal covered.'} ${Math.abs(calorieGap)>state.energyTarget*.085?`Calories: ${Math.abs(Math.round(calorieGap))} kcal ${calorieGap>0?'below':'above'} target.`:'Calories are close to your target.'}`):
  (both?'Planen ligger nær begge målene.':
   `${proteinGap>0?`Mangler ${nfmt(proteinGap)} g protein.`:proteinGap< -25?`Over proteinmålet med ${nfmt(-proteinGap)} g.`:'Proteinmålet dekket.'} ${Math.abs(calorieGap)>state.energyTarget*.085?`Kalorier: ${calorieGap>0?`${Math.round(calorieGap)} kcal under`:`${Math.abs(Math.round(calorieGap))} kcal over`} målet.`:'Kaloriene er nær målet.'}`);
 return `<section class="day-plan" id="daily-plan"><div class="demo-test-bar ${demoMode?'is-active':''}"><span>${demoMode?say('🧪 Prøvelager · Endringer lagres ikke','🧪 Test pantry · Changes won’t be saved'):say('Vil du teste protein og kalorier?','Want to test protein and calories?')}</span><button type="button" data-action="toggle-demo" aria-pressed="${demoMode}">${demoMode?say('Avslutt test','Exit test'):say('Prøv nå 🧪','Try it 🧪')}</button></div><div class="day-plan-head"><div><span class="eyebrow">${say('DAGENS MATPLAN','DAILY MEAL PLAN')}</span><h2>${mealCount} ${say('måltider, én plan','meals, one plan')}</h2></div>
 <div class="date-move"><button data-plan-date="-1" aria-label="Forrige dag"><span aria-hidden="true">−1</span></button><button data-plan-today="yes" aria-label="Gå til i dag">${say('I dag','Today')}</button><button data-plan-date="1" aria-label="Neste dag"><span aria-hidden="true">+1</span></button></div></div>
 <p class="day-label">${safe(displayDayDate(planKey()))}</p>
 ${mealCountControl(planKey())}
 <div class="day-goals"><span>${icon('flame',17)} <b>${state.proteinTarget} g protein</b></span><span>${icon('spark',17)} <b>${state.energyTarget} kcal</b></span><button data-page="settings">${say('Endre mål 🎯','Change goals 🎯')}</button></div>
 <div class="daily-totals"><div><span>${say('PLANLAGT','PLANNED')}</span><strong>${nfmt(p.protein)} g</strong><small>${p.kcal} kcal</small></div>
 <div><span>${say('SPIST','EATEN')}</span><strong>${nfmt(e.protein)} g</strong><small>${e.kcal} kcal</small></div></div>
 <div class="plan-target ${both&&!isOverCost?'good':''}">${summary}
 <small>${say('Dagens råvarer','Ingredients today')}: ${money(dayCost)} · ${say('Ca.','About')} ${money(dailyCap)} / ${say('dag','day')} ${isOverCost?`· ${money(dayCost-dailyCap)} ${say('over','over budget')}`:`· ${say('innenfor','within budget')}`}</small></div>
 <button class="plan-auto" data-action="auto-plan">✦ ${say('Tilpass dagsplanen til målene mine','Adjust my daily plan to my goals')}</button>
 ${data.slots.map(slotCard).join('')}
 ${shortages.length?`<div class="day-shopping-needed"><strong>${say('Dette mangler til planen','Missing ingredients for your plan')}</strong><p>${shortages.map(m=>shortageText(m.id,m.needed)).join(' · ')}</p>
 <button class="button lime compact" data-action="add-day-missing">${say('Legg manglende varer i handlelisten 🛒','Add missing items to shopping list 🛒')}</button></div>`:
 `<p class="day-shopping-all-good">${say('Du har nok mat hjemme til de gjenværende måltidene.','You have enough food for your remaining meals.')}</p>`}</section>`;
}
function applyMealCount(value){
 const old=configuredMealCount(state),next=clamp(Math.round(Number(value)||old),2,6);
 if(next===old)return;
 const key=planKey(),locked=Object.keys(state.mealLog?.[key]||{}).length>0;
 if(locked){state.dayMealCounts??={};state.dayMealCounts[key]??=old;}
 else if(state.dayMealCounts?.[key])delete state.dayMealCounts[key];
 state.mealCount=next;
 if(!locked){
  const selected=suggestDayFromPantry(state,key,'budget');
  if(selected){state.dailyPlanConfigs??={};state.dailyPlanConfigs[key]=planConfig(key);}
 }
 render(true);
 announce(locked?(state.lang==='en'?`${next} meals apply from tomorrow. Today's log is preserved.`:`${next} måltider gjelder fra neste nye dag; dagens logg er beholdt.`):(state.lang==='en'?`Daily plan updated to ${next} meals.`:`Dagsplanen er tilpasset ${next} måltider.`));
}
function updateDailyGoals(){
 const selected=suggestDayFromPantry(state,planKey(),'budget'); // completed slots stay unchanged
 if(selected){state.dailyPlanConfigs??={};state.dailyPlanConfigs[planKey()]=planConfig(planKey());}
 render(true);
}
function logEat(slot){const result=eatSlot(state,planKey(),slot);if(result.ok){state.stockVersion=(state.stockVersion||0)+1;render(true);announce(state.lang==='en'?`${displaySlotName(slot)} logged · ${nfmt(result.event.nutrition.protein)} g protein`:`${displaySlotName(slot)} registrert · ${nfmt(result.event.nutrition.protein)} g protein`);if(tallyDay(state,planKey()).eaten.protein>=state.proteinTarget)confetti();return;}
 if(result.reason==='already-eaten'){announce('Dette måltidet er allerede registrert.');return;}
 if(result.reason==='missing'){const products=result.missing.map(x=>displayItemName(x.id)).join(', ');announce(state.lang==='en'?`Missing: ${products}. Update your pantry first.`:`Du mangler: ${products}. Oppdater lageret først.`);return;}
 announce('Kan ikke registrere dette måltidet.');}
function undoEat(slot){const result=undoSlot(state,planKey(),slot);if(result.ok){state.stockVersion=(state.stockVersion||0)+1;render(true);announce(say('Måltidet er angret, maten er tilbake på lager.','Meal undone. Ingredients returned to your pantry.'));}}
function changeDailyMeal(slot){const date=planKey();if(!changeSlot(state,date,slot)){announce('Angre registreringen før du bytter dette måltidet.');return;}if(slot==='dinner'){const adapted=suggestDayFromPantry(state,date,'budget');if(adapted){state.dailyPlanConfigs??={};state.dailyPlanConfigs[date]=planConfig(date);}}render(true);announce(say('Måltidet er byttet.','Meal changed.'));}
function addDayMissing(){const missingItems=shopNeeds();if(!missingItems.length){announce('Alt på plass til dagens mat.');return;}
 for(const i of missingItems){if(!item(i.id)?.list && !state.extras.includes(i.id))state.extras.push(i.id);}
 state.shoppingNeeds={...(state.shoppingNeeds||{}),[planKey()]:missingItems};render(true);
 announce(state.lang==='en'?`${missingItems.length} items added to your shopping list`:`${missingItems.length} varer lagt til handlelisten`);}
