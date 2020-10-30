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

var contractList = ['nft','hotpot','gacha','loan','market','reward','stakepool','invite'];

var contractURL = {
    "nft": "https://etherscan.io/",
    "hotpot": "https://etherscan.io/",
    "gacha": "https://etherscan.io/",
    "loan": "https://etherscan.io/",
    "market": "https://etherscan.io/",
    "reward": "https://etherscan.io/",
    "stakepool":"https://etherscan.io/",
    "invite":"https://etherscan.io/"
}

var mainContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
    "market": "0xAcbda85F41362768834144Ab24B9103f3A524E08",
    "reward": "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3",
    "invite":"",
}

var ropstenContracts = {
    "nft": "0x27c26D4f9AdEF17497e41A2BeF4F641304B237bc",
    "hotpot": "0x849068872b4648D6Fa86851E6d132f7188f495E4",
    "gacha": "0x79D14bcf231087078B0EFa9d0e1Cd67073e074B1",
    "loan": "0xf7aCae676fB418249FAc9fDF15EE75c5d577944f",
    "market": "0xE6C549f4599E051889699a616AC1816d8D2c0Be7",
    "reward": "0xEDcdDD6ED6DD29c7bfe4b7eF6Cc05B7b064506Cb",
    'invite':'0xEECc6288566CFAb69df891894cC85eeE24dEa9d5',
}

var rinkebyContracts = {
    "nft": "0x1331b1784B258dE8b734bD9D80d3cdDf772d1Ab4",
    "hotpot": "0xc30394D25537003BAab11F0E370aa9421081092A",
    "gacha": "0xa6766a76BCaa2B644F0bf69060E37d2D2e152362",
    "loan": "0x8d6Db51dB7381DdacE7Def41404148af90cAC648",
    "market": "0x9D9c94B0567Af5275Aa053d898234528692a1826",
    "reward": "0x8D923313feE6ce408FDfb5fD3F94bC8d628dcD71",
    'invite':'0x774d406BBFD9D34C022B26A3D0160e9cE353fD7C',
}

var ganacheContracts = {
    "nft": "0x37D910ac5f8628702E5B1839838dC0E52f1E407A",
    "hotpot": "0x829B25171ee154d6deFFA2eC2C1385AF9b356b42",
    "gacha": "0xf3B53787ccDD3a6Ab1bca7aCB4408e190ae4FB5B",
    "loan": "0xB1af5A68eBB8b7D7Fa5aD614D0A2F96A324975d0",
    "market": "0x006E6b60A11F6564E24A5aEfF2661B165Ee266F7",
    "reward": "0xD522D6dEc82F447EE99526Ed9f7F4493D58Dc2F3",
    "invite":"",
}


var ropstenPool = {
    "usdt":"0xf22EedE32e58df2266B101953E17030d813e0Fd1",
    "eth/usdt":"0x8E239Aa44e8Fd2CFeb0D790ED818455aC67Ca8e5",
    "wbtc":"0xB53d399345721Cb32Ce2164ec451F9Ff62EAFcac",
    "usdc":"0xB53d399345721Cb32Ce2164ec451F9Ff62EAFcac",
    "hotpot":"0xEbA362ebF91059c856F94af793d7686755C5e96D",
    "hotpot/eth":"0xd421E548D667BBc9B4ab516A3D9A8c21052531d6"
}

var ropstenStakeERC = {
    "usdt":"0xad6d458402f60fd3bd25163575031acdce07538d",  //dai
    "eth/usdt":"0x1c5DEe94a34D795f9EEeF830B68B80e44868d316",  //eth/dai
    "usdc":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",  //uni/eth
    "wbtc":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",
    "hotpot/eth":"0x4F0BE49909c59e7D832a717c09F4A83A17D4B965"
}

var rinkebyPool = {
    "usdt":"0x2074195527cd4c1bE39888B163Fb96A7EdeEd4e7",
    "eth/usdt":"0x3c9BFC46EAe00302C3f3FA2a17d6AE03542C1bA8",
    "wbtc":"0xE2A81Cc30c2bd5bCa860F2F329985bd60eBB8457",
    "usdc":"0xC044095A9560AE291f9c0f18082Bd54817d3D637",
    "hotpot":"0x9a2126F9a2a3F183f258eD220A1a70F6A45FDd61",
    "hotpot/eth":"0x8E2140Ac7d0Ccd36fA9D72a091334d6D291654eA"
}

var rinkebyStakeERC = {
    "usdt":"0x2448ee2641d78cc42d7ad76498917359d961a783",  
    "eth/usdt":"0x78ab2e85eaf22dc7b6981e54432e17521bdadc23",  
    "usdc":"0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",  
    "wbtc":"0x01be23585060835e02b77ef475b0cc51aa1e0709",
    "hotpot/eth":"0x904e49cBe4756e19Eb63cbc90a8a482AF3DeF2B7",
    "wbtc/eth":"0x78ab2e85eaf22dc7b6981e54432e17521bdadc23"
}

var ganachePool = {
    "usdt":"0xf22EedE32e58df2266B101953E17030d813e0Fd1",
    "eth/usdt":"0x8E239Aa44e8Fd2CFeb0D790ED818455aC67Ca8e5",
    "wbtc":"0xB53d399345721Cb32Ce2164ec451F9Ff62EAFcac",
    "usdc":"",
    "hotpot":"0xEbA362ebF91059c856F94af793d7686755C5e96D",
    "hotpot/eth":"0xd421E548D667BBc9B4ab516A3D9A8c21052531d6"
}

var ganacheStakeERC = {
    "usdt":"0x2Ba8B39C22e796d65e32FF6afcbFD4075379041e",
    "eth/usdt":"0x71aa19b27DE4272c9189d3228796A3518f79F4d4",
    "usdc":"0xB709f47e5FA51Fe61085Ab40302A25Fc7dbCe590",  
    "wbtc":"",
    "hotpot/eth":"0x82538e5dF3E3457502EfFB6b1C3D94e8dFDEf485"
}

var mainPool = {
    "usdt":"0xf22EedE32e58df2266B101953E17030d813e0Fd1",
    "eth/usdt":"0x8E239Aa44e8Fd2CFeb0D790ED818455aC67Ca8e5",
    "wbtc":"0xB53d399345721Cb32Ce2164ec451F9Ff62EAFcac",
    "usdc":"",
    "hotpot":"0xEbA362ebF91059c856F94af793d7686755C5e96D",
    "hotpot/eth":"0xd421E548D667BBc9B4ab516A3D9A8c21052531d6"
}

var mainStakeERC = {
    "usdt":"0xdac17f958d2ee523a2206206994597c13d831ec7",  //usdt
    "eth/usdt":"0x0d4a11d5eeaac28ec3f61d100daf4d40471f1852", //eth/usdt
    "usdc":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",   //usdc
    "wbtc":"0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",  //wbtc
    "hotpot/eth":"0xd3d2e2692501a5c9ca623199d38826e513033a17",
    "wbtc/eth":"0xbb2b8038a1640196fbe3e38816f3e67cba72d940" //wbtc/eth
}


function setChainId(chainId){
    if (chainId === ChainId[0]) {
        console.log("connect main");
        contractAddress = mainContracts;
        stakePoolAddress = mainPool;
        stakeERCAddress = mainStakeERC;
        ethAddress="0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
    }else if(chainId === ChainId[1]){
        console.log("connect ropsten")
        contractAddress = ropstenContracts;
        stakePoolAddress = ropstenPool;
        stakeERCAddress = ropstenStakeERC;
        ethAddress="0xc778417e063141139fce010982780140aa0cd5ab";
    }
     else if (chainId === ChainId[2]) {
        console.log("connect rinkeby");

        contractAddress = rinkebyContracts;
        stakePoolAddress = rinkebyPool;
        stakeERCAddress = rinkebyStakeERC;
        ethAddress="0xc778417e063141139fce010982780140aa0cd5ab";

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
    "wbtc",
    "usdc",
    "hotpot",
    "hotpot/eth",
    "wbtc/eth"
]

function createTokenInfo(name){
    var token = new Object;
    token.name = name;
    token.decimals = 18;
    token.address = null;
    token.price = 0;
    return token;
}

var ChainId = ['main','ropsten','rinkey']

ETHENV = {
    Tokens:{},
    //chainId === "0x1" main, chainId === "0x3" ropsten, chainId === "0x4" rinkey
    chainId:null,
    ethPrice:0,

    init:function(_chainId){
        setChainId(_chainId);
        ETHENV.chainId = _chainId;
    }
}