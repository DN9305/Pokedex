/////////////////
//RENDER-FUNCTIONS
////////////////
//**Alle Daten stammen aus dem TempCache(pokeTempCache)**//

function renderOnInit(searchCategory){
    renderCardsSmall(searchCategory)
    renderLoadButton()
}

function renderCardsSmall(searchCategory) {
    let offset = user.searchOffsetBefore
    let index = endpointsDB.findIndex(element => element.endpoint === searchCategory)
    let limit = endpointsDB[index].limitSort + offset

    renderBatchCardsSmall(offset, limit)
    renderTypesInCardsSmall(offset, limit)
}

function renderBatchCardsSmall(offset, limit) {
    let html = ""

    for (let i = offset; i < limit && i < pokeTempCache.length; i++) {
        let pokemonData = pokeTempCache[i]
        pokemonData.positionInTempCache = i
        html += getTemplateCardsSmall(pokemonData)
    }
    user.loadedBatch += 1
    document.getElementById("cards").innerHTML += getTemplateCardsSmallBatch(user.loadedBatch)
    document.getElementById(`batch-${user.loadedBatch}`).innerHTML = html
}

function renderTypesInCardsSmall(offset, limit) {
    for (let i = offset; i < limit && i < pokeTempCache.length; i++) {
        let pokemonData = pokeTempCache[i]
        let html = ""
        pokemonData.types.forEach(element => html += getTemplateCardsTypes(element.type.name))
        document.getElementById(`type-${pokemonData.id}`).innerHTML = html
        const cardSmall = document.getElementById(`card-small-${pokemonData.id}`)
        cardSmall.addEventListener("click", () => renderCardBig(pokemonData))
    }
}

function renderLoadButton(){
    document.getElementById("load-more-wrapper").innerHTML = getTemplateLoadMoreButton()
    document.getElementById("load-more").addEventListener("click", () => laodMore())
}

function renderSearchBar(){
    
}

function renderCardBig(pokemonData) {
    const dialog = document.getElementById("dialog")
    getBigCardStructure(pokemonData)
    renderCardBigHeader(pokemonData)
    renderCardBigAbout(pokemonData)
    dialog.showModal()
}

function getBigCardStructure(pokemonData) {
    const dialog = document.getElementById("dialog")
    dialog.innerHTML = getTemplateStructureCardBig()
    const about = document.getElementById("about")
    const baseStats = document.getElementById("base-stats")
    const buttonBefore = document.getElementById("before")
    const buttonNext = document.getElementById("next")
    about.addEventListener("click", () => renderCardBigAbout(pokemonData))
    baseStats.addEventListener("click", () => renderCardBigStats(pokemonData))
    buttonBefore.addEventListener("click", () => navigateBigCards(pokemonData.PositionInTempCache, "before"))
    buttonNext.addEventListener("click", () => navigateBigCards(pokemonData.PositionInTempCache, "next"))
}

function renderCardBigHeader(pokemonData) {
    let html = ""
    const headerCardBig = document.getElementById("header-card-big")
    headerCardBig.innerHTML = getTemplateBigCardHeader(pokemonData)
    const pokemonType = document.getElementById("type")
    pokemonData.types.forEach(element => html += getTemplateCardsTypes(element.type.name))
    pokemonType.innerHTML = html
}

function renderCardBigAbout(pokemonData) {
    const pokemonInformation = document.getElementById("pokemon-information")
    pokemonInformation.innerHTML = getTemplateAbout(pokemonData)
    getAbilities(pokemonData.abilities)
}

function renderCardBigStats(pokemonData) {
    const pokemonInformation = document.getElementById("pokemon-information")
    pokemonInformation.innerHTML = getTemplateStructureStats()
    getStats(pokemonData.stats)
}

/////////////////
//HELP-FUNCTIONS
////////////////
function navigateBigCards(index, direction) {
    let pokemonData = []

    if (direction === "next" && index < pokeTempCache.length - 1) {
        let indexNew = index + 1
        pokemonData = pokeTempCache[indexNew]
    } else if (direction === "next" && index === pokeTempCache.length - 1) {
        let indexNew = 0
        pokemonData = pokeTempCache[indexNew]
    } else if (direction === "before" && index === 0) {
        let indexNew = pokeTempCache.length - 1
        pokemonData = pokeTempCache[indexNew]
    } else {
        let indexNew = index - 1
        pokemonData = pokeTempCache[indexNew]
    }

    getBigCardStructure(pokemonData)
    renderCardBigHeader(pokemonData)
    renderCardBigAbout(pokemonData)
}

function getAbilities(abilitiesArray) {
    let html = ""

    for (let i = 0; i < abilitiesArray.length; i++) {
        const element = abilitiesArray[i].ability;
        let lastElement = abilitiesArray.length - 1
        if (i !== lastElement) {
            html += element.name + ", "
        } else {
            html += element.name
        }
    }

    document.getElementById("abilities").innerHTML = html
}

function getStats(statsArray) {
    let html = ""

    for (let i = 0; i < statsArray.length; i++) {
        const element = statsArray[i];
        html += getTemplateStats(element.stat.name, element.base_stat)
    }

    document.getElementById("stats").innerHTML = html
}
