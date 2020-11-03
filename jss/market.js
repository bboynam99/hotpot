const utils = require('web3-utils');
const BigNumber = require("big-number");
const BN = require('bn.js');

function getPriceBytes(price) {
    var p = new BigNumber(price);
    p.mult(10**18);
    console.log("p="+p.toString());
    return utils.padLeft(utils.toHex(p.toString()), 64)
}

Market = {
    listSize: 0,
    listIds: [],
    listTokens: {},
    allowance: 0,
    eventBlocks: new Set(),
    eventBlocks1: new Set(),
    initMarketInfo: function () {
        console.log("initMarketInfo");
        Market.initSellTable();
        contractsInstance.HotPot.Approval({ owner: defaultAccount, spender: contractsInstance.NFTMarket.address }, function (error, result) {
            if (!error) {
                console.log("Market Approval");
                if (Market.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Market.eventBlocks.add(result.blockNumber);
                
                var nb = new BN(10);
                nb = nb.pow(new BN(30));
                if(result.args.value.lt(nb)){
                    return;
                }
                
                Market.allowance = result.args.value;
                console.log("approval spender=" + result.args.spender);
                Market.initSellTable();
            }
        });
        contractsInstance.HotPot.allowance(defaultAccount, contractsInstance.NFTMarket.address, function (e, r) {
            if (!e) {
                Market.allowance = r;
            }
            contractsInstance.NFTMarket.getListToken(function (e, r) {
                console.log("market getListToken=" + r);
                Market.listIds = r;
                for (var i = 0; i < r.length; i++) {
                    Market.getNFTInfo(r[i]);
                }
            });
        });
        contractsInstance.NFTMarket.getListSize(function (e, r) {
            console.log("market size=" + r);
            Market.listSize = r;
        });
        console.log("Listed");
        contractsInstance.NFTMarket.Listed(function (e, result) {
            console.log("Listed block num=" + result.blockNumber);
            if (Market.eventBlocks.has(result.blockNumber)) {
                return;
            }
            Market.eventBlocks.add(result.blockNumber);
            if (e) {
                toastAlert("Error:" + e.message);
            } else {
                showTopMsg("List Success", 4000);
                var id = result.args._tokenId;
                var price = result.args._price;
                var seller = result.args._seller;

                Market.listIds.push(id);
                var nft = Market.createSellNft(id,1);
                nft.price = price;
                nft.seller = seller;
                contractsInstance.NFTHotPot.getGrade(id,function(e,r){
                    if(!e){
                        nft.grade = r;
                        Market.addNFTToTable(nft);
                    }
                });
            }
        });
        console.log("Unlisted");
        contractsInstance.NFTMarket.Unlisted(function (e, r) {
            console.log("Unlisted block num=" + result.blockNumber);
            if (Market.eventBlocks.has(result.blockNumber)) {
                return;
            }
            Market.eventBlocks.add(result.blockNumber);
            Market.removeNFT(r.args._tokenId);
        });
        Market.addHistory();
    },
    addHistory:function(){
        console.log("addHistory");
        $("#tablesellhistory").empty();
        var node = $("<tr  style='height:60px!important;'></tr>");
        var nodeid = $("<td>ID</td>");
        var nodegrade = $("<td data-lang='grade'></td>").text(getString('grade'));
        var nodeprice = $("<td data-lang='price'></td>").text(getString('price'));
        var nodeaction = $("<td data-lang='buyer' style='text-align: center!important;'></td>").text(getString('buyer'));
        var nodeblock = $("<td data-lang='actiontime' style='text-align: center;'></td>").text(getString('actiontime'));
        node.append(nodeid);
        node.append(nodegrade);
        node.append(nodeprice);
        node.append(nodeaction);
        node.append(nodeblock);
        $("#tablesellhistory").append(node);

        var events = contractsInstance.NFTMarket.allEvents({filter:{event:'Swapped'},fromBlock: 0, toBlock: 'latest'});
        events.get(function(e,r){
            for(var i=0;i<r.length;i++){
                var event = r[i];
                if(event.event == 'Swapped'){
                    console.log("Swapped");
                    var info = Market.createSellInfo(event.args._buyer,event.args._tokenId,
                        event.args._price,event.transactionHash,event.blockNumber);
                    Market.addSellInfo(info);
                }
            }
        });
        events.stopWatching();
    },
    createSellInfo:function(buyer,tokenId,price,hash,blockNumber){
        var info =new Object();
        info.buyer=buyer;
        info.id=tokenId;
        info.price=price;
        info.grade = 1;
        info.hash = hash;
        info.blockNumber=blockNumber;
        return info;
    },
    addSellInfo:function(nft){
        // var h = $("<p></p>").text(info.borrower+" borrowed ID="+info.tokenId+",price per day "+info.pricePerDay/10**18+" HotPot");
        // $("#loanhistory").append(h);
        var node = $("<tr  style='height:60px!important;'></tr>");

        var nodeid = $("<td></td>").text(formatZero(nft.id, 3));
        node.append(nodeid);

        var nodegradein;
        if(nft.grade==1){
            nodegradein=$("<span data-lang='grade1'></span>").text(getString('grade1'));
        }
        else if (nft.grade == 2) {
            nodegradein=$("<span data-lang='grade2'></span>").text(getString('grade2'));
        } else if (nft.grade == 3) {
            nodegradein=$("<span data-lang='grade3'></span>").text(getString('grade3'));
        }

        var nodegrade = $("<td></td>");
        nodegrade.append(nodegradein);
        node.append(nodegrade);

        var price = nft.price.div(Math.pow(10, 18));
        if (price > 10000) {
            price = 0;
        }
        var nodeprice = $("<td></td>").text(price.toFixed(2));
        node.append(nodeprice);

        var pre = nft.buyer.substr(0,5);
        var last = nft.buyer.substr(nft.buyer.length-5,nft.buyer.length-1);
        var text = pre +"..."+last;
        var nodea = $("<a target='_blank' style='color:blue'></a>").text(text);
        nodea.attr("href",getEthersanUrl(nft.hash));
        var nodetdbtn = $("<td style='text-align: center;'></td>").append(nodea);

        node.append(nodetdbtn);
        
        var timestamp = web3.eth.getBlock(nft.blockNumber).timestamp;
        var now = Math.floor((new Date()).getTime()/1000);
        var delay = now - timestamp;
        var delaystr = formatTime2Min(delay)+" "+getString('ago');

        var nodeblockNumber = $("<td style='text-align: center;'></td>").text(delaystr);
        node.append(nodeblockNumber);

        $("#tablesellhistory").append(node);
    },
    removeNFT:function(tokenId){
        console.log("removeNFT="+tokenId);
        var position = -1;
        for(var i=0;i<Market.listIds.length;i++){
            if(tokenId == Market.listIds[i]){
                position = i;
                break;
            }
        }
        if(position!=-1){
            Market.listIds.splice(position,1);
        }
        delete UsMarketerNFT.listTokens[tokenId];
        var id = "#tr"+tokenId;
        $(id).remove();
    },
    approve:function(){
        contractsInstance.HotPot.approve(contractsInstance.NFTMarket.address, web3.toHex(Math.pow(10, 30)), function (e, r) {
            afterSendTx(e, r);
        });
    },
    cancelSell: function (id) {
        console.log("cancleSell " + id);
        contractsInstance.NFTMarket.unlist(id, function (e, r) {
            afterSendTx(e, r);
        });
    },
    buyNFT: function (id) {
        console.log("buyNFT " + id);
        var price = Market.listTokens[id].price;
        if(defaultBalance.lt(price)){
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.NFTMarket.swap(id, function (e, r) {
            afterSendTx(e, r);
        })
    },
    sellNFT: function (id) {
        if(!UserNFT.isAvailable(id)){
            toastAlert(getString('nftnotavailable'));
            return;
        }
        var nft = UserNFT.nftInfos[id];
        if(nft.loan){
            toastAlert(getString('loaning'));
            return;
        }
        showSellAlert(id);
    },
    sellSure: function () {
        var id = getSellAlertId();
        console.log("sell sure id=" + id);

        hideSellAlert();
        var input = $('.stakeInput').val();
        var price = parseFloat(input);
        if (price <= 0) {
            toastAlert(getString('priceerror'));
            return;
        }
        // price = web3.toHex(price * Math.pow(10, 18));
        // var bn = new BigNumber(price*10**18);
        // price = utils.padLeft(utils.toHex(bn), 64)
        id = parseInt(id);
        contractsInstance.NFTHotPot.safeTransferFrom['address,address,uint256,bytes'](defaultAccount, contractAddress.market, id, getPriceBytes(price), function (e, result) {
            if (e) {
                toastAlert("Error:" + e.message);
            } else {
                showTopMsg("Pending...", 0, getEthersanUrl(result));
                startListenTX(result);
            }
        });
    },
    getNFTInfo: async function (id) {
        console.log("getNFTInfo id=" + id);
        contractsInstance.NFTMarket.sellerOf(id,function(e,r){
            if(r == defaultAccount){
                var nft = NFT.createNFTInfo(id,defaultAccount);
                UserNFT.sellNFTs[id] = nft;
                UserNFT.sellNFTs[id].sell = true;
                UserNFT.sellIds.push(id);
                UserNFT.userBalance = UserNFT.userBalance.plus(1);
                UserNFT.updateUserNFT();
            }
            contractsInstance.NFTHotPot.getGrade(id, function (e, r) {
                var grade = r;
                if(UserNFT.sellNFTs[id])
                UserNFT.sellNFTs[id].grade = r;
                var nft = Market.createSellNft(id, grade);
                Market.listTokens[id] = nft;
    
                contractsInstance.NFTMarket.priceOf(id, function (e, r) {
                    var price = r;
                    Market.listTokens[id].price = price;
                    contractsInstance.NFTMarket.sellerOf(id, function (e, r) {
                        Market.listTokens[id].seller = r;
                        Market.addNFTToTable(Market.listTokens[id]);
                    });
    
                });
            });
        });
        
    },

    initSellTable:function(){
        console.log("initSellTable");
        $("#tablesell").empty();
        var node = $("<tr></tr>");
        var nodeid = $("<td>ID</td>");
        var nodegrade = $("<td data-lang='grade'></td>").text(getString('grade'));
        var nodeprice = $("<td data-lang='price'></td>").text(getString('price'));
        var nodeaction = $("<td data-lang='action' style='text-align: center;'></td>").text(getString('action'));
        node.append(nodeid);
        node.append(nodegrade);
        node.append(nodeprice);
        node.append(nodeaction);
        $("#tablesell").append(node);

        for(var i=0;i<Market.listIds.length;i++){
            var id = Market.listIds[i];
            var nft = Market.listTokens[id];
            Market.addNFTToTable(nft);
        }
    },
    addNFTToTable: function (nft) {
        var node = $("<tr></tr>");
        node.attr("id","tr"+nft.id);

        var nodeid = $("<td></td>").text(formatZero(nft.id, 3));
        node.append(nodeid);

        var nodegradein;
        if(nft.grade==1){
            nodegradein=$("<span data-lang='grade1'></span>").text(getString('grade1'));
        }
        else if (nft.grade == 2) {
            nodegradein=$("<span data-lang='grade2'></span>").text(getString('grade2'));
        } else if (nft.grade == 3) {
            nodegradein=$("<span data-lang='grade3'></span>").text(getString('grade3'));
        }

        var nodegrade = $("<td></td>");
        nodegrade.append(nodegradein);
        node.append(nodegrade);

        var price = nft.price.div(Math.pow(10, 18));
        if (price > 10000) {
            price = 0;
        }
        var nodeprice = $("<td></td>").text(price.toFixed(2));
        node.append(nodeprice);

        var nodetdbtn = $("<td style='text-align: center;'></td>");

        if(Market.allowance==0){
            var nodebtn = $("<button class='green button' data-lang='approve'></button>").text(getString('approve'));
            nodetdbtn.on("click", nodebtn, function () { Market.approve() });
            nodetdbtn.append(nodebtn);            
        }else{
            if (nft.seller == defaultAccount) {
                var nodebtn = $("<button class='green button' data-lang='cancelsell'></button>").text(getString('cancelsell'));
                nodetdbtn.on("click", nodebtn, function () { Market.cancelSell(nft.id) });
                nodetdbtn.append(nodebtn);
            } else {
                var nodebtn = $("<button class='green button' data-lang='buy'></button>").text(getString('buy'));
                nodetdbtn.on("click", nodebtn, function () { Market.buyNFT(nft.id) });
                nodetdbtn.append(nodebtn);
            }
        }
        node.append(nodetdbtn);

        $("#tablesell").append(node);
    },
    createSellNft: function (id, grade) {
        var object = new Object;
        object.id = id;
        object.grade = grade;
        object.price = 0;
        object.seller = null;
        return object;
    }
}
