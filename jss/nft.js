var nftUse = [
    'reward',
    'stake',
    'me'
]

NFT = {
    createNFT: function (nft, use) {
        var nodeli = $("<li class='pricingTable-firstTable_table'></li>");

        var nodename = $("<span data-lang='grade1mb'></span>").text(getString('grade1mb'));
        if (nft.grade == 2) {
            nodename = $("<span data-lang='grade2mb'></span>").text(getString('grade2mb'));
        } else if (nft.grade == 3) {
            nodename = $("<span data-lang='grade3mb'></span>").text(getString('grade3mb'));
        }
        var nodeh1 = $("<h1 class='pricingTable-firstTable_table__header'></h1>");
        nodeh1.append(nodename);

        //<span>ID:</span><span>002</span><span>/1000</span>
        var phtml = "<span>ID:</span><span>" + formatZero(nft.id, 3) + "</span><span>/1000</span>";
        var nodep = $("<p class='pricingTable-firstTable_table__pricing'></p>").html(phtml);
        var nodeul = $("<ul class='pricingTable-firstTable_table__options'></ul>");
        var nodeavailable = $("<span data-lang='available'></span>").text(getString('available'));
        var canUse = true;

        if (nft.loan) {
            nodeavailable = $("<span data-lang='loaninginfo'></span>").text(getString('loaninginfo'));
        } else if (nft.sell) {
            nodeavailable = $("<span data-lang='selling'></span>").text(getString('selling'));
        }
        else {
            var usetime = parseInt((nft.usetime).valueOf());
            var delay = usetime + 86400 - ((new Date()).getTime()) / 1000;

            if (delay > 0) {
                canUse = false;

                let fomoTime = Math.floor(delay);
                console.log("charger time=" + fomoTime + ",id=" + nft.id);
                nodeavailable = $("<span></span>");
                var nodetime0 = $("<span  data-lang='charging'></span>").text(getString('charging'));
                nodeavailable.append(nodetime0);
                var nodetime = $("<span></span>");
                nodetime.attr("id", "nftusetime" + nft.id);
                nodeavailable.append(nodetime);
                if (fomoTime > 0) {
                    setInterval(() => {
                        fomoTime -= 1;
                        $("#nftusetime" + nft.id).text(" : " + formatTime(fomoTime))
                    }, 1000);
                }
            }
        }

        var nodeli1 = $("<li></li>");
        nodeli1.append(nodeavailable);
        nodeul.append(nodeli1);

        var borrowEndTime = nft.borrowEndTime;
        var now = Math.floor(((new Date()).getTime()) / 1000);

        if (borrowEndTime > now) {
            var nodeli2 = $("<li></li>");
            var nodeborrow = $("<span></span>");
            var nodeborrowinfo = $("<span  data-lang='borrowed'></span>").text(getString('borrowed'));
            nodeborrow.append(nodeborrowinfo);
            var nodeborrowtime = $("<span></span>").text(" : " + formatTime2Min(borrowEndTime - now));
            nodeborrow.append(nodeborrowtime);
            nodeli2.append(nodeborrow);
            nodeul.append(nodeli2);
        }

        nodeli.append(nodeh1);
        nodeli.append(nodep);
        nodeli.append(nodeul);

        var nodediv;
        if (!nft.sell && !nft.loan) {
            if (use === nftUse[1]) {
                if (canUse) {
                    nodediv = $("<div data-lang='claim'  class='pricingTable-firstTable_table__getstart'></div>").text(getString('claim'));
                    nodeli.on("click", nodediv, function () { Stake.claimByNFT(nft.id) });
                }
                else {
                    nodediv = $("<div data-lang='waitcharge' class='pricingTable-firstTable_table__getstart'></div>").text(getString('waitcharge'));
                }
            } else if (use === nftUse[0]) {
                if (canUse) {
                    nodediv = $("<div data-lang='bonus' class='pricingTable-firstTable_table__getstart'></div>").text(getString('bonus'));
                    nodeli.on("click", nodediv, function () { Reward.rewardByNFT(nft.id) });
                }
                else {
                    nodediv = $("<div data-lang='waitcharge' class='pricingTable-firstTable_table__getstart'></div>").text(getString('waitcharge'));
                }
            } else if (use === nftUse[2] && !nft.borrowed) {
                if (!nft.loan && !nft.sell) {
                    nodediv = $("<table></table>");
                    var nodetr = $("<tr></tr>");
                    var nodeth1 = $("<th style='background-color: white!important;padding:0px!important;'></th>");
                    var nodebtn1 = $("<div style='margin-right:5px;margin-left:5px;' data-lang='loan' class='pricingTable-firstTable_table__getstart' onclick='Loan.loanNFT(" + nft.id + ")'></div>").text(getString('loan'));
                    nodeth1.append(nodebtn1);
                    var nodeth2 = $("<th style='background-color: white!important;padding:0px!important;'></th>");
                    var nodedivsell = $("<div style='margin-right:5px;margin-left:5px;' data-lang='sell' class='pricingTable-firstTable_table__getstart' onclick='Market.sellNFT(" + nft.id + ")'></div>").text(getString('sell'));
                    nodeth2.append(nodedivsell);
                    nodetr.append(nodeth1);
                    nodetr.append(nodeth2);
                    nodediv.append(nodetr);
                }
            }
        } else {
            if (nft.loan)
                nodediv = $("<div data-lang='cancelloan' class='pricingTable-firstTable_table__getstart' onclick='Loan.cancelDeposit(" + nft.id + ")'></div>").text(getString('cancelloan'));
            if (nft.sell)
                nodediv = $("<div data-lang='cancelsell' class='pricingTable-firstTable_table__getstart' onclick='Market.cancelSell(" + nft.id + ")'></div>").text(getString('cancelsell'));
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
                    if (count > ids.length - 1) {
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
        nft.borrowed = false;
        nft.borrowEndTime = 0;
        return nft;
    },
    isAvailable: function (usetime) {
        var now = Math.floor((new Date()).getTime() / 1000);
        return usetime + 86400 < now;
    }
}


UserNFT = {
    nftIds: Array(),
    nftInfos: {},
    sellIds: Array(),
    sellNFTs: {},
    borrowIds: Array(),
    borrowNFTs: {},
    totalNFT: 0,
    userBalance: 0,
    gotoMyPage: function () {

    },
    nftBorrowed: function (object) {
        var borrower = object.borrower;
        var tokenId = parseInt(object.tokenId);
        if (borrower == defaultAccount) {
            console.log("I borrow this nft");
            UserNFT.borrowIds.push(tokenId);
            var borrow = NFT.createNFTInfo(tokenId, object.owner);
            borrow.grade = parseInt(object.grade);
            borrow.borrowed = true;
            borrow.borrowEndTime = parseInt(object.start) + parseInt(object.borrowDays) * 86400;
            UserNFT.borrowNFTs[tokenId] = borrow;
            contractsInstance.NFTHotPot.methods.getUseTime(tokenId).call(function (e, r) {
                if (!e) {
                    UserNFT.borrowNFTs[tokenId].usetime = parseInt(r);
                }
            });
            UserNFT.updateNFTTable();
            contractsInstance.NFTHotPot.events.UseTicket({ filter: { tokenId: tokenId } }, function (e, r) {
                if(r.returnValues.tokenId!=tokenId){
                    return;
                }
                if(checkSameEvent(r)){
                    return;
                }
                console.log("nft UseTicket tokenid=" + r.returnValues.tokenId);
                var id = parseInt(r.returnValues.tokenId);
                var time = parseInt(r.returnValues.useTime);
                UserNFT.borrowNFTs[id].usetime = time;
                UserNFT.updateNFTTable();
            });
        } else {
            var nft = UserNFT.nftInfos[tokenId];
            if (nft.id != 0) {
                console.log("My nft is borrowed");
                nft.borrowed = true;
                nft.borrowEndTime = parseInt(object.start) + parseInt(object.borrowDays) * 86400;
                UserNFT.updateNFTTable();
            }
        }
    },
    checkMyBorrowed: function (nft) {
        if (nft.borrower == defaultAccount) {
            var id = nft.id;
            var timenow = Math.floor((new Date()).getTime() / 1000);
            if (nft.borrowEndTime < timenow) {
                return;
            }
            UserNFT.borrowIds.push(nft.id);
            var borrow = NFT.createNFTInfo(nft.id, nft.owner);
            borrow.grade = nft.grade;
            borrow.borrowed = true;
            borrow.borrowEndTime = nft.borrowEndTime;
            UserNFT.borrowNFTs[nft.id] = borrow;
            contractsInstance.NFTHotPot.methods.getUseTime(id).call(function (e, r) {
                if (!e) {
                    UserNFT.borrowNFTs[id].usetime = parseInt(r);
                }
            });
            console.log("checkMyBorrowed =" + id);
            contractsInstance.NFTHotPot.events.UseTicket({ filter: { tokenId: id } }, function (e, r) {
                if(r.returnValues.tokenId!=id){
                    return;
                }
                if(checkSameEvent(r)){
                    return;
                }
                console.log("nft UseTicket tokenid=" + r.returnValues.tokenId);
                var id = parseInt(r.returnValues.tokenId);
                var time = parseInt(r.returnValues.useTime);
                UserNFT.borrowNFTs[id].usetime = time;
                UserNFT.updateNFTTable();
            });
        }
    },
    addLoanList: function (tokenId) {
        console.log("addLoanList " + tokenId);
        UserNFT.nftInfos[tokenId].loan = true;
        UserNFT.updateNFTTable();
    },
    removeLoanList: function (tokenId) {
        console.log("removeLoanList " + tokenId);
        UserNFT.nftInfos[tokenId].loan = false;
        UserNFT.updateNFTTable();
    },
    removeSellList: function (tokenId) {
        console.log("removeSellList " + tokenId);
        var position = -1;
        for (var i = 0; i < UserNFT.sellIds.length; i++) {
            if (tokenId == UserNFT.sellIds[i]) {
                position = i;
                break;
            }
        }
        if (position != -1) {
            UserNFT.sellIds.splice(position, 1);
        }
        delete UserNFT.sellNFTs[tokenId];
        UserNFT.updateNFTTable();
        UserNFT.userBalance = UserNFT.userBalance.minus(1);
        UserNFT.updateUserNFT();
    },
    addSellList: function (nft) {
        var id = nft.id;
        console.log("addSellList id=" + nft.id);
        UserNFT.sellNFTs[id] = nft;
        UserNFT.sellNFTs[id].sell = true;
        UserNFT.sellIds.push(id);
        UserNFT.userBalance = UserNFT.userBalance.plus(1);
        UserNFT.updateUserNFT();
    },
    isAvailable: function (id) {
        var nft = UserNFT.nftInfos[id];
        return NFT.isAvailable(nft.usetime);
    },
    updateMysell: function () {
        $(".mysell").text(sellIds.length);
    },
    updateMyLoan: function () {
        $(".myloan").text();
    },
    updateTotalNFT: function () {
        $(".ticketbalance").text(UserNFT.totalNFT);
    },
    updateUserNFT: function () {
        console.log("updateUserNFT");
        $(".myticketbalance").text(UserNFT.userBalance);
    },
    deleteNFT: function (tokenId) {
        console.log("deleteNFT " + tokenId);
        var position = -1;
        for (var i = 0; i < UserNFT.nftIds.length; i++) {
            if (tokenId == UserNFT.nftIds[i]) {
                position = i;
                break;
            }
        }
        if (position != -1) {
            UserNFT.nftIds.splice(position, 1);
        }
        delete UserNFT.nftInfos[tokenId];
        UserNFT.updateNFTTable();
    },
    addNFT: function (tokenId) {
        console.log("addNFT " + tokenId);
        UserNFT.nftIds.push(tokenId);
        var nft = NFT.createNFTInfo(tokenId, defaultAccount);
        UserNFT.nftInfos[tokenId] = nft;
        contractsInstance.NFTHotPot.methods.getGrade(tokenId).call(function (e, result) {
            console.log("get grade id=" + tokenId + ",grade=" + result);
            UserNFT.nftInfos[tokenId].grade = parseInt(result);
            UserNFT.getUseTime(tokenId);
            UserNFT.updateNFTTable();
        });
    },
    getNFTBalances: function () {
        console.log("getNFTBalances");
        // initiate contract for an address

        contractsInstance.NFTHotPot.methods.totalSupply().call(function (e, result) {
            UserNFT.totalNFT = new BigNumber(result);
            UserNFT.updateTotalNFT();
        });
        // event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
        // Transfer
        contractsInstance.NFTHotPot.events.Transfer({ filter: { from: defaultAccount } }, function (e, r) {
            if(r.returnValues.from!=defaultAccount){
                return;
            }
            if(checkSameEvent(r)){
                return;
            }
            console.log("nft out tokenid=" + r.returnValues.tokenId + ",to " + r.returnValues.to);
            console.log("nft block num=" + r.blockNumber);
            UserNFT.deleteNFT(r.returnValues.tokenId);
            UserNFT.userBalance = UserNFT.userBalance.minus(1);
            UserNFT.updateUserNFT();
        });
        contractsInstance.NFTHotPot.events.Transfer({ filter: { to: defaultAccount } }, function (e, r) {
            if(r.returnValues.to!=defaultAccount){
                return;
            }
            if(checkSameEvent(r)){
                return;
            }
            console.log("nft in tokenid=" + r.returnValues.tokenId + ",from " + r.returnValues.from);
            UserNFT.addNFT(parseInt(r.returnValues.tokenId));
            UserNFT.userBalance = UserNFT.userBalance.plus(1);
            UserNFT.updateUserNFT();
        });
        contractsInstance.NFTHotPot.events.UseTicket({ filter: { owner: defaultAccount } }, function (e, r) {
            if(r.returnValues.owner!=defaultAccount){
                return;
            }
            if(checkSameEvent(r)){
                return;
            }
            console.log("nft UseTicket tokenid=" + r.returnValues.tokenId);
            var id = parseInt(r.returnValues.tokenId);
            var time = parseInt(r.returnValues.useTime);
            UserNFT.nftInfos[id].usetime = time;

            UserNFT.updateNFTTable();
        });

        // call constant function
        contractsInstance.NFTHotPot.methods.balanceOf(defaultAccount).call(function (error, result) {
            console.log("getNFTBalances balanceOf=" + result) // '0x25434534534'
            UserNFT.userBalance = new BigNumber(result);
            UserNFT.nftIds = Array();

            $(".myticketbalance").text(result);

            for (var i = 0; i < result; i++) {
                contractsInstance.NFTHotPot.methods.tokenOfOwnerByIndex(defaultAccount, i).call(function (e, result) {
                    result = parseInt(result);
                    console.log("tokenOfOwnerByIndex id=" + result);
                    UserNFT.nftIds.push(result);
                    var nft = NFT.createNFTInfo(result, defaultAccount);
                    UserNFT.nftInfos[result] = nft;
                    UserNFT.getNFTInfo(result);
                });
            }
        });
    },
    getNFTInfo: function (id) {
        contractsInstance.NFTHotPot.methods.getGrade(id).call(function (e, result) {
            result = parseInt(result);
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

        contractsInstance.Loan.methods.reservations(id).call(function (e, r) {
            var tokenId = r[0];
            var owner = r[1];
            var borrower = r[2];
            var borrowEndTime = parseInt(r[3]);
            var pricePerDay = r[4];
            var start = parseInt(r[5]);
            var times = parseInt(r[6]);

            var lasttime = times * (86400) + (start);
            var timenow = Math.floor((new Date()).getTime() / 1000);
            if (timenow < lasttime) {
                console.log("this token is loan");
                UserNFT.nftInfos[id].loan = true;
            }
            if (borrowEndTime > timenow) {
                UserNFT.nftInfos[id].borrowed = true;
                UserNFT.nftInfos[id].borrowEndTime = borrowEndTime;
            }
        });
    },
    getUseTime: function (id) {
        contractsInstance.NFTHotPot.methods.getUseTime(id).call(function (e, result) {
            result = parseInt(result);
            console.log("get use time id=" + id + ",time=" + result);
            UserNFT.nftInfos[id].usetime = parseInt(result);
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
        $("#pricingTable").empty();
        var totalIds = Array();
        var nfts = {};
        for (var i = 0; i < UserNFT.nftIds.length; i++) {
            var id = UserNFT.nftIds[i];
            totalIds.push(id);
            nfts[id] = UserNFT.nftInfos[id];
        }
        for (var i = 0; i < UserNFT.sellIds.length; i++) {
            var id = UserNFT.sellIds[i];
            totalIds.push(id);
            nfts[id] = UserNFT.sellNFTs[id];
        }
        for (var i = 0; i < UserNFT.borrowIds.length; i++) {
            var id = UserNFT.borrowIds[i];
            totalIds.push(id);
            nfts[id] = UserNFT.borrowNFTs[id];
        }
        $("#pricingTable").append(NFT.createNFTs(totalIds, nfts, use));
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
