let baseURL = "https://pokeapi.co/api/v2/"

///////////////////
////INIT-FUNCTIONS
//////////////////

////searchCategroy = name vom ursprungs Endpunkt siehe endpointsDB. 
////searchSubCategory = name von dem einzelnen Types, Abilities und Gender der jeweiligen endpoints.
///////"pokemon" hat searchSubCategory "pokemon", da dessen endpunkt bereits der letzte schritt um die gebrauchten Pokemon aus dessen liste fetchen zu können.
const user = {
    searchCategory: "type",
    searchSubCategory: "fire",
    searchOffsetBefore: 0,
    searchOffsetLatest: 0
}

async function init() {
    try {
        let category = user.searchCategory
        let type = user.searchSubCategory
        await fetchDataForListsDbOnInit(endpointsDB)
        console.log(pokemonAbilityUrl)
        loadData(category, type)
        console.log(endpointTempCache)
        console.log(pokemonTempCache)
        loadData(category, type)
    } catch (error) {
        console.error("FETCH-FEHLER:", error)
    }
}

async function fetchDataForListsDbOnInit(endpoints) {
    let promises = []
    let fetchStyle = "eager"
    for (let i = 0; i < endpoints.length; i++) {
        if (endpoints[i].useCaseList) {
            let { endpoint, list, limitList } = endpoints[i]
            let endpointURL = baseURL + endpoint + `?limit=${limitList}`
            promises.push(fillList(endpointURL, list, fetchStyle))
        }
    }
    await Promise.all(promises)
}

/////////////////
//RENDER-FUNCTIONS
////////////////

function renderCardsSmall() {
    let html = ""
    let offset = user.searchOffsetBefore
    let limit = offset + 20
    for (let i = offset; i < limit && i < pokemonTempCache.length; i++) {
        let data = pokemonTempCache[i]
        html += getTemplateCardsSmall(data)
    }
    document.getElementById(main).innerHTML = html
}

/////////////////
//LIST-FUNCTIONS
////////////////

function loadData(searchCategory, searchSubCategory = "pokemon") {
    fetchDataIntoTempCache(searchCategory, searchSubCategory)

}

async function fetchDataIntoTempCache(searchCategory, searchSubCategory) {
    setUserSearchStatus(searchCategory, searchSubCategory)

    let index = endpointsDB.findIndex(element => element.endpoint === searchCategory)
    let limit = endpointsDB[index].limitSort
    let latestOffset = user.searchOffsetLatest


    if (searchCategory === "pokemon") {
        let list = endpointsDB[index].list
        getDataLazyLoading(list, latestOffset, limit)
    } else {
        let list = endpointsDB[index].cache
        await preparePokemonListFromsearchSubCategory(index, searchSubCategory, list)
        getDataLazyLoading(list, latestOffset, limit)
    }
}

/////////////////
//HELP-FUNCTIONS
////////////////

//general-HELPFUNCTIONS//

async function fetchUrl(url) {
    let response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Daten. Status: ${response.status}, Endpoint: ${url}`)
    }
    return await response.json()
}

async function getDataLazyLoading(list, count, limit) {
    let promises = []
    let conditionLimit = count + limit

    for (let i = count; i < conditionLimit && i < list.length; i++) {
        let url = list[i].url
        promises.push(fetchUrl(url))
    }

    setUserSearchOffset(conditionLimit, count)

    let result = await Promise.all(promises)
    for (let i = 0; i < result.length; i++) {
        pokemonTempCache.push(result[i])
    }
}

async function preparePokemonListFromsearchSubCategory(indexEndpointDB, searchSubCategory, cache) {
    let list = endpointsDB[indexEndpointDB].list
    let indexList = list.findIndex(element => element.name === searchSubCategory)
    let url = list[indexList].url
    return fillList(url, cache)
}

function setUserSearchStatus(searchCategory, searchSubCategory) {
    clearUserSearchData(searchSubCategory)
    user.searchCategory = searchCategory
    user.searchSubCategory = searchSubCategory
}

function clearUserSearchData(searchSubCategory) {
    if (searchSubCategory !== user.searchCategory) {
        setUserSearchOffset(0, 0)
        clearPokemonTempCache()
    }
}

function setUserSearchOffset(searchOffsetLatest, searchOffsetBefore) {
    user.searchOffsetLatest = searchOffsetLatest
    user.searchOffsetBefore = searchOffsetBefore
}

function clearPokemonTempCache() {
    pokemonTempCache.length = 0
}

//init-HELPFUNCTIONS//

async function fillList(url, listArrayDB, fetchStyle = "lazy") {
    let result = await fetchUrl(url)

    let newResults = transformResultByStructure(result)

    for (let i = 0; i < newResults.length; i++) {
        let name = newResults[i].name
        let url = newResults[i].url
        listArrayDB.push({ name: name, url: url })
    }
    if (result.next && fetchStyle === "eager") {
        let endpointNext = result.next
        await fillList(endpointNext, listArrayDB)
    }
}

function transformResultByStructure(result) {
    let results = []

    if (result.results) {
        result.results.forEach(element => results.push({ name: element.name, url: element.url }))
    } else if (result.pokemon) {
        result.pokemon.forEach(element => results.push({ name: element.pokemon.name, url: element.pokemon.url }))
    } else if (result.pokemon_species_details) {
        result.pokemon_species_details.forEach(element => results.push({ name: element.pokemon_species.name, url: element.pokemon_species.url }))
    }
    return results
}