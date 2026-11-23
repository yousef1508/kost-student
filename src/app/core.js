/* KOST application core. */
/* KOST Student · Fargerik, interaktiv frontend. Ingen live-butikkdata eller Android-bakgrunnsjobb. */
const IMAGE_ROOT = '';
const image = id => EMBEDDED_IMAGES[id] || '';
const currentLocale = ()=>state?.lang==='en'?'en-US':'nb-NO';
const money = n => `${new Intl.NumberFormat(currentLocale(),{minimumFractionDigits:2,maximumFractionDigits:2}).format(n)} kr`;
const nfmt = n => new Intl.NumberFormat(currentLocale(),{maximumFractionDigits:1}).format(n);
const clamp = (v,a,b) => Math.max(a,Math.min(v,b));
const item = id => FOOD.find(x=>x.id===id);
const meal = id => RECIPE_DATA.find(x=>x.id===id) || RECIPE_DATA[0];
const safe = str => String(str).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const DAY_NAMES={nb:['Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag','Søndag'],en:['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']};
const SHORT_DAY_NAMES={nb:['Man','Tir','Ons','Tor','Fre','Lør','Søn'],en:['Mon','Tue','Wed','Thu','Fri','Sat','Sun']};
const UI={
 nb:{
  navToday:'I dag',navWeek:'Uke',navShop:'Handle',navPantry:'Lager',
  weekEyebrow:'Denne uka',weeklyMenu:'Ukens meny',seeRecipe:'Se oppskrift',swapDish:'Bytt rett',seeMissing:'Se hva som mangler',moreDishes:'Flere retter',allRecipes:'Alle oppskrifter',cheapMeals:'Gode middager trenger ikke være dyre.',
  settingsEyebrow:'Din KOST',settingsTitle:'Sånn liker du det.',appearance:'Utseende',theme:'Tema',light:'Lys',dark:'Mørk',language:'Språk',norwegian:'Norsk',english:'English',
  yourFood:'Maten din',noPork:'Uten svinekjøtt',noOats:'Ingen havregryn',yourMeals:'Måltidene dine',howManyMeals:'Hvor mange måltider vil du spise?',mealCountHelp:'Antallet endrer porsjonene og dagsplanen.',
  yourGoals:'Målene dine',proteinPerDay:'Protein per dag',caloriesPerDay:'Kalorier per dag',goalsHelp:'Når du endrer mål eller antall måltider, får du en ny dagsplan. Måltider du har spist blir ikke slettet.',
  reminders:'Påminnelser',shoppingReminders:'Handlepåminnelser',reminderOn:'Påminnelse på',shortcuts:'Snarveier',budget:'Budsjett',recipes:'Oppskrifter',reset:'Start på nytt',
  todayHungry:'Hei, sulten?',todayDone:'Proteinet er i boks!',dinnerInPlan:'Middag i planen',eatenToday:'Spist i dag',planCoversGoal:'Planen dekker målet',seeDayPlan:'Se dagens plan',goalReached:'Målet nådd',remaining:'g igjen',caloriesToday:'Kalorier i dag',moreRecipes:'Flere oppskrifter',seeAll:'Se alle',budgetTeaser:'Matbudsjett',budgetTeaserSub:'Se hvor mye som er igjen',
  cookbookEyebrow:'Din lille kokebok',whatSoundsGood:'Hva frister?',searchPlaceholder:'Søk etter mat eller ingrediens',weekFavorite:'Ukens favoritt',goodCheapMade:'Godt. Billig. Laget av deg.',findDish:'Finn en rett som passer dagen din.',all:'Alle',quick:'Raskt',proteinRich:'Proteinrikt',under20:'Under 20 kr',favorites:'Favoritter',haveEverything:'Har alt',resultsDish:'rett',resultsDishes:'retter',noDishes:'Fant ingen retter',tryAnother:'Prøv et annet søk eller vis alle oppskriftene.',showAll:'Vis alle',
  modeSaved:'Tema oppdatert',languageSaved:'Språk oppdatert'
 },
 en:{
  navToday:'Today',navWeek:'Week',navShop:'Shop',navPantry:'Pantry',
  weekEyebrow:'This week',weeklyMenu:'Weekly menu',seeRecipe:'See recipe',swapDish:'Swap dish',seeMissing:'See missing items',moreDishes:'More dishes',allRecipes:'All recipes',cheapMeals:'Good dinners do not have to be expensive.',
  settingsEyebrow:'Your KOST',settingsTitle:'Make it yours.',appearance:'Appearance',theme:'Theme',light:'Light',dark:'Dark',language:'Language',norwegian:'Norwegian',english:'English',
  yourFood:'Your food',noPork:'No pork',noOats:'No oats',yourMeals:'Your meals',howManyMeals:'How many meals do you want per day?',mealCountHelp:'This changes both portions and the daily plan.',
  yourGoals:'Your goals',proteinPerDay:'Protein per day',caloriesPerDay:'Calories per day',goalsHelp:'When you change goals or meal count, you get a new daily plan. Meals already eaten are kept.',
  reminders:'Reminders',shoppingReminders:'Shopping reminders',reminderOn:'Reminder day',shortcuts:'Shortcuts',budget:'Budget',recipes:'Recipes',reset:'Reset',
  todayHungry:'Stay on track today',todayDone:'Protein goal reached!',dinnerInPlan:'Dinner in plan',eatenToday:'Eaten today',planCoversGoal:'Plan hits the goal',seeDayPlan:"See today's plan",goalReached:'Goal reached',remaining:'g left',caloriesToday:'Calories today',moreRecipes:'More recipes',seeAll:'See all',budgetTeaser:'Food budget',budgetTeaserSub:'See how much is left',
  cookbookEyebrow:'Your cookbook',whatSoundsGood:'What sounds good?',searchPlaceholder:'Search by meal or ingredient',weekFavorite:'Weekly favorite',goodCheapMade:'Tasty. Affordable. Made by you.',findDish:'Find a dish that fits your day.',all:'All',quick:'Quick',proteinRich:'High protein',under20:'Under 20 kr',favorites:'Favorites',haveEverything:'Have all',resultsDish:'dish',resultsDishes:'dishes',noDishes:'No dishes found',tryAnother:'Try another search or show all recipes.',showAll:'Show all',
  modeSaved:'Theme updated',languageSaved:'Language updated'
 }
};
const LABEL_FILTERS=[['Alle','all'],['Raskt','quick'],['Proteinrikt','proteinRich'],['Under 20 kr','under20'],['Favoritter','favorites'],['Har alt','haveEverything']];
const t=k=>(UI[state?.lang||'nb']||UI.nb)[k]||UI.nb[k]||k;
const dayNames=()=>DAY_NAMES[state?.lang||'nb']||DAY_NAMES.nb;
const shortDayNames=()=>SHORT_DAY_NAMES[state?.lang||'nb']||SHORT_DAY_NAMES.nb;
const todayName = ()=>new Intl.DateTimeFormat(currentLocale(),{weekday:'long',day:'numeric',month:'long'}).format(new Date());
const weekdayIndex=()=>((new Date().getDay()+6)%7);
const weekdayDate=i=>{const now=new Date();const mon=new Date(now.getFullYear(),now.getMonth(),now.getDate()-weekdayIndex());mon.setDate(mon.getDate()+i);return mon.getDate()};
const iconPaths={
  home:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z"/>',
  calendar:'<rect x="3" y="5" width="18" height="16" rx="3"/><path d="M7 3v4M17 3v4M3 10h18"/>',
  bag:'<path d="M4 8h16l-1 13H5L4 8Z"/><path d="M9 9V6a3 3 0 0 1 6 0v3"/>',
  fridge:'<rect x="5" y="2" width="14" height="20" rx="3"/><path d="M5 11h14M9 6v3M9 15v3"/>',
  arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>', back:'<path d="m15 18-6-6 6-6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>', minus:'<path d="M5 12h14"/>', check:'<path d="m4 12 5 5L20 6"/>',
  heart:'<path d="M20.8 5.5a5 5 0 0 0-7.1 0L12 7.2l-1.7-1.7a5 5 0 0 0-7.1 7.1L12 21l8.8-8.4a5 5 0 0 0 0-7.1Z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v6l4 2"/>', chef:'<path d="M7 16H5a4 4 0 0 1-.4-8 5 5 0 0 1 9-3 5 5 0 0 1 5.4 4 4 4 0 0 1 .1 7H17"/><path d="M7 14v7h10v-7"/>',
  tag:'<path d="M3 12V4h8l10 10-7 7-11-9Z"/><circle cx="8" cy="8" r="1"/>',
  flame:'<path d="M12 22c-4 0-7-3-7-7 0-4 3-7 5-10 1 2 2 3 2 5 2-2 3-4 3-8 3 3 5 7 5 12 0 5-3 8-8 8Z"/>',
  search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  sliders:'<path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="currentColor" stroke="none"/><circle cx="16" cy="17" r="3" fill="currentColor" stroke="none"/>',
  wallet:'<rect x="2" y="6" width="20" height="15" rx="3"/><path d="M2 9V6c0-2 2-3 4-3h13"/><path d="M15 13h7v5h-7a2 2 0 0 1 0-5z"/>',
  rotate:'<path d="M3 12a9 9 0 1 0 3-6"/><path d="M3 4v5h5"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  star:'<path d="M12 2l3 7 7 .6-5.5 4.8L18.5 22 12 18l-6.5 4 2-7.6L2 9.6 9 9z"/>',
  pause:'<path d="M8 5v14M16 5v14"/>', play:'<path d="m8 5 11 7-11 7z"/>',
  trash:'<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14"/>',
  list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  moon:'<path d="M20.4 15.4A8.5 8.5 0 0 1 8.6 3.6 8.5 8.5 0 1 0 20.4 15.4Z"/>',
  sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42"/>'
};
const icon=(id,size=19)=>`<svg viewBox="0 0 24 24" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="1.85" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${iconPaths[id]||iconPaths.star}</svg>`;
const pic=(key,klass='',alt='')=>`<img class="${klass}" src="${image(key)}" alt="${safe(alt)}" loading="eager" decoding="async">`;
const btn=(text,action,cls='')=>`<button type="button" class="button ${cls}" data-action="${action}">${text}</button>`;
const heading=(name,action='',target='')=>`<div class="section-title"><h2>${name}</h2>${action?`<button class="text-link action-pill" data-action="${target}"><span>${action}</span><span class="emoji-action" aria-hidden="true">✨</span></button>`:''}</div>`;
const frame=document.getElementById('screen');
const device=document.getElementById('app-device');
const localKey='kost-student-preview-v22';
const defaultState={
  page:'today',backStack:[],recipeId:'tue',selectedDay:weekdayIndex(),weekChanges:{},
  search:'',filter:'Alle',shopStore:'Alle',dealStore:'Alle',
  purchased:[],stockedPurchases:[],extras:[],favorites:[],ingredientChecked:[],
  pantry:{},
  portionOverrides:{},step:0,timerSeconds:0,timerRunning:false,
  proteinExtra:false,notificationDay:'Onsdag',notifications:true,
  shoppingView:'mangler',budgetTab:'plan',mealCompleted:false,purchaseLedger:[],
  onboardingDone:false,onboardingStep:0,profile:{...PROFILE_DEFAULTS},monthlyBudget:DEFAULT_MONTHLY_BUDGET,weekPurchaseCounts:{},stockVersion:0,
  planDate:dayKeyLocal(),dailyChoices:{},dailyPortions:{},dayMealCounts:{},dailyPlanConfigs:{},mealLog:{},pinnedDinners:{},mealCount:4,proteinTarget:150,energyTarget:2400,miniSlot:'breakfast',theme:'light',lang:'nb'
};
function loadState(){
 try{
  const existing=localStorage.getItem(localKey)||localStorage.getItem('kost-student-preview-v21')||localStorage.getItem('kost-student-preview-v19')||localStorage.getItem('kost-student-preview-v18')||localStorage.getItem('kost-student-preview-v17')||localStorage.getItem('kost-student-preview-v12')||localStorage.getItem('kost-student-preview-v11')||localStorage.getItem('kost-student-preview-v10')||localStorage.getItem('kost-student-preview-v9')||localStorage.getItem('kost-student-preview-v8');
  let value=JSON.parse(existing||'{}');
  if(typeof value!=='object'||!value||Array.isArray(value))return structuredClone(defaultState);
  const merged={...structuredClone(defaultState),...value,backStack:[],page:'today',timerRunning:false,ingredientChecked:[],pantry:{...defaultState.pantry,...(value.pantry||{})},dailyChoices:value.dailyChoices||{},dailyPortions:value.dailyPortions||{},dayMealCounts:value.dayMealCounts||{},dailyPlanConfigs:value.dailyPlanConfigs||{},mealLog:value.mealLog||{},profile:{...PROFILE_DEFAULTS,...(value.profile||{})},weekPurchaseCounts:value.weekPurchaseCounts||{},pinnedDinners:value.pinnedDinners||{}};
  if(!/^\d{4}-\d{2}-\d{2}$/.test(merged.planDate||''))merged.planDate=dayKeyLocal();
  merged.proteinTarget=clamp(Math.round(Number(merged.proteinTarget)||150),60,240);
  merged.energyTarget=clamp(Math.round(Number(merged.energyTarget)||2400),1200,4500);
  merged.mealCount=clamp(Math.round(Number(merged.mealCount)||4),2,6);
  merged.monthlyBudget=normalizeMonthlyBudget(merged.monthlyBudget);
  merged.onboardingDone=value.onboardingDone===true;merged.onboardingStep=clamp(Math.round(Number(value.onboardingStep)||0),0,2);
  merged.theme=['light','dark'].includes(merged.theme)?merged.theme:'light';
  merged.lang=['nb','en'].includes(merged.lang)?merged.lang:'nb';
  if(!value.dayMealCounts)for(const [date,choices] of Object.entries(merged.dailyChoices))if(choices?.extra)merged.dayMealCounts[date]=5;
  // Remember the number of meals used when an earlier date was logged.
  for(const [date,entries] of Object.entries(merged.mealLog)){
   if(Object.keys(entries||{}).length>0&&!merged.dayMealCounts[date])merged.dayMealCounts[date]=entries.extra?5:4;
  }
  return merged;
 }catch{return structuredClone(defaultState);}
}
const state=loadState();
// Prøvemodus kjører kun i minnet. Ekte lager og måltidslogg lagres aldri mens den er aktiv.
var demoMode=false;
var realStateBeforeDemo=null;
var restoringDemo=false;
const displayItemName=id=>state.lang==='en'?(EN_FOOD[id]||item(id)?.name||id):(item(id)?.name||id);
const displaySlotName=slot=>{
 const norwegian=MEAL_SLOT_NAMES[slot]||slot;
 return state.lang==='en'?(EN_SLOTS[norwegian]||norwegian):norwegian;
};
const save=()=>{if(demoMode||restoringDemo)return;try{const {backStack,...store}=state;localStorage.setItem(localKey,JSON.stringify({...store,timerRunning:false}));}catch{}};
function toggleDemoMode(){
 if(demoMode){
  if(realStateBeforeDemo){const backup=structuredClone(realStateBeforeDemo);Object.assign(state,backup);}
  demoMode=false;realStateBeforeDemo=null;restoringDemo=true;try{render(true);}finally{restoringDemo=false;}
  announce(say('Du er tilbake til ditt eget lager.','Back to your own pantry.'));
  return;
 }
 realStateBeforeDemo=structuredClone(state);demoMode=true;
 const date=planKey();
 // Start med en separat, uregistrert testdag og nok råvarer til å teste både logg og angring.
 state.mealLog??={};delete state.mealLog[date];
 state.pantry={};for(const product of FOOD)state.pantry[product.id]=20;
 state.stockVersion=(state.stockVersion||0)+1;
 state.dailyPlanConfigs??={};delete state.dailyPlanConfigs[date];
 state.page='today';render(true);
 announce(say('Testlageret er klart. Prøv «Spist» på et måltid.','Test pantry ready. Tap “Eaten” on any meal.'));
}

function announce(msg){if(typeof translatePhrase==='function')msg=translatePhrase(msg);const region=document.getElementById('live-region');region.textContent='';setTimeout(()=>region.textContent=msg,20);let old=device.querySelector('.toast');old?.remove();let el=document.createElement('div');el.className='toast';el.setAttribute('role','status');el.setAttribute('aria-live','polite');el.innerHTML=`<div class="toast-pill"><span>${safe(msg)}</span></div>`;device.appendChild(el);clearTimeout(announce.task);announce.task=setTimeout(()=>el.remove(),2500);}
function header(){return `<div class="topbar"><button class="brand" data-page="today" aria-label="KOST home">KOST<span>✳</span></button><div class="topbar-actions"><button class="settings-button" data-page="settings" aria-label="${t('settingsTitle')}">${icon('sliders',19)}</button><button class="avatar" data-page="settings" aria-label="${t('settingsTitle')}">K</button></div></div>`;}
function nav(){const active={miniRecipe:'today',today:'today',week:'week',shop:'shop',pantry:'pantry',deals:'shop',budget:'today',recipes:'week',recipe:'week',cook:'week',settings:'today'}[state.page]||'today';return `<nav class="nav" aria-label="Main menu">${[['today',t('navToday'),'home'],['week',t('navWeek'),'calendar'],['shop',t('navShop'),'bag'],['pantry',t('navPantry'),'fridge']].map(([page,label,ic])=>`<button type="button" data-page="${page}" class="${active===page?'active':''}" ${active===page?'aria-current="page"':''}>${icon(ic,20)}<span>${label}</span></button>`).join('')}</nav>`;}
function backbar(title='Oppskrift',fav=false){return `<div class="back-bar"><button class="circle-button" data-action="back" aria-label="Tilbake"><span class="back-close" aria-hidden="true">✕</span></button><strong>${title}</strong>${fav?`<button class="circle-button heart-btn ${state.favorites.includes(state.recipeId)?'saved':''}" data-action="favorite" aria-label="${state.favorites.includes(state.recipeId)?'Fjern favoritt':'Lagre favoritt'}">${icon('heart',20)}</button>`:''}</div>`;}
function navigate(page){if(!state.onboardingDone)return;if(!page||!['today','week','shop','pantry','deals','budget','recipes','recipe','miniRecipe','cook','settings'].includes(page))return;stopTimer();if(state.page!==page)state.backStack.push(state.page);state.page=page;render();save();}
function goBack(){stopTimer();state.page=state.backStack.pop()||'week';render();save();}
