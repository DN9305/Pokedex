/////////////////
//RENDER-FUNCTIONS
////////////////

function renderOnInit() {
    renderLoadButton()
    renderSearchBar()
}

function renderAndShowLoadingScreen() {
    document.getElementById("cards").insertAdjacentHTML("beforeend", getTemplateCardsSmallBatch(user.batchID))
    document.getElementById(`batch-${user.batchID}`).innerHTML = getTemplateLoadingScreen()
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
    document.getElementById(`batch-${user.batchID}`).innerHTML = html
    user.batchID += 1
}

function renderTypesInCardsSmall(offset, limit) {
    for (let i = offset; i < limit && i < pokeTempCache.length; i++) {
        let pokemonData = pokeTempCache[i]
        let html = ""
        pokemonData.types.forEach(element => html += getTemplateCardsTypes(element.type.name))
        document.getElementById(`type-${pokemonData.id}`).innerHTML += html
        const cardSmall = document.getElementById(`card-small-${pokemonData.id}`)
        cardSmall.addEventListener("click", () => renderCardBig(pokemonData))
    }
}

function renderLoadButton() {
    document.getElementById("load-more-wrapper").innerHTML = getTemplateLoadMoreButton()
    document.getElementById("load-more").addEventListener("click", () => laodMore())
}

function renderSearchBar() {
    document.getElementById("search-section").innerHTML = getTemplateSearchSection()
    document.getElementById("search-button").addEventListener("click", () => {
        let inputValue = document.getElementById("input").value.toLowerCase();
        if (inputValue.length > 2) {
            findPokemonFromArray(inputValue)
        };
    })
}

function renderSearchResults(result) {
    const dialog = document.getElementById("dialog")
    dialog.innerHTML = getTemplateSearchResultsStructure()
    document.getElementById("close-button-results-dialog").addEventListener("click", () => dialog.close())
    if (!result.length) {
        dialog.innerHTML = getTemplateSearchFailed()
        document.getElementById("close-button-fail-result").addEventListener("click", () => dialog.close())
        dialog.showModal()
        return
    } else {
        result.forEach(element => renderResults(element))
        let resultsNames = ["type", "gender", "pokemon", "ability"]
        resultsNames.forEach(element => {
            let newResultsNames = result.filter(item => item.category.includes(element));
            if (newResultsNames.length) {
                document.getElementById(`hide-${newResultsNames[0].category}`).classList.toggle("hide")
            }
        })
    }
    dialog.showModal()
}

function renderResults(element) {
    console.log(element)
    if (element.category == "type") {
        document.getElementById("search-results-type").insertAdjacentHTML("beforeend", getTemplateChooseFromSearchResult(element))
        document.getElementById(`chosen-result-${element.id}`).addEventListener("click", () => chosenSearchResult(element.category, element.name, element.url))
    } else if (element.category == "gender") {
        document.getElementById("search-results-gender").insertAdjacentHTML("beforeend", getTemplateChooseFromSearchResult(element))
        document.getElementById(`chosen-result-${element.id}`).addEventListener("click", () => chosenSearchResult(element.category, element.name, element.url))
    } else if (element.category == "ability") {
        document.getElementById("search-results-ability").insertAdjacentHTML("beforeend", getTemplateChooseFromSearchResult(element))
        document.getElementById(`chosen-result-${element.id}`).addEventListener("click", () => chosenSearchResult(element.category, element.name, element.url))
    } else if (element.category == "pokemon") {
        document.getElementById("search-results-pokemon").insertAdjacentHTML("beforeend", getTemplateChooseFromSearchResult(element))
        document.getElementById(`chosen-result-${element.id}`).addEventListener("click", () => chosenSearchResult(element.category, element.name, element.url))
    }
}

async function chosenSearchResult(searchCategory, searchSubCategory, url) {
    const dialog = document.getElementById("dialog")
    if (searchCategory != "pokemon") {
        loadAndShowData(searchCategory, searchSubCategory)
        dialog.close()
    } else {
        dialog.close()
        let pokemonData = await getPokemonData(searchSubCategory, url)
        renderCardBig(pokemonData, true)
        dialog.showModal()
    }

}

function renderCardBig(pokemonData, buttons = false) {
    const dialog = document.getElementById("dialog")
    getBigCardStructure(pokemonData)
    renderCardBigHeader(pokemonData)
    renderCardBigAbout(pokemonData)
    if(buttons){
        document.getElementById("before").setAttribute("class", "hide")
        document.getElementById("next").setAttribute("class", "hide")
    }
    dialog.showModal()
}

function getBigCardStructure(pokemonData) {
    const dialog = document.getElementById("dialog")
    dialog.innerHTML = getTemplateStructureCardBig()
    const about = document.getElementById("about")
    const baseStats = document.getElementById("base-stats")
    const buttonBefore = document.getElementById("before")
    const buttonNext = document.getElementById("next")
    const closeButton = document.getElementById("close-button")
    closeButton.addEventListener("click", () => dialog.close())
    about.addEventListener("click", () => renderCardBigAbout(pokemonData))
    baseStats.addEventListener("click", () => renderCardBigStats(pokemonData))
    buttonBefore.addEventListener("click", () => navigateBigCards(pokemonData.positionInTempCache, "before"))
    buttonNext.addEventListener("click", () => navigateBigCards(pokemonData.positionInTempCache, "next"))
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
