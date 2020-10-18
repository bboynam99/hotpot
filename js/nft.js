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

        if (nft.usetime + 86400 > (new Date()).getTime() / 1000) {
            canUse = false;
            availabe = "Charging : 20h 10:36"

            let fomoTime = Math.floor(nft.usetime + 86400 - (new Date()).getTime() / 1000);
            console.log("charger time=" + fomoTime);
            availabe = "Charging : " + formatFomoTime(fomoTime);
            if (fomoTime > 0) {
                setInterval(() => {
                    fomoTime -= 1;
                    $("#nftusetime" + nft.id).text("Charging : " + formatFomoTime(fomoTime))
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
}


function formatFomoTime(t) {
    if (t < 0) {
        return "已结束，奖励结算中";
    }
    // console.log("formatFomoTime : "+t)
    const times = Math.floor(t);
    const h = Math.floor(times / 3600);
    const m = Math.floor((times % 3600) / 60);
    const s = times % 60;
    return h + "h " + m + "m " + ' ' + + s + "s";
}

function formatZero(num, len) {
    if (String(num).length > len) return num;
    return (Array(len).join(0) + num).slice(-len);
}