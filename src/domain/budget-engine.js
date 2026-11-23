/* Shared budget rules. 2,000 kr is a starting default, never a cap. */
function normalizeMonthlyBudget(value,fallback=DEFAULT_MONTHLY_BUDGET){const parsed=typeof value==="string"?Number(value.trim().replace(",", ".")):Number(value);if(!Number.isFinite(parsed)||parsed<=0)return fallback;return Math.round((parsed+Number.EPSILON)*100)/100;}
function budgetForDays(monthlyBudget,days){const monthly=normalizeMonthlyBudget(monthlyBudget),dayCount=Math.max(0,Number(days)||0);return Math.round((monthly/30)*dayCount*100)/100;}
function dailyBudgetFor(monthlyBudget){return budgetForDays(monthlyBudget,1);}
function budgetStatus(spend,limit){const actual=Math.max(0,Number(spend)||0),cap=Math.max(0,Number(limit)||0),difference=Math.round((cap-actual)*100)/100;return {within:difference>=-.01,remaining:Math.max(0,difference),over:Math.max(0,-difference),difference};}
