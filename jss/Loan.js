Loan = {
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

        var endTime = nft.startTime + nft.times*86400;
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
        object.times = 0;
        object.startTime = 0;
        object.usetime=0;
        object.owner = null;
        object.borrower = null;
        return object;
    }
}

