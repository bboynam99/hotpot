var contractAddress = {}

var stakePoolAddress = {}

var stakeERCAddress = {}

var stakeERCContract={}

//createToken
var stakeInfos = {}

var univ2PairsAddress = {}

var ethAddress;

//createPairInfo
var univ2PairInfo={}

var uniFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

var mainContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1091cF23823b1F6172e9AB362052fAc20b296e0E",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "stakepool": "0x65C74F67bF32e633AbeE501E757812513b1E8abd",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
}

var ropstenContracts = {
    "nft": "0x51aF31f225CC758f0F189fd694c174Fd3439AB6C",
    "hotpot": "0xEE35F1Aa6F2ea8eEE669671c852D879b17eB8AF8",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "stakepool": "0x65C74F67bF32e633AbeE501E757812513b1E8abd",
    "loan": "0xFCD912C39E3eF3b835E1dD55c2c0d7BF4EEEd47e",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
}

var ganacheContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1091cF23823b1F6172e9AB362052fAc20b296e0E",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "stakepool": "0x65C74F67bF32e633AbeE501E757812513b1E8abd",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
}

var mainPool = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ropstenPool = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ganachePool = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var mainStakeERC = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ropstenStakeERC = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ganacheStakeERC = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var mainUniPairs = {
    "eth/usdt":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
    "uni/eth":"0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "hotpot/eth":"0x32ce7e48debdccbfe0cd037cc89526e4382cb81b"
}

//fake pairs
var ropstenUniPairs = {
    "eth/usdt":"0x1c5DEe94a34D795f9EEeF830B68B80e44868d316",
    "uni/eth":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",
    "hotpot/eth":"0x98A608D3f29EebB496815901fcFe8eCcC32bE54a"
}

function setChainId(chainId){
    if (chainId === "0x1") {
        console.log("connect main");
        contractAddress = mainContracts;
        stakePoolAddress = mainPool;
        stakeERCAddress = mainStakeERC;
        univ2PairsAddress = mainUniPairs;
        ethAddress="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }else if(chainId === "0x3"){
        console.log("connect ropsten")
        contractAddress = ropstenContracts;
        stakePoolAddress = ropstenPool;
        stakeERCAddress = ropstenStakeERC;
        univ2PairsAddress = ropstenUniPairs;
        ethAddress="0xc778417e063141139fce010982780140aa0cd5ab";
    }
     else if (chainId === "0x4") {
        console.log("connect rinkeby");
    } else if (chainId === "0x29a") {
        console.log("connect ganache");
        contractAddress = ganacheContracts;
        stakePoolAddress = ganachePool;
        stakeERCAddress = ganacheStakeERC;
    }
}


//name,address,poolAddress,weight,poolTotalStake,userStake,userBalance
function createToken(name, address, poolAddress) {
    var oTempToken = new Object;
    //contract instance of this token's stake pool
    oTempToken.instance=null;

    //用来质押的代币名称
    oTempToken.name = name;

    //用来质押的代币地址，比如这个是wwt-trx lp 地址
    oTempToken.address = address;

    //用来挖矿的地址，比如这个是矿池wwt-trx lp的地址
    oTempToken.poolAddress = poolAddress;

    //该矿池能挖出来总代币数量，这个是WWT的数量
    oTempToken.totalReward = 50;

    //该矿池目前质押的总数量
    oTempToken.poolTotalStake = 0;

    //该矿池这个用户质押了多少
    oTempToken.userStake = 0;

    //该矿池用来挖矿的代币，用户有多少，单位是wei，即需要除以10^decimals，才是用户看的
    oTempToken.userBalance = 0;

    //用户当前挖出来多少代币
    oTempToken.userEarn = 0;

    //该矿池的挖矿币的价格
    oTempToken.price = 0;

    oTempToken.priceNormalize = false;

    //该矿池的挖矿币的精度
    oTempToken.decimals = 18;

    //该矿池的APY
    oTempToken.apy = 0;

    oTempToken.allowance = 0;

    oTempToken.rewardRate = 0;

    return oTempToken;
}

function createPairInfo(address) {
    var pair = new Object;
    pair.address = address;
    pair.contractInstance = null;

    pair.token0=null;

    pair.token1=null;

    pair.reserve0=null;

    pair.reserve1=null;

    pair.totalSupply = 0;

    //by eth
    pair.lpPrice=0;

    pair.decimals=0;

    return pair;
}

var allPoolTokens = [
    "usdt",
    "eth/usdt",
    "uni/eth",
    "hotpot",
    "hotpot/eth",
]
