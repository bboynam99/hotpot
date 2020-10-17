const UNISWAP = require('@uniswap/sdk')
const Fetcher = UNISWAP.Fetcher;
const ChainId = UNISWAP.ChainId;
const Token = UNISWAP.Token;
const Route = UNISWAP.Route;
const WETH = UNISWAP.WETH;
const ethers = require('ethers');
var currentPagePoolID = "";
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
        // var filter = web3.eth.filter("pending");

        var options = {
            fromBlock: "latest",
            toBlock:"latest",
            address:contractAddress.gacha
        };
        var filter = web3.eth.filter(options);

        filter.watch(function (error, result) {
            if (!error)
                console.log("filter:"+result.transactionHash+",address="+result.address);
            else{
                console.log("filter error:"+error);
            }
        });

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
            console.log("s=" + s);
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
            return UserNFT.getNFTBalances();
        });

        $.getJSON('contracts/Reward.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.Reward = web3.eth.contract(data.abi);
            return App.getReward();
        });

        $.getJSON('contracts/Gacha.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            App.contracts.Gacha = web3.eth.contract(data.abi);
            return Gacha.getGacha();
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
            console.log("getUniV2Pairs " + token);
            if (token === "usdt" || token === "hotpot") {
                // getUniV2Token(token);
            } else {
                App.getUniV2Pair(token);
            }
            App.getStakeERCInfo(token);
        }
    },
    getStakeERCInfo: function (token) {
        if (stakeERCAddress[token] == null || stakeERCAddress[token] == "") {
            return;
        }
        stakeERCContract[token] = erc20Contract.at(stakeERCAddress[token]);
        console.log("getStakeERCInfo token=" + token);
        stakeERCContract[token].balanceOf(App.defaultAccount, function (e, result) {
            stakeInfos[token].userBalance = result;
            console.log("getStakeERCInfo balance=" + result + ",name=" + token);
            stakeERCContract[token].decimals(function (e, result) {
                stakeInfos[token].decimals = result;
                App.contracts.HotPot.allowance(App.defaultAccount, stakePoolAddress[token], function (e, result) {
                    console.log("getStakeERCInfo allowance=" + result + ",name=" + token);
                    stakeInfos[token].allowance = result;
                    if (currentPagePoolID != "") {
                        Stake.initpooldata(currentPagePoolID);
                    }
                });
            });
        });
    },
    getUniV2Pair: function (pair) {
        console.log("getUniV2Pair=" + pair);
        univ2PairInfo[pair] = createPairInfo(pair);
        if (stakeERCAddress[pair] == null || stakeERCAddress[pair] == "") {
            return;
        }
        univ2PairInfo[pair].contractInstance = App.contracts.UniV2Pair.at(stakeERCAddress[pair]);

        univ2PairInfo[pair].contractInstance.decimals(function (e, result) {
            console.log("getUniV2Pair decimals=" + result + ",name=" + pair);
            univ2PairInfo[pair].decimals = result;
            univ2PairInfo[pair].contractInstance.getReserves(function (e, result) {
                console.log("getUniV2Pair getReserves=" + result + ",name=" + pair);
                var reserve0 = result[0];
                var reserve1 = result[1];

                univ2PairInfo[pair].reserve0 = reserve0;
                univ2PairInfo[pair].reserve1 = reserve1;

                univ2PairInfo[pair].contractInstance.totalSupply(function (e, result) {
                    console.log("getUniV2Pair totalSupply=" + result + ",name=" + pair);
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
    getLoan: function () {

    },
    getStakePools: function () {
        // allPoolTokens
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolToken = allPoolTokens[i];
            var poolAddress = stakePoolAddress[poolToken];
            var lpAddress = stakeERCAddress[poolToken];
            stakeInfos[poolToken] = createToken(poolToken, lpAddress, poolAddress);
        }
    },
    checkApproval: function () {
        console.log("checkApproval");
        App.contracts.HotPot.allowance(App.defaultAccount, contractAddress.gacha, function (e, result) {
            var allowance = result.c[0];
            if (allowance == 0) {

            } else {
                $("#pull1").show();
                $("#pull10").show();
                $("#approvegacha").hide();
            }
        });
        if (currentPagePoolID != "") {
            var token = currentPagePoolID;
            App.contracts.HotPot.allowance(App.defaultAccount, stakePoolAddress[token], function (e, result) {
                console.log("getStakeERCInfo allowance=" + result + ",name=" + token);
                stakeInfos[token].allowance = result;
                if (currentPagePoolID != "") {
                    Stake.initpooldata(currentPagePoolID);
                }
            });
        }
    },
    getBalances: function () {
        console.log('Getting balances...' + getTime());
        App.contracts.HotPot = App.contracts.HotPot.at(contractAddress.hotpot);

        // watch for an event with {some: 'args'}
        App.contracts.HotPot.Approval({ owner: App.defaultAccount }, function (error, result) {
            if (!error) {
                // toastAlert("Approve success!");
                console.log("approval "+result);
                hideTopMsg();
                App.checkApproval();
            }
        });

        // call constant function
        App.contracts.HotPot.balanceOf(App.defaultAccount, function (e, result) {
            balanceOfHotpot['total'] = new BigNumber(1000000 * 10 ** 18);
            $('.mybalance').text((result.div(Math.pow(10, 18)).toFixed(2)));
            App.contracts.HotPot.allowance(App.defaultAccount, contractAddress.gacha, function (e, result) {
                var allowance = result.c[0];
                if (allowance == 0) {

                } else {
                    $("#pull1").show();
                    $("#pull10").show();
                    $("#approvegacha").hide();
                }
            });
            Stake.getAllPoolBalance();
        });

    },

    getReward: function () {
        console.log("getReward" + ":" + getTime());
        App.contracts.Reward = App.contracts.Reward.at(contractAddress.reward);

        // call constant function
        App.contracts.Reward.getBalance(function (error, result) {
            console.log("reward balanceOf=" + result + ":" + getTime()) // '0x25434534534'
            var total = (result.div(Math.pow(10, 18))).toFixed(2);
            $(".totalreward").text(total + " HotPot");
        });
    },
};
var count = 0;
Stake = {
    approve: function () {
        console.log("stake approve:" + currentPagePoolID);
        if (currentPagePoolID != "") {
            App.contracts.HotPot.approve(stakePoolAddress[currentPagePoolID], web3.toHex(Math.pow(10, 30)), function (e, result) {
                if (e) {
                    console.log("stake approve error " + e);
                } else {
                    var url = "https://etherscan.io/tx/" + result;
                    if (ETHENV.chainId == '0x1') {
                        url = "https://etherscan.io/tx/" + result;
                    } else if (ETHENV.chainId == '0x3') {
                        url = "https://ropsten.etherscan.io/tx/" + result;
                    }
                    showTopMsg("Pending...", 0, url);
                }
            });
        }
    },
    //currentPagePoolID
    claimFree: function () {

    },
    claimNFT: function () {
        if (UserNFT.nftIds.length == 0) {
            //$.i18n.map[i]
            toastAlert($.i18n.map['nocard']);
        } else {
            showTable(true);
        }
    },
    stake: function () {
        console.log("stake");
        if (stakeInfos[currentPagePoolID].userBalance == 0) {
            toastAlert(getString('noenoughstake'));
            return;
        }
        document.getElementById("popTitle").innerHTML = "Stake";
        var userBalance = (stakeInfos[currentPagePoolID].userBalance / Math.pow(10, stakeInfos[currentPagePoolID].decimals)).toFixed(4);
        $('#maxAvaliable').text(userBalance);
        document.getElementById('stakeInput').value = 0;
        $("#withdrawdiv").hide();
        $("#stakediv").show();
        showAlert();
    },

    maxStake: function () {
        var max = $('#maxAvaliable').text();
        // console.log("maxStake=" + max);
        document.getElementById('stakeInput').value = max
    },
    stakeSure: function () {
        hideAlert();
        var token = stakeInfos[currentPagePoolID];
        if (token && token.poolAddress) {
            var stake = parseFloat(document.getElementById('stakeInput').value);
            if (stake <= 0) {
                toastAlert(getString('stakecannotbezero'));
                return;
            }
            token.instance.Staked({ user: App.defaultAccount }, function (err, result) {
                if (err) {
                    return console.error('Error with stake:', err);
                }
                if (result) {
                    // console.log('eventResult:', eventResult);
                    toastAlert("Stake success!");
                    initpooldata(currentPagePoolID);
                }
            });
            var hex = web3.toHex(stake * Math.pow(10, token.decimals));
            token.instance.stake(hex, function (e, result) {
                if (e) {

                    return console.error('Error with stake:', e);
                }
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            });
        }

    },

    withdraw: function () {

    },
    getAllPoolBalance: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            Stake.getSinglePoolBalance(token);
        }
    },
    getSinglePoolBalance: function (name) {
        console.log("getSinglePoolBalance name=" + name);
        var poolAddress = stakePoolAddress[name];
        App.contracts.HotPot.balanceOf(poolAddress, function (e, result) {
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
    checkTotalStaked: function () {
        var totalPrice = 0;
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            var stake = stakeInfos[poolName].poolTotalStake;
            if (stake == 0) {
                return;
            }
            totalPrice = totalPrice.add(stake.div(Math.pow(10, stakeInfos[poolName].decimals)).mul(stakeInfos[poolName].price));
        }
        $("#totalstake").text(totalPrice);
    },
    initSinglePool: function (poolName) {
        var poolAddress = stakePoolAddress[poolName];
        console.log("poolname=" + poolName);
        stakeInfos[poolName].instance = App.contracts.StakePool.at(poolAddress);
        stakeInfos[poolName].instance.totalSupply(function (e, result) {
            console.log("totalSupply pool=" + poolName + ",totalSupply:" + result);
            stakeInfos[poolName].poolTotalStake = result;
            stakeInfos[poolName].instance.balanceOf(App.defaultAccount, function (e, result) {
                console.log("totalSupply pool=" + poolName + ",balanceOf:" + result);
                stakeInfos[poolName].userStake = result;
                stakeInfos[poolName].instance.earned(App.defaultAccount, function (e, result) {
                    stakeInfos[poolName].userEarn = result;
                    stakeInfos[poolName].instance.rewardRate(function (e, result) {
                        console.log("totalSupply pool=" + poolName + ",rewardRate:" + result);
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
    getGacha: function () {
        App.contracts.Gacha = App.contracts.Gacha.at(contractAddress.gacha);
        App.contracts.Gacha.GachaTicket(function (error, result) {
            if (error) { console.log("GachaTicket error " + error); }
            else {
                console.log("GachaTicket " + result);
                $("#globalmsg").show();
                //https://ropsten.etherscan.io/tx/0x1db5cc2d53ec1961c5df1331a034821bc888ac19eca86fe6a103f9973e6ec18c
                var url = "https://etherscan.io/tx/" + result.transactionHash;
                if (ETHENV.chainId == '0x1') {
                    url = "https://etherscan.io/tx/" + result.transactionHash;
                } else if (ETHENV.chainId == '0x3') {
                    url = "https://ropsten.etherscan.io/tx/" + result.transactionHash;
                }
                $("#globalmsg").attr("href", url);
                $("#gachauser").text(result.args._owner);
                setTimeout(function () {
                    $("#globalmsg").hide();
                }, 5000);

                if (result.args._owner == App.defaultAccount) {
                    hideTopMsg();
                }
            }
        });
        console.log("getGacha");
        App.contracts.Gacha.GachaNothing(function (e, result) {
            if (e) {
                console.log("GachaTicket error " + e);
            } else {
                console.log("GachaNothing " + result);
                showTopMsg("没有抽中。", 5000);
            }
        });
    },
    pull: function () {
        console.log("pull");

        App.contracts.Gacha.pull({ gas: 200000 },function (e, result) {
            if (e) {
                console.log("pull error:" + e);
            } else {
                console.log("pull " + result);
                //https://ropsten.etherscan.io/tx/0x1db5cc2d53ec1961c5df1331a034821bc888ac19eca86fe6a103f9973e6ec18c
                var url = "https://etherscan.io/tx/" + result;
                if (ETHENV.chainId == '0x1') {
                    url = "https://etherscan.io/tx/" + result;
                } else if (ETHENV.chainId == '0x3') {
                    url = "https://ropsten.etherscan.io/tx/" + result;
                }
                showTopMsg("Pending...", 0, url);
                startListenTX(result);
            }
        });
    },
    pull10: function () {
        console.log("pull10");

        App.contracts.Gacha.pull10({ gas: 1200000 }, function (e, result) {
            if (e) {
                console.log("pull 10 error:" + e);
            } else {
                console.log("pull 10:" + result);
                //https://ropsten.etherscan.io/tx/0x1db5cc2d53ec1961c5df1331a034821bc888ac19eca86fe6a103f9973e6ec18c
                var url = "https://etherscan.io/tx/" + result;
                if (ETHENV.chainId == '0x1') {
                    url = "https://etherscan.io/tx/" + result;
                } else if (ETHENV.chainId == '0x3') {
                    url = "https://ropsten.etherscan.io/tx/" + result;
                }
                showTopMsg("Pending...", 0, url);
                startListenTX(result);
            }
        });
    },
    approve: function () {
        App.contracts.HotPot.approve(contractAddress.gacha, web3.toHex(Math.pow(10, 30)), function (e, result) {
            if (e) {
                console.log("Gacha approve error " + e);
            } else {
                var url = "https://etherscan.io/tx/" + result;
                if (ETHENV.chainId == '0x1') {
                    url = "https://etherscan.io/tx/" + result;
                } else if (ETHENV.chainId == '0x3') {
                    url = "https://ropsten.etherscan.io/tx/" + result;
                }
                showTopMsg("Pending...", 0, url);
            }
        });
    }
}

Market = {

}

Reward = {
    gotoPage: function () {
        console.log("Reward gotoPage");
    },
    claim: function () {
        if (UserNFT.nftIds.length == 0) {
            //$.i18n.map[i]
            toastAlert($.i18n.map['nocard']);
        } else {
            showTable(true);
        }
    }
}

UserNFT = {
    nftIds: Array(),
    nftInfos: {},
    userBalance: 0,
    getNFTBalances: function () {
        console.log("getNFTBalances" + ":" + getTime());
        // initiate contract for an address
        App.contracts.NFTHotPot = App.contracts.NFTHotPot.at(contractAddress.nft);

        App.contracts.NFTHotPot.totalSupply(function (e, result) {
            $(".ticketbalance").text(result);
        });

        // call constant function
        App.contracts.NFTHotPot.balanceOf(App.defaultAccount, function (error, result) {
            console.log("getNFTBalances balanceOf=" + result + ":" + getTime()) // '0x25434534534'
            userBalance = result;
            $(".myticketbalance").text(result);
            for (var i = 0; i < result; i++) {
                App.contracts.NFTHotPot.tokenOfOwnerByIndex(App.defaultAccount, i, function (e, result) {
                    console.log("tokenOfOwnerByIndex id=" + result);
                    UserNFT.nftIds.push(result);
                    var nft = UserNFT.createNFTInfo(result, App.defaultAccount);
                    UserNFT.nftInfos[result] = nft;
                    UserNFT.getNFTInfo(result);
                    // UserNFT.getUseTime(result);
                });
            }
        });
    },
    createNFTInfo: function (id, owner) {
        var nft = new Object;
        nft.id = id;
        nft.grade = 0;
        nft.owner = owner;
        nft.usetime = 0;
        return nft;
    },
    getNFTInfo: function (id) {
        App.contracts.NFTHotPot.getGrade(id, function (e, result) {
            console.log("get grade id=" + id + ",grade=" + result);
            UserNFT.nftInfos[id].grade = result;
            if (result == 1) {
                $("#grade1num").text(parseInt($("#grade1num").text()) + 1);
            } else if (result == 2) {
                $("#grade2num").text(parseInt($("#grade2num").text()) + 1);
            } else if (result == 3) {
                $("#grade3num").text(parseInt($("#grade3num").text()) + 1);
            }
            UserNFT.getUseTime(id);
        });
    },
    getUseTime: function (id) {
        App.contracts.NFTHotPot.getUseTime(id, function (e, result) {
            console.log("get use time id=" + id + ",time=" + result);
            UserNFT.nftInfos[id].usetime = result;
            var endTime = result + 86400;
            var now = (new Date()).getTime() / 1000;
            var grade = UserNFT.nftInfos[id].grade;
            //it is not available now
            if (endTime > now) {

            } else {
                if (grade == 1) {
                    $("#grade1unuse").text(parseInt($("#grade1unuse").text()) + 1);
                } else if (grade == 2) {
                    $("#grade2unuse").text(parseInt($("#grade2unuse").text()) + 1);
                } else if (grade == 3) {
                    $("#grade3unuse").text(parseInt($("#grade3unuse").text()) + 1);
                }
            }

        });
    },
    initNFTTable: function () {

    }
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
    currentPagePoolID = "";
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

    showTable(false);
    if (classname === "reward") {
        Reward.gotoPage();
    } else if (classname === "me") {
        showTable(true);
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

function getTime() {
    return (new Date()).getTime();
}

function showTopMsg(msg, showTime, url) {
    $("#toprightmsg").text(msg);
    $("#toprightmsg").show();
    $("#toprightmsg").attr("href", url);
    if (showTime > 0) {
        setTimeout(function () {
            hideTopMsg();
        }, showTime);
    }
}

function hideTopMsg() {
    $("#toprightmsg").hide();
}

function toastAlert(msg) {
    console.log("toastAlert:" + msg);
    document.getElementById('alertdiv').style.display = 'block';
    document.getElementById('alertdiv').innerHTML = msg;
    setTimeout(function () {
        document.getElementById('alertdiv').style.display = 'none';
    }, 3000);
}

window.showTable = (flag) => {
    if (flag) {
        $(".pricingTable").show();
        // black_overlay
    } else {
        $(".pricingTable").hide();
    }
}


function showAlert() {
    document.getElementById('light').style.display = 'block';
    document.getElementById('fade').style.display = 'block';
}

function hideAlert() {
    document.getElementById('light').style.display = 'none';
    document.getElementById('fade').style.display = 'none';
}

function getString(id) {
    return $.i18n.map[id];
}

function getEthersanUrl(tx) {
    var url = "https://etherscan.io/tx/" + tx;
    if (ETHENV.chainId == '0x1') {
        url = "https://etherscan.io/tx/" + tx;
    } else if (ETHENV.chainId == '0x3') {
        url = "https://ropsten.etherscan.io/tx/" + tx;
    }
    return url;
}

function startListenTX(tx){
    console.log("startListenTX");
    var internal = setInterval(function(){
        web3.eth.getTransactionReceipt(tx, function(e,result){
            if(e){
                console.log("tx error:"+e);
            }else{
                console.log("tx result:"+result);
            }
            if(result)
            {
                clearInterval(internal);
                console.log("getTransactionReceipt ");
                hideTopMsg();
                if(result.status == '0x0'){
                    showTopMsg(getString('txfail'),5000,getEthersanUrl(result.transactionHash));
                    // toastAlert(getString('txfail'));
                }
                
            }
        });
    },3000);

}