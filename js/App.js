App = {
    web3Provider: null,
    defaultAccount: null,
    contracts: {},

    init: function () {
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
            setChainId(chainId);
        }
        return App.initWallet();
    },

    initWallet: async function () {
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
    },

    initContract: function () {
        $.getJSON('contracts/HotPot.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.HotPot = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.HotPot.setProvider(App.web3Provider);
            // App.contracts.HotPot.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getBalances();
        });

        $.getJSON('contracts/NFTokenHotPot.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.NFTHotPot = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.NFTHotPot.setProvider(App.web3Provider);
            // App.contracts.NFTHotPot.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getNFTBalances();
        });

        $.getJSON('contracts/Reward.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Reward = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Reward.setProvider(App.web3Provider);
            // App.contracts.Reward.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getReward();
        });

        $.getJSON('contracts/Gacha.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Gacha = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Gacha.setProvider(App.web3Provider);
            // App.contracts.Gacha.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getGacha();
        });

        $.getJSON('contracts/Loan.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Loan = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Loan.setProvider(App.web3Provider);
            // App.contracts.Loan.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getLoan();
        });

        $.getJSON('contracts/NFTMarket.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.NFTMarket = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.NFTMarket.setProvider(App.web3Provider);
            // App.contracts.NFTMarket.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getNFTMarket();
        });
        $.getJSON('contracts/StakePool.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.StakePool = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.StakePool.setProvider(App.web3Provider);
            // App.contracts.StakePool.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getStakePools();
        });

        $.getJSON('contracts/UniV2Pair.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.UniV2Pair = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.UniV2Pair.setProvider(App.web3Provider);
            // App.contracts.UniV2Pair.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getUniV2Pairs();
        });
    },
    getUniV2Pairs: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (token === "usdt" || token === "hotpot") {
                // getUniV2Token(token);
            } else {
                App.getUniV2Pair(token);
            }
            App.getStakeERCInfo(token);
        }
    },
    getStakeERCInfo: function (token) {
        App.contracts.HotPot.at(stakeERCAddress[token])
            .then(function (instance) {
                stakeERCContract[token] = instance;
                return instance.balanceOf(defaultAccount);
            })
            .then(function (result) {
                stakeInfos[token].userBalance = result;
                return stakeERCContract[token].decimals();
            })
            .then(function (result) {
                stakeInfos[token].decimals = result;
                return stakeERCContract[token].allowance(defaultAccount, stakePoolAddress[token]);
            })
            .then(function (result) {
                stakeInfos[token].allowance = result;
            });
    },
    getUniV2Pair: function (pair) {
        univ2PairInfo[pair] = createPairInfo(pair);
        App.contracts.UniV2Pair.at(univ2PairsAddress[pair])
            .then(function (instance) {
                univ2PairInfo[pair].contractInstance = instance;
                return instance.getReserves();
            })
            .then(function (result) {
                // console.log("price="+result.c[0]);
                var reserve0 = result[0];
                var reserve1 = result[1];

                univ2PairInfo[pair].reserve0 = reserve0;
                univ2PairInfo[pair].reserve1 = reserve1;

                return univ2PairInfo[pair].contractInstance.totalSupply();
            })
            .then(function (result) {
                univ2PairInfo[pair].totalSupply = result;
                if (pair === "eth/usdt") {
                    univ2PairInfo[pair].lpPrice = univ2PairInfo[pair].reserve0.times(2).div(univ2PairInfo[pair].totalSupply);
                } else {
                    univ2PairInfo[pair].lpPrice = univ2PairInfo[pair].reserve1.times(2).div(univ2PairInfo[pair].totalSupply);
                }
                console.log("pair=" + pair + ",lp price=" + univ2PairInfo[pair].lpPrice);
                return univ2PairInfo[pair].contractInstance.decimals();
            })
            .then(function (result) {
                univ2PairInfo[pair].decimals = result;
                App.checkAllUni();
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
        Stake.initStakePool();
    },
    calTokenPrice: function () {
        var ethusdt = univ2PairInfo["eth/usdt"];
        var vEth = ethusdt.reserve0;
        var vUsdt = ethusdt.reserve1;

        var priceEth = vUsdt.div(vEth);

        var hotpoteth = univ2PairInfo["hotpot/eth"];
        var vHot = hotpoteth.reserve0;
        var vE = hotpoteth.reserve1;

        var priceHot = vE.div(vHot).times(priceEth);

        //usdt
        stakeInfos["usdt"].price = 1;
        stakeInfos["hotpot"].price = priceHot;
        for (var i = 0; i < allPoolTokens.length; i++) {
            var name = allPoolTokens[i];
            if (name != "usdt" && name != "hotpot") {
                stakeInfos[name].price = univ2PairInfo[name].lpPrice.times(priceEth);
            }
        }
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

            //lp  --- uni/eth usdt/eth hotpot/eth
            //none lp --- usdt hotpot

            //1.get info of lp token

            //2.get info of lp stake pool

        }
    },

    getBalances: function () {
        console.log('Getting balances...');

        App.contracts.HotPot.at(contractAddress.hotpot)
            .then(function (instance) {
                App.contracts.HotPot = instance;
                console.log("get HotPot");
                return instance.decimals();
            })
            .then(function (result) {
                var decimals = result.c[0];
                console.log("decimals=" + decimals);
                return App.contracts.HotPot.balanceOf(App.defaultAccount);
            }).then(function (result) {
                balance = result.c[0];
                console.log("balance=" + balance);
                $('.balance').text((balance / Math.pow(10, 18)).toFixedSpecial(2) + ' HotPot');
                return App.contracts.HotPot.allowance(App.defaultAccount, contractAddress.gacha);
            }).then(function (result) {
                var allowance = result.c[0];
                console.log("allowance=" + allowance);
                if (allowance == 0) {

                } else {
                    $("#pull1").show();
                    $("#pull10").show();
                    $("#approve").hide();
                }
            });
    },
    getNFTBalances: function () {
        console.log("getNFTBalances");
        App.contracts.NFTHotPot.at(contractAddress.nft)
            .then(function (instance) {
                App.contracts.NFTHotPot = instance;
                return instance.balanceOf(App.defaultAccount);
            })
            .then(function (result) {
                var balance = result.c[0];
                console.log("nft balance=" + balance);
                $(".ticketbalance").text(balance);
                return App.contracts.NFTHotPot.totalSupply();
            })
            .then(function (result) {
                var total = result.c[0];
                console.log("nft total=" + total);
                $(".ticketbalance").text(total);
                return App.contracts.NFTHotPot.balanceOf(App.defaultAccount);
            }).then(function (result) {
                var b = result.c[0];
                console.log("myticketbalance=" + b);
                $(".myticketbalance").text(b);
            });
    },
    getReward: function () {
        console.log("getReward");
        App.contracts.Reward.at(contractAddress.reward)
            .then(function (instance) {
                App.contracts.Reward = instance;
                return instance.getBalance();
            })
            .then(function (result) {
                var b = result.c[0];
                console.log("balance=" + b);
                $(".totalreward").text((b / Math.pow(10, 18)).toFixedSpecial(2) + ' HotPot');
            });
    },
};

Stake = {
    initpooldata: function (name) {
        $('.farmname').text(pools[name].name + ' pool');
        currentPagePoolID = name;

        let token = stakeInfos[name];
        var allowance = token.allowance;
        if (allowance > 0) {
            $('body').addClass('approved');
        }

        var stakeDecimals = token.decimals;
        let totalStake = token.poolTotalStake;
        // console.log("totalStake=" + totalStake);
        $('.totalstake').text((totalStake / Math.pow(10, stakeDecimals)).toFixedSpecial(4));
        pools[name].poolTotalStake = totalStake;

        let userStake = token.userStake;
        // console.log("userStake=" + userStake);
        $('.stakedbalance').text((userStake / Math.pow(10, stakeDecimals)).toFixedSpecial(4));

        $('#stakeToken').text(name +" ");

        let earned = token.earned;
        earned = (earned / Math.pow(10, stakeInfos["hotpot"].decimals)).toFixedSpecial(4);
        $('.rewardbalance').text(earned);
    },
    initStakePool: function () {
        console.log("initStakePool");
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            var poolAddress = stakePoolAddress[poolName];
            App.contract.StakePool.at(poolAddress)
                .then(function (instance) {
                    stakeInfos[poolName].instance = instance;
                    return instance.totalSupply();
                })
                .then(function (result) {
                    stakeInfos[poolName].poolTotalStake = result;
                    return stakeInfos[poolName].instance.balanceOf(defaultAccount);
                })
                .then(function (result) {
                    stakeInfos[poolName].userStake = result;
                    return stakeInfos[poolName].instance.earned(defaultAccount);
                })
                .then(function (result) {
                    stakeInfos[poolName].userEarn = result;
                    return stakeInfos[poolName].instance.rewardRate();
                })
                .then(function (result) {
                    stakeInfos[poolName].rewardRate = result;
                });
        }
    },
    updateAPY: function (name) {
        // console.log("updateapy " + name + ",address=" + pools[name].poolAddress);
        var hotpotDecimals = stakeInfos["hotpot"].decimals;
        //池子每s产出wwt数量
        let rewardRate = stakeInfos[name].rewardRate();
        rewardRate = rewardRate.div(Math.pow(10, hotpotDecimals));

        //每s能挖出的wwt总价格
        let rewardPrice = rewardRate * stakeInfos["hotpot"].price;

        //用来质押的代币
        let stakeToken = stakeInfos[name];
        let totalStake = stakeToken.poolTotalStake;

        let totalStakePrice = totalStake / Math.pow(10, stakeToken.decimals) * stakeToken.price;

        // console.log("updateapy token price=" + stakeToken.price);

        //每s，每u能产出的产率
        let aps = 1;
        if (totalStakePrice != 0)
            aps = rewardPrice / totalStakePrice;

        let apy = aps * 60 * 60 * 24 * 365;

        // console.log("totalStakePrice="+totalStakePrice+",apy="+apy);

        stakeToken.apy = apy;

        var apyStr = parseInt(apy) * 100 + ' %';
        if (totalStakePrice == 0) {
            apyStr = "Infinity %";
        }

        var apyp = ".poolyield" + name;
        // if (name === "WWT/TRX") {
        //     apyp = ".poolyieldWWTTRX";
        // }
        // console.log("apy str="+apyStr);
        $(apyp).animateNumbers(apyStr);
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
    let aa = "a" + classname;
    //border-bottom-color: rgba(255, 255, 255, .25);
    document.getElementById(aa).style.borderBottomColor = "rgba(255, 255, 255, .25)";

    if (classname == "home") {
        $("#ticketinfo").hide();
    } else {
        $("#ticketinfo").show();
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