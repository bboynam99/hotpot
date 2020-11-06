Invite = {
    claimRatio: 0,
    myInviteCode: 0,
    inputvalidated: false,
    eventBlocks: new Set(),
    eventBlocks1: new Set(),
    initInviteInfo: function () {

        contractsInstance.Invite.events.InviteCreated({ filter: { creator: defaultAccount } }, function (error, result) {
            if (!error) {
                if(result.returnValues.creator!=defaultAccount){
                    return;
                }
                if (Invite.eventBlocks1.has(result.blockNumber)) {
                    return;
                }
                Invite.eventBlocks1.add(result.blockNumber);
                console.log("InviteCreated");
                Invite.getMyInviteCode();
            }
        });

        contractsInstance.Invite.events.InviteInput({ filter: { user: defaultAccount } }, function (error, result) {
            if (!error) {
                if(result.returnValues.user!=defaultAccount){
                    return;
                }
                if (Invite.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Invite.eventBlocks.add(result.blockNumber);
                console.log("InviteInput");
                Invite.getInputInviteCode();
            }
        });
        contractsInstance.Invite.events.InviteValidate({ filter: { validator: defaultAccount } }, function (error, result) {
            if (!error) {
                if(result.returnValues.validator!=defaultAccount){
                    return;
                }
                if (Invite.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Invite.eventBlocks.add(result.blockNumber);
                console.log("InviteValidate");
                $("#invitevalidated").show();
                $("#inviteinputed").hide();
                Invite.claimRatio += 0.01;
                Invite.updateRatio();
            }
        });
        Invite.getMyInviteCode();
        contractsInstance.Invite.methods.getInviteNum(defaultAccount).call(function (e, r) {
            $("#totalinvite").text(r);
        });
        contractsInstance.Invite.methods.calValidNum(defaultAccount).call(function (e, r) {
            $("#validateinvite").text(r);
        });
        contractsInstance.Invite.methods.calRatioUpdate(defaultAccount).call(function (e, r) {
            var ratio = parseInt(r) / 1000;
            console.log("calRatioUpdate=" + ratio);
            Invite.claimRatio += ratio;
            Invite.updateRatio();
        });
        Invite.getInputInviteCode();

        contractsInstance.Invite.methods.checkValidated(defaultAccount).call(function (e, r) {
            console.log("checkValidated=" + r);
            Invite.inputvalidated = parseInt(r);
            if (r) {
                $("#invitevalidated").show();
                $("#inviteinputed").hide();
            } else {
                $("#invitevalidated").hide();
            }
        });
    },
    getInputInviteCode: function () {
        contractsInstance.Invite.methods.getInputInviteCode(defaultAccount).call(function (e, r) {
            console.log("getInputInviteCode=" + r);
            if (parseInt(r) == 0) {
                $("#inputinvitecode").show();
                $("#inviteinputed").hide();
            } else {
                $("#inputinvitecode").hide();
                if (!Invite.inputvalidated)
                    $("#inviteinputed").show();
            }
        });
    },
    getMyInviteCode: function () {
        contractsInstance.Invite.methods.getMyInviteCode(defaultAccount).call(function (e, r) {
            r = parseInt(r);
            console.log("getMyInviteCode=" + r);
            if (r != 0) {
                Invite.myInviteCode = r;
                $("#myinvitecode").text(r);
                $("#nocodetip").hide();
                $("#myinvitecode").show();
            }
            else {
                $("#nocodetip").show();
                $("#myinvitecode").hide();
            }
        });
    },
    updateRatio: function () {
        $("#claimratioup").text(100 * Invite.claimRatio + "%");
    },
    inputCode: function () {
        var code = $("#inviteInput").val();
        console.log("code=" + code);
        var regex = /^\d+$/;
        if (regex.test(code)) {
            if (code == Invite.myInviteCode) {
                toastAlert(getString('inputyourcode'));
            } else if (code < 1000) {
                toastAlert(getString('inputwrong'));
            } else
                contractsInstance.Invite.methods.inputCode(code).send({ from: defaultAccount }, function (e, r) {
                    afterSendTx(e, r);
                });
        } else {
            toastAlert(getString('inputwrong'));
        }
    },
}