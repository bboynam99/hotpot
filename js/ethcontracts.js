var contractAddress = {}

var stakePoolAddress = {}

var stakeERCAddress = {}

var stakeERCContract={}

//createToken
var stakeInfos = {}

var ethAddress;

var testFlag = true;

//createPairInfo
var univ2PairInfo={}

var uniFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

var balanceOfHotpot={};

var mainContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1091cF23823b1F6172e9AB362052fAc20b296e0E",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
}

var ropstenContracts = {
    "nft": "0xF0B81d9b69F8F31fB12aBE3f65A0b26B3855EA8B",
    "hotpot": "0x5F5F353DEF50B7F5258c0Ff3eF710c3199859CB8",
    "gacha": "0x66651d7d171367d1641ddeeab8332FB2773DCF99",
    "loan": "0x6eFD34051A519C83a34c88eeC3E6dF4C412c00aE",
    "market": "0x7DCB044D7D8AF2D6ABfB7B1eC497493147E3FECe",
    "reward": "0x359Ce203647031e0bc9C9135f7CA4Ae1eb26073E",
}

var ganacheContracts = {
    "nft": "0x2e53Fc0Be23cc164Ba531Aa3Bb779b2001d75bfa",
    "hotpot": "0xCd0dB3A7922006E2E5141bB86596c076211F8a73",
    "gacha": "0xB21A275f4d41403ddB7323c6ebaC9017A366b784",
    "loan": "0x30eB316A852a4068e278f60fa1D9c3aF2e3C17cE",
    "market": "0xc2dbD1fc7642900A3968B18423960879c938b936",
    "reward": "0x776B9beB22C0947a6734Ea51961077f4540b14fc",
}

var mainPool = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ropstenPool = {
    "usdt":"0x5Be34889FFEB5a4da4FBF66F5DC33A15A516ff83",
    "eth/usdt":"0x6d4765f7E143A9d9c14B29936f38b9CaFf966eA5",
    "uni/eth":"0x22E11d3A47Be9A0c73101Cf0b7EF157b0e92149F",
    "hotpot":"0x1d766fa76C555c79dB162A738c4782c083642D9E",
    "hotpot/eth":"0x0A2eF64D457AE65fA81748F6b3F150710a7e3b6e"
}


var ganachePool = {
    "usdt":"0x781ED42B0eF6199Ccd2863DE3ebE325b8730b4bB",
    "eth/usdt":"0x39FfA08A0Fa6f811F47C05900f6714d0cDCF6D79",
    "uni/eth":"0xC6D75eb8c21C76E0b54444479B24b9aA6B747B62",
    "hotpot":"0x2EccdD1794cfC45C75bfeb9FbAc00574c7E77D33",
    "hotpot/eth":"0x36d5287e52B68e7a13c88ACeE856BCFC6dF7FF63"
}

var mainStakeERC = {
    "usdt":"0xdac17f958d2ee523a2206206994597c13d831ec7",
    "eth/usdt":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
    "uni/eth":"0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "hotpot":"",
    "hotpot/eth":""
}

var ropstenStakeERC = {
    "usdt":"0x0d9c8723b343a8368bebe0b5e89273ff8d712e3c",
    "eth/usdt":"0xbc30AaA8e99d0f0e435FC938034850c2fC77f753",
    "uni/eth":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",
    "hotpot":"0x5F5F353DEF50B7F5258c0Ff3eF710c3199859CB8",
    "hotpot/eth":"0xCdaF6Ec7bFE04A3cEce52436B39BE0A2c2F85aDc"
}

   // var stakeTokens = [
    //     "ethusdt",
    //     'unieth',
    //     'usdt',
    //     'hotpot',
    //     'hotpoteth'
    // ];
var ganacheStakeERC = {
    "usdt":"0xaCdE14dA5B325e937794dcfEaBDB1b9afA958083",
    "eth/usdt":"0xfb42D94EEa4C28aa098a564671e52349001a9780",
    "uni/eth":"0xB41D8e3b64e488B95C295D068D94e43000C8d8f7",
    "hotpot":"0xCd0dB3A7922006E2E5141bB86596c076211F8a73",
    "hotpot/eth":"0x2897615b467434aCb5d8c85C15b47B08Fc385e63"
}

// var mainUniPairs = {
//     "eth/usdt":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
//     "uni/eth":"0xd3d2e2692501a5c9ca623199d38826e513033a17",
//     "hotpot/eth":"0x32ce7e48debdccbfe0cd037cc89526e4382cb81b"
// }

// //fake pairs
// var ropstenUniPairs = {
//     "eth/usdt":"0x1c5DEe94a34D795f9EEeF830B68B80e44868d316",
//     "uni/eth":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",
//     "hotpot/eth":"0x98A608D3f29EebB496815901fcFe8eCcC32bE54a"
// }

function setChainId(chainId){
    if (chainId === "0x1") {
        console.log("connect main");
        testFlag = false;
        contractAddress = mainContracts;
        stakePoolAddress = mainPool;
        stakeERCAddress = mainStakeERC;
        TokenAddress = mainTokenAddress;
        ethAddress="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }else if(chainId === "0x3"){
        console.log("connect ropsten")
        contractAddress = ropstenContracts;
        stakePoolAddress = ropstenPool;
        stakeERCAddress = ropstenStakeERC;
        TokenAddress = ropstenTokenAddress;
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

var knownTokens = {}

function createTokenInfo(name){
    var token = new Object;
    token.name = name;
    token.decimals = 18;
    token.address = null;
    token.price = 0;
    return token;
}

var initToken=[
    'usdt',
    'hotpot',
    'uni'
]

var TokenAddress = {}

var mainTokenAddress={
    'usdt':"0xdac17f958d2ee523a2206206994597c13d831ec7",
    'hotpot':"",
    "uni":"0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"
}

var ropstenTokenAddress={
    'usdt':"",
    'hotpot':"",
    "uni":""
}

ETHENV = {
    Tokens:{},
    //chainId === "0x1" main, chainId === "0x3" ropsten, chainId === "0x4" rinkey
    chainId:null,
    ethPrice:0,

    init:function(_chainId){
        setChainId(_chainId);
        ETHENV.chainId = _chainId;
        knownTokens['usdt'] = createTokenInfo('usdt');
        knownTokens['usdt'].decimals = 6;
        knownTokens['usdt'].address = TokenAddress['usdt'];

        knownTokens['uni'] = createTokenInfo('uni');
        knownTokens['uni'].decimals = 18;
        knownTokens['uni'].address = TokenAddress['uni'];

        knownTokens['hotpot'] = createTokenInfo('hotpot');
        knownTokens['hotpot'].decimals = 18;
        knownTokens['hotpot'].address = TokenAddress['hotpot'];
    }
}