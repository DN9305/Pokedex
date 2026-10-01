const tempCache = []
const pokemonCache = []
const pokemonNames = []
const pokemonTypes = []
const pokemonGender = []
const pokemonAbility = []
const endpointsDB = [
    {
        endpoint: "pokemon",
        list: pokemonNames,
        limitList: 500,
        useCaseList: true,
        useCaseSort: false,
    },
    {
        endpoint: "type",
        list: pokemonTypes,
        limitList: 500,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: true,
        cache: tempCache,
        
    },
    {
        endpoint: "gender",
        list: pokemonGender,
        limitSort: 2,
        useCaseList: true,
        useCaseSort: true,
        cache: tempCache,
        
    },
    {
        endpoint: "ability",
        list: pokemonAbility,
        limitList: 500,
        limitSort: 20,
        useCaseList: true,
        useCaseSort: true,
        cache: tempCache,
        
    },
    {
        endpoint: "evolution-chain",
        limitSort: 20,
        useCaseList: false,
        useCaseSort: true,
        cache: tempCache,
    }
]