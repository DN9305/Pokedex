# Pokedex Ablauf

## Pokedex API - Documentation takeaways:

* default limit = 20 -> limit=X zum get request hinzufügen als parameter. offset wird bei -> next        automatish umd das limit erhöht.
    * API RESOURCE LIST(type): count(anzahl resources zu diesem endpoint), next(url), previous(url), results
        * Unnanmed endpoints: 
            *  characteristic, contest-effect, evolution-chain, machine, super-contest-effect endpoints are unnamed, the rest are named.
* unamed geben named results urls zumindest bei evoloution chain, diese müssen wieder gefetcht werden am besten for schleife nutzen.

### Fluss Diagramm: 

```mermaid
graph TD
    %% Zu sehen sind: 20-40 Pokemon als kleine karten mit name und typ. Sowie eine Suchleiste
    A[User kommt auf Seite] --> B(INIT render = Suchfeld + Pokeindex +html basics)
    B --> C{Suchfeld}
    subgraph Reihe [ ]
        direction LR
        C--> zusatzinfoName[Wenn nach namen gesucht wird und autocomplete vorhanden sein soll: am anfang bei init ein api fetch aller namen. öffnet GroßeKarte]

        C --> zusatzinfoTypEtc[Wenn nach typ, ability etc gesucht wird, dann muss es für diesen typ ebenfalls eine liste geben für autocomplete. die jeweiligen typen sollten dann eventuell farbig hinterlegt sein im autocomplet]
    end
    B --> D{Pokeindex 20-40}
    D --> Button[Button load and fetch next loadingscreen während dessen nicht anklickbar]
    Button --> F[render Zusätzlich oder komplett neu bzw angeheftet?]
    F --> D

    C --> daten>mindestenst 3 buchstaben bevor vorschlag]
    daten --> | JA | erfolg{gefunden}
    erfolg --> | typ/ability/etc | suchrender[renderPokeindex 20+]
    suchrender
    erfolg --> | Name | klickNameRenderKarteGroß

    daten --> | Nein | error{error}
    error --> errorHandling[fehlermeldung im Suchfeld anzeigen direkt]
```

## Flussdiagramm takeaways:

Beim initialisieren, benötige ich bereits fetches die ausgeführt werden. 

* 1x für die erten Pokemon im Pokedex evoloution chain
    * hier ein weiterer fetch für die result url
* 1x für alle Namen von Pokemon
* 1x für alle Typen von Pokemon

fetch Daten werden mein hauptarbeits daten sein. Logik baut um diese herum auf für rendern suchen.

* hier am besten destruktion benutzen für bessere übersicht(weniger x[i].[i] etc)`? bisher nicht möglich einfache variablen zuweisung zu x[i] ist einfacher. Was ist der usecase von destruction?

```mermaid
graph TD

    
    initEndpoints[list of endpoints for Initialization] --> fetchFuncInit(fetchFunction///ÜbergabeParameter = list of endpoints ^)
    fetchFuncInit --> init[INIT FUNCTION]
    init --> | Es gibt 1 großes cache für Pokemon mit kompletten daten. sowie eine speicher array temporär für suchergebnisse. | renderP{render Pokedex / suchergebnisse}
    init --> | arrays = pokemonnamen, types, abbilities, etc für autocomplete bei der suche| renderS{render suchleiste}

   
```

```