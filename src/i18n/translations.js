/* Norwegian and English food, recipe, and interface translations. */
/* KOST Student: complete UI copy and food/recipe translations.
   All food calculations remain ID- and quantity-based and are language-independent. */
const EN_FOOD={
 chicken:'Ground chicken',eggs:'Eggs',cottage:'Low-fat cottage cheese',milk:'Low-fat milk',
 tuna:'Tuna in water',salmon:'Salmon',mackerel:'Mackerel in tomato sauce',peas:'Dried yellow peas',
 lentils:'Red lentils',bread:'Extra wholegrain bread',rice:'Jasmine rice',pasta:'Wholewheat pasta',
 potatoes:'Potatoes',carrots:'Carrots',cabbage:'Cabbage',onions:'Yellow onions',bananas:'Bananas',
 apples:'Apples',broccoli:'Frozen broccoli',tomatoes:'Chopped tomatoes',oil:'Rapeseed oil',spices:'Spices and garlic'
};
const EN_RECIPES={
 mon:{name:'Chicken rice bowl',sub:'Juicy ground chicken with carrots and rice',steps:[
 ['Cook the rice','Rinse the rice and cook with the correct amount of water, following the package instructions. Keep covered while you prepare the rest.','You can cook enough rice for two days.'],
 ['Prepare the vegetables','Peel and dice the carrots. Finely chop the onion so everything cooks evenly.'],
 ['Cook the chicken thoroughly','Heat a little oil in a pan. Fry the ground chicken, breaking it up as it cooks, until thoroughly cooked. Add onion and carrot, then cook until tender.','Choose halal-certified ground chicken.'],
 ['Season and serve','Season with paprika, pepper and a little salt. Divide the rice and chicken mixture into two servings.']]},
 tue:{name:'Chicken and lentil pasta',sub:'Filling pasta sauce with red lentils',steps:[
 ['Cook lentils and pasta','Rinse the lentils well. Simmer in water until soft, usually 10–15 minutes. Cook pasta al dente in a separate pot.','Use dried red lentils, not uncooked whole peas.'],
 ['Cook chicken and onion','Finely chop the onion. Fry with ground chicken in a little oil until the meat is thoroughly cooked.','Use halal-certified chicken.'],
 ['Make the sauce','Add chopped tomatoes, cooked lentils, spices and a splash of pasta water. Simmer for about 8 minutes.'],
 ['Combine the pasta','Toss pasta through the sauce. Divide into three servings. Cool leftovers quickly before refrigerating.','Eat refrigerated leftovers within 2–3 days or freeze them.']]},
 wed:{name:'Salmon with potatoes',sub:'Oven-baked salmon and green broccoli',steps:[
 ['Heat the oven','Preheat to 200°C (conventional oven). Wash the potatoes and cut into even wedges.'],
 ['Roast the potatoes','Toss potatoes with oil, pepper and seasoning. Roast on a tray for 20–25 minutes, until tender.'],
 ['Add the salmon','Place the salmon on the tray toward the end of cooking. Cook until heated through and flakes easily. Timing depends on thickness.'],
 ['Steam and serve','Steam the broccoli for 4–5 minutes. Serve alongside salmon and potatoes.','Salmon is a more expensive dish, so plan it less often on a tight budget.']]},
 thu:{name:'Egg and lentil curry',sub:'Warm, spiced curry with rice',steps:[
 ['Cook rice and eggs','Prepare rice as directed. Boil eggs until the yolks are firm, about 9–10 minutes, and cool briefly.'],
 ['Build the flavour','Finely chop and soften the onion with cumin, curry powder and paprika. Add a little water or oil if needed.'],
 ['Simmer the curry','Add rinsed lentils, chopped tomatoes and enough water to cover. Cook until the lentils are completely soft, around 12–15 minutes.'],
 ['Serve','Cut the eggs in half and place on the lentils. Serve with rice, split into two servings.']]},
 fri:{name:'Chicken and cabbage skillet',sub:'Crisp cabbage, potatoes and seasoned chicken',steps:[
 ['Parboil the potatoes','Dice the potatoes and simmer for 6–8 minutes, until almost tender.'],
 ['Cook the chicken','Fry halal-certified ground chicken in a large pan until thoroughly cooked.'],
 ['Add the vegetables','Finely slice the cabbage and chop the onion. Add everything to the pan with the potatoes and a little oil.'],
 ['Finish the dish','Continue cooking until cabbage is soft and potatoes have a little colour. Season and divide into two servings.']]},
 sat:{name:'Tuna and pea stew',sub:'Affordable tomato stew with rice',extra:'Dried peas must be soaked and fully cooked in advance.',steps:[
 ['Prepare the peas ahead of time','Soak dried whole peas and boil until completely tender, following package directions. Do this before the stated dinner time. Alternatively, use ready-cooked peas.','Never eat raw or merely soaked dried peas.'],
 ['Cook the rice','Cook rice as directed on the package and set aside.'],
 ['Make the tomato stew','Soften finely chopped onion with spices. Add chopped tomatoes and fully cooked peas. Simmer gently.'],
 ['Add the tuna','Drain the tuna, stir it in and heat through. Serve with rice.']]},
 sun:{name:'Tuna and egg pasta',sub:'Quick pasta dinner with broccoli',steps:[
 ['Cook pasta and eggs','Cook pasta al dente. Boil eggs until firm and cut into wedges.'],
 ['Steam the broccoli','Steam broccoli until tender, usually 4–5 minutes.'],
 ['Make a quick sauce','Heat chopped tomatoes with a little oil, pepper and optional spices. Stir in tuna until warm.'],
 ['Mix and enjoy','Toss pasta and broccoli through the sauce. Top with eggs and divide into two servings.']]}
};
const EN_MINIS={
 budget_eggs:'Eggs, wholegrain bread and banana',eggs_bread:'Eggs, bread and apple',cottage_banana:'Cottage cheese and banana',
 tuna_toast:'Tuna on wholegrain toast',budget_lentils:'Spiced lentil and rice bowl',lentil_eggs:'Lentils, eggs and rice',
 tuna_rice:'Tuna rice bowl',cottage_eggs:'Eggs and cottage cheese',budget_lentil_eggs:'Lentils, eggs and bread',
 cottage_eggs_snack:'Cottage cheese and eggs',mackerel_bread:'Mackerel on wholegrain toast',tuna_eggs_snack:'Tuna and eggs',
 topup_cottage:'Extra cottage cheese',topup_tuna:'Small serving of tuna',topup_eggs:'Two boiled eggs',
 afternoon_cottage:'Cottage cheese and apple',afternoon_tuna:'Tuna on wholegrain bread',afternoon_eggs:'Eggs and banana'
};
const EN_SLOTS={Frokost:'Breakfast',Lunsj:'Lunch',Middag:'Dinner',Kveldsmat:'Evening meal',Mellommåltid:'Snack',Ettermiddag:'Afternoon snack'};
const EN_COPY={
 // Navigation, headings and high-level actions
 'Denne uka':'This week','Denne Uka':'This week','Ukens meny':'Weekly menu','Onsdag':'Wednesday',
 'KOST home':'KOST home','Profile':'Profile','Main menu':'Main menu','Velg dag':'Choose day','Choose day':'Choose day',
 'Daglig matplan':'Daily meal plan','DAGENS MATPLAN':'DAILY MEAL PLAN','4 måltider, én plan':'4 meals, one plan','måltider, én plan':'meals, one plan',
 'Måltider per dag':'Meals per day','Fordeles etter dine mål':'Adjusted to your goals','Endre mål':'Change goals',
 'PLANLAGT':'PLANNED','SPIST':'EATEN','Planen ligger nær begge målene.':'Your plan is close to both goals.',
 'Planen dekker begge målene.':'Your plan meets both goals.', 'Proteinmålet dekket.':'Protein goal covered.',
 'Mangler':'Missing','mangler':'missing','varer':'items','vare':'item','Spist':'Eaten','Spis':'Eat','Spist i dag':'Eaten today',
 'Dette mangler til planen':'Missing ingredients for your plan','Legg manglende varer i handlelisten':'Add missing items to shopping list',
 'Tilpass dagsplanen til målene mine':'Adjust the day to my goals','Dagens råvarer':'Ingredient cost today','innenfor':'within budget',
 'måltider':'meals','måltid':'meal','porsjon':'serving','porsjoner':'servings','porsj.':'serv.',
 'Oppskrift':'Recipe','Oppskrifter':'Recipes','Dette trenger du':'What you need','Slik gjør du':'How to make it',
 'Tid':'Time','Protein/porsjon':'Protein / serving','Per porsjon':'Per serving','Energi':'Energy',
 'Hvor mange spiser?':'How many servings?','Ingrediensene tilpasses':'Ingredients update automatically',
 'Alt i hus!':'Everything at home!','Har hjemme':'Have at home','Litt hjemme':'Some at home',
 'Valgfritt':'Optional','Trengs':'Needed','Du har det du trenger':'You have everything you need',
 'Mangler du noe?':'Missing something?','Legg til':'Add','Se handlelisten':'View shopping list',
 'Bruk som middag i dagsplanen':'Use for dinner today','Start å lage':'Start cooking',
 'Praktisk når du har skole':'Perfect for busy days',
 'Lag flere porsjoner og sett rester raskt i kjøleskap eller fryser.':'Cook several portions and chill or freeze leftovers promptly.',
 'Vi lager mat':'Let’s cook','STEG':'STEP','AV':'OF','Ferdig!':'Finished!',
 'Du fikset det!':'You did it!','er klar til servering.':'is ready to serve.',
 'g protein per porsjon':'g protein per serving','Registrer én porsjon spist':'Log one serving eaten',
 'Til dagens matplan':'Back to today’s plan','Tilbake til oppskriften':'Back to recipe',
 'Hjelp på kjøkkenet':'Cooking timer','Start timer':'Start timer','Pause timer':'Pause timer',
 'Forrige':'Previous','Neste steg':'Next step','Ferdig':'Done','Tilbake':'Back',
 'Jeg har spist dette':'I ate this','Angre registrering':'Undo meal',
 'Du mangler noen ingredienser. Oppdater lageret når du har handlet.':'Some ingredients are missing. Update your pantry when you shop.',
 'Nytt måltid':'New meal',
 'Lagt i favoritter':'Added to favourites','Fjernet fra favoritter':'Removed from favourites',
 'Rett lagt inn som middag':'Added to dinner plan','Timeren er ferdig!':'Timer finished!',
 'Kan ikke registreres':'Cannot log this meal','Først må du':'First you need to',
 'Varer lagt i handlelisten':'Items added to shopping list',
 'Angre måltidet før du bytter det.':'Undo the meal before swapping it.',
 'Kunne ikke lage matplan.':'Could not generate a meal plan.',
 'Startet på nytt':'Started over',
 // Grocery and pantry
 'På vei til butikken?':'Heading to the store?','Handle smart':'Shop smarter','DIN HANDLELISTE':'YOUR SHOPPING LIST',
 'IGJEN Å HANDLE':'LEFT TO BUY','igjen å handle':'left to buy','kjøpt':'bought','Kjøpt':'Bought',
 'Må kjøpes':'To buy','Til måltidene':'For meals on','Se priser':'Check prices','Se hva som mangler':'See missing ingredients',
 'Kjøkkenet ditt':'Your kitchen','Hva har du hjemme?':'What do you have?','Bruk det':'Use what','du har.':'you have.',
 'Da kan du spare litt ekstra.':'Make the most of what you already have.',
 'I skapet og kjøleskapet':'In the cupboard and fridge','per pakke':'per pack',
 'Finn oppskrifter':'Find recipes','Sammenlign før du handler':'Compare before shopping',
 'Prisjakt!':'Price check!','3 BUTIKKER':'3 STORES','God mat.':'Good food.','Små priser.':'Small prices.',
 'Se varer du trenger. Velg det som passer turen din.':'Find what you need. Choose a store that suits you.',
 'Varer å sjekke':'Products to check','På listen':'On the list','Åpne handlelisten':'Open shopping list',
 'Alle':'All','Frokost':'Breakfast','Lunsj':'Lunch','Middag':'Dinner','Kveldsmat':'Evening meal',
 'Mellommåltid':'Snack','Ettermiddag':'Afternoon snack',
 // Budget and settings
 'Studentbudsjettet':'Student budget','Pengene dine':'Your money',
 'REGISTRERT HANDLEBELØP DENNE MÅNEDEN':'SPENT ON GROCERIES THIS MONTH',
 'igjen av budsjettet':'left in your budget','av':'of',
 'Hva koster dagens plan?':'What does today’s meal plan cost?',
 'MATEN I DAGSPLANEN':'COST OF TODAY’S MEALS','per dag for':'per day for','kr/mnd':'kr/month','dag':'day','måned':'month',
 'Bruk maten du har hjemme':'Use the food you have','Se hva som mangler i dagsplanen.':'See what the meal plan still needs.',
 'Sånn liker du det.':'Make it yours.','Din KOST':'Your KOST','Utseende':'Appearance',
 'Tema':'Theme','Lys':'Light','Mørk':'Dark','Språk':'Language','Norsk':'Norwegian',
 'Maten din':'Your food','Uten svinekjøtt':'No pork','Ingen havregryn':'No oats',
 'Måltidene dine':'Your meals','Hvor mange måltider vil du spise?':'How many meals per day?',
 'Antallet endrer porsjonene og dagsplanen.':'Meal count changes your portions and daily plan.',
 'Målene dine':'Your goals','Protein per dag':'Protein per day','Kalorier per dag':'Calories per day',
 'Når du endrer mål eller antall måltider, får du en ny dagsplan. Måltider du har spist blir ikke slettet.':
 'Changing your goals or meal count creates a new plan. Logged meals stay as they are.',
 'Påminnelser':'Reminders','Handlepåminnelser':'Shopping reminders','Påminnelse på':'Reminder day',
 'Snarveier':'Shortcuts','Budsjett':'Budget','Start på nytt':'Start over',
 'I dag':'Today','Uke':'Week','Handle':'Shop','Lager':'Pantry',
 // dynamic meal planner
 'Dagens spiste måltider er bevart.':'Meals logged today are kept.',
 'gjelder fra neste nye dag.':'takes effect the next day.',
 'Over proteinmålet med':'Over protein goal by', 'Kalorier:':'Calories:',
 'kcal under':'kcal below','kcal over':'kcal above','målet':'target',
 'Ca.':'About','kcal':'kcal',
 // UI menu and filters
 'Din lille kokebok':'Your cookbook','Hva frister?':'What sounds good?',
 'Raskt':'Quick','Proteinrikt':'High protein','Under 20 kr':'Under 20 kr',
 'Favoritter':'Favourites','Har alt':'Have everything',
 'Rett':'Dish','retter':'dishes','rett':'dish',
 'Ukens favoritt':'Favourite of the week','UKENS FAVORITT':'FAVOURITE OF THE WEEK',
 'Godt.':'Tasty.','Billig.':'Affordable.','Laget av deg.':'Made by you.',
 'Finn en rett som passer dagen din.':'Find something delicious for today.',
 'Fant ingen retter':'No dishes found','Prøv et annet søk eller vis alle oppskriftene.':'Try another search or show all recipes.',
 'Vis alle':'Show all','Se alle':'See all','Flere retter':'More dishes',
 'Kyllingkjøttdeig':'Ground chicken'
};
const EN_EXTRA_SENTENCES={
 'Ris kan lages for to dager om gangen.':'You can cook rice for two days at a time.',
 'Bruk tørre røde linser, ikke ukokte hele erter.':'Use dried red lentils, not uncooked whole peas.',
 'Bruk halal-godkjent kylling.':'Use halal-certified chicken.',
 'Spis kjøleskapsrestene innen 2–3 dager, eller frys dem.':'Eat refrigerated leftovers within 2–3 days or freeze.',
 'Laks er en dyrere rett, så planlegg den sjeldnere ved stramt budsjett.':'Salmon costs more, so plan it less often on a tight budget.',
 'Ikke spis rå eller bare bløtlagte tørkede erter.':'Do not eat raw or merely soaked dried peas.'
};
function makeEnglishMap(){
 const map={...EN_COPY,...EN_EXTRA_SENTENCES,...EN_SLOTS};
 if(typeof FOOD!=='undefined')for(const p of FOOD)map[p.name]=EN_FOOD[p.id]||p.name;
 if(typeof RECIPE_DATA!=='undefined')for(const recipe of RECIPE_DATA){const en=EN_RECIPES[recipe.id];if(!en)continue;map[recipe.name]=en.name;map[recipe.sub]=en.sub;if(recipe.extra&&en.extra)map[recipe.extra]=en.extra;
  recipe.steps.forEach((s,i)=>{const trans=en.steps[i];if(!trans)return;map[s.title]=trans[0];map[s.detail]=trans[1];if(s.tip&&trans[2])map[s.tip]=trans[2];});}
 if(typeof MINI_MEALS!=='undefined')for(const ms of Object.values(MINI_MEALS))for(const r of ms){if(EN_MINIS[r.id])map[r.name]=EN_MINIS[r.id];}
 if(typeof SECOND_SNACK_MEALS!=='undefined')for(const r of SECOND_SNACK_MEALS)if(EN_MINIS[r.id])map[r.name]=EN_MINIS[r.id];
 if(typeof MINI_GUIDES!=='undefined')for(const [id,steps] of Object.entries(MINI_GUIDES)){ /* common steps below */ }
 Object.assign(map,{
 'Kok eggene i 9–10 minutter til de er faste.':'Boil the eggs for 9–10 minutes until firm.',
 'Server med grovbrød og en banan.':'Serve with wholegrain bread and a banana.',
 'Skyll risen og kok etter anvisningen på posen.':'Rinse the rice and cook as directed on the bag.',
 'Skyll de tørre røde linsene og kok dem helt myke, vanligvis 12–15 minutter.':'Rinse dried red lentils and simmer until soft, usually 12–15 minutes.',
 'Finhakk løken og rasp gulroten. Stek kort med litt olje, bland inn linser og server med ris.':'Finely chop the onion and grate the carrot. Fry briefly in a little oil, add lentils and serve with rice.',
 'Skyll de tørre røde linsene og kok dem helt møre i cirka 12–15 minutter.':'Rinse the dried red lentils and simmer until completely soft, about 12–15 minutes.',
 'Kok eggene til de er faste.':'Boil eggs until firm.',
 'Server linsene med eggene og grovbrød.':'Serve lentils with eggs and wholegrain bread.',
 'Vei opp cottage cheese.':'Measure the cottage cheese.',
 'Skjær eplet i biter og server sammen.':'Cut the apple into pieces and serve together.',
 'Hell av tunfisken.':'Drain the tuna.',
 'Server med grovbrød.':'Serve with wholegrain bread.',
 'Kok eggene helt faste.':'Boil the eggs until fully firm.',
 'Server med banan.':'Serve with banana.',
 'Ha cottage cheese i en skål.':'Put cottage cheese in a bowl.',
 'Skjær bananen i biter og server med grovbrød ved siden av.':'Slice the banana and serve with wholegrain bread on the side.',
 'Server dem med grovbrød og et eple.':'Serve them with wholegrain bread and an apple.',
 'Hell av vannet fra tunfisken.':'Drain the water from the tuna.',
 'Fordel den over grovbrødet og server gulrot i staver ved siden av.':'Spread over wholegrain bread and serve with carrot sticks.',
 'Skyll linser og kok helt myke. Kok ris etter pakken.':'Rinse and cook lentils until fully tender. Cook rice as directed.',
 'Stek finhakket løk kort og rør inn hakkede tomater og linsene. Server med ris og egg.':'Briefly sauté chopped onion, then add tomatoes and lentils. Serve with rice and eggs.',
 'Kok risen etter pakken.':'Cook rice according to the package instructions.',
 'Damp brokkolien til den er mør.':'Steam the broccoli until tender.',
 'Hell av tunfisken og bland den med ris og brokkoli. Ha på litt olje om ønskelig.':'Drain tuna and mix it with rice and broccoli. Add a little oil if you like.',
 'Server cottage cheese sammen med egg, grovbrød og gulrotstaver.':'Serve cottage cheese with eggs, wholegrain bread and carrot sticks.',
 'Server med cottage cheese.':'Serve with cottage cheese.',
 'Smør makrell i tomat på grovbrødet.':'Spread mackerel in tomato sauce on wholegrain bread.',
 'Skyll og skjær eplet i biter.':'Rinse and chop the apple.',
 'Hell av tunfisken og server den med egg og grovbrød.':'Drain the tuna and serve with eggs and wholegrain bread.',
 'Mål opp cottage cheese og server den kald.':'Measure out cottage cheese and serve chilled.',
 'Hell av tunfisken og server i en liten skål.':'Drain the tuna and serve in a small bowl.',
 'Kok eggene til de er faste og spis dem varme eller kalde.':'Boil the eggs until firm and enjoy warm or cold.'
 });
 return map;
}
let EN_MAP=null;let EN_KEYS=[];
function translatePhrase(input){
 if(typeof state==='undefined'||state.lang!=='en'||!input)return input;
 if(!EN_MAP){EN_MAP=makeEnglishMap();EN_KEYS=Object.keys(EN_MAP).sort((a,b)=>b.length-a.length);}
 let str=String(input);
 if(EN_MAP[str]!==undefined)return EN_MAP[str];
 // Keep punctuation and values intact, translating the longest phrases first.
 const escapeRegExp=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 for(const key of EN_KEYS){
   if(!str.includes(key))continue;
   const rx=new RegExp('(?<![\\p{L}\\p{N}])'+escapeRegExp(key)+'(?![\\p{L}\\p{N}])','gu');
   str=str.replace(rx,EN_MAP[key]);
  }
 // Dynamic singular/plural quantities and abbreviated units.
 str=str.replace(/(\d+)\s+stk\b/g,(_,n)=>`${n} ${n==='1'?'pc':'pcs'}`).replace(/(\d+(?:[.,]\d+)?)\s+pk\b/g,(_,n)=>`${n} ${Number(n.replace(',','.'))===1?'pack':'packs'}`);
 return str;
}
function localizeDOM(root){
 if(!root||typeof state==='undefined'||state.lang!=='en')return;
 const walk=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
  if(!node.nodeValue.trim()||node.parentElement?.closest('svg,script,style'))return NodeFilter.FILTER_REJECT;
  return NodeFilter.FILTER_ACCEPT;
 }});
 const nodes=[];while(walk.nextNode())nodes.push(walk.currentNode);
 for(const n of nodes){const original=n.nodeValue;const trimmed=original.trim();const rewritten=translatePhrase(trimmed);if(trimmed!==rewritten)n.nodeValue=original.replace(trimmed,rewritten);}
 for(const el of root.querySelectorAll('[placeholder],[aria-label],[title],img[alt]')){
  for(const attr of ['placeholder','aria-label','title','alt'])if(el.hasAttribute(attr))el.setAttribute(attr,translatePhrase(el.getAttribute(attr)));
 }
}

