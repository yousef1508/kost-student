/* KOST app rendering and event handlers. */
function openRecipe(id){state.recipeId=id;state.ingredientChecked=[];navigate('recipe');}
function addMissingToShopping(){const list=missing(meal(state.recipeId));const added=list.filter(i=>!item(i.id)?.list&&!state.extras.includes(i.id));state.extras.push(...added.map(i=>i.id));announce(state.lang==='en'?`${list.length} ${list.length===1?'item':'items'} on your shopping list`:`${list.length} ${list.length===1?'vare':'varer'} i handlelisten`);save();}
function completeStep(){const r=meal(state.recipeId);stopTimer();state.step=clamp(state.step+1,0,r.steps.length);if(state.step===r.steps.length)confetti();else resetStepTimer();render();}
function confetti(){const burst=document.createElement('div');burst.className='confetti';for(let i=0;i<27;i++){let n=document.createElement('i');n.style.setProperty('--dx',`${(Math.random()-.5)*420}px`);n.style.setProperty('--dy',`${(Math.random()-.5)*480}px`);n.style.setProperty('--rotation',`${Math.random()*680-340}deg`);n.style.background=['#DFFF69','#FF8474','#B8A4FF','#FFCF68','#B5EAE4'][i%5];burst.append(n);}device.append(burst);setTimeout(()=>burst.remove(),1250);}
function doAction(action){
 if(action==='setup-next'){
  if(state.onboardingStep===1){if(!readProfile('setup')){announce(say('Fyll ut gyldig vekt, høyde og alder.','Enter valid weight, height and age.'));return;}fillTargetsFromProfile();}
  state.onboardingStep=Math.min(2,state.onboardingStep+1);render();return;
 }
 if(action==='setup-back'){state.onboardingStep=Math.max(0,state.onboardingStep-1);render();return;}
 if(action==='setup-toggle-cal'||action==='setup-toggle-protein'){
   const isCal=action==='setup-toggle-cal',key=isCal?'customCalorie':'customProtein',id=isCal?'setup-calorie':'setup-protein';
   const current=document.getElementById(id);if(current)state[isCal?'energyTarget':'proteinTarget']=clamp(Math.round(Number(current.value)|| (isCal?2400:150)),isCal?1200:60,isCal?4500:240);
   state.profile[key]=!state.profile[key];fillTargetsFromProfile();render();return;
 }
 if(action==='setup-finish'){
   if(!validProfile(state.profile)){state.onboardingStep=1;render();return;}
   if(state.profile.customCalorie)state.energyTarget=numeric('setup-calorie',1200,4500,state.energyTarget);
   if(state.profile.customProtein)state.proteinTarget=numeric('setup-protein',60,240,state.proteinTarget);
   state.monthlyBudget=normalizeMonthlyBudget(numeric('setup-budget',1,Infinity,state.monthlyBudget));
   state.onboardingDone=true;state.page='today';state.dailyPlanConfigs={};updateDailyGoals();frame.scrollTop=0;announce(say('Din matplan er klar!','Your meal plan is ready!'));return;
 }
 if(action==='save-profile'){
  if(!readProfile('settings')){announce(say('Sjekk vekt, høyde og alder.','Check weight, height and age.'));return;}
  state.monthlyBudget=normalizeMonthlyBudget(numeric('monthly-budget',1,Infinity,state.monthlyBudget));
  if(state.profile.customCalorie)state.energyTarget=numeric('energy-target',1200,4500,state.energyTarget);
  if(state.profile.customProtein)state.proteinTarget=numeric('protein-target',60,240,state.proteinTarget);
  fillTargetsFromProfile();state.dailyPlanConfigs={};updateDailyGoals();announce(say('Matplan, ukehandel og budsjett er oppdatert.','Meal plan, shopping and budget updated.'));return;
 }
 if(action==='settings-cal-auto'||action==='settings-protein-auto'){
   if(!readProfile('settings')){announce(say('Sjekk profilfeltene.','Check your profile fields.'));return;}
   state.monthlyBudget=numeric('monthly-budget',500,10000,state.monthlyBudget);
   const isCal=action==='settings-cal-auto';state.profile[isCal?'customCalorie':'customProtein']=false;fillTargetsFromProfile();updateDailyGoals();return;
 }
 if(action.startsWith('recipe:'))return openRecipe(action.split(':')[1]);if(['today','week','recipes','recipe','shop','pantry','deals','budget','settings'].includes(action))return navigate(action);
 switch(action){
  case 'toggle-demo':toggleDemoMode();return;
  case 'back':return goBack();case 'favorite':{let id=state.recipeId;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];render(true);announce(state.favorites.includes(id)?'Lagt i favoritter':'Fjernet fra favoritter');return;}
  case 'clear-search':state.search='';render(true);document.getElementById('recipe-search')?.focus();return;
  case 'all-recipes':state.filter='Alle';state.search='';render(true);return;
  case 'swap-week':{const date=weekKey();if(!changeSlot(state,date,'dinner')){announce('Angre måltidet før du bytter det.');return;}const adapted=suggestDayFromPantry(state,date,'budget');if(adapted){state.dailyPlanConfigs??={};state.dailyPlanConfigs[date]=planConfig(date);}render(true);document.getElementById('day-card')?.animate([{transform:'translateX(20px)',opacity:.4},{transform:'translateX(0)',opacity:1}],{duration:270,easing:'ease-out'});return;}
  case 'add-protein':return applyMealCount(configuredMealCount(state)+1);
  case 'reset-protein':return applyMealCount(configuredMealCount(state)-1);
  case 'meal-count-plus':return applyMealCount(configuredMealCount(state)+1);
  case 'meal-count-minus':return applyMealCount(configuredMealCount(state)-1);
  case 'add-day-missing':addDayMissing();return;
  case 'auto-plan':{const chosen=suggestDayFromPantry(state,planKey(),'budget');if(!chosen){announce('Kunne ikke lage matplan.');return;}
    state.dailyPlanConfigs??={};state.dailyPlanConfigs[planKey()]=planConfig(planKey());
    render(true);announce(state.lang==='en'?`Plan for ${chosen.mealCount} meals: ${nfmt(chosen.protein)} g protein, ${chosen.kcal} kcal.`:`Plan for ${chosen.mealCount} måltider: ${nfmt(chosen.protein)} g protein, ${chosen.kcal} kcal.`);return;}
  case 'set-dinner':{
    const date=planKey();if(state.mealLog?.[date]?.dinner){announce('Middagen er allerede registrert. Angre først.');return;}
    state.pinnedDinners??={};state.pinnedDinners[date]=state.recipeId;
    state.dailyChoices[date]??={};state.dailyChoices[date].dinner=state.recipeId;
    const adapted=suggestDayFromPantry(state,date,'budget');state.dailyPlanConfigs[date]=planConfig(date);
    render(true);announce(adapted?say('Retten og resten av dagsplanen er tilpasset målene dine.','Dinner and your day have been adapted to your goals.'):say('Middagen er lagt i dagsplanen.','Dinner added to your day.'));return;
  }
  case 'eat-cooked':{
    const date=planKey();if(state.mealLog?.[date]?.dinner){announce('Middagen er allerede registrert.');return;}
    state.dailyChoices[date]??={};state.dailyChoices[date].dinner=state.recipeId;
    const result=eatSlot(state,date,'dinner');if(result.ok){state.stockVersion=(state.stockVersion||0)+1;state.page='today';render();announce('Én porsjon spist og trukket fra lageret.');confetti();}
    else announce('Du mangler noen ingredienser. Oppdater lageret før du registrerer maten.');return;
  }
  case 'add-missing':addMissingToShopping();render(true);return;
  case 'start-cook':state.step=0;resetStepTimer();navigate('cook');return;
  case 'next-step':completeStep();return;
  case 'previous-step':{state.step=Math.max(0,state.step-1);resetStepTimer();render();return;}
  case 'timer-toggle':toggleTimer();return;
  case 'toggle-notifications':state.notifications=!state.notifications;render(true);return;
  case 'change-day':state.notificationDay=state.notificationDay==='Onsdag'?'Søndag':'Onsdag';render(true);return;
  case 'theme:light':state.theme='light';render(true);if(state.onboardingDone)announce(t('modeSaved'));return;
  case 'theme:dark':state.theme='dark';render(true);if(state.onboardingDone)announce(t('modeSaved'));return;
  case 'quick-theme':state.theme=state.theme==='dark'?'light':'dark';render(true);announce(t('modeSaved'));return;
  case 'quick-lang':state.lang=state.lang==='en'?'nb':'en';render(true);announce(t('languageSaved'));return;
  case 'lang:nb':state.lang='nb';render(true);if(state.onboardingDone)announce(t('languageSaved'));return;
  case 'lang:en':state.lang='en';render(true);if(state.onboardingDone)announce(t('languageSaved'));return;
  case 'reset-preview':{if(demoMode){toggleDemoMode();return;}stopTimer();localStorage.removeItem(localKey);Object.assign(state,structuredClone(defaultState));render();announce(say('Førstegangsoppsettet er klart.','Setup is ready.'));return;}
 }
}
document.addEventListener('click',event=>{
 const e=event.target.closest('button[data-page],button[data-action],button[data-day],button[data-open],button[data-fav],button[data-filter],button[data-ingredient],button[data-portion],button[data-step-open],button[data-store],button[data-deal-store],button[data-shopping-view],button[data-buy],button[data-add-stock],button[data-extra],button[data-stock],button[data-eat],button[data-undo-meal],button[data-swap-slot],button[data-plan-date],button[data-plan-today],button[data-select-date],button[data-day-recipe],button[data-meal-count],button[data-set-meal-count],button[data-setup-meals],button[data-week-buy],button[data-open-weekdate]');if(!e)return;
 if(e.dataset.openWeekdate){state.planDate=e.dataset.openWeekdate;state.selectedDay=weekdayFor(state.planDate);navigate('today');return;}
 if(e.dataset.setupMeals){state.mealCount=Number(e.dataset.setupMeals);render();return;}
 if(e.dataset.weekBuy)return logWeeklyPurchase(e.dataset.weekBuy);
 if(e.dataset.mealCount)return applyMealCount(configuredMealCount(state)+Number(e.dataset.mealCount));
 if(e.dataset.setMealCount)return applyMealCount(Number(e.dataset.setMealCount));
 if(e.dataset.dayRecipe){let slot=e.dataset.dayRecipe;if(slot==='dinner'){const r=getDailyMeal(state,planKey(),'dinner');return openRecipe(r.recipeId);}
  state.miniSlot=slot;navigate('miniRecipe');return;}
 if(e.dataset.eat)return logEat(e.dataset.eat);
 if(e.dataset.undoMeal)return undoEat(e.dataset.undoMeal);
 if(e.dataset.swapSlot)return changeDailyMeal(e.dataset.swapSlot);
 if(e.dataset.planDate){state.planDate=shiftDay(planKey(),Number(e.dataset.planDate));render(true);return;}
 if(e.dataset.planToday){state.planDate=dayKeyLocal();render(true);return;}
 if(e.dataset.selectDate){state.planDate=e.dataset.selectDate;state.selectedDay=weekdayFor(state.planDate);render(true);return;}
 if(e.dataset.page)return navigate(e.dataset.page);
 if(e.dataset.action)return doAction(e.dataset.action);
 if(e.dataset.open)return openRecipe(e.dataset.open);
 if(e.dataset.fav){let id=e.dataset.fav;state.favorites=state.favorites.includes(id)?state.favorites.filter(x=>x!==id):[...state.favorites,id];render(true);announce(state.favorites.includes(id)?'Lagt i favoritter':'Fjernet fra favoritter');return;}
 if(e.dataset.filter){state.filter=e.dataset.filter;render(true);return;}
 if(e.dataset.day!==undefined){state.selectedDay=Number(e.dataset.day);state.planDate=weekKey(state.selectedDay);render(true);return;}
 if(e.dataset.ingredient!==undefined){let index=Number(e.dataset.ingredient);state.ingredientChecked=state.ingredientChecked.includes(index)?state.ingredientChecked.filter(x=>x!==index):[...state.ingredientChecked,index];render(true);return;}
 if(e.dataset.portion){let r=meal(state.recipeId);state.portionOverrides[r.id]=clamp(portion(r)+Number(e.dataset.portion),1,8);render(true);return;}
 if(e.dataset.stepOpen!==undefined){state.step=Number(e.dataset.stepOpen);resetStepTimer();navigate('cook');return;}
 if(e.dataset.store){state.shopStore=e.dataset.store;render(true);return;}
 if(e.dataset.dealStore){state.dealStore=e.dataset.dealStore;render(true);return;}
 if(e.dataset.shoppingView){state.shoppingView=e.dataset.shoppingView;render(true);return;}
 if(e.dataset.buy){let id=e.dataset.buy,g=item(id);if(!g)return;
 if(!state.purchased.includes(id)){
  state.purchased.push(id);state.stockVersion=(state.stockVersion||0)+1;state.purchaseLedger??=[];state.purchaseLedger.push({id,price:g.price,date:dayKeyLocal()});
  if(!state.stockedPurchases.includes(id)){state.pantry[id]=rounded((state.pantry[id]||0)+1,6);state.stockedPurchases.push(id);}
  render(true);announce('Kjøpt! Én pakke lagt i lageret.');return;
 }
 if(state.stockedPurchases.includes(id)){
  if(inventoryAmount(state,id)+1e-5<g.grams){announce('Varen er allerede brukt. Angre måltidet før du angrer kjøpet.');return;}
  state.pantry[id]=rounded(Math.max(0,state.pantry[id]-1),6);
  state.stockedPurchases=state.stockedPurchases.filter(x=>x!==id);
 }
 state.stockVersion=(state.stockVersion||0)+1;state.purchased=state.purchased.filter(x=>x!==id);const i=(state.purchaseLedger||[]).findLastIndex(x=>x.id===id);if(i>=0)state.purchaseLedger.splice(i,1);render(true);announce('Kjøpet er angret.');return;
 }
 if(e.dataset.addStock){let id=e.dataset.addStock;if(state.stockedPurchases.includes(id))return;state.pantry[id]=clamp((state.pantry[id]||0)+1,0,99);state.stockedPurchases.push(id);state.stockVersion=(state.stockVersion||0)+1;render(true);announce('Lagt til i lageret');return;}
 if(e.dataset.extra){let id=e.dataset.extra;if(!state.extras.includes(id))state.extras.push(id);render(true);announce('Varen ligger på handlelisten');return;}
 if(e.dataset.stock){let [id,delta]=e.dataset.stock.split(':');state.pantry[id]=rounded(clamp((Number(state.pantry[id])||0)+Number(delta),0,99),6);state.stockVersion=(state.stockVersion||0)+1;render(true);return;}
});
document.addEventListener('input',event=>{if(event.target.id==='recipe-search'){state.search=event.target.value;updateRecipeResults();const clr=document.querySelector('.clear-search');if(clr)clr.hidden=!state.search;save();}});
document.addEventListener('change',event=>{if(event.target.id==='protein-target'){state.profile.customProtein=true;}
 if(event.target.id==='energy-target'){state.profile.customCalorie=true;}});
document.addEventListener('input',event=>{const id=event.target.id;if(id==='setup-calorie'&&state.profile.customCalorie){const v=Number(event.target.value);if(v>=1200&&v<=4500)state.energyTarget=v;}
 if(id==='setup-protein'&&state.profile.customProtein){const v=Number(event.target.value);if(v>=60&&v<=240)state.proteinTarget=v;}
 if(id==='setup-budget'||id==='monthly-budget'){const v=parseNumericValue(event.target.value);if(Number.isFinite(v)&&v>0)state.monthlyBudget=normalizeMonthlyBudget(v);}});
let touchStart=0;document.addEventListener('touchstart',e=>{if(e.target.closest('#day-card'))touchStart=e.changedTouches[0].clientX;},{passive:true});
document.addEventListener('touchend',e=>{if(!touchStart)return;let delta=e.changedTouches[0].clientX-touchStart;touchStart=0;if(Math.abs(delta)>55 && state.page==='week'){state.selectedDay=clamp(state.selectedDay+(delta<0?1:-1),0,6);render(true);}}, {passive:true});
render();

