const UNISWAP = require('@uniswap/sdk')
console.log(`The chainId of mainnet is ${UNISWAP.ChainId.MAINNET}.`)
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
            App.contracts.HotPot.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getBalances();
        });

        $.getJSON('contracts/NFTokenHotPot.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.NFTHotPot = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.NFTHotPot.setProvider(App.web3Provider);
            App.contracts.NFTHotPot.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getNFTBalances();
        });

        $.getJSON('contracts/Reward.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Reward = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Reward.setProvider(App.web3Provider);
            App.contracts.Reward.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getReward();
        });

        $.getJSON('contracts/Gacha.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Gacha = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Gacha.setProvider(App.web3Provider);
            App.contracts.Gacha.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getGacha();
        });

        $.getJSON('contracts/Loan.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.Loan = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.Loan.setProvider(App.web3Provider);
            App.contracts.Loan.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getLoan();
        });

        $.getJSON('contracts/NFTMarket.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.NFTMarket = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.NFTMarket.setProvider(App.web3Provider);
            App.contracts.NFTMarket.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getNFTMarket();
        });
        $.getJSON('contracts/StakePool.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            var TutorialTokenArtifact = data;
            App.contracts.StakePool = TruffleContract(TutorialTokenArtifact);

            // Set the provider for our contract.
            App.contracts.StakePool.setProvider(App.web3Provider);
            App.contracts.StakePool.numberFormat = "BigNumber";
            // Use our contract to retieve and mark the adopted pets.
            return App.getStakePools();
        });

        
    },
    getNFTMarket: function () {

    },
    getGacha: function () {

    },
    getLoan: function () {

    },
    getStakePools: function () {
        // allTokens
        var count = allTokens.length;
        for(var i=0;i<count;i++){
            var lpName = allTokens[i];
            var poolAddress = stakePoolAddress[lpName];
            var lpAddress = stakeERCAddress[lpName];
            stakeInfos[lpName] = createToken(lpName, lpAddress, poolAddress);

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
        console.log("initpooldata:" + name);
        async function triggercontract() {
            var c = await window.tronWeb.contract().at(tokenAddress);
            $('.farmname').text(pools[name].name + ' pool');
            currentPagePoolID = name;

            if (name === "WWT/TRX") {
                if (pools[name].address.length == 0) {
                    return;
                }
                //这是lp token，需要单独处理
                //checkAllowance(userAddress, contractAddress)
                var allowance = await mm_tron.allowance(walletAddress, pools[name].address, pools[name].poolAddress);
                // console.log("allowance=" + allowance);
                if (allowance > 0) {
                    $('body').addClass('approved');
                }
                let lpDecimals = await mm_tron.decimals(pools[name].address);
                // console.log("lpDecimals=" + lpDecimals);
                let lpBalance = await mm_tron.balanceOf(walletAddress, pools[name].address);
                pools[name].userBalance = lpBalance;
                pools[name].decimals = lpDecimals;
            } else {
                var token = pools[name];
                let tokenContract = await window.tronWeb.contract().at(token.address);
                var allowance = await tokenContract.allowance(walletAddress, pools[name].poolAddress).call();
                // console.log("allowance=" + allowance);
                if (name == "USDT") {
                    allowance = allowance.remaining;
                }
                var rallowance = window.tronWeb.toDecimal(allowance);
                if (rallowance > 0) {
                    $('body').addClass('approved');
                }
                let b = await tokenContract.balanceOf(walletAddress).call();
                pools[name].userBalance = b;
            }

            var stakeDecimals = pools[name].decimals;
            let poolContract = await window.tronWeb.contract().at(pools[name].poolAddress);
            let totalStake = await poolContract.totalSupply().call();
            // console.log("totalStake=" + totalStake);
            $('.totalstake').text((totalStake / Math.pow(10, stakeDecimals)).toFixedSpecial(4) + " " + pools[currentPagePoolID].name);
            pools[name].poolTotalStake = totalStake;

            let userStake = await poolContract.balanceOf(walletAddress).call();
            // console.log("userStake=" + userStake);
            pools[name].userStake = userStake;
            $('.stakedbalance').text((userStake / Math.pow(10, stakeDecimals)).toFixedSpecial(4) + " " + pools[currentPagePoolID].name);

            $('#stakeToken').text(pools[name].name + " ");

            let earned = await poolContract.earned(walletAddress).call();
            pools[name].userEarn = earned;
            earned = (earned / Math.pow(10, wwtDecimals)).toFixedSpecial(4);
            $('.rewardbalance').text(earned);
        }
        triggercontract();
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
        // updateAllTokens();
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