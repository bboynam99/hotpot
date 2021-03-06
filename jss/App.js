const WalletConnectProvider = require("@walletconnect/web3-provider").default;
const Web3 = require('web3');

App = {
    web3Provider: null,
    erc20ABI: null,
    uniV2PairABI: null,
    enableWalletConnect: false,
    init: function () {
        return App.initWeb3();
    },
    connectMetamask: function () {
        if (typeof window.ethereum != 'undefined') {
            App.initWeb3();
        } else {
            toastAlert(getString('nometamask'));
        }
    },
    connectWallet: async function () {
        if (!App.enableWalletConnect) {
            toastAlert(getString('comingsoon'));
            return;
        }
        //  Create WalletConnect Provider
        const provider = new WalletConnectProvider({
            infuraId: "3c4e7e3302614427bd0afc40b7e332db" // Required
        });
        // Subscribe to accounts change
        provider.on("accountsChanged", (accounts) => {
            if (printLog) console.log(accounts);
            // window.location.reload();
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            if (printLog) console.log(chainId);
            // window.location.reload();
        });

        // Subscribe to session connection
        provider.on("connect", () => {
            if (printLog) console.log("connect");
        });

        // Subscribe to session disconnection
        provider.on("disconnect", (code, reason) => {
            if (printLog) console.log(code, reason);
            // window.location.reload();
        });
        //  Enable session (triggers QR Code modal)
        await provider.enable();
        //  Create Web3
        // web3 = new Web3(provider);
        web3 = new Web3(provider);

        if (web3 == null) {
            toastAlert(getString('noconnectwallet'));
            return;
        }

        if (web3 != null) {
            $('body').addClass('web3');
        }
        //  Get Accounts
        const accounts = provider.accounts;

        //  Get Chain Id
        const chainId = provider.chainId;
        var chain = ChainId[0];

        if (chainId == 1) {
            chain = ChainId[0];
        } else if (chainId == 3) {
            chain = ChainId[1];
        } else if (chainId == 4) {
            chain = ChainId[2];
        }
        ETHENV.init(chain);
        if (printLog) console.log("account=" + accounts[0]);
        // await provider.disconnect();

        // if(printLog)console.log("address Yes:" + window.tronWeb.defaultAddress.base58)
        defaultAccount = accounts[0];
        if (printLog) console.log("chainid=" + chainId + ",account=" + defaultAccount);
        return App.initContract();
    },
    initWeb3: function () {
        // Initialize web3 and set the provider to the testRPC.
        if (typeof window.ethereum != 'undefined') {
            if (printLog) console.log("Metamask is installed!");
            App.web3Provider = window.ethereum;
            web3 = new Web3(window.ethereum);
            window.ethereum.on('accountsChanged', (accounts) => {
                // Handle the new accounts, or lack thereof.
                // "accounts" will always be an array, but it can be empty.
                if (printLog) console.log("accountsChanged");
                window.location.reload();
            });

            window.ethereum.on('chainChanged', (chainId) => {
                // Handle the new chain.
                // Correctly handling chain changes can be complicated.
                // We recommend reloading the page unless you have a very good reason not to.
                if (printLog) console.log("chainChanged");
                window.location.reload();
            });
            if (printLog) console.log("chainid=" + window.ethereum.chainId);
            var chainId = window.ethereum.chainId;
            ////chainId === "0x1" main, chainId === "0x3" ropsten, chainId === "0x4" rinkey
            var chain = ChainId[0];
            if (chainId === '0x1') {
                chain = ChainId[0];
            } else if (chainId === '0x3') {
                chain = ChainId[1];
            } else if (chainId === '0x4') {
                chain = ChainId[2];
            }
            ETHENV.init(chain);
            return App.initWallet();
        } else {
            if (App.enableWalletConnect)
                App.connectWallet();
        }
    },

    initWallet: async function () {
        if (printLog) console.log("initWallet");
        if (web3 != null) {
            $('body').addClass('web3');
        }
        var v = web3.version;
        if (printLog) console.log("web3 version=" + v);
        let accounts = await ethereum.request(
            {
                method: 'eth_requestAccounts'
            }
        );
        if (printLog) console.log("account=" + accounts[0]);
        defaultAccount = web3.utils.toChecksumAddress(accounts[0]);
        return App.initContract();
    },
    initContract: function () {
        $("#divloading").show();
        $.getJSON('contracts/StakePool.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            if (printLog) console.log("StakePool create");
            // contractsInstance.StakePool = new web3.eth.Contract(data.abi);
            contractABI['stakepool'] = data.abi;
            return App.getStakePools();
        });
        $.getJSON('contracts/HotPot.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            contractsInstance.HotPot = new web3.eth.Contract(data.abi, contractAddress.hotpot);
            erc20ABI = data.abi;
            // erc20Contract = new web3.eth.Contract(data.abi,contractAddress.hotpot);
            // contractsInstance.HotPot = contractsInstance.HotPot.at(contractAddress.hotpot);

            $.getJSON('contracts/Loan.json', function (data) {
                // Get the necessary contract artifact file and instantiate it with truffle-contract.
                contractsInstance.Loan = new web3.eth.Contract(data.abi, contractAddress['loan']);
                // contractsInstance.Loan = contractsInstance.Loan.at(contractAddress['loan']);

                $.getJSON('contracts/NFTokenHotPot.json', function (data) {
                    contractsInstance.NFTHotPot = new web3.eth.Contract(data.abi, contractAddress.nft);
                    // contractsInstance.NFTHotPot = contractsInstance.NFTHotPot.at(contractAddress.nft);
                    return UserNFT.getNFTBalances();
                });
                return Loan.getLoan();
            });
            return App.getBalances();
        });

        $.getJSON('contracts/Reward.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            contractsInstance.Reward = new web3.eth.Contract(data.abi, contractAddress.reward);
            // contractsInstance.Reward = contractsInstance.Reward.at(contractAddress.reward);
            return Reward.getRewardInfo();
        });

        $.getJSON('contracts/Gacha.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            contractsInstance.Gacha = new web3.eth.Contract(data.abi, contractAddress.gacha);
            // contractsInstance.Gacha = contractsInstance.Gacha.at(contractAddress.gacha);
            return Gacha.getGacha();
        });


        $.getJSON('contracts/NFTMarket.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            contractsInstance.NFTMarket = new web3.eth.Contract(data.abi, contractAddress['market']);
            // contractsInstance.NFTMarket = contractsInstance.NFTMarket.at(contractAddress['market']);
            return Market.initMarketInfo();
        });

        $.getJSON('contracts/Invite.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            contractsInstance.Invite = new web3.eth.Contract(data.abi, contractAddress['invite']);
            // contractsInstance.Invite = contractsInstance.Invite.at(contractAddress['invite']);
            return Invite.initInviteInfo();
        });
    },
    getUniV2Pairs: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (printLog) console.log("getUniV2Pairs " + token);
            if (token == 'eth/usdt' || token == "hotpot/eth" || token == "wbtc/eth") {
                App.getUniV2Pair(token);
            }
            if (token != "wbtc/eth")
                App.getStakeERCInfo(token);
        }
    },
    getStakeERCInfo: function (token) {
        if (stakeERCAddress[token] == null || stakeERCAddress[token] == "") {
            return;
        }
        stakeERCContract[token] = new web3.eth.Contract(erc20ABI, stakeERCAddress[token]);
        if (printLog) console.log("getStakeERCInfo token=" + token);
        stakeERCContract[token].methods.balanceOf(defaultAccount).call(function (e, result) {
            stakeInfos[token].userBalance = new BigNumber(result);
            if (printLog) console.log("getStakeERCInfo balance=" + result + ",name=" + token);
            stakeERCContract[token].methods.decimals().call(function (e, result) {
                stakeInfos[token].decimals = parseInt(result);
                stakeERCContract[token].methods.allowance(defaultAccount, stakePoolAddress[token]).call(function (e, result) {
                    if (printLog) console.log("getStakeERCInfo allowance=" + result + ",name=" + token);
                    stakeInfos[token].allowance = new BigNumber(result);
                    if (currentPagePoolID != "") {
                        Stake.initpooldata(currentPagePoolID);
                    }
                });
            });
        });

        // watch for an event with {some: 'args'}
        stakeERCContract[token].events.Approval({ filter: { owner: defaultAccount } }, function (error, result) {
            if (!error) {
                if (result.returnValues.owner != defaultAccount) {
                    return;
                }
                if (checkSameEvent(result)) {
                    return;
                }

                result.returnValues.value = new BigNumber(result.returnValues.value);
                if (result.returnValues.value.lt(new BigNumber(10 ** 30))) {
                    if (printLog) console.log("stakeERCContract Approval less");
                    return;
                }

                if (printLog) console.log(token + ":approval " + result.returnValues);
                hideTopMsg();

                stakeInfos[token].allowance = result.returnValues.value;
                if (currentPagePoolID != "") {
                    Stake.initpooldata(currentPagePoolID);
                }
                var spender = result.returnValues.spender.toLowerCase();
                var gacha = contractAddress.gacha.toLowerCase();
                if (spender == gacha) {
                    $("#pull1").show();
                    $("#pull10").show();
                    $("#approvegacha").hide();
                }
            }
        });
    },
    updateUserBalance: function () {
        var b = (defaultBalance.div(Math.pow(10, 18)).toFixed(2));
        if (printLog) console.log("updateUserBalance " + b);
        $('.mybalance').text(b);
    },
    getUniV2Pair: function (pair) {
        if (printLog) console.log("getUniV2Pair=" + pair);
        univ2PairInfo[pair] = createPairInfo(pair);
        if (stakeERCAddress[pair] == null || stakeERCAddress[pair] == "") {
            return;
        }
        univ2PairInfo[pair].contractInstance = new web3.eth.Contract(App.uniV2PairABI, stakeERCAddress[pair]);
        univ2PairInfo[pair].contractInstance.methods.token0().call(function (e, r) {
            univ2PairInfo[pair].token0 = r;
            if (printLog) console.log("getUniV2Pair pair=" + pair + ", token0=" + r);
        });
        univ2PairInfo[pair].contractInstance.methods.token1().call(function (e, r) {
            univ2PairInfo[pair].token1 = r;
            if (printLog) console.log("getUniV2Pair pair=" + pair + ",token1=" + r);
        });
        univ2PairInfo[pair].contractInstance.methods.decimals().call(function (e, result) {
            if (printLog) console.log("getUniV2Pair decimals=" + result + ",name=" + pair);
            univ2PairInfo[pair].decimals = parseInt(result);
            univ2PairInfo[pair].contractInstance.methods.getReserves().call(function (e, result) {
                if (printLog) console.log("getUniV2Pair getReserves=" + result + ",name=" + pair);
                var reserve0 = new BigNumber(result[0]);
                var reserve1 = new BigNumber(result[1]);
                if (reserve0 == 0) {
                    reserve0 = reserve0.plus(1);
                }
                if (reserve1 == 0) {
                    reserve1 = reserve1.plus(1);
                }
                univ2PairInfo[pair].reserve0 = reserve0;
                univ2PairInfo[pair].reserve1 = reserve1;

                univ2PairInfo[pair].contractInstance.methods.totalSupply().call(function (e, result) {
                    if (printLog) console.log("getUniV2Pair totalSupply=" + result + ",name=" + pair);
                    result = new BigNumber(result);
                    if (result == 0) {
                        result = result.plus(1);
                    }
                    univ2PairInfo[pair].totalSupply = result;
                    univ2PairInfo[pair].lpPrice = univ2PairInfo[pair].reserve1.div(Math.pow(10, 18)).times(2).div(univ2PairInfo[pair].totalSupply.div(Math.pow(10, univ2PairInfo[pair].decimals)));
                    if (printLog) console.log("pair=" + pair + ",lp price=" + univ2PairInfo[pair].lpPrice);
                    App.checkAllUni();
                });
            });
        });
    },
    checkAllUni: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (token == 'eth/usdt' || token == "hotpot/eth" || token == "wbtc/eth") {
                if (univ2PairInfo[token].lpPrice == 0) {
                    return
                }
            }
        }
        App.calTokenPrice();
    },
    calTokenPrice: function () {
        if (printLog) console.log("calTokenPrice");
        var ethusdt = univ2PairInfo["eth/usdt"];
        var vEth = ethusdt.reserve0.div(Math.pow(10, 18));
        var vUsdt = ethusdt.reserve1.div(Math.pow(10, 6));
        if (ETHENV.chainId == ChainId[1] || ETHENV.chainId == ChainId[2]) {
            vEth = ethusdt.reserve1.div(Math.pow(10, 18));
            vUsdt = ethusdt.reserve0.div(Math.pow(10, 6));
        }

        var priceEth = vUsdt.div(vEth);
        if (printLog) console.log("calTokenPrice price eth=" + priceEth);


        var hotpoteth = univ2PairInfo["hotpot/eth"];
        var vHot = hotpoteth.reserve0.div(Math.pow(10, 18));
        var vE = hotpoteth.reserve1.div(Math.pow(10, 18));

        var priceHot = vE.div(vHot).times(priceEth);
        if (printLog) console.log("calTokenPrice eth price=" + priceEth + ",hot price=" + priceHot);


        var btceth = univ2PairInfo["wbtc/eth"];
        var vbtc = btceth.reserve0.div(Math.pow(10, 8));
        var vE2 = btceth.reserve1.div(Math.pow(10, 18));

        var pricebtc = vE2.div(vbtc).times(priceEth);
        if (printLog) console.log("calTokenPrice eth price=" + priceEth + ",btc price=" + pricebtc);

        //usdt
        stakeInfos["usdt"].price = 1;
        stakeInfos["usdc"].price = 1;
        stakeInfos["hotpot"].price = priceHot;
        stakeInfos['wbtc'].price = pricebtc;

        for (var i = 0; i < allPoolTokens.length; i++) {
            var name = allPoolTokens[i];
            if (name == 'eth/usdt' || name == "hotpot/eth" || name == "wbtc/eth") {
                stakeInfos[name].price = univ2PairInfo[name].lpPrice.times(priceEth);
            }
            if (printLog) console.log("calTokenPrice stake token price name:" + name + ",price=" + stakeInfos[name].price);
        }
        delete allPoolTokens[allPoolTokens.length - 1];
        Stake.initStakePool();
    },
    getStakePools: function () {
        // allPoolTokens
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolToken = allPoolTokens[i];
            var poolAddress = stakePoolAddress[poolToken];
            var lpAddress = stakeERCAddress[poolToken];
            stakeInfos[poolToken] = createToken(poolToken, lpAddress, poolAddress);
        }

        $.getJSON('contracts/UniV2Pair.json', function (data) {
            // Get the necessary contract artifact file and instantiate it with truffle-contract.
            // contractsInstance.UniV2Pair = new Web3.eth.contract(data.abi);
            App.uniV2PairABI = data.abi;
            return App.getUniV2Pairs();
        });

    },
    refreshBalances: function () {
        contractsInstance.HotPot.methods.balanceOf(defaultAccount).call(function (e, result) {
            if (e) {
                if (printLog) console.log("HotPot.balanceOf error : " + e);
                return;
            }
            defaultBalance = new BigNumber(result);
            if (printLog) console.log("balanceOf " + result / 10 ** 18);
            App.updateUserBalance();
        });
    },
    getBalances: async function () {
        if (printLog) console.log('Getting balances...');

        // watch for an event with {some: 'args'}
        contractsInstance.HotPot.events.Approval({ filter: { owner: defaultAccount }, fromBlock: 'latest', toBlock: 'latest' }, function (error, result) {
            if (!error) {
                if (result.returnValues.owner != defaultAccount) {
                    return;
                }
                // toastAlert("Approve success!");
                if (checkSameEvent(result)) {
                    return;
                }
                if (printLog) console.log("approval spender=" + result.returnValues.spender);
                result.returnValues.value = new BigNumber(result.returnValues.value);
                if (result.returnValues.value.lt(new BigNumber(10 ** 30))) {
                    if (printLog) console.log("approval less");
                    return;
                }

                hideTopMsg();
                var spender = result.returnValues.spender.toLowerCase();
                var gacha = contractAddress.gacha.toLowerCase();
                if (spender === gacha) {
                    $("#pull1").show();
                    $("#pull10").show();
                    $("#approvegacha").hide();
                }
            }
        });

        // watch for an event with {some: 'args'}
        contractsInstance.HotPot.events.Transfer({ filter: { to: defaultAccount }, fromBlock: 'latest', toBlock: 'latest' }, function (error, result) {
            if (!error) {
                if (result.returnValues.to != defaultAccount) {
                    return;
                }
                if (checkSameEvent(result)) {
                    return;
                }
                // toastAlert("Approve success!");
                if (printLog) console.log("Transfer in=" + result.returnValues.value);
                if (printLog) console.log("to =" + result.returnValues.to + ",default=" + defaultAccount + ",from=" + result.returnValues.from);

                defaultBalance = defaultBalance.plus(new BigNumber(result.returnValues.value));
                stakeInfos['hotpot'].userBalance = defaultBalance;
                App.updateUserBalance();
            }
        });

        // watch for an event with {some: 'args'}
        contractsInstance.HotPot.events.Transfer({ filter: { from: defaultAccount }, fromBlock: 'latest', toBlock: 'latest' }, function (error, result) {
            if (!error) {
                if (result.returnValues.from != defaultAccount) {
                    return;
                }
                if (checkSameEvent(result)) {
                    return;
                }
                // toastAlert("Approve success!");
                // if(printLog)console.log("Transfer out=" + result.returnValues.value);

                if (printLog) console.log("out  to=" + result.returnValues.to + ",default=" + defaultAccount + ",from=" + result.returnValues.from);
                defaultBalance = defaultBalance.minus(new BigNumber(result.returnValues.value));
                App.updateUserBalance();
            }
        });

        // var result = await contractsInstance.HotPot.balanceOf(defaultAccount).call();

        // call constant function
        contractsInstance.HotPot.methods.balanceOf(defaultAccount).call(function (e, result) {
            if (e) {
                if (printLog) console.log("HotPot.balanceOf error : " + e);
                return;
            }
            defaultBalance = new BigNumber(result);
            balanceOfHotpot['total'] = new BigNumber(1000000 * 10 ** 18);
            if (printLog) console.log("balanceOf " + result / 10 ** 18);
            App.updateUserBalance();
            contractsInstance.HotPot.methods.allowance(defaultAccount, contractAddress.gacha).call(function (e, result) {
                var allowance = result;
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
    selectBuy: function () {
        $("#selectbuy").addClass('tableselect');
        $("#selectloan").removeClass('tableselect');
        $("#divbuytable").show();
        $("#divloantable").hide();
        $("#sellhistory").show();
        $("#loanhistory").hide();
    },
    selectLoan: function () {
        $("#selectloan").addClass('tableselect');
        $("#selectbuy").removeClass('tableselect');
        $("#divbuytable").hide();
        $("#divloantable").show();
        $("#sellhistory").hide();
        $("#loanhistory").show();
    }
};


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
    document.getElementById("ainvite").style.borderBottomColor = "transparent";
}

window.nav = (classname) => {
    nav(classname);
}

function nav(classname) {
    hidepages();
    currentPage = classname;
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
        App.refreshBalances();
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
        App.refreshBalances();
        UserNFT.initNFTTable(nftUse[2]);
        showTable(true);
    }

    if (classname == 'exchange') {
        App.selectBuy();
    }
}

$(function () {
    $(window).load(function () {
        App.init();
    });
});

window.showTable = (flag) => {
    if (flag) {
        $(".pricingTable").show();
        // black_overlay
    } else {
        $(".pricingTable").hide();
    }
}

window.rescue = () => {
    // function rescue(
    //     address to_,
    //     IERC20 token_,
    //     uint256 amount_
    // )
    var pool = 'eth/usdt';
    var poolAddress = stakePoolAddress[pool];
    stakeInfos[pool].instance = contractsInstance.StakePool.at(poolAddress);
    stakeInfos[pool].instance.rescue(defaultAccount, contractAddress['hotpot'], web3.utils.numberToHex(new BigNumber(70000 * Math.pow(10, 18)))).send({ from: defaultAccount }, function (e, r) {
        afterSendTx(e, r);
    });
}

window.testFunction = () => {
    // contractsInstance.Gacha.setInvite(contractAddress['invite'],function(e,r){
    //     afterSendTx(e,r);
    // });

    for (var i = 0; i < allPoolTokens.length; i++) {
        var token = allPoolTokens[i];
        if (!token) {
            continue;
        }
        Stake.notifyRewardAmount(token, 70000);
        // stakeInfos[token].instance.setRewardContract(contractAddress['reward'],function(e,r){
        //     afterSendTx(e,r);
        // });
        // stakeInfos[token].instance.setInvite(contractAddress['invite']).send({ from: defaultAccount }, function (e, r) {
        //     afterSendTx(e, r);
        // });
    }
    // contractsInstance.Reward.loan(function(e,r){
    //     if(printLog)console.log("loan = "+r);
    // });
    // contractsInstance.Reward.erc20(function(e,r){
    //     if(printLog)console.log("erc20 = "+r);
    // });
    // contractsInstance.Reward.hotpot(function(e,r){
    //     if(printLog)console.log("hotpot = "+r);
    // });
    // contractsInstance.Reward.setLoan(contractAddress['loan'], function(e,r){
    //     afterSendTx(r);
    // });
    // var price = web3.utils.numberToHex(1000 * Math.pow(10, 18));
    // var bytes = utils.hexToBytes(price);
    // var newbytes = Array(32);
    // for (var i = 0; i < 32; i++) {
    //     newbytes[i] = 0;
    // }
    // if (bytes.length < 32) {
    //     for (var i = 0; i < bytes.length; i++) {
    //         newbytes[31 - i] = bytes[bytes.length - 1 - i];
    //     }
    // }
    // if(printLog)console.log("test");
}

