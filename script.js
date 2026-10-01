let baseURL = "https://pokeapi.co/api/v2/"

const tempCache = []
let pokemonCache = []

async function init() {
    try {
        await fetchDataForListsDB(endpointsDB)
        console.log(pokemonAbility)
    } catch (error) {
        console.error("FETCH-FEHLER:", error)
    }
}

async function fetchDataForListsDB(endpoints) {
    let promises = []
    for (let i = 0; i < endpoints.length; i++) {
        if (endpoints[i].useCaseList) {
            let { endpoint, list, limitList } = endpoints[i]
            let endpointURL = baseURL + endpoint + `?limit=${limitList}`
            promises.push(fillList(endpointURL, list))
        }
    }
    await Promise.all(promises)
}

/////////////////
//HELP-FUNCTIONS
////////////////

async function fetchData(url) {
    let response = await fetch(url)
    if (!response.ok) {
        throw new Error(`Fehler beim Laden der Daten. Status: ${response.status}, Endpoint: ${endpoint}`)
    }
    return await response.json()
}

async function fillList(endpoint, listArrayDB) {
    let result = await fetchData(endpoint)
    for (let i = 0; i < result.results.length; i++) {
        let name = result.results[i].name
        listArrayDB.push(name)
    }
    if (result.next) {
        let endpointNext = result.next
        await fillList(endpointNext, listArrayDB)
    }
}


