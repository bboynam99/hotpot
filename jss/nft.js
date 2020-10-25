var nftUse = [
    'reward',
    'stake',
    'me'
]

NFT = {
    createNFT: function (nft, use) {
        // if (nft.id == 3) {
        //     nft.usetime = Math.floor((new Date()).getTime() / 1000);
        // }

        var nodeli = $("<li class='pricingTable-firstTable_table'></li>");
        var name = "Member Card";
        if (nft.grade == 2) {
            name = "Gold Member Card";
        } else if (nft.grade == 3) {
            name = "Epic Member Card";
        }

        var nodeh1 = $("<h1 class='pricingTable-firstTable_table__header'></h1>").text(name);

        //<span>ID:</span><span>002</span><span>/1000</span>
        var phtml = "<span>ID:</span><span>" + formatZero(nft.id, 3) + "</span><span>/1000</span>";
        var nodep = $("<p class='pricingTable-firstTable_table__pricing'></p>").html(phtml);
        var nodeul = $("<ul class='pricingTable-firstTable_table__options'></ul>");
        var availabe = "Available";
        var canUse = true;

        var usetime = parseInt((nft.usetime).valueOf());
        var delay = usetime + 86400 - ((new Date()).getTime()) / 1000;

        if (delay>0) {
            canUse = false;
            availabe = "Charging : 20h 10:36"

            let fomoTime = Math.floor(delay);
            console.log("charger time=" + fomoTime);
            availabe = "Charging : " + formatTime(fomoTime);
            if (fomoTime > 0) {
                setInterval(() => {
                    fomoTime -= 1;
                    $("#nftusetime" + nft.id).text("Charging : " + formatTime(fomoTime))
                }, 1000);
            }
        }
        var nodeli1 = $("<li></li>").text(availabe);
        nodeli1.attr("id", "nftusetime" + nft.id);
        nodeul.append(nodeli1);

        nodeli.append(nodeh1);
        nodeli.append(nodep);
        nodeli.append(nodeul);

        var nodediv;
        if (use === nftUse[1]) {
            if (canUse){
                nodediv = $("<div class='pricingTable-firstTable_table__getstart'></div>").text("CLAIM");
                nodeli.on("click",nodediv,function(){Stake.claimByNFT(nft.id)});
            }
            else{
                nodediv = $("<div class='pricingTable-firstTable_table__getstart'></div>").text("Waitting for charging");
            }
        } else if(use===nftUse[0]){
            if (canUse){
                nodediv = $("<div class='pricingTable-firstTable_table__getstart'></div>").text("DIVIDENDS");
                nodeli.on("click",nodediv,function(){Reward.rewardByNFT(nft.id)});
            }               
            else{
                nodediv = $("<div class='pricingTable-firstTable_table__getstart'></div>").text("Waitting for charging");
            }
        } else if(use === nftUse[2]){
            nodediv = $("<div class='pricingTable-firstTable_table__getstart' onclick='Loan.loanNFT("+nft.id+")'></div>").text("LOAN");

            var nodedivsell = $("<div class='pricingTable-firstTable_table__getstart' onclick='Market.sellNFT("+nft.id+")'></div>").text("SELL");
            nodeli.append(nodedivsell);
        }

        nodeli.append(nodediv);
        return nodeli;
    },
    createNFTs: function (ids, nfts, use) {
        if (ids.length <= 3) {
            var nodeul = $("<ul class='pricingTable-firstTable'></ul>");
            for (var i = 0; i < ids.length; i++) {
                var node = NFT.createNFT(nfts[ids[i]], use);
                nodeul.append(node);
            }
            return nodeul;
        } else {
            var nodediv = $("<div></div>");
            var size = Math.ceil(ids.length / 3);
            for (var j = 0; j < size; j++) {
                var nodeul = $("<ul class='pricingTable-firstTable'></ul>");
                for (var i = 0; i < 3; i++) {
                    var count = 3 * j + i;
                    if (count > ids.length-1) {
                        break;
                    }
                    var node = NFT.createNFT(nfts[ids[count]], use);
                    nodeul.append(node);
                }
                nodediv.append(nodeul);
            }
            return nodediv;
        }
    },
    createNFTInfo: function (id, owner) {
        var nft = new Object;
        nft.id = id;
        nft.grade = 0;
        nft.owner = owner;
        nft.usetime = 0;
        nft.loan = false;
        nft.sell = false;
        return nft;
    },
    isAvailable:function(usetime){
        var now = Math.floor((new Date()).getTime()/1000);
        return usetime+86400<now;
    }
}


UserNFT = {
    nftIds: Array(),
    nftInfos: {},
    totalNFT: 0,
    userBalance: 0,
    eventBlocks: new Set(),
    isAvailable:function(id){
        var nft = UserNFT.nftInfos[id];
        return NFT.isAvailable(nft.usetime);
    },
    updateTotalNFT: function () {
        $(".ticketbalance").text(UserNFT.totalNFT);
    },
    updateUserNFT: function () {
        console.log("updateUserNFT");
        $(".myticketbalance").text(UserNFT.userBalance);
    },
    deleteNFT:function(tokenId){
        console.log("deleteNFT "+tokenId);
        var position = -1;
        for(var i=0;i<UserNFT.nftIds.length;i++){
            if(tokenId == UserNFT.nftIds[i]){
                position = i;
                break;
            }
        }
        if(position!=-1){
            UserNFT.nftIds.splice(position,1);
        }
        delete UserNFT.nftInfos[tokenId];
    },
    addNFT:function(tokenId){
        console.log("addNFT "+tokenId);
        UserNFT.nftIds.push(tokenId);
        var nft = NFT.createNFTInfo(tokenId, App.defaultAccount);
        UserNFT.nftInfos[tokenId] = nft;
    },
    getNFTBalances: function () {
        console.log("getNFTBalances");
        // initiate contract for an address

        contractsInstance.NFTHotPot.totalSupply(function (e, result) {
            UserNFT.totalNFT = result;
            UserNFT.updateTotalNFT();
        });
        // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
        // Transfer
        contractsInstance.NFTHotPot.Transfer({ from: App.defaultAccount }, function (e, r) {
            console.log("nft out tokenid=" + r.args.tokenId + ",to " + r.args.to);
            console.log("nft block num=" + r.blockNumber);
            if (UserNFT.eventBlocks.has(r.blockNumber)) {
                return;
            }
            UserNFT.eventBlocks.add(r.blockNumber);
            UserNFT.deleteNFT(r.args.tokenId);
            UserNFT.userBalance = UserNFT.userBalance.sub(1);
            UserNFT.updateUserNFT();
        });
        contractsInstance.NFTHotPot.Transfer({ to: App.defaultAccount }, function (e, r) {
            console.log("nft in tokenid=" + r.args.tokenId + ",from " + r.args.from);
            if (UserNFT.eventBlocks.has(r.blockNumber)) {
                return;
            }
            UserNFT.eventBlocks.add(r.blockNumber);
            UserNFT.addNFT(r.args.tokenId);
            UserNFT.userBalance = UserNFT.userBalance.plus(1);
            UserNFT.updateUserNFT();
        });
        contractsInstance.NFTHotPot.UseTicket({ owner: App.defaultAccount }, function (e, r) {
            console.log("nft UseTicket tokenid=" + r.args.tokenId);
            if (UserNFT.eventBlocks.has(r.blockNumber)) {
                return;
            }
            UserNFT.eventBlocks.add(r.blockNumber);

            var id = r.args.tokenId;
            var time = r.args.useTime;
            UserNFT.nftInfos[id].usetime = time;

            UserNFT.updateNFTTable();
        });

        // event UseTicket(
        //     address indexed owner,
        //     uint256 indexed useTime,
        //     uint256 indexed tokenId
        // );

        // call constant function
        contractsInstance.NFTHotPot.balanceOf(App.defaultAccount, function (error, result) {
            console.log("getNFTBalances balanceOf=" + result) // '0x25434534534'
            UserNFT.userBalance = result;
            UserNFT.nftIds = Array();

            $(".myticketbalance").text(result);
            for (var i = 0; i < result; i++) {
                contractsInstance.NFTHotPot.tokenOfOwnerByIndex(App.defaultAccount, i, function (e, result) {
                    console.log("tokenOfOwnerByIndex id=" + result);
                    UserNFT.nftIds.push(result);
                    var nft = NFT.createNFTInfo(result, App.defaultAccount);
                    UserNFT.nftInfos[result] = nft;
                    UserNFT.getNFTInfo(result);
                });
            }
        });
    },
    getNFTInfo: function (id) {
        contractsInstance.NFTHotPot.getGrade(id, function (e, result) {
            console.log("get grade id=" + id + ",grade=" + result);
            UserNFT.nftInfos[id].grade = result;
            if (result == 1) {
                $("#grade1num").text(parseInt($("#grade1num").text()) + 1);
            } else if (result == 2) {
                $("#grade2num").text(parseInt($("#grade2num").text()) + 1);
            } else if (result == 3) {
                $("#grade3num").text(parseInt($("#grade3num").text()) + 1);
            }
            UserNFT.getUseTime(id);
        });
    },
    getUseTime: function (id) {
        contractsInstance.NFTHotPot.getUseTime(id, function (e, result) {
            console.log("get use time id=" + id + ",time=" + result);
            UserNFT.nftInfos[id].usetime = result;
            var endTime = result + 86400;
            var now = (new Date()).getTime() / 1000;
            var grade = UserNFT.nftInfos[id].grade;
            //it is not available now
            if (endTime > now) {

            } else {
                if (grade == 1) {
                    $("#grade1unuse").text(parseInt($("#grade1unuse").text()) + 1);
                } else if (grade == 2) {
                    $("#grade2unuse").text(parseInt($("#grade2unuse").text()) + 1);
                } else if (grade == 3) {
                    $("#grade3unuse").text(parseInt($("#grade3unuse").text()) + 1);
                }
            }

        });
    },
    initNFTTable: function (use) {
        $(".pricingTable").empty();
        $(".pricingTable").append(NFT.createNFTs(UserNFT.nftIds, UserNFT.nftInfos, use));
    },
    updateNFTTable: function () {
        console.log("updateNFTTable page=" + currentPage);
        if (currentPage === "reward") {
            UserNFT.initNFTTable(nftUse[0]);
        } else if (currentPage === "me") {
            UserNFT.initNFTTable(nftUse[2]);
        } else {
            if (currentPagePoolID != "") {
                UserNFT.initNFTTable(nftUse[1]);
            }
        }
    }
}
