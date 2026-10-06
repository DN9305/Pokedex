function getTemplateCardsSmall(pokemonData) {
    return /*html*/`
        <div class="card-small" id="card-small-${pokemonData.id}">
            <div>
                <p>#${pokemonData.id}</p>
                <h2>${pokemonData.name}</h2>
                <div>
                    <div id="type-${pokemonData.id}">
                    </div>
                    <img src="${pokemonData.sprites.front_default}" alt="Picture Of the Pokemon itself">
                </div>
            </div>
        </div>
    `
}

function getTemplateCardsSmallBatch(batchID) {
    return /*html*/`
        <div clas="batch" id="batch-${batchID}">

        </div>
    `
}

function getTemplateCardsTypes(pokemonDataType) {
    return /*html*/`
        <div class="type">
            <p>${pokemonDataType}</p>
        </div>
    `
}

function getTemplateStructureCardBig() {
    return /*html*/`    
        <button id="close-button">X</button>
            <div class= "big-card-wrapper">
                <section id="header-card-big">    
                </section>
                <section id="content-card-big">
                    <div>
                        <button id="about">About</button>
                        <button id="base-stats">Base Stats</button>
                    </div>
                    <section id="pokemon-information">
                    </section>
                    <nav>
                        <button id="before"><-</button>
                        <button id="next">-></button>       
                    </nav>
                </section>
            </div>
    `
}

function getTemplateBigCardHeader(pokemonData) {
    return /*html*/`
        <div class="card-small">
            <div>
                <p>#${pokemonData.id}</p>
                <h2>${pokemonData.name}</h2>
                <div>
                    <div id="type">
                    </div>
                    <img src="${pokemonData.sprites.front_default}" alt="Picture Of the Pokemon itself">
                </div>
            </div>
        </div>
    `
}

function getTemplateAbout(pokemonData) {
    return /*html*/`
        <table>
            <tr>
                <td>Species</td>
                <td>${pokemonData.species.name}</td>
            </tr>
            <tr>
                <td>Height</td>
                <td>${pokemonData.height}</td>
            </tr>
            <tr>
                <td>Weight</td>
                <td>${pokemonData.weight}</td>
            </tr>
            <tr>
                <td>Abilities</td>
                <td id="abilities"></td>
            </tr>
        </table>
    `
}

function getTemplateStructureStats() {
    return /*html*/`
        <table id="stats">
        </table>
    `
}


function getTemplateStats(name, base_stat) {
    return /*html*/`
        <tr>
            <td>${name}</td>
            <td>${base_stat}</td>
        </tr>
    `
}

function getTemplateLoadMoreButton() {
    return /*html*/`
        <button class="load-more" id="load-more">LOAD MORE HERE</button>
    `
}

function getTemplateSearchSection() {
    return /*html*/`
        <input type="text" id="input" placeholder="Name/Gender/Type/Ability">
        <button id="search-button">Search</button>
    `
}

function getTemplateSearchResultsStructure() {
    return /*html*/`
        <button id="close-button-results-dialog">X</button>
        <div>
            <div id="hide-type" class="search-results hide">
                <h3>Type</h3>
                <div id="search-results-type">

                </div>
            </div>
            <div id="hide-gender" class="search-results hide">
                <h3>Gender</h3>
                <div id="search-results-gender">

                </div>
            </div>
            <div id="hide-ability" class="search-results hide">
                <h3>Ability</h3>
                <div id="search-results-ability">

                </div>
            </div>
            <div id="hide-pokemon" class="search-results hide">
                <h3>Pokemon</h3>
                <div id="search-results-pokemon">

                </div>
            </div>
        </div>
    `
}

function getTemplateSearchFailed() {
    return /*html*/`
            <p>Search Failed<br>Please try another keyword!</p>    
            <button id="close-button-fail-result">close</button>
    `
}

function getTemplateChooseFromSearchResult(resultElement) {
    return /*html*/`
        <div id="chosen-result-${resultElement.id}">
            <p>Name: <span id="searchSubCategory-${resultElement.id}">${resultElement.name}</span></p>
        </div>
    `
}

function getTemplateLoadingScreen() {
    return /*html*/`
        <div id="loading-screen">
            <div class="spinner"></div>
            <p>Lädt...</p>
        </div>
    `
}
