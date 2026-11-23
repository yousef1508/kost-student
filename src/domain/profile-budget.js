/* Profile recommendations and budget-aware weekly shopping calculations. */
/* KOST profile & recommendations: estimated resting energy from Mifflin-St Jeor,
 * adjusted by self-selected activity and objective. Not medical advice.
 * Values are estimates; observed weight trend should guide adjustments. */
const PROFILE_DEFAULTS=Object.freeze({weightKg:null,heightCm:null,age:null,sex:'unspecified',activity:'moderate',goal:'maintain',customCalorie:false,customProtein:false});
const ACTIVITY_MULTIPLIERS=Object.freeze({sedentary:1.2,light:1.375,moderate:1.55,active:1.725});
function validProfile(p){return p&&Number.isFinite(+p.weightKg)&&+p.weightKg>=35&&+p.weightKg<=250&&Number.isFinite(+p.heightCm)&&+p.heightCm>=120&&+p.heightCm<=230&&Number.isFinite(+p.age)&&+p.age>=18&&+p.age<=90;}
function recommendedGoals(p){
 if(!validProfile(p))return null;
 const weight=+p.weightKg,height=+p.heightCm,age=+p.age;
 const sexConstant=p.sex==='male'?5:p.sex==='female'?-161:-78;
 const bmr=10*weight+6.25*height-5*age+sexConstant;
 const activity=ACTIVITY_MULTIPLIERS[p.activity]||ACTIVITY_MULTIPLIERS.moderate;
 const factor=p.goal==='cut'?.85:p.goal==='gain'?1.08:1;
 const calories=Math.max(1200,Math.min(4500,Math.round(bmr*activity*factor/25)*25));
 const proteinRatio=p.goal==='cut'?1.9:p.goal==='gain'?1.8:1.6;
 const protein=Math.max(60,Math.min(240,Math.round(weight*proteinRatio/5)*5));
 return {calories,protein,maintenance:Math.round(bmr*activity/25)*25,bmr:Math.round(bmr)};
}
function dayTargetBudget(state){return dailyBudgetFor(state.monthlyBudget);}
function weekRange(date){const monday=shiftDay(date,-weekdayFor(date));return Array.from({length:7},(_,i)=>shiftDay(monday,i));}
function weekShoppingNeeds(state,dates){
 // All remaining meals from the week, summed before subtracting current pantry.
 // Already logged meals consumed their ingredients at log time.
 const needed={};let plannedCost=0,protein=0,calories=0;
 for(const date of dates){
  for(const row of dailyMeals(state,date)){
   const nutrition=nutritionFor(row.meal.ingredients);
   protein+=nutrition.protein;calories+=nutrition.kcal;
   plannedCost+=mealIngredientCost(row.meal.ingredients);
   if(state.mealLog?.[date]?.[row.slot])continue;
   for(const ing of row.meal.ingredients){if(ing.optional)continue;needed[ing.id]=(needed[ing.id]||0)+ing.qty;}
  }
 }
 const weekId=dates[0],ordered=[];
 for(const [id,grams] of Object.entries(needed)){
  const food=FOOD.find(g=>g.id===id);if(!food)continue;
  const have=inventoryAmount(state,id);
  const remaining=Math.max(0,grams-have);
  const stillPacks=Math.ceil(Math.max(0,remaining-.0000001)/food.grams);
  const purchasedPacks=Math.max(0,Number(state.weekPurchaseCounts?.[weekId]?.[id])||0);
  const totalPacks=stillPacks+purchasedPacks;
  if(totalPacks)ordered.push({id,food,needed:rounded(grams,1),onHand:rounded(have,1),missing:rounded(remaining,1),packs:stillPacks,totalPacks,purchasedPacks,price:rounded(stillPacks*food.price,2)});
 }
 ordered.sort((a,b)=>a.food.store.localeCompare(b.food.store)||a.food.name.localeCompare(b.food.name));
 // Keep extra items that the user explicitly added from offers or a recipe.
 for(const id of state.extras||[]){
  if(ordered.some(x=>x.id===id))continue;
  const food=FOOD.find(g=>g.id===id);if(!food)continue;
  const purchasedPacks=Math.max(0,Number(state.weekPurchaseCounts?.[weekId]?.[id])||0);
  const stillPacks=Math.max(0,1-purchasedPacks);
  ordered.push({id,food,needed:food.grams,onHand:rounded(inventoryAmount(state,id),1),missing:stillPacks*food.grams,packs:stillPacks,totalPacks:1,purchasedPacks,price:rounded(stillPacks*food.price,2),extra:true});
 }
 ordered.sort((a,b)=>a.food.store.localeCompare(b.food.store)||a.food.name.localeCompare(b.food.name));
 const cost=rounded(ordered.reduce((sum,x)=>sum+x.price,0),2);
 const budget=budgetForDays(state.monthlyBudget,dates.length);
 return {weekId,dates,items:ordered,cost,plannedCost:rounded(plannedCost,2),avgProtein:rounded(protein/dates.length,1),avgCalories:Math.round(calories/dates.length),budget:rounded(budget,2),overBudget:cost>budget+.01};
}
function recomputeProfileTargets(state){const rec=recommendedGoals(state.profile);if(!rec)return null;
 if(!state.profile.customCalorie)state.energyTarget=rec.calories;
 if(!state.profile.customProtein)state.proteinTarget=rec.protein;
 return rec;
}

