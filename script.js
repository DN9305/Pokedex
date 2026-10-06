let baseURL = "https://pokeapi.co/api/v2/"


////searchCategroy = name vom ursprungs Endpunkt siehe endpointsDB. 
////searchSubCategory = name von dem einzelnen Types, Abilities und Gender der jeweiligen endpoints.
///////"pokemon" hat searchSubCategory "pokemon", da dessen endpunkt bereits der letzte schritt ist um die gebrauchten pokemon fetchen zu können die angezeigt werden sollen.
const user = {
    searchCategory: "pokemon",
    searchSubCategory: "pokemon",
    searchOffsetBefore: 0,
    searchOffsetLatest: 0,
    batchID: 0
}

/////////////////
//INIT-FUNCTION
////////////////

async function init() {
    try {
        let { searchCategory, searchSubCategory } = user
        await fetchDataForListsDbOnInit(endpointsDB)
        renderOnInit()
        await loadAndShowData(searchCategory, searchSubCategory)

    } catch (error) {
        console.error("FETCH-FEHLER:", error)
    }
}

/////////////////
//MAIN-FUNCTIONS
////////////////

async function loadAndShowData(searchCategory, searchSubCategory = "pokemon") {
    renderAndShowLoadingScreen()
    await fetchDataIntoTempCache(searchCategory, searchSubCategory)
    renderCardsSmall(searchCategory, searchSubCategory)
}

async function laodMore() {
    renderAndShowLoadingScreen()
    await fetchDataIntoTempCache(user.searchCategory, user.searchSubCategory)
    renderCardsSmall(user.searchCategory, user.searchSubCategory)
}

function findPokemonFromArray(inputValue) {
    let searchArrays = [pokeGenderUrl, pokeTypesUrl, pokeAbilityUrl, pokeNamesUrl]
    let outputArray = []
    let idCount = 0
    for (let i = 0; i < searchArrays.length; i++) {
        let array = searchArrays[i]
        let result = array.filter(filterArrayForName, inputValue)
        result.forEach(element => { element.id = idCount; idCount++ })
        outputArray.push(...result)
    }

    resultOutputToUser(outputArray)
}

async function resultOutputToUser(result) {
    if (result.length == 1 && result[0].category == "pokemon") {
        let pokemonData = await getPokemonData(result[0].name, result[0].url)
        renderCardBig(pokemonData, true)
        chosenSearchResult(element.category, element.name, element.url)
    } else {
        renderSearchResults(result)
    }
}

async function getPokemonData(name, url) {
    let results = pokePersistCache.filter(element => element.name.includes(name))
    let pokemonData = {}
    if (results.length) {
        pokemonData = results[0]
        return pokemonData
    } else {
        pokemonData = await fetchUrl(url)
        return pokemonData
    }

}

function filterArrayForName(element) {
    return element.name.includes(this)
}

/////////////////
//TEMPCACHE-FUNCTION-FLOW
////////////////

async function fetchDataIntoTempCache(searchCategory, searchSubCategory) {
    setUserSearchStatus(searchCategory, searchSubCategory)

    let index = endpointsDB.findIndex(element => element.endpoint === searchCategory)
    let limit = endpointsDB[index].limitSort
    let latestOffset = user.searchOffsetLatest

    if (searchCategory === "pokemon") {
        let list = endpointsDB[index].list
        await fetchDataLazyLoading(list, latestOffset, limit)
    } else {
        let list = endpointsDB[index].cache
        await preparePokeListFromsearchSubCategory(index, searchSubCategory, list)
        await fetchDataLazyLoading(list, latestOffset, limit)
    }
}

function setUserSearchStatus(searchCategory, searchSubCategory) {
    clearUserSearchData(searchSubCategory)
    user.searchCategory = searchCategory
    user.searchSubCategory = searchSubCategory
}

function clearUserSearchData(searchSubCategory) {
    if (searchSubCategory !== user.searchSubCategory) {
        resetUserBatchesLoaded()
        setUserSearchOffset(0, 0)
        savePokeTempCacheToPersistCache()
        clearPokeTempCache()
    }
}

function resetUserBatchesLoaded() {
    user.batchID = 0
}
function setUserSearchOffset(searchOffsetLatest, searchOffsetBefore) {
    user.searchOffsetLatest = searchOffsetLatest
    user.searchOffsetBefore = searchOffsetBefore
}

function savePokeTempCacheToPersistCache() {
    if (pokeTempCache.length) {
        pokeTempCache.forEach(element => {
            let index = element.id
            delete element.positionInTempCache
            if (pokePersistCache[index] === undefined) {
                pokePersistCache[index] = element
            }
        })
    }
}

function clearPokeTempCache() {
    endpointTempCache.length = 0
    pokeTempCache.length = 0
    document.getElementById("cards").innerHTML = ""
}


async function preparePokeListFromsearchSubCategory(indexEndpointDB, searchSubCategory, cache) {
    if (!cache.length) {
        let list = endpointsDB[indexEndpointDB].list
        let indexList = list.findIndex(element => element.name === searchSubCategory)
        let url = list[indexList].url
        return await fillArray(url, cache)
    }
}

async function fetchDataLazyLoading(list, latestOffset, limit) {
    let count = latestOffset
    let promises = []
    let conditionLimit = count + limit

    for (let i = count; i < conditionLimit && i < list.length; i++) {
        let url = list[i].url
        promises.push(fetchUrl(url))
    }

    setUserSearchOffset(conditionLimit, count)

    let result = await Promise.all(promises)
    for (let i = 0; i < result.length; i++) {
        result[i] = pokeTempCache.push(result[i])
    }
}

/////////////////
//DATABANK-FUNCTIONS
////////////////

async function fetchDataForListsDbOnInit(endpoints) {
    let promises = []
    let fetchStyle = "eager"
    for (let i = 0; i < endpoints.length; i++) {
        if (endpoints[i].useCaseList) {
            let { endpoint, list, limitList } = endpoints[i]
            let endpointURL = baseURL + endpoint + `?limit=${limitList}`
            promises.push(fillArray(endpointURL, list, fetchStyle, endpoint))
        }
    }
    await Promise.all(promises)
}

async function fillArray(url, listArrayDB, fetchStyle = "lazy", endpoint = "pokemon") {
    let result = await fetchUrl(url)

    let newResults = transformResultByStructure(result)
    for (let i = 0; i < newResults.length; i++) {
        let name = newResults[i].name
        let url = newResults[i].url
        let category = endpoint
        listArrayDB.push({ name: name, url: url, category: category })
    }
    if (result.next && fetchStyle === "eager") {
        let endpointNext = result.next
        await fillArray(endpointNext, listArrayDB, fetchStyle, endpoint)
    }
}

/////////////////
//HELP-FUNCTIONS
////////////////

async function fetchUrl(url) {
    let response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Daten. Status: ${response.status}, Endpoint: ${url}`)
    }
    return await response.json()
}

///Die Daten der Pokemons liegen je nach endpoint anfrage anders Verschachtelt. Wennn neue endpunkte zu endpointsDB hinzugefügt werden muss hier die entsprechende struktur eingetragen werden
///um auf die pokemon Daten zugreifen zu können.
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