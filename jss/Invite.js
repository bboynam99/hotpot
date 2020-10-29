Invite = {
    claimRatio:0,
    initInviteInfo:function(){
        contractsInstance.Invite.getInviteCode(defaultAccount,function(e,r){
            if(r!=0)
            {
                $("#myinvitecode").text(r);
                $("#nocodetip").hide();
                $("#myinvitecode").show();
            }
            else{
                $("#nocodetip").show();
                $("#myinvitecode").hide();
            }
        });
        contractsInstance.Invite.getInviteNum(defaultAccount,function(e,r){
            $("#totalinvite").text(r);
        });
        contractsInstance.Invite.calValidNum(defaultAccount,function(e,r){
            $("#validateinvite").text(r);
        });
        contractsInstance.Invite.calRatioUpdate(defaultAccount,function(e,r){
            var ratio = r/1000;
            Invite.claimRatio += ratio;
            Invite.updateRatio();
        });
        contractsInstance.Invite.getInviterCode(defaultAccount,function(e,r){
            if(r==0){
                $("#inputinvitecode").show();
                $("#inviteinputed").hide();
            }else{
                $("#inputinvitecode").hide();
                $("#inviteinputed").show();
            }
        });
        contractsInstance.Invite.checkValidated(defaultAccount,function(e,r){
            if(r){
                $("#invitevalidated").show();
                $("#inviteinputed").hide();
                Invite.claimRatio += 0.01;
                Invite.updateRatio();
            }else{
                $("#invitevalidated").hide();
            }
        });

    },
    updateRatio:function(){
        $("#claimratioup").text(100*Invite.claimRatio+"%");
    }
}