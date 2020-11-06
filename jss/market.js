function getPriceBytes(price) {
    var p = (new BigNumber(price)).times(10 ** 18);
    console.log("p=" + p.toString());
    return web3.utils.padLeft(web3.utils.numberToHex(p.toString()), 64)
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
        contractsInstance.HotPot.events.Approval({ filter:{owner: defaultAccount, spender: contractsInstance.NFTMarket._address} }, function (error, result) {
            if (!error) {
                if(result.returnValues.owner!=defaultAccount || result.returnValues.spender!=contractsInstance.NFTMarket._address){
                    return;
                }
                // console.log("Market Approval");
                if (Market.eventBlocks.has(result.blockNumber)) {
                    return;
                }
                Market.eventBlocks.add(result.blockNumber);
                result.returnValues.value = new BigNumber(result.returnValues.value);

                if (result.returnValues.value.lt(new BigNumber(10 ** 30))) {
                    return;
                }

                Market.allowance = result.returnValues.value;
                console.log("approval spender=" + result.returnValues.spender);
                Market.initSellTable();
            }
        });
        contractsInstance.HotPot.methods.allowance(defaultAccount, contractsInstance.NFTMarket._address).call(function (e, r) {
            if (!e) {
                Market.allowance = new BigNumber(r);
            }
            contractsInstance.NFTMarket.methods.getListToken().call(function (e, r) {
                console.log("market getListToken=" + r);
                for (var i = 0; i < r.length; i++) {
                    Market.listIds.push(parseInt(r[i]));
                    Market.getNFTInfo(parseInt(r[i]));
                }
            });
        });
        contractsInstance.NFTMarket.methods.getListSize().call(function (e, r) {
            console.log("market size=" + r);
            Market.listSize = parseInt(r);
        });
        console.log("Listed");
        contractsInstance.NFTMarket.events.Listed(function (e, result) {
            if (Market.eventBlocks.has(result.blockNumber)) {
                return;
            }
            Market.eventBlocks.add(result.blockNumber);
            
            if (e) {
                if(result.returnValues._seller==defaultAccount)
                toastAlert("Error:" + e.message);
            } else {
                if(result.returnValues._seller==defaultAccount)
                showTopMsg("List Success", 4000);
                var id = parseInt(result.returnValues._tokenId);
                var price = result.returnValues._price;
                var seller = result.returnValues._seller;

                Market.listIds.push(3);
                var nft = Market.createSellNft(id, 1);
                nft.price = new BigNumber(price);
                nft.seller = seller;
                contractsInstance.NFTHotPot.methods.getGrade(id).call(function (e, r) {
                    if (!e) {
                        nft.grade = parseInt(r);
                        Market.addNFTToTable(nft);
                        if(nft.seller==defaultAccount){
                            UserNFT.addSellList(nft);
                        }
                    }
                });
            }
        });
        console.log("Unlisted");
        contractsInstance.NFTMarket.events.Unlisted(function (e, result) {
            if (Market.eventBlocks.has(result.blockNumber)) {
                return;
            }
            Market.eventBlocks.add(result.blockNumber);
            console.log("Unlisted block num=" + result.blockNumber);
            if(result.returnValues._seller==defaultAccount){
                UserNFT.removeSellList(parseInt(result.returnValues._tokenId));
            }
            Market.removeNFT(parseInt(result.returnValues._tokenId));
            if(result.returnValues._seller==defaultAccount)
            showTopMsg("Unlist Success", 4000);
        });
        Market.addHistory();
    },
    addHistory: function () {
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

        contractsInstance.NFTMarket.events.allEvents({ filter: { event: 'Swapped' }, fromBlock: 0, toBlock: 'latest' }, function (e, r) {
            for (var i = 0; i < r.length; i++) {
                var event = r[i];
                if (event.event == 'Swapped') {
                    console.log("Swapped");
                    var info = Market.createSellInfo(event.returnValues._buyer, event.returnValues._tokenId,
                        new BigNumber(event.returnValues._price), event.transactionHash, event.blockNumber);
                    Market.addSellInfo(info);
                }
            }
        });
    },
    createSellInfo: function (buyer, tokenId, price, hash, blockNumber) {
        var info = new Object();
        info.buyer = buyer;
        info.id = tokenId;
        info.price = price;
        info.grade = 1;
        info.hash = hash;
        info.blockNumber = blockNumber;
        return info;
    },
    addSellInfo: function (nft) {
        // var h = $("<p></p>").text(info.borrower+" borrowed ID="+info.tokenId+",price per day "+info.pricePerDay/10**18+" HotPot");
        // $("#loanhistory").append(h);
        var node = $("<tr  style='height:60px!important;'></tr>");

        var nodeid = $("<td></td>").text(formatZero(nft.id, 3));
        node.append(nodeid);

        var nodegradein;
        if (nft.grade == 1) {
            nodegradein = $("<span data-lang='grade1'></span>").text(getString('grade1'));
        }
        else if (nft.grade == 2) {
            nodegradein = $("<span data-lang='grade2'></span>").text(getString('grade2'));
        } else if (nft.grade == 3) {
            nodegradein = $("<span data-lang='grade3'></span>").text(getString('grade3'));
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

        var pre = nft.buyer.substr(0, 5);
        var last = nft.buyer.substr(nft.buyer.length - 5, nft.buyer.length - 1);
        var text = pre + "..." + last;
        var nodea = $("<a target='_blank' style='color:blue'></a>").text(text);
        nodea.attr("href", getEthersanUrl(nft.hash));
        var nodetdbtn = $("<td style='text-align: center;'></td>").append(nodea);

        node.append(nodetdbtn);

        var timestamp = web3.eth.getBlock(nft.blockNumber).timestamp;
        var now = Math.floor((new Date()).getTime() / 1000);
        var delay = now - timestamp;
        var delaystr = formatTime2Min(delay) + " " + getString('ago');

        var nodeblockNumber = $("<td style='text-align: center;'></td>").text(delaystr);
        node.append(nodeblockNumber);

        $("#tablesellhistory").append(node);
    },
    removeNFT: function (tokenId) {
        console.log("removeNFT=" + tokenId);
        var position = -1;
        for (var i = 0; i < Market.listIds.length; i++) {
            if (tokenId == Market.listIds[i]) {
                position = i;
                break;
            }
        }
        if (position != -1) {
            Market.listIds.splice(0, 1);
        }
        delete Market.listTokens[tokenId];
        var id = "#tr" + tokenId;
        $(id).remove();
    },
    approve: function () {
        contractsInstance.HotPot.methods.approve(contractsInstance.NFTMarket._address, web3.utils.numberToHex(new BigNumber(Math.pow(10, 30)))).send({ from: defaultAccount }, function (e, r) {
            afterSendTx(e, r);
        });
    },
    cancelSell: function (id) {
        console.log("cancleSell " + id);
        contractsInstance.NFTMarket.methods.unlist(id).send({ from: defaultAccount }, function (e, r) {
            afterSendTx(e, r);
        });
    },
    buyNFT: function (id) {
        console.log("buyNFT " + id);
        var price = Market.listTokens[id].price;
        if (defaultBalance.lt(price)) {
            toastAlert(getString('hotnotenough'));
            return;
        }
        contractsInstance.NFTMarket.methods.swap(id).send({ from: defaultAccount }, function (e, r) {
            afterSendTx(e, r);
        })
    },
    sellNFT: function (id) {
        if (!UserNFT.isAvailable(id)) {
            toastAlert(getString('nftnotavailable'));
            return;
        }
        var nft = UserNFT.nftInfos[id];
        if (nft.loan) {
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
        id = parseInt(id);
        //['address,address,uint256,bytes']
        contractsInstance.NFTHotPot.methods.safeTransferFrom(defaultAccount, contractAddress.market, id, getPriceBytes(price)).send({ from: defaultAccount }, function (e, result) {
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
        contractsInstance.NFTMarket.methods.sellerOf(id).call(function (e, r) {
            if (r == defaultAccount) {
                var nft = NFT.createNFTInfo(id, defaultAccount);
                UserNFT.sellNFTs[id] = nft;
                UserNFT.sellNFTs[id].sell = true;
                UserNFT.sellIds.push(id);
                UserNFT.userBalance = UserNFT.userBalance.plus(1);
                UserNFT.updateUserNFT();
            }
            contractsInstance.NFTHotPot.methods.getGrade(id).call(function (e, r) {
                var grade = parseInt(r);
                if (UserNFT.sellNFTs[id])
                    UserNFT.sellNFTs[id].grade = grade;
                var nft = Market.createSellNft(id, grade);
                Market.listTokens[id] = nft;

                contractsInstance.NFTMarket.methods.priceOf(id).call(function (e, r) {
                    var price = new BigNumber(r);
                    Market.listTokens[id].price = price;
                    contractsInstance.NFTMarket.methods.sellerOf(id).call(function (e, r) {
                        Market.listTokens[id].seller = r;
                        Market.addNFTToTable(Market.listTokens[id]);
                    });

                });
            });
        });

    },

    initSellTable: function () {
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

        for (var i = 0; i < Market.listIds.length; i++) {
            var id = Market.listIds[i];
            var nft = Market.listTokens[id];
            console.log("i="+i+",id="+id+",nft id="+nft.id);
            Market.addNFTToTable(nft);
        }
    },
    addNFTToTable: function (nft) {
        var node = $("<tr></tr>");
        node.attr("id", "tr" + nft.id);

        var nodeid = $("<td></td>").text(formatZero(nft.id, 3));
        node.append(nodeid);

        var nodegradein;
        if (nft.grade == 1) {
            nodegradein = $("<span data-lang='grade1'></span>").text(getString('grade1'));
        }
        else if (nft.grade == 2) {
            nodegradein = $("<span data-lang='grade2'></span>").text(getString('grade2'));
        } else if (nft.grade == 3) {
            nodegradein = $("<span data-lang='grade3'></span>").text(getString('grade3'));
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

        if (Market.allowance == 0) {
            var nodebtn = $("<button class='green button' data-lang='approve'></button>").text(getString('approve'));
            nodetdbtn.on("click", nodebtn, function () { Market.approve() });
            nodetdbtn.append(nodebtn);
        } else {
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
