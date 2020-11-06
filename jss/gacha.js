Gacha = {
    gachaHx: null,
    getGacha: function () {
        if (printLog) console.log("getGacha init");
        contractsInstance.Gacha.methods.getPosibilityNow().call(function (e, r) {
            if (!e) {
                r = parseInt(r);
                $("#posibilitynow").text("1/" + r);
                $("#posibilitylater").text("1/" + (r * 2));
            }
        });
        contractsInstance.Gacha.events.GachaTicket(function (error, result) {
            if (error) { if (printLog) console.log("GachaTicket error " + error); }
            else {
                // if(printLog)console.log("GachaTicket block num=" + result.blockNumber);
                if (checkSameEvent(result)) {
                    return;
                }
                if (printLog) console.log("GachaTicket " + result.returnValues);
                $("#globalmsg").show();

                $("#globalmsg").attr("href", getEthersanUrl(result.transactionHash));
                $("#gachauser").text(result.returnValues._owner);
                setTimeout(function () {
                    $("#globalmsg").hide();
                }, 5000);

                if (result.returnValues._owner == defaultAccount) {
                    hideTopMsg();
                }

                UserNFT.totalNFT = UserNFT.totalNFT.plus(1);
                UserNFT.updateTotalNFT();
            }
        });
        if (printLog) console.log("getGacha");
        contractsInstance.Gacha.events.GachaNothing({
            filter: { _owner: defaultAccount },
            fromBlock: 'latest',
            toBlock: 'latest'
        }, function (e, result) {
            if (result.returnValues._owner != defaultAccount) {
                return;
            }
            if (e) {
                if (printLog) console.log("GachaTicket error " + e);
            } else {
                // if(printLog)console.log("GachaNothing block num=" + result.blockNumber);

                if (checkSameEvent(result)) {
                    return;
                }

                if (printLog) console.log("GachaNothing " + result.returnValues);
                showImportantMsg(getString('GachaNothing'), getEthersanUrl(result.transactionHash));
            }
        });
    },
    pull: function () {
        if (printLog) console.log("pull");

        if (defaultBalance.lt(new BigNumber(20 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.methods.pull().send({ from: defaultAccount, gas: 1200000 }, function (e, result) {
            if (e) {
                if (printLog) console.log("pull error:" + e);
            } else {
                if (printLog) console.log("pull " + result);

                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    pull10: function () {
        if (printLog) console.log("pull10");
        if (defaultBalance.lt(new BigNumber(190 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.methods.pull10().send({ from: defaultAccount, gas: 1200000 }, function (e, result) {
            if (e) {
                if (printLog) console.log("pull 10 error:" + e);
            } else {
                if (printLog) console.log("pull 10:" + result);

                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    approve: function () {
        contractsInstance.HotPot.methods.approve(contractAddress.gacha, web3.utils.numberToHex(new BigNumber(Math.pow(10, 30)))).send({ from: defaultAccount }, function (e, result) {
            if (e) {
                if (printLog) console.log("Gacha approve error " + e);
            } else {
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    }
}
