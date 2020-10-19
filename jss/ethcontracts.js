var contractAddress = {}

var stakePoolAddress = {}

var stakeERCAddress = {}

var stakeERCContract={}

//createToken
var stakeInfos = {}

var ethAddress;

//createPairInfo
var univ2PairInfo={}

var uniFactoryAddress = "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f";

var balanceOfHotpot={};

var contractsInstance = {};

var mainContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1091cF23823b1F6172e9AB362052fAc20b296e0E",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
}

var ropstenContracts = {
    "nft": "0x9c00EFbD9A187bE65ba088A59B133baEA06B1f71",
    "hotpot": "0x42670e96F3F14399aeb3660472800AeC9b689e55",
    "gacha": "0x6fE2eFC4b7c3CB2a16933Ac018d52e974813776d",
    "loan": "0x77AAeDAb8d613b88Ef2329B7aD107516b8E5233d",
    "market": "0xbAf28532f11f7CA008DAed382bba24A5BA243414",
    "reward": "0xfe405e149c907D3f5c9979159D0Ad7d929a63B27",
}

var ganacheContracts = {
    "nft": "0x07Ef939016643763201007909c5CC35858b290E1",
    "hotpot": "0xe18eDD671c0b0ebE4F1aD5B2f1C5c065C8cA64ba",
    "gacha": "0xEfA4D518fD856e478eE23e475Ca672Cc0a615629",
    "loan": "0xf8125D436990b8FFc2d01834d2f76636c9a881f4",
    "market": "0x6cE3c77Fe272c1d64340b51f66B8C341Cb70485D",
    "reward": "0x07a45cD6D828f23De6e5Ba4899688d480e203bfe",
}

var mainPool = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}

var ropstenPool = {
    "usdt":"0x343121206D75c89961Ac2822ecf9F5F5762Db304",
    "eth/usdt":"0xF4B3d0586aD31306ed5e8357b7e841Fa3f3594aA",
    "uni/eth":"0xa4B9a2854C43d02e365E770408759A063784901a",
    "hotpot":"0x7afa51532b542eF9Bc5CEDD233eee6A8f441B4A5",
    "hotpot/eth":"0xeb549d230C16534d6d58bAAd4F321a83cE51419B"
}


var ganachePool = {
    "usdt":"0xf6cFA1c520a9210eedC4a34b651f1B2BC377c921",
    "eth/usdt":"0x83414F6884824B3C3f84982b5035B975016B314c",
    "uni/eth":"0x6Cec720a5BB6D1a32542f3481cA01C34290869e7",
    "hotpot":"0xD7082591252A713af183A685c5200cE2ef945AEE",
    "hotpot/eth":"0xe19Cd136f6B59cfcedA33cEB1D06f34B57B80A7E"
}

var mainStakeERC = {
    "usdt":"0xdac17f958d2ee523a2206206994597c13d831ec7",
    "eth/usdt":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852",
    "uni/eth":"0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "hotpot/eth":""
}

var ropstenStakeERC = {
    "usdt":"0xad6d458402f60fd3bd25163575031acdce07538d",  //dai
    "eth/usdt":"0x1c5DEe94a34D795f9EEeF830B68B80e44868d316",  //eth/dai
    "uni/eth":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",  //uni/eth
    "hotpot/eth":"0xDBA5276922b01bb01F9b1047e941aBd6469Aab4B"
}

   // var stakeTokens = [
    //     "ethusdt",
    //     'unieth',
    //     'usdt',
    //     'hotpot',
    //     'hotpoteth'
    // ];
var ganacheStakeERC = {
    "usdt":"0xad2b72858c66B40cBDb97c28A2B939df5F147367",
    "eth/usdt":"0x9d37ABBA38F30F336A87c2acC8E8B75D1a476Bc0",
    "uni/eth":"0xBDeFFdE8a1358B96A6859fD0aEFE1b371a392b9e",
    "hotpot/eth":"0xa99d9FFc19aC4d570dBcBce3b227389C84D9dB92"
}

function setChainId(chainId){
    if (chainId === "0x1") {
        console.log("connect main");
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
    stakeERCAddress['hotpot'] = contractAddress['hotpot'];
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

    //The pool's end time
    oTempToken.periodFinish=0;

    oTempToken.priceNormalize = false;

    //该矿池的挖矿币的精度
    oTempToken.decimals = 18;

    //该矿池的APY
    oTempToken.apy = 0;

    oTempToken.allowance = 0;

    oTempToken.rewardRate = 0;

    oTempToken.lastRewardTime = 0;

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