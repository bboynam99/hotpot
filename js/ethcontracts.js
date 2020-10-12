var nft = "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F";
var hotpot = "0x1091cF23823b1F6172e9AB362052fAc20b296e0E";
var gacha = "0x8264cB34e0cB675a9a7a863B6301f16512570130";
var stakepool = "0x65C74F67bF32e633AbeE501E757812513b1E8abd";
var loan = "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7";
var market = "0xAcbda85F41362768834144Ab24B9103f3A524E08";
var reward = "0x215E9C18A19D5b0DaFfa83e9C4f122BB260F12D3";

var usdt = "0x789B419dFA4Ad42C09454Ec7927C4A7BdD96dfed";

var contractAddress = {}

var stakePoolAddress = {}

var stakeERCAddress = {}

var mainContracts = {
    "nft": "0xeB7197AcD05f2E1B361B5D6b7fD7abFDcfE18d8F",
    "hotpot": "0x1091cF23823b1F6172e9AB362052fAc20b296e0E",
    "gacha": "0x8264cB34e0cB675a9a7a863B6301f16512570130",
    "stakepool": "0x65C74F67bF32e633AbeE501E757812513b1E8abd",
    "loan": "0x006fDBe6E50826ed1a815f77c82413f6FF8a6Ba7",
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

var ganacheStakeERC = {
    "usdt":"",
    "eth/usdt":"",
    "uni/eth":"",
    "hotpot":"",
    "hotpot/eth":""
}


function setChainId(chainId){
    if (chainId === "0x1") {
        console.log("connect main");
        contractAddress = mainContracts;
        stakePoolAddress = mainPool;
        stakeERCAddress = mainStakeERC;
    } else if (chainId === "0x4") {
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
    return oTempToken;
}

var allTokens = [
    "usdt",
    "eth/usdt",
    "uni/eth",
    "hotpot",
    "hotpot/eth",
]

var pools = {
    "WWT/TRX": createToken("WWT/TRX", "TLYRrVeGXKkZyZXweo7yDZqWDPq1DpdFVu", "TMr5kifkZVfGqWgcuofvYYgECTFhxGL6Bo"),
    "WWT": createToken("WWT", "TUHVUsg8hvR4TxmWAbfvKTKwGdrqArmYsv", "TLfG1ogM21DVYKL8UqTmLksjkHccMa6BhS"),
    "USDT": createToken("USDT", "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t", "TGEA1ML342FLHw2t3g9Fr631Cnbnw61rm8"),
    "PEARL": createToken("PEARL", "TGbu32VEGpS4kDmjrmn5ZZJgUyHQiaweoq", "TWmK7fBMpyKn9nHwtZrKzkXgT3LnhexETD"),
    "COLA": createToken("COLA", "TSNWgunSeGUQqBKK4bM31iLw3bn9SBWWTG", "TJUXaE6Be69QsRL8doAHN2YWWXFjH2qG6s"),
    "SSK": createToken("SSK", "TW1sqqq7UphAqGNHDXSLXsEainYHJuQeyC", "TX1AxuHk8LL4Rxyb7pR3i2kpBg64tR3cWA"),
    "SUN": createToken("SUN", "TKkeiboTkxXKJpbmVFbv4a8ov5rAfRDMf9", "TBXJaSvyYxRMfBY2fXWsqim3XoH61qHouP"),
}
