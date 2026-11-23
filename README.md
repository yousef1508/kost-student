# KOST Student

KOST Student er en interaktiv prototype for planlegging av måltider, matbudsjett og daglig næringsinntak. Målet er å gjøre det enklere å planlegge rimelige måltider, følge med på protein og energi, og holde oversikt over hva som finnes i kjøkkenskapet.

## Funksjoner i prototypen

- Førstegangsoppsett med alder, høyde, vekt, aktivitetsnivå og mål.
- Estimat av energibehov basert på Mifflin–St Jeor, med mulighet for å justere energi- og proteinmål.
- Daglig og ukentlig måltidsplanlegging, med valg av antall måltider.
- Oppskrifter med ingredienser, mengder, estimert næringsinnhold, pris og fremgangsmåte.
- Oppskriftsøk, filtrering og favoritter.
- Kjøkkenlager som oppdateres når måltider registreres eller varer legges til.
- Handleliste som tar hensyn til planlagte måltider og registrert lager.
- Budsjettoversikt og handleberegning for REMA 1000, KIWI og A Food Market.
- Lys og mørk visning samt norsk og engelsk språk.
- Innebygde mat- og produktbilder.

## Kom i gang

Prototypen er laget som en selvstendig HTML-side og krever ingen byggesteg eller pakkeinstallasjon.

1. Klon repositoryet.
2. Åpne `index.html` i en moderne nettleser.

Hvis du vil kjøre den via en lokal webserver:

```bash
python -m http.server 8000
```

Åpne deretter [http://localhost:8000](http://localhost:8000).

## Teknologi

- HTML
- CSS
- JavaScript (vanilla)
- Nettleserens `localStorage` for lokal lagring

Det brukes ingen eksterne JavaScript-biblioteker eller eksterne API-kall i den nåværende prototypen.

## Datagrunnlag og begrensninger

Dette repositoryet inneholder den interaktive frontend-prototypen, ikke en ferdig native Android-app.

- Produktpriser er lokale eksempelverdier som kan endres i kildekoden. De hentes ikke direkte fra butikkene og er ikke live-priser.
- Det finnes ingen aktiv integrasjon mot Mattilbud, REMA 1000, KIWI eller A Food Market.
- Næringsverdier og energiberegninger er estimater og bør ikke brukes som medisinsk rådgivning.
- Profil, plan, favoritter og lager lagres lokalt i nettleseren. Det finnes foreløpig ingen brukerkonto, backend, skysynkronisering eller fler-enhetsstøtte.
- Påminnelsesinnstillingene er del av grensesnittet. Push-varsler eller bakgrunnsvarsler er ikke implementert.
- Android-pakking, publisering i appbutikk og produksjonsdrift er ikke inkludert.

## Personvern

Den nåværende prototypen behandler brukerdata lokalt i nettleseren. Den sender ikke profil-, måltids- eller lagerdata til en ekstern tjeneste. Sletting av nettleserens nettsteddata kan fjerne den lokale lagringen.

## Lisens

Det er foreløpig ikke lagt til noen åpen kildekode-lisens. Gjenbruk og distribusjon er derfor ikke uttrykkelig lisensiert.
