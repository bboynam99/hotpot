const UNISWAP = require('@uniswap/sdk')
const Fetcher = UNISWAP.Fetcher;
const ChainId = UNISWAP.ChainId;
const Token = UNISWAP.Token;
const Route = UNISWAP.Route;
const WETH = UNISWAP.WETH;
const ethers = require('ethers');

App = {
    web3Provider: null,
    defaultAccount: null,
    contracts: {},
    erc20Contract: null,
    init: function () {
        console.log(`The chainId of mainnet is ${ChainId.MAINNET}.`)

        return App.initWeb3();
    },

    initWeb3: function () {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof window.ethereum != 'undefined') {
            console.log("Metamask is installed!");
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);

            window.ethereum.on('accountsChanged', (accounts) => {
                // Handle the new accounts, or lack thereof.
                // "accounts" will always be an array, but it can be empty.
                console.log("accountsChanged");
                window.location.reload();
            });

            window.ethereum.on('chainChanged', (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have a very good reason not to.
                console.log("chainChanged");
                window.location.reload();
            });
            console.log("chainid=" + window.ethereum.chainId);
            var chainId = window.ethereum.chainId;
            // Use the mainnet
            // const network = "mainnet";

            // Specify your own API keys
            // Each is optional, and if you omit it the default
            // API key for that service will be used.
            // const provider = ethers.getDefaultProvider(network, {
            //     etherscan: 'IXP277PKS6ZT4DU5RWZ5ACQW5567IW22K6',
            // });
            // ethers.providers = provider;

            ETHENV.init(chainId);
        }
        return App.initWallet();
    },
    initWallet: async function () {
        console.log("initWallet");
        if (web3 != null) {
            $('body').addClass('web3');
        }
        let accounts = await ethereum.request(
            {
                method: 'eth_requestAccounts'
            }
        );
        console.log("account=" + accounts[0]);
        console.log("current account=" + ethereum.selectedAddress);
        // console.log("address Yes:" + window.tronWeb.defaultAddress.base58)
        App.defaultAccount = accounts[0];
        return App.initContract();
        // return App.initUniSDK();
    },
    initUniSDK: async function () {
        var chain = ChainId.ROPSTEN;
        var chainId = ETHENV.chainId;
        if (chainId === "0x1") {
            chain = ChainId.MAINNET;
        } else if (chainId === "0x3") {
            chain = ChainId.ROPSTEN;
        }
        else if (chainId === "0x4") {
            chain = ChainId.RINKEBY;
        } else if (chainId === "0x29a") {
        }
        console.log("dai start" + (new Date()).getTime());
        for (var i = 0; i < initToken.length; i++) {
            var name = initToken[i];
            var t = knownTokens[name];
            if (t.address == null || t.address == "") {
                continue;
            }
            const token = new Token(chain, t.address, t.decimals);

            // note that you may want/need to handle this async code differently,
            // for example if top-level await is not an option
            const pair = await Fetcher.fetchPairData(token, WETH[token.chainId])

            const route = new Route([pair], WETH[token.chainId])

            const route2 = new Route([pair], token);
            // console.log("name="+name);
            // console.log(route.midPrice.toSignificant(6)+":"+ (new Date()).getTime()) // 201.306
            // console.log(route2.midPrice.toSignificant(6)+":"+ (new Date()).getTime()) // 201.306
            if (name === 'usdt') {
                ETHENV.ethPrice = route.midPrice;
                console.log("eth price=" + ETHENV.ethPrice.toSignificant(6));
            }
            t.price = route2.midPrice;
        }

        for (var i = 0; i < initToken.length; i++) {
            var name = initToken[i];
            var t = knownTokens[name];
            if (t.price == 0) {
                continue;
            }
            t.price = t.price.multiply(ETHENV.ethPrice);
            console.log("name=" + name + ",price=" + t.price.toSignificant(6) + "," + (new Date()).getTime());

            var s = t.price.scalar.numerator;
            console.log("s="+s);
        }
        return App.initContract();
    },
    initContract: function () {
        $.getJSON('contracts/StakePool.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.StakePool = web3.eth.contract(data.abi);
            return App.getStakePools();
        });
        $.getJSON('contracts/HotPot.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.HotPot = web3.eth.contract(data.abi);
            erc20Contract = web3.eth.contract(data.abi);
            return App.getBalances();
        });

        $.getJSON('contracts/NFTokenHotPot.json', function (data) {
            App.contracts.NFTHotPot = web3.eth.contract(data.abi);
            return App.getNFTBalances();
        });

        $.getJSON('contracts/Reward.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.Reward = web3.eth.contract(data.abi);
            return App.getReward();
        });

        $.getJSON('contracts/Gacha.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.Gacha = web3.eth.contract(data.abi);
            return App.getGacha();
        });

        $.getJSON('contracts/Loan.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.Loan = web3.eth.contract(data.abi);
            return App.getLoan();
        });

        $.getJSON('contracts/NFTMarket.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.NFTMarket = web3.eth.contract(data.abi);

            return App.getNFTMarket();
        });

        $.getJSON('contracts/UniV2Pair.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.UniV2Pair = web3.eth.contract(data.abi);
            return App.getUniV2Pairs();
        });

    },
    getUniV2Pairs: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            console.log("getUniV2Pairs "+token);
            if (token === "usdt" || token === "hotpot") {
                // getUniV2Token(token);
            } else {
                App.getUniV2Pair(token);
            }
            App.getStakeERCInfo(token);
        }
    },
    getStakeERCInfo: function (token) {
        if(stakeERCAddress[token]==null || stakeERCAddress[token]==""){
            return;
        }
        stakeERCContract[token] = erc20Contract.at(stakeERCAddress[token]);
        console.log("getStakeERCInfo token="+token);
        stakeERCContract[token].balanceOf(App.defaultAccount,function(e,result){
            stakeInfos[token].userBalance = result;
            console.log("getStakeERCInfo balance="+result+",name="+token);
            stakeERCContract[token].decimals(function(e,result){
                stakeInfos[token].decimals = result;
                stakeERCContract[token].allowance(App.defaultAccount, stakePoolAddress[token],function(e,result){
                    console.log("getStakeERCInfo allowance="+result+",name="+token);
                    stakeInfos[token].allowance = result;
                });
            });
        });
    },
    getUniV2Pair: function (pair) {
        console.log("getUniV2Pair=" + pair);
        univ2PairInfo[pair] = createPairInfo(pair);
        if(stakeERCAddress[pair]==null ||stakeERCAddress[pair]==""){
            return;
        }
        univ2PairInfo[pair].contractInstance = App.contracts.UniV2Pair.at(stakeERCAddress[pair]);

        univ2PairInfo[pair].contractInstance.decimals(function(e,result){
            console.log("getUniV2Pair decimals="+result+",name="+pair);
            univ2PairInfo[pair].decimals = result;
            univ2PairInfo[pair].contractInstance.getReserves(function(e,result){
                console.log("getUniV2Pair getReserves="+result+",name="+pair);
                var reserve0 = result[0];
                var reserve1 = result[1];

                univ2PairInfo[pair].reserve0 = reserve0;
                univ2PairInfo[pair].reserve1 = reserve1;

                univ2PairInfo[pair].contractInstance.totalSupply(function(e,result){
                    console.log("getUniV2Pair totalSupply="+result+",name="+pair);
                    univ2PairInfo[pair].totalSupply = result;
                    if (pair === "eth/usdt" && !testFlag) {
                        univ2PairInfo[pair].lpPrice = univ2PairInfo[pair].reserve0.div(Math.pow(10, 18)).times(2).div(univ2PairInfo[pair].totalSupply.div(Math.pow(10, univ2PairInfo[pair].decimals)));
                    } else {
                        univ2PairInfo[pair].lpPrice = univ2PairInfo[pair].reserve1.div(Math.pow(10, 18)).times(2).div(univ2PairInfo[pair].totalSupply.div(Math.pow(10, univ2PairInfo[pair].decimals)));
                    }
                    console.log("pair=" + pair + ",lp price=" + univ2PairInfo[pair].lpPrice);
                    App.checkAllUni();
                });
            });
        });
    },
    checkAllUni: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (token != "usdt" && token != "hotpot") {
                if (univ2PairInfo[token].lpPrice == 0) {
                    return
                }
            }
        }
        App.calTokenPrice();
    },
    calTokenPrice: function () {
        console.log("calTokenPrice");
        var ethusdt = univ2PairInfo["eth/usdt"];
        var vEth = ethusdt.reserve0.div(Math.pow(10, 18));
        var vUsdt = ethusdt.reserve1.div(Math.pow(10, 6));
        if (testFlag) {
            vEth = ethusdt.reserve1.div(Math.pow(10, 18));
            vUsdt = ethusdt.reserve0.div(Math.pow(10, 6));
        }

        var priceEth = vUsdt.div(vEth);

        var hotpoteth = univ2PairInfo["hotpot/eth"];
        var vHot = hotpoteth.reserve0.div(Math.pow(10, 18));
        var vE = hotpoteth.reserve1.div(Math.pow(10, 18));

        var priceHot = vE.div(vHot).times(priceEth);
        console.log("eth price=" + priceEth + ",hot price=" + priceHot);
        //usdt
        stakeInfos["usdt"].price = 1;
        stakeInfos["hotpot"].price = priceHot;
        for (var i = 0; i < allPoolTokens.length; i++) {
            var name = allPoolTokens[i];
            if (name != "usdt" && name != "hotpot") {
                stakeInfos[name].price = univ2PairInfo[name].lpPrice.times(priceEth);
            }
            console.log("stake token price name:" + name + ",price=" + stakeInfos[name].price);
        }
        Stake.initStakePool();
    },
    getNFTMarket: function () {

    },
    getGacha: function () {

    },
    getLoan: function () {

    },
    getStakePools: function () {
        // allPoolTokens
        var count = allPoolTokens.length;
        for (var i = 0; i < count; i++) {
            var poolToken = allPoolTokens[i];
            var poolAddress = stakePoolAddress[poolToken];
            var lpAddress = stakeERCAddress[poolToken];
            stakeInfos[poolToken] = createToken(poolToken, lpAddress, poolAddress);
        }
    },

    getBalances: function () {
        console.log('Getting balances...'+getTime());
        App.contracts.HotPot = App.contracts.HotPot.at(contractAddress.hotpot);

        // call constant function
        App.contracts.HotPot.balanceOf(App.defaultAccount,function(e,result){
            balanceOfHotpot['total'] = new BigNumber(1000000*10**18);
            $('#mybalance').text(result.div( Math.pow(10, 18)));
            App.contracts.HotPot.allowance(App.defaultAccount, contractAddress.gacha,function(e,result){
                var allowance = result.c[0];
                if (allowance == 0) {

                } else {
                    $("#pull1").show();
                    $("#pull10").show();
                    $("#approve").hide();
                }
            });
            Stake.getAllPoolBalance();
        });

    },
    getNFTBalances: function () {
        console.log("getNFTBalances"+":"+getTime());
        // initiate contract for an address
        var myContractInstance = App.contracts.NFTHotPot.at(contractAddress.nft);

        // call constant function
        myContractInstance.balanceOf(App.defaultAccount,function(error,result){
            console.log("getNFTBalances balanceOf="+result+":"+getTime()) // '0x25434534534'
            $(".myticketbalance").text(result);
        });


        // App.contracts.NFTHotPot.at(contractAddress.nft)
        //     .then(function (instance) {
        //         App.contracts.NFTHotPot = instance;
        //         return instance.balanceOf(App.defaultAccount);
        //     }).then(function (result) {
        //         var b = result;
        //         console.log("myticketbalance=" + b+":"+getTime());
        //         $(".myticketbalance").text(b);
        //     });
            // .then(function (result) {
            //     var balance = result.c[0];
            //     console.log("nft balance=" + balance);
            //     $(".ticketbalance").text(balance);
            //     return App.contracts.NFTHotPot.totalSupply();
            // })
            // .then(function (result) {
            //     var total = result.c[0];
            //     console.log("nft total=" + total);
            //     $(".ticketbalance").text(total);
            //     return App.contracts.NFTHotPot.balanceOf(App.defaultAccount);
            // }).then(function (result) {
            //     var b = result.c[0];
            //     console.log("myticketbalance=" + b);
            //     $(".myticketbalance").text(b);
            // });
    },
    getReward: function () {
        console.log("getReward"+":"+getTime());
        var myContractInstance = App.contracts.Reward.at(contractAddress.reward);

        // call constant function
        myContractInstance.getBalance(function(error,result){
            console.log("reward balanceOf="+result+":"+getTime()) // '0x25434534534'
        });
        // App.contracts.Reward.at(contractAddress.reward)
        //     .then(function (instance) {
        //         App.contracts.Reward = instance;
        //         return instance.getBalance();
        //     })
        //     .then(function (result) {
        //         var b = result.c[0];
        //         console.log("reward balance=" + b+":"+getTime());
        //         $(".totalreward").text((b / Math.pow(10, 18)).toFixedSpecial(2) + ' HotPot');
        //     });
    },
};
var count = 0;
Stake = {
    getAllPoolBalance: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            Stake.getSinglePoolBalance(token);
        }
    },
    getSinglePoolBalance: function (name) {
        console.log("getSinglePoolBalance name="+name);
        var poolAddress = stakePoolAddress[name];
        App.contracts.HotPot.balanceOf(poolAddress,function(e,result){
                console.log("pool balance name=" + name + ",balance=" + result);
                balanceOfHotpot[name] = result;
                count++;
                if (count == 5) {
                    Stake.calTotalCirculation();
                }
        });
    },
    calTotalCirculation: function () {
        var total = balanceOfHotpot['total'];
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            total = total.minus(balanceOfHotpot[token]);
        }
        total = total.div(Math.pow(10, 18));
        console.log("calTotalCirculation=" + total);
        $("#totalcir").text(total);
    },

    generateUniFactory: function () {
        $.getJSON('contracts/UniswapFatory.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.UniFactory = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.UniFactory.setProvider(App.web3Provider);
            // App.contracts.Loan.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return Stake.generateUniHotpotPair();
        });
    },
    generateUniHotpotPair: function () {
        App.contracts.UniFactory.at(uniFactoryAddress)
            .then(function (instance) {
                return instance.createPair(stakeERCAddress['hotpot'], ethAddress)
            })
            .then(function (result) {
                console.log("createPair=" + result.c[0]);
                // stakeERCAddress['hotpot/eth'] = result.c[0];
            });
    },
    initpooldata: function (name) {
        $('.farmname').text(name + ' FARM');
        currentPagePoolID = name;

        let token = stakeInfos[name];
        var allowance = token.allowance;
        if (allowance > 0) {
            $('body').addClass('approved');
        }

        var stakeDecimals = token.decimals;
        let totalStake = token.poolTotalStake;
        // console.log("totalStake=" + totalStake);

        $('.totalstake').text((totalStake.div(Math.pow(10, stakeDecimals))));
        // pools[name].poolTotalStake = totalStake;

        let userStake = token.userStake;
        // console.log("userStake=" + userStake);
        $('.stakedbalance').text((userStake.div(Math.pow(10, stakeDecimals))));

        $('#stakeToken').text(name + " ");

        let earned = token.earned;
        earned = (earned / Math.pow(10, stakeInfos["hotpot"].decimals));
        $('.rewardbalance').text(earned);
    },
    initStakePool: function () {
        console.log("initStakePool");
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            Stake.initSinglePool(poolName);
        }
    },
    checkTotalStaked:function(){
        var totalPrice = 0;
        for(var i=0;i<allPoolTokens.length;i++){
            var poolName = allPoolTokens[i];
            var stake = stakeInfos[poolName].poolTotalStake;
            if(stake==0){
                return;
            }
            totalPrice =totalPrice.add(stake.div(Math.pow(10,stakeInfos[poolName].decimals)).mul(stakeInfos[poolName].price));
        }
        $("#totalstake").text(totalPrice);
    },
    initSinglePool: function (poolName) {
        var poolAddress = stakePoolAddress[poolName];
        console.log("poolname=" + poolName);
        stakeInfos[poolName].instance = App.contracts.StakePool.at(poolAddress);
        stakeInfos[poolName].instance.totalSupply(function(e,result){
            console.log("totalSupply pool="+poolName+",totalSupply:" + result);
            stakeInfos[poolName].poolTotalStake = result;
            stakeInfos[poolName].instance.balanceOf(App.defaultAccount,function(e,result){
                console.log("totalSupply pool="+poolName+",balanceOf:" + result);
                stakeInfos[poolName].userStake = result;
                stakeInfos[poolName].instance.earned(App.defaultAccount,function(e,result){
                    stakeInfos[poolName].userEarn = result;
                    stakeInfos[poolName].instance.rewardRate(function(e,result){
                        console.log("totalSupply pool="+poolName+",rewardRate:" + result);
                        stakeInfos[poolName].rewardRate = result;
                        Stake.updateAPY(poolName);
                        Stake.checkTotalStaked();
                    });
                });
            });
        });
    },
    updateAPY: function (name) {
        console.log("updateapy " + name);
        var hotpotDecimals = knownTokens["hotpot"].decimals;
        //池子每s产出wwt数量
        let rewardRate = stakeInfos[name].rewardRate.div(Math.pow(10, hotpotDecimals));
        rewardRate = rewardRate.div(Math.pow(10, hotpotDecimals));

        //每s能挖出的wwt总价格
        let rewardPrice = rewardRate * stakeInfos["hotpot"].price;

        //用来质押的代币
        let stakeToken = stakeInfos[name];
        let totalStake = stakeToken.poolTotalStake;

        let totalStakePrice = totalStake.div(Math.pow(10, stakeToken.decimals)).mul(stakeToken.price);

        console.log("updateapy token price=" + stakeToken.price);

        //每s，每u能产出的产率
        let aps = 1;
        if (totalStakePrice != 0)
            aps = rewardPrice / totalStakePrice;

        let apy = aps * 60 * 60 * 24 * 365;

        console.log("totalStakePrice=" + totalStakePrice + ",apy=" + apy);

        stakeToken.apy = apy;

        var apyStr = parseInt(apy) * 100 + ' %';
        if (totalStakePrice == 0) {
            apyStr = "Infinity %";
        }
        // "eth/usdt",
        // "uni/eth",
        // "hotpot",
        // "hotpot/eth",

        if (name == "eth/usdt") name = "ethusdt";
        if (name == "uni/eth") name = "unieth";
        if (name == "hotpot/eth") name = "hotpoteth";

        var apyp = ".poolyield" + name;
        // if (name === "WWT/TRX") {
        //     apyp = ".poolyieldWWTTRX";
        // }
        console.log("apy str=" + apyStr);
        $(apyp).animateNumbers(apyStr);

        $("#divloading").hide();
    }
}

Gacha = {
    pull: function () {
        console.log("pull");
        if (App.contracts.HotPot) {
            App.contracts.HotPot.allowance(App.defaultAccount, contractAddress.gacha)
                .then(function (result) {

                });
        } else {
            console.log("waiting for hotpot");
        }
    },
    pull10: function () {

    },
    approve: function () {
        App.contracts.HotPot.approve(contractAddress.gacha, web3.toHex(Math.pow(10, 30)))
            .then(function (result) {
                console.log("Value was set to", result.logs[0].args.val);
            });
    }
}

Market = {

}

Reward = {

}


function hidepages() {
    $('main').hide();
}

function recoveABottom() {
    document.getElementById("ahome").style.borderBottomColor = "transparent";
    document.getElementById("areward").style.borderBottomColor = "transparent";
    document.getElementById("afarms").style.borderBottomColor = "transparent";
    document.getElementById("aexchange").style.borderBottomColor = "transparent";
    document.getElementById("agacha").style.borderBottomColor = "transparent";
    document.getElementById("aabout").style.borderBottomColor = "transparent";
    document.getElementById("ame").style.borderBottomColor = "transparent";
}

window.nav = (classname) => {
    nav(classname);
}

function nav(classname) {
    hidepages();
    $('body').removeClass('approved');

    if (classname.indexOf('pool') === 0) {
        $('#singlepool').show();
        currentPagePoolID = classname.slice(4);
        Stake.initpooldata(currentPagePoolID);
        $('main.pool').show();
    } else {
        $('main.' + classname).show();
    }
    if (classname === "home") {
        $("#infodiv").show();
    } else {
        $("#infodiv").hide();
    }
    recoveABottom();

    if (classname == "home") {
        $("#ticketinfo").hide();
    } else {
        $("#ticketinfo").show();
    }
    if (classname.indexOf('pool') != 0) {
        let aa = "a" + classname;
        //border-bottom-color: rgba(255, 255, 255, .25);
        document.getElementById(aa).style.borderBottomColor = "rgba(255, 255, 255, .25)";
    }
}


Number.prototype.toFixedSpecial = function (n) {
    var str = this.toFixed(n);
    if (str.indexOf('e+') === -1) return str;

    str = str
        .replace('.', '')
        .split('e+')
        .reduce(function (p, b) {
            return p + Array(b - p.length + 2).join(0);
        });

    if (n > 0) str += '.' + Array(n + 1).join(0);

    return str;
};


$(function () {
    $(window).load(function () {
        App.init();
    });
});

function getTime(){
    return (new Date()).getTime();
}