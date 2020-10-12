var walletAddress;

if(typeof window.ethereum != 'undefined'){
    console.log("Metamask is installed!");
    async function trigger(){
        let accounts = await window.ethereum.request(
            {
                method:'eth_requestAccounts'
            }
        );
        console.log("account="+accounts[0]);
        // console.log("address Yes:" + window.tronWeb.defaultAddress.base58)
		walletAddress = accounts[0];
		updateConnectStatus();
    }
    trigger();
}

function updateConnectStatus() {
	$('body').addClass('web3');
	getBalance();
}

function getBalance(){

}


function hidepages() {
	$('main').hide();
}


function recoveABottom(){
	document.getElementById("ahome").style.borderBottomColor = "transparent";
	document.getElementById("areward").style.borderBottomColor = "transparent";
	document.getElementById("afarms").style.borderBottomColor = "transparent";
	document.getElementById("aexchange").style.borderBottomColor = "transparent";
	document.getElementById("agacha").style.borderBottomColor = "transparent";
	document.getElementById("aabout").style.borderBottomColor = "transparent";
	document.getElementById("ame").style.borderBottomColor = "transparent";
}


function nav(classname) {
	hidepages();
	$('body').removeClass('approved');

	if (classname.indexOf('pool') === 0) {
		$('#singlepool').show();
		currentPagePoolID = classname.slice(4);
		initpooldata(currentPagePoolID);
		$('main.pool').show();
	} else {
		$('main.' + classname).show();
		// updateAllTokens();
	}
	if(classname === "home"){
		$("#infodiv").show();
	}else{
		$("#infodiv").hide();
	}
	recoveABottom();
	let aa = "a"+classname;
	//border-bottom-color: rgba(255, 255, 255, .25);
	document.getElementById(aa).style.borderBottomColor = "rgba(255, 255, 255, .25)";

	if(classname == "home"){
		$("#ticketinfo").hide();
	}else{
		$("#ticketinfo").show();
	}

}
