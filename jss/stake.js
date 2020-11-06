Stake = {
    count: 0,
    cliamTimer: null,
    eventBlocks: new Set(),
    notifyRewardAmount: function (token, amount) {
        var amount = web3.utils.numberToHex(new BigNumber(amount * 10 ** 18));
        stakeInfos[token].instance.methods.notifyRewardAmount(amount).send({from:defaultAccount},function (e, result) {
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
                startListenTX(result);
            }
        });
    },
    claimByNFT: function (id) {
        console.log("claimByNFT " + id);
        var token = stakeInfos[currentPagePoolID];
        if (token.userEarn == 0) {
            toastAlert(getString('noearned'));
            return;
        } else {
            token.instance.methods.getRewardByNFT(id).send({ from: defaultAccount }, function (e, r) {
                afterSendTx(e, r);
            });
        }
    },
    approve: function () {
        console.log("stake approve:" + currentPagePoolID);
        if (currentPagePoolID != "") {
            var stakeToken = stakeERCContract[currentPagePoolID];
            console.log("approve " + stakeToken._address);
            var num = new BigNumber(10 ** 30);
            stakeToken.methods.approve(stakePoolAddress[currentPagePoolID], web3.utils.numberToHex(num)).send({ from: defaultAccount }, function (e, result) {
                afterSendTx(e, result);
                if (!e) {
                    $("#approvestake").text(getString('approvestake') + "...");
                }
            });
        }
    },
    //currentPagePoolID
    claimFree: function () {
        var token = stakeInfos[currentPagePoolID];
        if (token.userEarn == 0) {
            toastAlert(getString('noearned'));
            return;
        } else {

            var lastRewardTime = parseInt((token.lastRewardTime).valueOf());
            var now = Math.floor(((new Date()).getTime()) / 1000);
            var delay = lastRewardTime + 86400 - now;
            if (delay > 0) {
                toastAlert(getString('canclaimtoday'));
                return;
            }
            token.instance.methods.getRewardFree().send({ from: defaultAccount }, function (e, r) {
                afterSendTx(e, r);
            });
        }
    },
    claimNFT: function () {
        var token = stakeInfos[currentPagePoolID];
        if (token.userEarn == 0) {
            toastAlert(getString('noearned'));
            return;
        }
        if (UserNFT.nftIds.length + UserNFT.borrowIds.length == 0) {
            //$.i18n.map[i]
            toastAlert($.i18n.map['nocard']);
        } else {
            toastAlert(getString('choosecard'));
            UserNFT.initNFTTable(nftUse[1]);
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
    withdraw: function () {
        console.log("stake");
        if (stakeInfos[currentPagePoolID].userStake == 0) {
            toastAlert(getString('noenoughwithdraw'));
            return;
        }
        document.getElementById("popTitle").innerHTML = "WithDraw";
        var userStake = (stakeInfos[currentPagePoolID].userStake / Math.pow(10, stakeInfos[currentPagePoolID].decimals)).toFixed(4);
        $('#maxAvaliable').text(userStake);
        document.getElementById('stakeInput').value = 0;
        $("#withdrawdiv").show();
        $("#stakediv").hide();
        showAlert();
    },

    maxStake: function () {
        var max = $('#maxAvaliable').text();
        // console.log("maxStake=" + max);
        document.getElementById('stakeInput').value = max
    },
    withdrawSure: function () {
        hideAlert();
        var token = stakeInfos[currentPagePoolID];
        if (token && token.poolAddress) {
            var stake = parseFloat(document.getElementById('stakeInput').value);
            if (stake <= 0) {
                toastAlert(getString('withdrawcannotbezero'));
                return;
            }
            var num = new BigNumber(stake * Math.pow(10, token.decimals));
            var hex = web3.utils.numberToHex(num);
            token.instance.methods.withdraw(hex).send({ from: defaultAccount }, function (e, result) {
                if (e) {
                    return console.error('Error with stake:', e);
                }
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            });
        }
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
            var num = new BigNumber(stake * Math.pow(10, token.decimals));
            var hex = web3.utils.numberToHex(num);
            token.instance.methods.stake(hex).send({ from: defaultAccount }, { from: defaultAccount }, function (e, result) {
                if (e) {
                    return console.error('Error with stake:', e);
                }
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            });
        }
    },
    getAllPoolBalance: function () {
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (token)
                Stake.getSinglePoolBalance(token);
        }
    },
    getSinglePoolBalance: function (name) {
        console.log("getSinglePoolBalance name=" + name);
        var poolAddress = stakePoolAddress[name];
        if (poolAddress)
            contractsInstance.HotPot.methods.balanceOf(poolAddress).call(function (e, result) {
                console.log("pool balance name=" + name + ",balance=" + result);
                balanceOfHotpot[name] = new BigNumber(result);
                Stake.count++;
                if (Stake.count == allPoolTokens.length - 1) {
                    Stake.calTotalCirculation();
                }
            });
    },
    getFreeRewardRatio: function () {
        stakeInfos['usdt'].instance.methods.freeRewardRatio().call(function (e, r) {
            console.log("freeRewardRatio=" + r);
            $(".cliamratio").text(r + "%");
        });
    },
    calTotalCirculation: function () {
        var total = balanceOfHotpot['total'];
        for (var i = 0; i < allPoolTokens.length; i++) {
            var token = allPoolTokens[i];
            if (balanceOfHotpot[token])
                total = total.minus(balanceOfHotpot[token]);
        }
        total = total.minus(200000 * 10 ** 18);
        total = total.div(Math.pow(10, 18));
        console.log("calTotalCirculation=" + total);
        $("#totalcir").text(total.toFixed(2));
    },
    initpooldata: function (name) {
        if (Stake.cliamTimer != null) {
            clearInterval(Stake.cliamTimer);
            Stake.cliamTimer = null;
        }
        var upername = (name + "").toUpperCase();

        $('.farmname').text(upername);
        currentPagePoolID = name;

        let token = stakeInfos[name];
        var allowance = token.allowance;
        if (allowance > 0) {
            $('body').addClass('approved');
        } else {
            $("#approvestake").text(getString('approvestake'));
        }

        var stakeDecimals = token.decimals;
        let totalStake = token.poolTotalStake;
        // console.log("totalStake=" + totalStake);

        $('.totalstake').text((totalStake.div(Math.pow(10, stakeDecimals))).toFixed(2) + " " + name);
        // pools[name].poolTotalStake = totalStake;

        let userStake = token.userStake;
        // console.log("userStake=" + userStake);
        $('.stakedbalance').text((userStake.div(Math.pow(10, stakeDecimals))).toFixed(2) + " " + name);

        $('#stakeToken').text(name + " ");

        let earned = token.userEarn;
        earned = (earned / Math.pow(10, stakeInfos["hotpot"].decimals));
        $('.rewardbalance').text(earned.toFixed(2));

        var lastRewardTime = parseInt((token.lastRewardTime).valueOf());
        var now = Math.floor(((new Date()).getTime()) / 1000);
        var delay = lastRewardTime + 86400 - now;
        console.log("lastRewardTime=" + lastRewardTime + ",delay=" + delay + ",token=" + name);
        if (delay > 0) {
            $("#claimtimep").show();
            Stake.cliamTimer = setInterval(() => {
                delay -= 1;
                if (delay == 0) {
                    $("#claimtimep").hide();
                    clearInterval(Stake.cliamTimer);
                }
                $("#claimtime").text(formatFomoTime(delay));
            }, 1000);
        } else {
            $("#claimtimep").hide();
        }
    },
    initStakePool: function () {
        console.log("initStakePool");

        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            if (poolName)
                Stake.initSinglePool(poolName);
        }
        Stake.getFreeRewardRatio();
    },
    checkTotalStaked: function () {
        if (Stake.totalStake) {
            return;
        }
        var totalPrice = new BigNumber(0);
        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            if (!poolName) {
                break;
            }
            var periodFinish = stakeInfos[poolName].periodFinish;
            if (!periodFinish) {
                return;
            }
            if (periodFinish == 0) {
                return;
            }
        }

        for (var i = 0; i < allPoolTokens.length; i++) {
            var poolName = allPoolTokens[i];
            if (!poolName) {
                break;
            }
            var stake = stakeInfos[poolName].poolTotalStake;
            if (stakeInfos[poolName])
                console.log("checkTotalStaked: pool=" + poolName + ",price=" + stakeInfos[poolName].price + ",stake=" + stake);
            if (stake == 0) {
                continue;
            }
            var stakePrice = stake.div(Math.pow(10, stakeInfos[poolName].decimals)).times(stakeInfos[poolName].price);
            console.log("checkTotalStaked: pool=" + poolName + ",stake price=" + stakePrice);
            totalPrice = totalPrice.plus(stakePrice);
        }
        Stake.totalStake = totalPrice;
        $("#totalstake").text(totalPrice.toFixed(2));
    },
    initSinglePool: function (poolName) {
        var poolAddress = stakePoolAddress[poolName];
        console.log("initSinglePool poolname=" + poolName);
        stakeInfos[poolName].instance = new web3.eth.Contract(contractABI['stakepool'], poolAddress);

        stakeInfos[poolName].instance.events.Staked({ filter: { user: defaultAccount } }, function (err, result) {
            if(result.returnValues.user!=defaultAccount){
                return;
            }
            if (err) {
                return console.error('Error with stake:', err);
            }
            if (result) {
                if (Stake.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Stake.eventBlocks.add(result.blockNumber);
                // console.log('eventResult:', eventResult);
                toastAlert("Stake success!");
                console.log("Staked");
                stakeInfos[poolName].userStake = stakeInfos[poolName].userStake.plus(result.returnValues.amount);
                stakeInfos[poolName].poolTotalStake = stakeInfos[poolName].poolTotalStake.plus(result.returnValues.amount);
                if (currentPagePoolID == poolName)
                    Stake.initpooldata(currentPagePoolID);
            }
        });

        stakeInfos[poolName].instance.events.Withdrawn({ filter: { user: defaultAccount } }, function (err, result) {
            if(result.returnValues.user!=defaultAccount){
                return;
            }
            if (err) {
                return console.error('Error with stake:', err);
            }
            if (result) {
                // console.log('eventResult:', eventResult);
                if (Stake.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Stake.eventBlocks.add(result.blockNumber);
                toastAlert("Withdraw success!");
                console.log("Withdrawn");
                stakeInfos[poolName].userStake = stakeInfos[poolName].userStake.minus(result.returnValues.amount);
                stakeInfos[poolName].poolTotalStake = stakeInfos[poolName].poolTotalStake.minus(result.returnValues.amount);
                if (currentPagePoolID == poolName)
                    Stake.initpooldata(currentPagePoolID);
            }
        });

        stakeInfos[poolName].instance.events.RewardPaid({ filter: { user: defaultAccount } }, function (err, result) {
            if(result.returnValues.user!=defaultAccount){
                return;
            }
            if (err) {
                return console.error('Error with stake:', err);
            }
            if (result) {
                if (Stake.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Stake.eventBlocks.add(result.blockNumber);
                // console.log('eventResult:', eventResult);
                // toastAlert("Withdraw success!");
                console.log("RewardPaid");
                toastAlert(getString('getreward'));
                stakeInfos[poolName].userEarn = stakeInfos[poolName].userEarn.minus(result.returnValues.reward);

                console.log("currentPagePoolID=" + currentPagePoolID + ",poolName=" + poolName);
                // stakeInfos[poolName].lastRewardTime = Math.floor((new Date()).getTime() / 1000);
                stakeInfos[poolName].instance.methods.lastRewardTime(defaultAccount).call(function (e, r) {
                    console.log("initSinglePool pool=" + poolName + ",lastRewardTime:" + r);
                    r = parseInt(r);
                    stakeInfos[poolName].lastRewardTime = r;
                    if (currentPagePoolID == poolName)
                        Stake.initpooldata(currentPagePoolID);
                });

            }
        });

        if(poolName=='usdt'||poolName=='hotpot')
        stakeInfos[poolName].instance.methods.starttime().call(function(e,result){
            if(!e){
                result = parseInt(result);
                console.log("pool="+poolName+",starttime="+result);
                stakeInfos[poolName].startTime=result;
                var now = Math.floor((new Date()).getTime()/1000);
                var delay = result - now;
                if(delay>0){
                    if(poolName=='usdt'){
                        $(".startbadge").show();
                        $(".starttime").text(formatTime(delay));
                    }
                    if(poolName=='hotpot'){
                        $(".startbadge2").show();
                        $(".starttime2").text(formatTime(delay));
                    }
                }
            }
        });

        if(poolName=='usdt'||poolName=='hotpot')
        stakeInfos[poolName].instance.methods.periodFinish().call(function(e,result){
            if(!e){
                result = parseInt(result);
                console.log("pool="+poolName+",periodFinish="+result);
                stakeInfos[poolName].periodFinish=result;
                var now = Math.floor((new Date()).getTime()/1000);
                var delay = result - now;
                if(delay>0&&delay<86400){
                    if(poolName=='usdt'){
                        $(".startbadge").show();
                        $(".starttime").text(formatTime(delay));
                    }
                    if(poolName=='hotpot'){
                        $(".startbadge2").show();
                        $(".starttime2").text(formatTime(delay));
                    }
                }
                if(delay<0){
                    if(poolName=='usdt'){
                        $(".endbadge").show();
                    }
                    if(poolName=='hotpot'){
                        $(".endbadge2").show();
                    }
                }
            }
        });

        stakeInfos[poolName].instance.methods.totalSupply().call(function (e, result) {
            result = new BigNumber(result);
            console.log("initSinglePool pool=" + poolName + ",totalSupply:" + result);
            stakeInfos[poolName].poolTotalStake = result;
            stakeInfos[poolName].instance.methods.balanceOf(defaultAccount).call(function (e, result) {
                console.log("initSinglePool pool=" + poolName + ",balanceOf:" + result);
                stakeInfos[poolName].userStake = new BigNumber(result);
                stakeInfos[poolName].instance.methods.earned(defaultAccount).call(function (e, result) {
                    console.log("initSinglePool pool=" + poolName + ",earned:" + result);

                    stakeInfos[poolName].userEarn = new BigNumber(result);
                    stakeInfos[poolName].instance.methods.rewardRate().call(function (e, result) {
                        console.log("initSinglePool pool=" + poolName + ",rewardRate:" + result);
                        stakeInfos[poolName].rewardRate = new BigNumber(result);
                        Stake.updateAPY(poolName);

                        console.log("initSinglePool poolName=" + poolName + ",currentPagePoolID=" + currentPagePoolID);
                        if (currentPagePoolID === poolName) {
                            Stake.initpooldata(currentPagePoolID);
                        }
                        stakeInfos[poolName].instance.methods.periodFinish().call(function (e, r) {
                            console.log("initSinglePool pool=" + poolName + ",periodFinish:" + r);
                            stakeInfos[poolName].periodFinish = parseInt(r);

                            Stake.checkTotalStaked();
                        });
                        stakeInfos[poolName].instance.methods.lastRewardTime(defaultAccount).call(function (e, r) {
                            console.log("initSinglePool pool=" + poolName + ",lastRewardTime:" + r);
                            stakeInfos[poolName].lastRewardTime = parseInt(r);
                        });
                    });
                });
            });
        });

    },
    updateAPY: function (name) {
        console.log("updateapy " + name);
        var hotpotDecimals = 18;
        //池子每s产出wwt数量
        let rewardRate = stakeInfos[name].rewardRate.div(Math.pow(10, hotpotDecimals));
        console.log("rewardRate=" + rewardRate);

        //每s能挖出的wwt总价格
        let rewardPrice = rewardRate * stakeInfos["hotpot"].price;

        //用来质押的代币
        let stakeToken = stakeInfos[name];
        let totalStake = stakeToken.poolTotalStake;

        let totalStakePrice = totalStake.div(Math.pow(10, stakeToken.decimals)).times(stakeToken.price);

        console.log("updateapy token price=" + stakeToken.price + ",total price=" + totalStakePrice);

        //每s，每u能产出的产率
        let aps = 1;
        if (totalStakePrice != 0)
            aps = rewardPrice / totalStakePrice;

        let apy = aps * 60 * 60 * 24 * 365;

        console.log("totalStakePrice=" + totalStakePrice + ",apy=" + apy);

        stakeToken.apy = apy;

        var apyStr = parseInt(apy) * 100 + ' %';
        if (totalStakePrice < 1) {
            apyStr = "Infinity %";
        }
        // "eth/usdt",
        // "uni/eth",
        // "hotpot",
        // "hotpot/eth",

        if (name == "eth/usdt") name = "ethusdt";
        if (name == "uni/eth") name = "unieth";
        if (name == "hotpot/eth") name = "hotpoteth";
        if (name == "wbtc/eth") name = "wbtceth";

        var apyp = ".poolyield" + name;
        console.log("apy str=" + apyStr);
        $(apyp).animateNumbers(apyStr);

        $("#divloading").hide();
    }
}
