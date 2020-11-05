Gacha = {
    gachaHx: null,
    eventBlocks: new Set(),
    getGacha: function () {
        console.log("getGacha init");
        contractsInstance.Gacha.methods.getPosibilityNow().call(function(e,r){
            if(!e){
                $("#posibilitynow").text("1/"+r);
                $("#posibilitylater").text("1/"+r/100);
            }
        });
        contractsInstance.Gacha.events.GachaTicket(function (error, result) {
            if (error) { console.log("GachaTicket error " + error); }
            else {
                // console.log("GachaTicket block num=" + result.blockNumber);
                if (Gacha.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Gacha.eventBlocks.add(result.blockNumber);
                console.log("GachaTicket " + result.returnValues);
                $("#globalmsg").show();

                $("#globalmsg").attr("href", getEthersanUrl(result.transactionHash));
                $("#gachauser").text(result.returnValues._owner);
                setTimeout(function () {
                    $("#globalmsg").hide();
                }, 5000);

                if (result.returnValues._owner == defaultAccount) {
                    hideTopMsg();
                }

                UserNFT.totalNFT=UserNFT.totalNFT.plus(1);
                UserNFT.updateTotalNFT();
            }
        });
        console.log("getGacha");
        contractsInstance.Gacha.events.GachaNothing({
            fromBlock: 'latest',
            toBlock: 'latest'
        }, function (e, result) {
            if (e) {
                console.log("GachaTicket error " + e);
            } else {
                // console.log("GachaNothing block num=" + result.blockNumber);
                if (Gacha.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Gacha.eventBlocks.add(result.blockNumber);

                console.log("GachaNothing " + result.returnValues);
                showImportantMsg(getString('GachaNothing'), getEthersanUrl(result.transactionHash));
            }
        });
    },
    pull: function () {
        console.log("pull");

        if (defaultBalance.lt(new BigNumber(20 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.methods.pull().send({from:defaultAccount, gas: 1200000 }, function (e, result) {
            if (e) {
                console.log("pull error:" + e);
            } else {
                console.log("pull " + result);

                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    pull10: function () {
        console.log("pull10");
        if (defaultBalance.lt(new BigNumber(190 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.methods.pull10().send({from:defaultAccount, gas: 1200000 }, function (e, result) {
            if (e) {
                console.log("pull 10 error:" + e);
            } else {
                console.log("pull 10:" + result);

                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    approve: function () {
        contractsInstance.HotPot.methods.approve(contractAddress.gacha, web3.utils.numberToHex(new BigNumber(Math.pow(10, 30)))).send({from:defaultAccount},function (e, result) {
            if (e) {
                console.log("Gacha approve error " + e);
            } else {
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    }
}
