

Reward = {
    gotoPage: function () {
        console.log("Reward gotoPage");
        Reward.getRewardInfo();
    },
    getRewardInfo: function () {
        console.log("getReward");

        // call constant function
        contractsInstance.Reward.methods.getBalance().call(function (error, result) {
            if (error) {
                console.log("Reward.getBalance error : " + error);
                return;
            }
            console.log("reward balanceOf=" + result) // '0x25434534534'
            var total = (result / Math.pow(10, 18)).toFixed(2);
            $(".totalreward").text(total + " HotPot");
        });
        contractsInstance.Reward.methods.calNormalReward(1).call(function (e, result) {
            if (e) {
                toastAlert("Error with calReward:" + e);
                return console.error('Error with getReward:', e);
            }

            var total = (result / Math.pow(10, 18)).toFixed(2);
            console.log("calReward " + total);
            $("#rewardpercard").text(total);
        });
    },
    claim: function () {
        if (UserNFT.nftIds.length + UserNFT.borrowIds.length == 0) {
            //$.i18n.map[i]
            toastAlert($.i18n.map['nocard']);
        } else {
            UserNFT.initNFTTable(nftUse[0]);
            showTable(true);
        }
    },
    rewardByNFT: function (id) {
        console.log("rewardByNFT : " + id);
        contractsInstance.Reward.events.WithdrawReward({ filter: { sender: defaultAccount } }, function (e, result) {
            if (!e) {
                toastAlert(getString('rewardsuccess'));
            }
        });

        contractsInstance.Reward.methods.getReward(id).send({ from: defaultAccount }, function (e, result) {
            if (e) {
                toastAlert("Error with getReward:" + e);
                return console.error('Error with getReward:', e);
            }
            showTopMsg("Pending...", 0, getEthersanUrl(result));
            startListenTX(result);
        });
    },
}
