

// <ul class="pricingTable-firstTable">
// <li class="pricingTable-firstTable_table">
//     <h1 class="pricingTable-firstTable_table__header">Member Card</h1>
//     <p class="pricingTable-firstTable_table__pricing"><span>ID:</span><span>001</span><span>/1000</span>
//     </p>
//     <ul class="pricingTable-firstTable_table__options">
//         <li>Available</li>
//         <li>Loaning</li>
//     </ul>
//     <div class="pricingTable-firstTable_table__getstart">DIVIDENDS</div>
// </li>

// <li class="pricingTable-firstTable_table">
//     <h1 class="pricingTable-firstTable_table__header">Gold Member Card</h1>
//     <p class="pricingTable-firstTable_table__pricing"><span>ID:</span><span>002</span><span>/1000</span>
//     </p>
//     <ul class="pricingTable-firstTable_table__options">
//         <li>Charging : 20h 10:36</li>
//     </ul>
//     <div class="pricingTable-firstTable_table__getstart">DIVIDENDS</div>
// </li>

// </ul>

var nftUse = [
    'reward',
    'stake'
]

NFT = {
    createNFT: function (nft, use) {
        var nodeli = $("<li class='pricingTable-firstTable_table'></li>");
        var name = "Member Card";
        if (nft.grade == 2) {
            name = "Gold Member Card";
        } else if (nft.grade == 3) {
            name = "Epic Member Card";
        }

        var nodeh1 = $("<h1 class='pricingTable-firstTable_table__header'></h1>").text(name);

        //<span>ID:</span><span>002</span><span>/1000</span>
        var phtml = "<span>ID:</span><span>" + nft.id + "</span><span>/1000</span>";
        var nodep = $("<p class='pricingTable-firstTable_table__pricing'></p>").html(phtml);
        var nodeul = $("<ul class='pricingTable-firstTable_table__options'></ul>");
        var availabe = "Available";
        if (nft.usetime + 86400 > (new Date()).getTime() / 1000) {
            availabe = "Charging : 20h 10:36"
        }
        var nodeli1 = $("<li></li>").text(availabe);
        nodeli1.attr("id", "nftusetime" + nft.id);
        nodeul.append(nodeli1);

        var button = "DIVIDENDS";
        if (use === nftUse[1]) {
            button = "CLAIM";
        }
        var nodediv = $("<div class='pricingTable-firstTable_table__getstart'></div>").text(button);

        nodeli.append(nodeh1);
        nodeli.append(nodep);
        nodeli.append(nodeul);
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
                    if (count > ids.length) {
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