const pokePersistCache = new Array(1026)
const pokeTempCache = []
const pokeNamesUrl = []
const pokeTypesUrl = []
const pokeGenderUrl = []
const pokeAbilityUrl = []
const endpointTempCache = []
const endpointsDB = [

    ///gibt die namen aller poke aus sowie die url zum einzelnen poke
    ///****ZÄHLT AUCH FÜR endpointTempCache***
    //////list: Pokemons: weiterführende Keys zu PokemonDaten die von interesse sind: (bsp: pokemon.X) (indexe müssen iteriert werden)
    /////////Order/ID: number //Order wäre besser als ID weil es der Tatsächlichen etnwicklungs reihenfolge folgt.
    /////////Height: height: number
    /////////Weight: weight: number
    /////////Abilities: abilities: [] -> index: {} -> ability: {} -> name, url
    /////////Types: types: [] -> index: {} -> type: {} -> name, url
    /////////Species: species: {} -> name, url
    /////////Stats: stats: [] -> index: {} -> [stat: {} -> name,url && base_stat: number]
    /////////Sprites: sprites: {} -> front_default: "string"
    {
        endpoint: "pokemon",
        list: pokeNamesUrl,
        limitList: 500,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: false,
    },
    ///gibt die namen aller Types aus sowie die url zum einzelnen Type
    //////list: URL: weiterführende Key chain zu Pokemons: (indexe müssen iteriert werden)
    /////////pokemon: pokemon: [] -> index: {} -> pokemon: {} -> name, url
    {
        endpoint: "type",
        list: pokeTypesUrl,
        limitList: 500,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: true,
        cache: endpointTempCache,

    },
    ///gibt die namen aller Gender aus sowie die url zum einzelnen Gender
    //////list: URL: weiterführende Key chain zu Pokemons: (indexe müssen iteriert werden)
    /////////pokemon: pokemon_species_details: [] -> index: {} -> pokemon_species: {} -> name, url
    {
        endpoint: "gender",
        list: pokeGenderUrl,
        limitList: 10,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: true,
        cache: endpointTempCache,

    },
    ///gibt die namen aller abilities aus sowie die url zur einzelnen Ability
    //////list: URL: weiterführende Key chains: (indexe müssen iteriert werden)
    //////////pokemon: pokemon: [] -> index: {} -> pokemon: {} -> name, url
    {
        endpoint: "ability",
        list: pokeAbilityUrl,
        limitList: 500,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: true,
        cache: endpointTempCache,

    },
]