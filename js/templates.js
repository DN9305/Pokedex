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

function getTemplateCardsSmallBatch(batchID){
    return /*html*/`
        <div id="batch-${batchID}">

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

function getTemplateLoadMoreButton(){
    return /*html*/`
        <button class="load-more" id="load-more">LOAD MORE HERE</button>
    `
}