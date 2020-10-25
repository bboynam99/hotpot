const utils = require('web3-utils');
const BigNumber = require("big-number");

function getPriceBytes(price) {
    var p = new BigNumber(price);
    p.mult(10**18);
    console.log("p="+p.toString());
    return utils.padLeft(utils.toHex(p.toString()), 64)
}

Loan = {
    listSize: 0,
    listIds: [],
    listTokens: {},
    allowance: 0,
    eventBlocks: new Set(),
    eventBlocks1: new Set(),
    getLoan: function () {
        Loan.initLoanTable();
        contractsInstance.HotPot.Approval({ owner: App.defaultAccount, spender: contractsInstance.Loan.address }, function (error, result) {
            if (!error) {
                // toastAlert("Approve success!");
                if (Loan.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Loan.eventBlocks.add(result.blockNumber);
                if(!result.args.value.isEqualTo(Math.pow(10, 30))){
                    return;
                }
                Loan.allowance = result.args.value;
                console.log("approval spender=" + result.args.spender);
                Loan.initLoanTable();
            }
        });
        contractsInstance.HotPot.allowance(defaultAccount, contractsInstance.Loan.address, function (e, r) {
            if (!e) {
                Loan.allowance = r;
            }
            contractsInstance.Loan.getLoanList(function (e, r) {
                console.log("market getListToken=" + r);
                Loan.listIds = r;
                for (var i = 0; i < r.length; i++) {
                    Loan.getNFTInfo(r[i]);
                }
            });
        });
        contractsInstance.Loan.getLoanSize(function (e, r) {
            console.log("getLoanSize=" + r);
            if (!e) {
                Loan.listSize = r;
            }
        });

        contractsInstance.Loan.getLoanList(function (e, r) {
            console.log("getLoanList=" + r);
            if (!e) {
                Loan.listIds = r;
            }
        });
        contractsInstance.Loan.TokenDeposit(function (e, r) {
            console.log("TokenDeposit");
        });
        contractsInstance.Loan.TokenCancelDeposit(function (e, r) {
            console.log("TokenCancelDeposit");
        });
        contractsInstance.Loan.TokenBorrowed(function (e, r) {
            console.log("TokenBorrowed");
        });
    },
    getNFTInfo: async function (id) {
        console.log("getNFTInfo id=" + id);
        contractsInstance.NFTHotPot.getGrade(id, function (e, r) {
            var grade = r;
            var nft = Loan.createLoanNft(id, grade);
            Loan.listTokens[id] = nft;

            contractsInstance.NFTMarket.priceOf(id, function (e, r) {
                var price = r;
                Market.listTokens[id].price = price;
                contractsInstance.NFTMarket.sellerOf(id, function (e, r) {
                    Market.listTokens[id].seller = r;
                    Market.addNFTToTable(Market.listTokens[id]);
                });

            });
        });
    },
    initLoanTable:function(){
        console.log("initLoanTable");
        $("#tableloan").empty();
        var node = $("<tr></tr>");
        var nodeid = $("<td>ID</td>");
        var nodegrade = $("<td></td>").text(getString('grade'));
        var nodeprice = $("<td></td>").text(getString('priceday'));
        var nodeendtime = $("<td></td>").text(getString('nodeendtime'));
        var nodeaction = $("<td style='text-align: center;'></td>").text(getString('action'));
        node.append(nodeid);
        node.append(nodegrade);
        node.append(nodeprice);
        node.append(nodeendtime);
        node.append(nodeaction);
        $("#tablesell").append(node);

        for(var i=0;i<Loan.listIds.length;i++){
            var id = Loan.listIds[i];
            var nft = Loan.listTokens[id];
            Loan.addNFTToTable(nft);
        }
    },
    loanNFT: function (id) {
        var nft = UserNFT.nftInfos[id];
        if (!NFT.isAvailable(nft.usetime)) {
            toastAlert(getString('nftnotavailable'));
            return;
        }
        showLoanAlert(id);
    },
    loanSure: function () {
        var id = getSellAlertId();
        console.log("loan sure id=" + id);

        hideSellAlert();
        var input = $('.stakeInput').val();
        var price = parseFloat(input);
        if (price <= 0) {
            toastAlert(getString('priceerror'));
            return;
        }
        price = web3.toHex(price * Math.pow(10, 18));
        id = parseInt(id);

        //loanInput
        var time = $('.loanInput').val();

        var regex = /^\d+$/;
        if (regex.test(time)) {
            if (time < 366 && time > 0) {

            } else {
                toastAlert(getString('errorloanday'));
                return;
            }
        } else {
            toastAlert(getString('errorloanday'));
            return;
        }

        var day = parseInt(time);

        contractsInstance.Loan.TokenDeposit(function (e, result) {
            if (e) {
                toastAlert("Error:" + e.message);
            } else {
                showTopMsg("Loan Success", 4000);
            }
        });

        contractsInstance.Loan.deposit(id, day, price, function (e, result) {
            if (e) {
                toastAlert("Error:" + e.message);
            } else {
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    createLoanTable:function(nft){
        var node = $("<tr></tr>");

        var nodeid = $("<td></td>").text(formatZero(nft.td,3));
        node.append(nodeid);

        var grade = getString('grade1');
        if(nft.grade==2){
            grade = getString('grade2');
        }else if(nft.grade==3){
            grade = getString('grade3');
        }
        var nodegrade = $("<td><td>").text(grade);
        node.append(nodegrade);

        var usetime = parseInt((nft.usetime).valueOf());
        var delay = usetime + 86400 - ((new Date()).getTime()) / 1000;

        var available = getString('available');
        if (delay>0) {
            available = formatTime(delay);
        }   
        var nodeav = $("<td></td>").text(available);
        node.append(nodeav);

        var price = (nft.price.div(Math.pow(10,18))).valueOf();
        var nodeprice = $("<td></td>").text(price.toFixed(2));
        node.append(nodeprice);

        var endTime = nft.startTime + nft.days*86400;
        var loanDelay = endTime - ((new Date()).getTime()) / 1000;
        var nodeloan = $("<td></td>").text(formatTime(loanDelay));
        node.append(nodeloan);

        var nodetdbtn = $("<td></td>");
        nodetdbtn.style.textAlign = "center";
        var nodebtn = $("<button class='green button'></button>");
        nodetdbtn.on("click",nodebtn,function(){Loan.loan(nft.id)});
        nodetdbtn.append(nodebtn);

        node.append(nodetdbtn);

        return node;
    },
    createLoansTable:function(ids, nfts){

    },
    createLoanNft:function(id,grade){
        var object = new Object;
        object.id = id;
        object.grade = grade;
        object.price = 0;
        object.days = 0;
        object.startTime = 0;
        object.owner = null;
        object.borrower = null;
        return object;
    }
}


