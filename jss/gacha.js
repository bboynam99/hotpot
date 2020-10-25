
Gacha = {
    gachaHx: null,
    eventBlocks: new Set(),
    getGacha: function () {
        console.log("getGacha init");
        contractsInstance.Gacha.getPosibilityNow(function(e,r){
            if(!e){
                $("#posibilitynow").text("1/"+r);
                $("#posibilitylater").text("1/"+r.mul(2));
            }
        });
        contractsInstance.Gacha.GachaTicket(function (error, result) {
            if (error) { console.log("GachaTicket error " + error); }
            else {
                console.log("GachaTicket block num=" + result.blockNumber);
                if (Gacha.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Gacha.eventBlocks.add(result.blockNumber);
                console.log("GachaTicket " + result.args);
                $("#globalmsg").show();

                $("#globalmsg").attr("href", getEthersanUrl(result.transactionHash));
                $("#gachauser").text(result.args._owner);
                setTimeout(function () {
                    $("#globalmsg").hide();
                }, 5000);

                if (result.args._owner == App.defaultAccount) {
                    hideTopMsg();
                }

                UserNFT.totalNFT=UserNFT.totalNFT.plus(1);
                UserNFT.updateTotalNFT();
            }
        });
        console.log("getGacha");
        contractsInstance.Gacha.GachaNothing({
            fromBlock: 'latest',
            toBlock: 'latest'
        }, function (e, result) {
            if (e) {
                console.log("GachaTicket error " + e);
            } else {
                console.log("GachaNothing block num=" + result.blockNumber);
                if (Gacha.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Gacha.eventBlocks.add(result.blockNumber);

                console.log("GachaNothing " + result.args);
                showImportantMsg(getString('GachaNothing'), getEthersanUrl(result.transactionHash));
            }
        });
    },
    pull: function () {
        console.log("pull");

        if (App.defaultBalance.lt(new BigNumber(20 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.pull({ gas: 1200000 }, function (e, result) {
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
        if (App.defaultBalance.lt(new BigNumber(190 * 10 ** 18))) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.Gacha.pull10({ gas: 1200000 }, function (e, result) {
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
        contractsInstance.HotPot.approve(contractAddress.gacha, web3.toHex(Math.pow(10, 30)), function (e, result) {
            if (e) {
                console.log("Gacha approve error " + e);
            } else {
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    }
}
