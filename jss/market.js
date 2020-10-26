const utils = require('web3-utils');
// const BigNumber = require("big-number");

function getPriceBytes(price) {
    var p = new BigNumber(price);
    p.multipliedBy(10**18);
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
        contractsInstance.HotPot.Approval({ owner: App.defaultAccount, spender: contractsInstance.NFTMarket.address }, function (error, result) {
            if (!error) {
                // toastAlert("Approve success!");
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

    // event Swapped(
    //     address indexed _buyer,
    //     address indexed _seller,
    //     uint256 indexed _tokenId,
    //     uint256 _price
    // );
        // contractsInstance.NFTMarket.Swapped(function (e, r) {
        //     console.log("Swapped block num=" + result.blockNumber);
        //     if (Market.eventBlocks.has(result.blockNumber)) {
        //         return;
        //     }
        //     Market.eventBlocks.add(result.blockNumber);
        //     Market.removeNFT(r.args._tokenId);
        // });
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
    cancleSell: function (id) {
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
        contractsInstance.NFTHotPot.safeTransferFrom['address,address,uint256,bytes'](App.defaultAccount, contractAddress.market, id, getPriceBytes(price), function (e, result) {
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
        contractsInstance.NFTHotPot.getGrade(id, function (e, r) {
            var grade = r;
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
    },

    initSellTable:function(){
        console.log("initSellTable");
        $("#tablesell").empty();
        var node = $("<tr></tr>");
        var nodeid = $("<td>ID</td>");
        var nodegrade = $("<td></td>").text(getString('grade'));
        var nodeprice = $("<td></td>").text(getString('price'));
        var nodeaction = $("<td style='text-align: center;'></td>").text(getString('action'));
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

        var grade = getString('grade1');
        if (nft.grade == 2) {
            grade = getString('grade2');
        } else if (nft.grade == 3) {
            grade = getString('grade3');
        }
        var nodegrade = $("<td></td>").text(grade);
        node.append(nodegrade);

        var price = nft.price.div(Math.pow(10, 18));
        if (price > 10000) {
            price = 0;
        }
        var nodeprice = $("<td></td>").text(price.toFixed(2));
        node.append(nodeprice);

        var nodetdbtn = $("<td style='text-align: center;'></td>");

        if(Market.allowance==0){
            var nodebtn = $("<button class='green button'></button>").text(getString('approve'));
            nodetdbtn.on("click", nodebtn, function () { Market.approve() });
            nodetdbtn.append(nodebtn);            
        }else{
            if (nft.seller == defaultAccount) {
                var nodebtn = $("<button class='green button'></button>").text(getString('canclesell'));
                nodetdbtn.on("click", nodebtn, function () { Market.cancleSell(nft.id) });
                nodetdbtn.append(nodebtn);
            } else {
                var nodebtn = $("<button class='green button'></button>").text(getString('buy'));
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
