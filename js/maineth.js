//引用web3
// var Web3 = require("web3");
//引用truffle-contract
// var contract = require("truffle-contract");

var walletAddress;
var web3;


if (typeof window.ethereum != 'undefined') {
	console.log("Metamask is installed!");
	var ethereum = window.ethereum;

	async function trigger() {
		let accounts = await ethereum.request(
			{
				method: 'eth_requestAccounts'
			}
		);
		console.log("account=" + accounts[0]);
		console.log("current account=" + ethereum.selectedAddress);
		// console.log("address Yes:" + window.tronWeb.defaultAddress.base58)
		walletAddress = accounts[0];

		ethereum.on('accountsChanged', (accounts) => {
			// Handle the new accounts, or lack thereof.
			// "accounts" will always be an array, but it can be empty.
			console.log("accountsChanged");
			window.location.reload();
		});

		ethereum.on('chainChanged', (chainId) => {
			// Handle the new chain.
			// Correctly handling chain changes can be complicated.
			// We recommend reloading the page unless you have a very good reason not to.
			console.log("chainChanged");
			window.location.reload();
		});
		console.log("chainid=" + ethereum.chainId);
		var chainId = ethereum.chainId;
		if (chainId === "0x1") {
			console.log("connect main");
		} else if (chainId === "0x4") {
			console.log("connect rinkeby");
		} else if (chainId === "0x29a") {
			console.log("connect ganache");
		}
		web3 = new Web3(ethereum);

		// var BigNumber = web3.toBigNumber(0).constructor;

		updateConnectStatus();
	}
	trigger();
}

function updateConnectStatus() {
	$('body').addClass('web3');
	getBalance();
	$.getJSON('MetaCoin.json', function(data) {
		// Get the necessary contract artifact file and instantiate it with truffle-contract.
		var TutorialTokenArtifact = data;
		App.contracts.TutorialToken = TruffleContract(TutorialTokenArtifact);
  
		// Set the provider for our contract.
		App.contracts.TutorialToken.setProvider(App.web3Provider);
  
		// Use our contract to retieve and mark the adopted pets.
		return App.getBalances();
	  });  
}

function getBalance() {
	// 合约ABI 合约ABI在你的编译JSON文件里面有的
	var contract_abi = [{ "constant": false, "inputs": [{ "name": "a", "type": "uint256" }, { "name": "b", "type": "uint256" }], "name": "addmath", "outputs": [{ "name": "c", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }];
	// 通过ABI初始化合约对象
	var MetaCoin = contract({
		abi: contract_abi
	});
}


function hidepages() {
	$('main').hide();
}


function recoveABottom() {
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
	if (classname === "home") {
		$("#infodiv").show();
	} else {
		$("#infodiv").hide();
	}
	recoveABottom();
	let aa = "a" + classname;
	//border-bottom-color: rgba(255, 255, 255, .25);
	document.getElementById(aa).style.borderBottomColor = "rgba(255, 255, 255, .25)";

	if (classname == "home") {
		$("#ticketinfo").hide();
	} else {
		$("#ticketinfo").show();
	}

}
