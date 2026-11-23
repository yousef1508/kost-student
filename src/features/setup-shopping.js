/* First-run setup, profile editing, and weekly shopping UI. */
/* Personalized first-run setup + profile editing + weekly shopping UI.
   Presentation only and deterministic local data, no live prices. */
const say=(nb,en)=>state.lang==='en'?en:nb;
const parseNumericValue=value=>{if(value===undefined||value===null)return NaN;const raw=String(value).trim().replace(',', '.');if(raw==='')return NaN;return Number(raw);};
const numeric=(id,low,high,fallback)=>{const el=document.getElementById(id);const raw=el?.value??'';const v=parseNumericValue(raw);return el&&Number.isFinite(v)&&String(raw).trim()!==''&&v>=low&&v<=high?v:fallback;};
const selected=(id,fallback)=>document.getElementById(id)?.value||fallback;
function setFieldState(id,isValid){const el=document.getElementById(id);if(!el)return;el.classList.toggle('field-error',!isValid);}
function onboarding(){
 const i=state.onboardingStep||0,p=state.profile||PROFILE_DEFAULTS,rec=recommendedGoals(p),last=i===2;
 const stepLabels=[say('Velkommen','Welcome'),say('Om deg','About you'),say('Din plan','Your plan')];
 const dots=stepLabels.map((x,k)=>`<span class="setup-dot ${k===i?'active':''}" aria-label="${safe(x)}"></span>`).join('');
 let content='';
 if(i===0){
 content=`<div class="setup-art">✳ <span>KOST</span><i>✦</i></div><h1>${say('Sunn mat. Din måte.','Good food, your way.')}</h1><p class="setup-intro">${say('Vi hjelper deg å spise godt og handle smart. Først gjør vi appen litt mer deg.','Eat well and shop smart. First, let’s make KOST yours.')}</p>
 <div class="setup-card"><h2>${say('Velg utseende','Choose appearance')}</h2><div class="setup-choice-row"><button data-action="theme:light" class="setup-select ${state.theme==='light'?'picked':''}">☀ ${say('Lyst','Light')}</button><button data-action="theme:dark" class="setup-select ${state.theme==='dark'?'picked':''}">☾ ${say('Mørkt','Dark')}</button></div></div>
 <div class="setup-card"><h2>${say('Velg språk','Choose language')}</h2><div class="setup-choice-row"><button data-action="lang:nb" class="setup-select ${state.lang==='nb'?'picked':''}">Norsk</button><button data-action="lang:en" class="setup-select ${state.lang==='en'?'picked':''}">English</button></div></div>
 <button class="setup-next" data-action="setup-next">${say('Fortsett ✨','Continue ✨')}</button>`;
 }else if(i===1){
 content=`<h1>${say('Bli litt kjent','A little about you')}</h1><p class="setup-intro">${say('Vi bruker dette til å foreslå matmengder. Alt kan endres senere.','We use this to estimate portions. You can change everything later.')}</p>
 <div class="setup-fields"><label>${say('Vekt','Weight')} <span>kg</span><input id="setup-weight" type="number" min="35" max="250" step="0.1" inputmode="decimal" placeholder="79" value="${p.weightKg??''}"></label>
 <label>${say('Høyde','Height')} <span>cm</span><input id="setup-height" type="number" min="120" max="230" inputmode="numeric" placeholder="175" value="${p.heightCm??''}"></label>
 <label>${say('Alder','Age')} <span>${say('år','years')}</span><input id="setup-age" type="number" min="18" max="90" inputmode="numeric" placeholder="25" value="${p.age??''}"></label>
 <label>${say('Beregning','Calculation')}<select id="setup-sex"><option value="unspecified" ${p.sex==='unspecified'?'selected':''}>${say('Ikke oppgitt','Prefer not to say')}</option><option value="male" ${p.sex==='male'?'selected':''}>${say('Mann','Male')}</option><option value="female" ${p.sex==='female'?'selected':''}>${say('Kvinne','Female')}</option></select></label>
 <label>${say('Hvor aktiv er du?','How active are you?')}<select id="setup-activity">${[['sedentary',say('Mest stillesittende','Mostly sedentary')],['light',say('Litt aktiv','Lightly active')],['moderate',say('Trener 3–5 dager','Train 3–5 days')],['active',say('Svært aktiv','Very active')]].map(([key,text])=>`<option value="${key}" ${key===p.activity?'selected':''}>${text}</option>`).join('')}</select></label>
 <label>${say('Hva vil du oppnå?','Your goal')}<select id="setup-goal">${[['cut',say('Mindre fett, beholde muskler','Lose fat, keep muscle')],['maintain',say('Holde vekten','Maintain weight')],['gain',say('Bygge muskler','Build muscle')]].map(([key,text])=>`<option value="${key}" ${key===p.goal?'selected':''}>${text}</option>`).join('')}</select></label></div>
 <div class="setup-actions"><button data-action="setup-back">${say('Tilbake','Back')}</button><button class="setup-next" data-action="setup-next">${say('Beregn mine mål','Calculate my goals')}</button></div>`;
 }else{
 content=`<h1>${say('Dette passer deg','Your starting plan')}</h1><p class="setup-intro">${say('Et forslag basert på målene dine. Du bestemmer selv.','A starting estimate based on your goals. You are in control.')}</p>
 <div class="setup-estimate"><div><small>${say('Kalorier per dag','Calories per day')}</small><strong>${state.energyTarget} <em>kcal</em></strong><button data-action="setup-toggle-cal">${p.customCalorie?say('Bruk anbefalt','Use recommendation'):say('Endre selv','Customize')}</button>${p.customCalorie?`<input id="setup-calorie" type="number" min="1200" max="4500" step="25" value="${state.energyTarget}">`:''}</div>
 <div><small>${say('Protein per dag','Protein per day')}</small><strong>${state.proteinTarget} <em>g</em></strong><button data-action="setup-toggle-protein">${p.customProtein?say('Bruk anbefalt','Use recommendation'):say('Endre selv','Customize')}</button>${p.customProtein?`<input id="setup-protein" type="number" min="60" max="240" step="5" value="${state.proteinTarget}">`:''}</div></div>
 <p class="setup-guidance">${say('Anslått vedlikeholdsbehov:','Estimated maintenance:')} ${rec?.maintenance||'–'} kcal. ${say('Følg med på vekt og energi over tid, og juster ved behov.','Monitor your weight and energy, and adjust as needed.')}</p>
 <div class="setup-card"><h2>${say('Måltider om dagen','Meals per day')}</h2><div class="setup-meals">${[2,3,4,5,6].map(x=>`<button class="${x===state.mealCount?'picked':''}" data-setup-meals="${x}">${x}</button>`).join('')}</div></div>
 <div class="setup-fields one"><label>${say('Matbudsjett per måned','Monthly food budget')} <span>kr</span><input id="setup-budget" type="number" min="1" step="1" value="${state.monthlyBudget}"></label></div>
 <div class="setup-actions"><button data-action="setup-back">${say('Tilbake','Back')}</button><button class="setup-next" data-action="setup-finish">${say('Start matplanen 🌟','Build my plan 🌟')}</button></div>`;
 }
 return `<div class="page setup-page"><div class="setup-status"><strong>KOST ✳</strong><span>${say('Steg','Step')} ${i+1} ${say('av','of')} 3</span></div><div class="setup-dots">${dots}</div>${content}</div>`;
}
function readProfile(prefix){
 const p={...state.profile};
 const existingWeight=Number.isFinite(+p.weightKg)?+p.weightKg:null;
 const existingHeight=Number.isFinite(+p.heightCm)?+p.heightCm:null;
 const existingAge=Number.isFinite(+p.age)?+p.age:null;
 const w=numeric(`${prefix}-weight`,35,250,existingWeight),h=numeric(`${prefix}-height`,120,230,existingHeight),a=numeric(`${prefix}-age`,18,90,existingAge);
 const validWeight=Number.isFinite(+w)&&+w>=35&&+w<=250;
 const validHeight=Number.isFinite(+h)&&+h>=120&&+h<=230;
 const validAge=Number.isFinite(+a)&&+a>=18&&+a<=90;
 setFieldState(`${prefix}-weight`,validWeight);setFieldState(`${prefix}-height`,validHeight);setFieldState(`${prefix}-age`,validAge);
 if(!validWeight||!validHeight||!validAge)return false;
 Object.assign(p,{weightKg:+w,heightCm:+h,age:+a,sex:selected(`${prefix}-sex`,'unspecified'),activity:selected(`${prefix}-activity`,'moderate'),goal:selected(`${prefix}-goal`,'maintain')});
 state.profile=p;return true;
}
function fillTargetsFromProfile(){const calc=recomputeProfileTargets(state);return calc;}
function profileSettings(){
 const p=state.profile,r=recommendedGoals(p),reco=r?`${r.calories} kcal · ${r.protein} g`:say('Fyll ut profilen','Complete profile');
 return `<section class="profile-settings"><div class="section-title"><h2>${say('Om deg','About you')}</h2></div><p class="profile-hint">${say('Vi tilpasser matplanen når du lagrer.','We adapt your meals when you save.')}</p>
 <div class="setup-fields profile-fields"><label>${say('Vekt','Weight')} (kg)<input id="settings-weight" type="number" min="35" max="250" step="0.1" value="${p.weightKg??''}"></label>
 <label>${say('Høyde','Height')} (cm)<input id="settings-height" type="number" min="120" max="230" value="${p.heightCm??''}"></label>
 <label>${say('Alder','Age')}<input id="settings-age" type="number" min="18" max="90" value="${p.age??''}"></label>
 <label>${say('Beregning','Calculation')}<select id="settings-sex">${[['unspecified',say('Ikke oppgitt','Not specified')],['male',say('Mann','Male')],['female',say('Kvinne','Female')]].map(([k,s])=>`<option value="${k}" ${p.sex===k?'selected':''}>${s}</option>`).join('')}</select></label>
 <label>${say('Aktivitetsnivå','Activity')}<select id="settings-activity">${[['sedentary',say('Mest stillesittende','Mostly sedentary')],['light',say('Litt aktiv','Lightly active')],['moderate',say('Trener 3–5 dager','Train 3–5 days')],['active',say('Svært aktiv','Very active')]].map(([k,s])=>`<option value="${k}" ${p.activity===k?'selected':''}>${s}</option>`).join('')}</select></label>
 <label>${say('Målet ditt','Your goal')}<select id="settings-goal">${[['cut',say('Mindre fett','Lose fat')],['maintain',say('Holde vekten','Maintain weight')],['gain',say('Bygge muskler','Build muscle')]].map(([k,s])=>`<option value="${k}" ${p.goal===k?'selected':''}>${s}</option>`).join('')}</select></label></div>
 <p class="profile-hint">${say('Anbefalt utgangspunkt','Starting recommendation')}: <b>${reco}</b></p>
 <div class="settings-row"><label for="monthly-budget">${say('Matbudsjett per måned','Monthly food budget')}</label><input class="target-input" type="number" id="monthly-budget" min="1" step="1" value="${state.monthlyBudget}"><span>kr</span></div>
 <div class="profile-reset-row"><button data-action="settings-cal-auto">${p.customCalorie?say('Bruk foreslått kaloriinntak','Use suggested calories'):say('Kalorier: anbefalt','Calories: recommended')}</button><button data-action="settings-protein-auto">${p.customProtein?say('Bruk foreslått proteinmål','Use suggested protein'):say('Protein: anbefalt','Protein: recommended')}</button></div>
 <button class="button block dark" data-action="save-profile">${say('Lagre og tilpass hele planen','Save and update my plan')}</button></section>`;
}
function shopV12(){
 for(const day of weekRange(planKey()))ensureDailyPlan(day);
 const report=weekShoppingNeeds(state,weekRange(planKey())),weekPurch=state.weekPurchaseCounts?.[report.weekId]||{};
 const remaining=report.items.filter(x=>x.packs>0),done=report.items.filter(x=>x.purchasedPacks>0),shown=state.shoppingView==='kjopt'?done:remaining;
 const filtered=shown.filter(x=>state.shopStore==='Alle'||x.food.store===state.shopStore);
 const weekDate=displayDayDate(report.dates[0]).replace(/^\S+\s*/,''),diff=rounded(report.cost-report.budget,2),monthly=normalizeMonthlyBudget(state.monthlyBudget);
 const statusLabel=report.overBudget?`${money(Math.abs(diff))} ${say('over budsjett','over budget')}`:`${money(Math.abs(diff))} ${say('igjen','left')}`;
 return `${header()}<p class="eyebrow">${say('Denne ukas mat','This week’s food')}</p><h1 class="heading">${say('Handle for uka','Shop for the week')}</h1>
 <section class="weekly-budget-hero"><div><small>${say('GJENSTÅR Å KJØPE','LEFT TO BUY')}</small><strong>${money(report.cost)}</strong><p>${say('Ukebudsjett','Weekly budget')}: ${money(report.budget)}</p></div><div class="weekly-budget-status ${report.overBudget?'warning':'good'}">${statusLabel}</div></section>
 <div class="weekly-budget-breakdown"><div class="budget-break-pill ${report.overBudget?'warning':'good'}"><strong>${report.overBudget?say('Derfor er du over budsjett','Why you are over budget'):say('Slik er totalsummen regnet ut','How this total is calculated')}</strong><small>${report.overBudget?say('Du mangler fortsatt varer for mer enn ukesandelen av månedsbudsjettet.','You still need items that cost more than this week’s share of your monthly budget.'):say('Du holder deg innenfor denne ukens andel av månedsbudsjettet.','You are within this week’s share of your monthly budget.')}</small></div><div class="weekly-budget-figures"><span>${say('Manglende varer akkurat nå','Missing items right now')}: <b>${money(report.cost)}</b></span><small>${say('Bare varer du fortsatt mangler til de neste 7 dagene. Det du allerede har hjemme er trukket fra.','Only the items you still need for the next 7 days. Anything already in your pantry is subtracted first.')}</small><span>${say('Ukebudsjett fra månedsbudsjett','Weekly budget from monthly budget')}: <b>${money(report.budget)}</b></span><small>${say('Beregnet fra','Calculated from')} ${money(monthly)} / ${say('måned','month')} ÷ 30 × 7. ${say('Hele pakker regnes med','Whole packs are included')}.</small><span>${report.overBudget?say('Forskjell','Difference'):say('Margin igjen','Margin left')}: <b>${money(Math.abs(diff))}</b> ${report.overBudget?say('over','over'):say('innenfor','within')}</span></div></div>
 <div class="weekly-shop-insight"><strong>${report.avgCalories} kcal · ${nfmt(report.avgProtein)} g ${say('protein per dag','protein per day')}</strong><p>${say('Basert på de sju planlagte dagene og det du har hjemme. Hele pakker er regnet med.','Based on seven planned days and your current pantry. Whole packs included.')}</p></div>
 <div class="segment-tabs"><button data-shopping-view="mangler" class="${state.shoppingView==='mangler'?'selected':''}">${say('Må kjøpes','To buy')} <b>${remaining.reduce((x,a)=>x+a.packs,0)}</b></button><button data-shopping-view="kjopt" class="${state.shoppingView==='kjopt'?'selected':''}">${say('Kjøpt','Bought')} <b>${done.reduce((x,a)=>x+a.purchasedPacks,0)}</b></button></div>
 <div class="filters">${['Alle',...STORES].map(store=>`<button class="filter ${state.shopStore===store?'active':''}" data-store="${store}">${store==='Alle'?say('Alle','All'):store}</button>`).join('')}</div>
 <div class="shopping-results">${filtered.length?[...new Set(filtered.map(x=>x.food.store))].map(store=>`<div class="store-heading"><strong>${store}</strong><small>${filtered.filter(x=>x.food.store===store).length} ${(filtered.filter(x=>x.food.store===store).length===1)?say('vare','item'):say('varer','items')}</small></div>${filtered.filter(x=>x.food.store===store).map(line=>`<div class="product-row"><img class="product-photo" src="${image('product_'+line.id)}" alt="${safe(line.food.name)}"><div class="product-copy"><strong>${safe(line.food.name)}</strong><small>${safe(line.food.size)} · ${state.shoppingView==='kjopt'?line.purchasedPacks:line.packs} ${((state.shoppingView==='kjopt'?line.purchasedPacks:line.packs)===1)?say('pakke','pack'):say('pakker','packs')}</small><b>${money((state.shoppingView==='kjopt'?line.purchasedPacks:line.packs)*line.food.price)}</b></div><button class="check-btn ${state.shoppingView==='kjopt'?'done':''}" data-week-buy="${line.id}:${state.shoppingView==='kjopt'?-1:1}" aria-label="${say('Endre kjøp','Change purchase')} ${safe(line.food.name)}">${icon(state.shoppingView==='kjopt'?'check':'plus',20)}</button></div>`).join('')}`).join(''):
 `<div class="empty-state"><span class="empty-icon" aria-hidden="true">${remaining.length===0&&state.shoppingView==='mangler'?'✓':'⌕'}</span><h3>${remaining.length===0&&state.shoppingView==='mangler'?say('Ferdig med ukeshandelen!','Your weekly shopping is covered!'):say('Ingen varer i dette utvalget','No items in this selection')}</h3><p>${remaining.length===0&&state.shoppingView==='mangler'?say('Alt er allerede registrert som kjøpt eller finnes på lageret.','Everything is already purchased or available in your pantry.'):say('Prøv Alle eller bytt mellom Må kjøpes og Kjøpt.','Select All or switch between To buy and Bought.')}</p></div>`}</div>
 <div class="weekly-footer"><button class="button block outline" data-page="budget">${say('Se budsjettet 💸','View budget 💸')}</button><button class="button block lime" data-page="week">${say('Se ukemenyen 🍽️','View weekly menu 🍽️')}</button></div>`;
}
function logWeeklyPurchase(token){const [id,changeText]=String(token).split(':'),diff=Number(changeText),g=item(id),days=weekRange(planKey()),week=days[0];if(!g||![1,-1].includes(diff))return;
 state.weekPurchaseCounts??={};state.weekPurchaseCounts[week]??={};let prev=state.weekPurchaseCounts[week][id]||0;
 if(diff===-1&&prev===0)return;
 if(diff===-1&&inventoryAmount(state,id)+.00001<g.grams){announce(say('Maten er brukt. Angre måltidet først.','Food has been used. Undo the meal first.'));return;}
 state.weekPurchaseCounts[week][id]=prev+diff;
 state.pantry[id]=rounded(Math.max(0,(state.pantry[id]||0)+diff),6);state.stockVersion=(state.stockVersion||0)+1;
 state.purchaseLedger??=[];
 if(diff>0)state.purchaseLedger.push({id,price:g.price,date:dayKeyLocal(),week});
 else{const ix=state.purchaseLedger.findLastIndex(x=>x.id===id&&x.week===week);if(ix>=0)state.purchaseLedger.splice(ix,1);}
 render(true);announce(diff>0?say('Kjøpt. Lagt til i lageret.','Bought and added to pantry.'):say('Kjøpet er angret.','Purchase undone.'));
}

